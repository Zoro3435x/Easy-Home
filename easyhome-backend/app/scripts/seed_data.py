"""
Script para cargar datos sintéticos en la base de datos.
Se ejecuta automáticamente cuando inicia la aplicación en Docker.
"""
from sqlalchemy.orm import Session
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def seed_database(db: Session) -> None:
    """
    Carga datos sintéticos en la base de datos.
    Se ejecuta solo si la base de datos está vacía.
    """
    from app.models.user import Usuario, Proveedor_Servicio
    from app.models.property import Categoria_Servicio, Publicacion_Servicio, Imagen_Publicacion
    
    try:
        # Verificar si ya hay datos
        existing_categories = db.query(Categoria_Servicio).count()
        if existing_categories > 0:
            logger.info("✅ Database already has data, skipping seed")
            return
        
        logger.info("📊 Seeding database with synthetic data...")
        
        # =============================================
        # 1. CREAR CATEGORÍAS
        # =============================================
        categories = [
            Categoria_Servicio(
                nombre_categoria="Plomería",
                descripcion="Servicios de reparación y instalación de tuberías",
                icono_url="https://example.com/icons/plomeria.png",
                orden_visualizacion=1
            ),
            Categoria_Servicio(
                nombre_categoria="Electricidad",
                descripcion="Servicios de instalación y reparación eléctrica",
                icono_url="https://example.com/icons/electricidad.png",
                orden_visualizacion=2
            ),
            Categoria_Servicio(
                nombre_categoria="Pintura",
                descripcion="Servicios de pintura y decoración",
                icono_url="https://example.com/icons/pintura.png",
                orden_visualizacion=3
            ),
            Categoria_Servicio(
                nombre_categoria="Carpintería",
                descripcion="Servicios de carpintería y mueblería",
                icono_url="https://example.com/icons/carpinteria.png",
                orden_visualizacion=4
            ),
            Categoria_Servicio(
                nombre_categoria="Jardinería",
                descripcion="Mantenimiento y diseño de jardines",
                icono_url="https://example.com/icons/jardineria.png",
                orden_visualizacion=5
            ),
        ]
        db.add_all(categories)
        db.commit()
        logger.info(f"✅ Created {len(categories)} categories")
        
        # =============================================
        # 2. CREAR USUARIOS CLIENTES
        # =============================================
        clients = [
            Usuario(
                nombre="María González",
                correo_electronico="maria@example.com",
                contraseña="hashed_password_maria",
                numero_telefono="5551234567",
                tipo_usuario="cliente",
                estado_cuenta="activo",
                metodo_autenticacion="local",
                google_id="google_maria_001",
                fecha_registro=datetime.now(),
                ultima_sesion=datetime.now()
            ),
            Usuario(
                nombre="Juan Rodríguez",
                correo_electronico="juan@example.com",
                contraseña="hashed_password_juan",
                numero_telefono="5559876543",
                tipo_usuario="cliente",
                estado_cuenta="activo",
                metodo_autenticacion="local",
                google_id="google_juan_001",
                fecha_registro=datetime.now(),
                ultima_sesion=datetime.now()
            ),
        ]
        db.add_all(clients)
        db.commit()
        logger.info(f"✅ Created {len(clients)} client users")
        
        # =============================================
        # 3. CREAR USUARIOS PROVEEDORES
        # =============================================
        providers_data = [
            {
                "nombre": "Carlos López Plomero",
                "email": "carlos.plomero@example.com",
                "telefono": "5552223333",
                "curp": "LOPC800101HDFLMN01",
                "experiencia": 10,
                "categoria": "Plomería"
            },
            {
                "nombre": "Ana Martínez Electricista",
                "email": "ana.electricista@example.com",
                "telefono": "5553334444",
                "curp": "MAMA850515HDFRNR02",
                "experiencia": 8,
                "categoria": "Electricidad"
            },
            {
                "nombre": "Pedro Pérez Pintor",
                "email": "pedro.pintor@example.com",
                "telefono": "5554445555",
                "curp": "PEPP760312HDFLMX03",
                "experiencia": 15,
                "categoria": "Pintura"
            },
        ]
        
        providers = []
        for pdata in providers_data:
            user = Usuario(
                nombre=pdata["nombre"],
                correo_electronico=pdata["email"],
                contraseña="hashed_password_provider",
                numero_telefono=pdata["telefono"],
                tipo_usuario="proveedor",
                estado_cuenta="activo",
                metodo_autenticacion="local",
                google_id=f"google_provider_{pdata['email']}",
                fecha_registro=datetime.now(),
                ultima_sesion=datetime.now()
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            provider = Proveedor_Servicio(
                id_proveedor=user.id_usuario,
                nombre_completo=pdata["nombre"],
                curp=pdata["curp"],
                años_experiencia=pdata["experiencia"],
                estado_solicitud="aprobado",
                fecha_aprobacion=datetime.now(),
                tiempo_activo_desde=datetime.now(),
                cantidad_trabajos_realizados=5,
                calificacion_promedio=4.5
            )
            db.add(provider)
            providers.append((user, provider))
        
        db.commit()
        logger.info(f"✅ Created {len(providers)} provider users")
        
        # =============================================
        # 4. CREAR PUBLICACIONES
        # =============================================
        publications_data = [
            {
                "titulo": "Reparación urgente de tuberías",
                "descripcion": "Especialista en reparación de fugas de agua, cambio de tuberías y mantenimiento preventivo",
                "precio_min": 150.00,
                "precio_max": 500.00,
                "categoria": 0,  # Plomería
                "proveedor": 0,  # Carlos López
            },
            {
                "titulo": "Instalación de sistemas eléctricos",
                "descripcion": "Instalación de tomacorrientes, switches, paneles eléctricos y mantenimiento seguro",
                "precio_min": 200.00,
                "precio_max": 800.00,
                "categoria": 1,  # Electricidad
                "proveedor": 1,  # Ana Martínez
            },
            {
                "titulo": "Pintura interior y exterior de alta calidad",
                "descripcion": "Pintura profesional con preparación de superficies, acabados duraderos",
                "precio_min": 100.00,
                "precio_max": 600.00,
                "categoria": 2,  # Pintura
                "proveedor": 2,  # Pedro Pérez
            },
            {
                "titulo": "Mantenimiento preventivo de plomería",
                "descripcion": "Revisión completa, limpieza de tuberías y prevención de problemas",
                "precio_min": 120.00,
                "precio_max": 400.00,
                "categoria": 0,  # Plomería
                "proveedor": 0,  # Carlos López
            },
        ]
        
        publications = []
        for pdata in publications_data:
            provider_user, provider = providers[pdata["proveedor"]]
            pub = Publicacion_Servicio(
                id_proveedor=provider.id_proveedor,
                id_categoria=categories[pdata["categoria"]].id_categoria,
                titulo=pdata["titulo"],
                descripcion=pdata["descripcion"],
                rango_precio_min=pdata["precio_min"],
                rango_precio_max=pdata["precio_max"],
                estado="activo",
                fecha_publicacion=datetime.now(),
                vistas=0
            )
            db.add(pub)
            publications.append(pub)
        
        db.commit()
        logger.info(f"✅ Created {len(publications)} publications")
        
        # =============================================
        # 5. CREAR IMÁGENES DE PUBLICACIONES
        # =============================================
        for idx, pub in enumerate(publications):
            for img_num in range(1, 4):  # 3 imágenes por publicación
                image = Imagen_Publicacion(
                    id_publicacion=pub.id_publicacion,
                    url_imagen=f"publicaciones/{pub.id_publicacion}/imagen_{img_num}.jpg",
                    orden=img_num,
                    fecha_subida=datetime.now()
                )
                db.add(image)
        
        db.commit()
        logger.info("✅ Created publication images")
        
        logger.info("✅ 🎉 Database seeding completed successfully!")
        logger.info("📊 Synthetic data is ready to use")
        
    except Exception as e:
        logger.error(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
