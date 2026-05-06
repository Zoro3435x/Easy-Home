"""
Script para crear un usuario administrador en la base de datos
Ejecutar con: python scripts/create_admin_user.py
"""
import sys
from datetime import datetime

from app.core.database import SessionLocal
from app.models.user import Usuario


def create_admin_user(email: str, nombre: str, contraseña: str = ""):
    """Crear un usuario administrador"""
    db = SessionLocal()

    try:
        # Verificar si el usuario ya existe
        existing = db.query(Usuario).filter(Usuario.correo_electronico == email).first()
        if existing:
            print(f"❌ El usuario {email} ya existe")
            return False

        # Crear el nuevo admin
        admin_user = Usuario(
            nombre=nombre,
            correo_electronico=email,
            contraseña=contraseña,  # Sin contraseña (usa método Cognito/local)
            tipo_usuario="administrador",
            estado_cuenta="activo",
            metodo_autenticacion="local",
            fecha_registro=datetime.now(),
            ultima_sesion=datetime.now(),
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("\n" + "=" * 70)
        print("✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE")
        print("=" * 70)
        print(f"ID: {admin_user.id_usuario}")
        print(f"Nombre: {admin_user.nombre}")
        print(f"Email: {admin_user.correo_electronico}")
        print(f"Tipo de usuario: {admin_user.tipo_usuario}")
        print(f"Estado: {admin_user.estado_cuenta}")
        print(f"Fecha de registro: {admin_user.fecha_registro}")
        print("=" * 70)

        return True

    except Exception as e:
        print(f"❌ Error al crear admin: {e}")
        db.rollback()
        return False
    finally:
        db.close()


def main():
    print("=" * 70)
    print("CREAR USUARIO ADMINISTRADOR")
    print("=" * 70)

    email = input("📧 Email del administrador: ").strip()
    nombre = input("👤 Nombre completo: ").strip()

    if not email or not nombre:
        print("❌ Email y nombre son obligatorios")
        return

    # Validar email básico
    if "@" not in email:
        print("❌ Email inválido")
        return

    success = create_admin_user(email, nombre)

    if success:
        print("\n💡 Tip: Ahora puedes iniciar sesión con este email en la app")
        print(
            "   El sistema verificará tu rol en la BD y te llevará al admin dashboard"
        )
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
