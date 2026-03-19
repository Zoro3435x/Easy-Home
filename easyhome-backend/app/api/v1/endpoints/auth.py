# app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.core.database import get_db
from app.models.user import Usuario, Proveedor_Servicio
from app.services.cognito_service import cognito_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


class CognitoUserSync(BaseModel):
    email: EmailStr
    cognito_sub: str
    name: str = None
    phone: str = None
    cognito_groups: list[str] = []


@router.post("/sync-cognito-user")
def sync_cognito_user(user_data: CognitoUserSync, db: Session = Depends(get_db)):
    """
    Sincroniza un usuario de Cognito con la base de datos local.
    Si el usuario ya existe, actualiza su última sesión.
    Si no existe, lo crea.
    
    IMPORTANTE: Si el usuario no tiene grupos en Cognito, se le asigna automáticamente al grupo "Clientes"
    """

    # NUEVO: obtener atributos directamente desde Cognito (email → nombre, teléfono, sub)
    cognito_attrs = cognito_service.get_user_by_email(user_data.email)
    if cognito_attrs:
        user_data.name = cognito_attrs.get("name") or user_data.name
        user_data.phone = cognito_attrs.get("phone_number") or user_data.phone
        user_data.cognito_sub = cognito_attrs.get("sub") or user_data.cognito_sub
        logger.info(f"Atributos sincronizados desde Cognito para {user_data.email}: {cognito_attrs}")
    else:
        logger.warning(f"No se pudieron obtener atributos para {user_data.email}")

    # ORIGINAL: búsqueda del usuario en la base de datos
    existing_user = db.query(Usuario).filter(
        (Usuario.correo_electronico == user_data.email) |
        (Usuario.google_id == user_data.cognito_sub)
    ).first()

    # ORIGINAL: asegurar grupo por defecto
    groups_assigned = cognito_service.ensure_user_has_default_group(
        username=user_data.email,
        current_groups=user_data.cognito_groups
    )
    
    if groups_assigned and not user_data.cognito_groups:
        user_data.cognito_groups = [cognito_service.client and 
                                     cognito_service.get_user_groups(user_data.email) or 
                                     ["Clientes"]]
        logger.info(f"Usuario {user_data.email} asignado al grupo por defecto")

    if existing_user:
        # ORIGINAL: actualizar última sesión
        existing_user.ultima_sesion = datetime.now()

        # NUEVO: sincronizar nombre/teléfono si Cognito los tiene
        if user_data.name:
            existing_user.nombre = user_data.name.strip()
        if user_data.phone:
            existing_user.numero_telefono = user_data.phone

        db.commit()
        db.refresh(existing_user)
        
        return {
            "message": "Usuario actualizado",
            "user_id": existing_user.id_usuario,
            "is_new": False,
            "groups": user_data.cognito_groups
        }
    
    # ORIGINAL: determinar tipo de usuario basado en grupos
    tipo_usuario = "cliente"
    if "Admin" in user_data.cognito_groups:
        tipo_usuario = "administrador"
    elif "Trabajadores" in user_data.cognito_groups:
        tipo_usuario = "proveedor"
    elif "Clientes" in user_data.cognito_groups:
        tipo_usuario = "cliente"
    
    # ORIGINAL + AJUSTE: creación del nuevo usuario
    new_user = Usuario(
        nombre=(user_data.name or user_data.email.split('@')[0]).strip(),  # NUEVO: strip()
        correo_electronico=user_data.email,
        contraseña="",  # No se necesita contraseña (usa Cognito)
        numero_telefono=user_data.phone,
        tipo_usuario=tipo_usuario,
        estado_cuenta="activo",
        metodo_autenticacion="cognito",
        google_id=user_data.cognito_sub,
        fecha_registro=datetime.now(),
        ultima_sesion=datetime.now()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Usuario creado exitosamente",
        "user_id": new_user.id_usuario,
        "is_new": True,
        "groups": user_data.cognito_groups
    }


@router.get("/user-info/{email}")
def get_user_info(email: str, db: Session = Depends(get_db)):
    """
    Obtiene información del usuario por email.
    Incluye id_proveedor si el usuario es un trabajador aprobado.
    """
    # ORIGINAL: búsqueda de usuario
    user = db.query(Usuario).filter(Usuario.correo_electronico == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # ORIGINAL: búsqueda de proveedor aprobado
    proveedor = db.query(Proveedor_Servicio).filter(
        Proveedor_Servicio.id_proveedor == user.id_usuario,
        Proveedor_Servicio.estado_solicitud == "aprobado"
    ).first()
    
    response = {
        "id_usuario": user.id_usuario,
        "nombre": user.nombre,
        "correo_electronico": user.correo_electronico,
        "numero_telefono": user.numero_telefono,
        "fecha_nacimiento": user.fecha_nacimiento,
        "tipo_usuario": user.tipo_usuario,
        "estado_cuenta": user.estado_cuenta,
        "fecha_registro": user.fecha_registro,
        "ultima_sesion": user.ultima_sesion,
        "id_proveedor": proveedor.id_proveedor if proveedor else None
    }
    
    return response
