"""
Script para inicializar la base de datos
Ejecutar con: python scripts/init_db.py
"""
import sys
from pathlib import Path

# Añadir el directorio raíz al path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

from app.core.database import init_db
from app.core.config import settings


def main():
    """Inicializar la base de datos"""
    print("=" * 80)
    print("INICIALIZANDO BASE DE DATOS EASYHOME")
    print("=" * 80)
    print(f"\n📋 Configuración:")
    print(f"   - Base de datos: {settings.DB_NAME}")
    print(f"   - Usuario: {settings.DB_USER}")
    print(f"   - Host: {settings.DB_HOST}:{settings.DB_PORT}")
    print(f"   - URL: {settings.database_url}")
    print("\n🔄 Creando tablas...\n")
    
    try:
        init_db()
        print("\n" + "=" * 80)
        print("✅ Base de datos inicializada correctamente!")
        print("=" * 80)
    except Exception as e:
        print("\n" + "=" * 80)
        print(f"❌ Error al inicializar la base de datos: {e}")
        print("=" * 80)
        print("\n💡 Verifica que:")
        print("   1. PostgreSQL esté instalado y corriendo")
        print("   2. La base de datos exista (o créala con: createdb easyhome_db)")
        print("   3. Las credenciales en .env sean correctas")
        sys.exit(1)


if __name__ == "__main__":
    main()
