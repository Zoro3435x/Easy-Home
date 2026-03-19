# app/api/v1/endpoints/solicitud.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.user import Proveedor_Servicio, Usuario
# Asegúrate de que esta importación sea correcta según tu estructura
# Si 'foto_trabajo.py' está en 'app/models/', esta importación es correcta.
from app.models.foto_trabajo import Foto_Trabajo_Anterior 
from app.services.cognito_service import cognito_service  # Importas tu servicio de Cognito
from app.services.s3_service import s3_service  # Importar servicio S3
import uuid
import logging # Es buena práctica añadir logging

# Configurar logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/solicitudes", tags=["Solicitudes de Proveedor"])


# =========================================================
# 1️⃣ CREAR SOLICITUD DE PROVEEDOR (CLIENTE)
# RF-06 / CU-07
# Endpoint AJUSTADO (sin 'telefono_contacto')
# =========================================================

@router.post("/")
async def crear_solicitud_proveedor(
    # --- Campos del formulario de Figma (corregido) ---
    # 'telefono_contacto' se elimina, se usará el del perfil de Usuario
    curp: str = Form(...),
    direccion: str = Form(...),
    años_experiencia: int = Form(..., description="El frontend debe enviar un valor numérico (ej: 1, 3, 5, 10)"),
    descripcion_servicios: Optional[str] = Form(None),
    servicios_ofrece: List[str] = Form(..., description="Lista de servicios seleccionados, ej: ['Electricidad', 'Pintura']"),
    fotos: List[UploadFile] = File(..., description="Evidencia fotográfica"),
    
    # --- Datos adicionales del frontend ---
    nombre_completo: str = Form(...), # Nombre completo del usuario
    user_email: str = Form(...), # Email del usuario logueado
    db: Session = Depends(get_db) # Inyectar la sesión de DB
):
    """
    Crea una solicitud de proveedor (postulación) asociada a un usuario (cliente) existente.
    Guarda todos los datos del formulario de Figma y sube las fotos de evidencia.
    El teléfono se hereda del perfil de usuario base.
    """
    
    try:
        # 🔹 1. Buscar usuario por correo
        usuario = db.query(Usuario).filter(Usuario.correo_electronico == user_email).first()
        if not usuario:
            logger.warning(f"Intento de solicitud para usuario no existente: {user_email}")
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")
            
        # (Opcional) Verificar si el usuario tiene un número de teléfono registrado
        if not usuario.numero_telefono:
             logger.warning(f"Usuario {user_email} intenta postularse sin número de teléfono.")
             # Depende de tus reglas de negocio si esto es un error o no
             # raise HTTPException(status_code=400, detail="Por favor, añade un número de teléfono a tu perfil antes de postularte.")


        # 🔹 2. Verificar si ya tiene una solicitud o es proveedor activo
        if usuario.proveedor_servicio:
            logger.warning(f"Usuario {user_email} ya tiene una solicitud o es proveedor.")
            raise HTTPException(status_code=400, detail="Ya existe una solicitud o eres proveedor activo.")

        # 🔹 3. Convertir la lista de servicios en un string (ej: "Electricidad, Pintura, Plomería")
        especializaciones_str = ", ".join(servicios_ofrece)

        # 🔹 4. Crear la solicitud en la tabla Proveedor_Servicio
        solicitud = Proveedor_Servicio(
            id_proveedor=usuario.id_usuario, # Se usa el ID del usuario como FK
            nombre_completo=nombre_completo,
            # 'telefono_contacto' se omite aquí
            direccion=direccion,
            curp=curp,
            años_experiencia=años_experiencia,
            experiencia_profesional=descripcion_servicios, # Mapeado a "Descripcion de tus servicios"
            especializaciones=especializaciones_str, # Mapeado a "Servicios que ofreces"
            estado_solicitud="pendiente", # Estado inicial
            fecha_solicitud=datetime.utcnow()
        )

        db.add(solicitud)
        db.commit()
        db.refresh(solicitud)

        # 🔹 5. Guardar fotos en S3
        urls_fotos_guardadas = []
        for file in fotos:
            try:
                # Generar nombre único para el archivo
                file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
                # Usar work-images/ como está configurado en el bucket
                s3_key = f"work-images/{uuid.uuid4()}.{file_extension}"
                
                # Determinar content type basado en la extensión
                content_types = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp'
                }
                content_type = content_types.get(file_extension.lower(), 'image/jpeg')
                
                # Subir archivo a S3 (retorna la S3 key, no URL pública)
                s3_object_key = s3_service.upload_file(
                    file_obj=file.file,
                    object_name=s3_key,
                    content_type=content_type
                )
                
                # Guardar la S3 key en la base de datos (no URL pública)
                # La key será usada para generar URLs pre-firmadas cuando se necesite
                nueva_foto = Foto_Trabajo_Anterior(
                    id_proveedor=solicitud.id_proveedor,
                    url_imagen=s3_object_key,  # Guardar S3 key
                    descripcion="Evidencia de trabajo (postulación)"
                )
                db.add(nueva_foto)
                urls_fotos_guardadas.append(s3_object_key)
                
                logger.info(f"Foto subida a S3: {s3_object_key}")
                
            except Exception as e:
                logger.error(f"Error al subir foto {file.filename}: {e}")
                # Continuar con las demás fotos aunque una falle
                continue
        
        db.commit()
        logger.info(f"Nueva solicitud creada para {user_email}, ID: {solicitud.id_proveedor}")

        return {
            "message": "Solicitud enviada correctamente.",
            "estado": solicitud.estado_solicitud,
            "id_solicitud": solicitud.id_proveedor,
            "fotos_subidas": urls_fotos_guardadas,
            "telefono_registrado": usuario.numero_telefono # Devuelve el teléfono que ya estaba
        }
    except Exception as e:
        db.rollback() # Revertir cambios en caso de error
        logger.error(f"Error al crear solicitud para {user_email}: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")


