# Script auxiliar para verificar la conexión a la base de datos
"""
Script para verificar la conexión a PostgreSQL
Ejecutar con: python scripts/check_db_connection.py
"""

from sqlalchemy import create_engine, text

from app.core.config import settings


def check_connection():
    """Verificar la conexión a la base de datos"""
    print("=" * 80)
    print("VERIFICANDO CONEXIÓN A LA BASE DE DATOS")
    print("=" * 80)

    print("\n📋 Configuración:")
    print(f"   - Base de datos: {settings.DB_NAME}")
    print(f"   - Usuario: {settings.DB_USER}")
    print(f"   - Host: {settings.DB_HOST}:{settings.DB_PORT}")

    print("\n🔄 Intentando conectar...")

    try:
        # Intentar conectar a PostgreSQL (sin especificar la base de datos)
        postgres_url = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/postgres"
        engine = create_engine(postgres_url)

        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print("\n✅ Conexión a PostgreSQL exitosa!")
            print(f"   Versión: {version}")

        # Verificar si la base de datos existe
        with engine.connect() as conn:
            result = conn.execute(
                text(f"SELECT 1 FROM pg_database WHERE datname = '{settings.DB_NAME}'")
            )
            db_exists = result.fetchone() is not None

        if db_exists:
            print(f"\n✅ La base de datos '{settings.DB_NAME}' existe")

            # Intentar conectar a la base de datos específica
            db_engine = create_engine(settings.database_url)
            with db_engine.connect() as conn:
                result = conn.execute(
                    text(
                        "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"
                    )
                )
                table_count = result.fetchone()[0]
                print(f"   Tablas encontradas: {table_count}")
        else:
            print(f"\n⚠️  La base de datos '{settings.DB_NAME}' NO existe")
            print("\n💡 Créala con el siguiente comando:")
            print(
                f'   psql -U {settings.DB_USER} -c "CREATE DATABASE {settings.DB_NAME};"'
            )

        print("\n" + "=" * 80)
        print("✅ Verificación completada")
        print("=" * 80)

    except Exception as e:
        print(f"\n❌ Error al conectar: {e}")
        print("\n" + "=" * 80)
        print("💡 Soluciones posibles:")
        print("=" * 80)
        print("1. Verifica que PostgreSQL esté instalado y corriendo:")
        print("   Get-Service postgresql*")
        print("\n2. Verifica las credenciales en el archivo .env")
        print("\n3. Si PostgreSQL está en otro puerto, actualiza DB_PORT en .env")
        print("\n4. Crea la base de datos si no existe:")
        print(f'   psql -U {settings.DB_USER} -c "CREATE DATABASE {settings.DB_NAME};"')
        sys.exit(1)


if __name__ == "__main__":
    check_connection()