# =========================================================
# 2️⃣ MOSTRAR SOLICITUDES (ADMINISTRADOR)
# RF-07 / CU-08
# =========================================================

@router.get("/admin")
def listar_solicitudes_admin(db: Session = Depends(get_db)):
    """
    Muestra todas las solicitudes de proveedores (pendientes, aprobadas, rechazadas).
    Solo debe ser consumido por un usuario Administrador.
    AHORA INCLUYE URLs temporales (pre-firmadas) para ver las fotos de evidencia.
    """
    try:
        # 1. Cargar solicitudes con sus relaciones (usuario y fotos)
        # Usamos joinedload para cargar las relaciones de forma eficiente
        solicitudes = db.query(Proveedor_Servicio)\
            .options(
                joinedload(Proveedor_Servicio.usuario),
                joinedload(Proveedor_Servicio.foto_trabajo) # Cargar la relación a Foto_Trabajo_Anterior
            )\
            .order_by(Proveedor_Servicio.fecha_solicitud.desc())\
            .all()

        resultado = []
        
        # Iterar sobre cada solicitud encontrada
        for s in solicitudes:
            
            # 2. Generar URLs pre-firmadas para las fotos de CADA solicitud
            fotos_con_urls = []
            if s.foto_trabajo: # Si hay fotos asociadas
                for foto in s.foto_trabajo:
                    try:
                        # foto.url_imagen contiene la S3 key (ej: "work-images/uuid.jpg")
                        presigned_url = s3_service.get_presigned_url(
                            object_name=foto.url_imagen,
                            expiration=3600 # Damos 1 hora de validez
                        )
                        fotos_con_urls.append({
                            "id_foto": foto.id_foto, # Asumiendo que el ID se llama id_foto (como en tu endpoint 4)
                            "url_temporal": presigned_url,
                            "descripcion": foto.descripcion
                        })
                    except Exception as e:
                        logger.error(f"Error generando URL para foto {foto.url_imagen}: {e}")
                        fotos_con_urls.append({
                            "id_foto": foto.id_foto, # Asumiendo ID
                            "url_temporal": None, # Indicar que falló
                            "error": str(e)
                        })

            # 3. Construir el objeto JSON de respuesta para esta solicitud
            resultado.append({
                "id_proveedor": s.id_proveedor,
                "nombre_completo": s.nombre_completo,
                
                # Datos del usuario (cargados con joinedload)
                "email_usuario": s.usuario.correo_electronico if s.usuario else None,
                "nombre_usuario": s.usuario.nombre if s.usuario else None,
                "telefono_usuario": s.usuario.numero_telefono if s.usuario else None,
                
                "direccion": s.direccion,
                "curp": s.curp,
                "años_experiencia": s.años_experiencia,
                "estado_solicitud": s.estado_solicitud,
                "fecha_solicitud": s.fecha_solicitud,
                "fecha_aprobacion": s.fecha_aprobacion,
                "especializaciones": s.especializaciones,
                
                # 4. Añadir la lista de fotos con sus URLs temporales
                "fotos_evidencia": fotos_con_urls
            })
            
        return resultado
        
    except Exception as e:
        logger.error(f"Error al listar solicitudes de admin: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener las solicitudes.")

# =========================================================
# 3️⃣ APROBAR O RECHAZAR SOLICITUD (ADMINISTRADOR)
# RF-07 / CU-08
# =========================================================

@router.put("/admin/{id_proveedor}")
def actualizar_estado_solicitud(
    id_proveedor: int,
    estado: str = Form(..., description="Debe ser 'aprobado' o 'rechazado'"),
    db: Session = Depends(get_db)
):
    """
    Permite al administrador aprobar o rechazar una solicitud.
    Si se APRUEBA:
    1. Cambia el estado en la BD.
    2. Cambia el 'tipo_usuario' a 'proveedor' en la tabla 'usuario'.
    3. Mueve al usuario al grupo 'Trabajadores' en Cognito.
    Si se RECHAZA:
    1. Elimina la solicitud de la BD.
    2. Elimina las fotos asociadas de la BD y S3.
    3. Permite que el usuario pueda crear una nueva solicitud.
    """
    solicitud = db.query(Proveedor_Servicio).filter(Proveedor_Servicio.id_proveedor == id_proveedor).first()
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")

    if estado not in ["aprobado", "rechazado"]:
        raise HTTPException(status_code=400, detail="Estado inválido. Use 'aprobado' o 'rechazado'.")

    usuario = db.query(Usuario).filter(Usuario.id_usuario == solicitud.id_proveedor).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario asociado a la solicitud no encontrado.")

    # 🔹 Lógica de APROBACIÓN
    if estado == "aprobado":
        solicitud.estado_solicitud = estado
        solicitud.fecha_aprobacion = datetime.utcnow()
        solicitud.tiempo_activo_desde = datetime.utcnow() # Inicia tiempo como proveedor
        
        try:
            # Actualizamos tipo_usuario local
            usuario.tipo_usuario = "proveedor"
            
            # -----------------------------------------------------------------
            # AQUI ESTÁ LA LÓGICA DE CAMBIO DE GRUPO QUE PEDISTE
            # Se llama a tu servicio de cognito para mover al usuario
            # -----------------------------------------------------------------
            cognito_service.add_user_to_group(
                username=usuario.correo_electronico, 
                group_name="Trabajadores" # El grupo de proveedores
            )
            
            logger.info(f"Solicitud {id_proveedor} APROBADA. Usuario {usuario.correo_electronico} movido a 'Trabajadores'.")
        
        except Exception as e:
            db.rollback()
            logger.error(f"Error en Cognito al aprobar {id_proveedor}: {e}")
            raise HTTPException(status_code=500, detail=f"Error al actualizar grupo en Cognito: {e}")
        
        db.commit()
        
        return {
            "message": "Solicitud aprobada correctamente.", 
            "id_proveedor": id_proveedor,
            "nuevo_estado": estado
        }
            
    else: # 🔹 Lógica de RECHAZO - ELIMINAR SOLICITUD
        try:
            # 1. Obtener y eliminar fotos de S3 y BD
            fotos = db.query(Foto_Trabajo_Anterior).filter(
                Foto_Trabajo_Anterior.id_proveedor == id_proveedor
            ).all()
            
            for foto in fotos:
                try:
                    # url_imagen ahora contiene la S3 key directamente (ej: work-images/uuid.jpg)
                    s3_key = foto.url_imagen
                    s3_service.delete_file(s3_key)
                    logger.info(f"Foto eliminada de S3: {s3_key}")
                except Exception as e:
                    logger.warning(f"Error al eliminar foto de S3: {e}")
                    # Continuar aunque falle la eliminación de S3
                
                # Eliminar de BD
                db.delete(foto)
            
            # 2. Eliminar la solicitud de la BD
            db.delete(solicitud)
            db.commit()
            
            logger.info(f"Solicitud {id_proveedor} RECHAZADA y ELIMINADA. Usuario {usuario.correo_electronico} puede crear nueva solicitud.")
            
            return {
                "message": "Solicitud rechazada y eliminada correctamente. El usuario puede crear una nueva solicitud.", 
                "id_proveedor": id_proveedor,
                "nuevo_estado": "eliminado"
            }
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error al eliminar solicitud {id_proveedor}: {e}")
            raise HTTPException(status_code=500, detail=f"Error al eliminar la solicitud: {e}")


# =========================================================
# 4️⃣ OBTENER FOTOS DE UN PROVEEDOR CON URLs PRE-FIRMADAS
# =========================================================

@router.get("/{id_proveedor}/fotos")
def obtener_fotos_proveedor(
    id_proveedor: int,
    expiration: int = 3600,  # 1 hora por defecto
    db: Session = Depends(get_db)
):
    """
    Obtiene las fotos de un proveedor con URLs pre-firmadas para acceso temporal.
    
    Args:
        id_proveedor: ID del proveedor
        expiration: Tiempo de expiración de las URLs en segundos (default: 3600 = 1 hora)
    
    Returns:
        Lista de fotos con URLs pre-firmadas temporales
    """
    try:
        # Buscar fotos del proveedor
        fotos = db.query(Foto_Trabajo_Anterior).filter(
            Foto_Trabajo_Anterior.id_proveedor == id_proveedor
        ).all()
        
        if not fotos:
            return []
        
        # Generar URLs pre-firmadas para cada foto
        fotos_con_urls = []
        for foto in fotos:
            try:
                # Generar URL pre-firmada temporal
                presigned_url = s3_service.get_presigned_url(
                    object_name=foto.url_imagen,  # S3 key
                    expiration=expiration
                )
                
                fotos_con_urls.append({
                    "id_foto": foto.id_foto,
                    "url_temporal": presigned_url,
                    "s3_key": foto.url_imagen,
                    "descripcion": foto.descripcion,
                    "fecha_subida": foto.fecha_subida,
                    "expira_en": f"{expiration} segundos"
                })
            except Exception as e:
                logger.error(f"Error generando URL pre-firmada para foto {foto.id_foto}: {e}")
                continue
        
        return fotos_con_urls
        
    except Exception as e:
        logger.error(f"Error al obtener fotos del proveedor {id_proveedor}: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener las fotos.")