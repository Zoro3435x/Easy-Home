#!/usr/bin/env python3
"""
Script para inicializar la base de datos local con datos sintéticos
Ejecutar con: python init_local_db.py
"""
import sys
from pathlib import Path

# Añadir el directorio raíz al path
ROOT_DIR = Path(__file__).resolve().parent
sys.path.append(str(ROOT_DIR))

from app.core.database import init_db
from app.core.config import settings


def main():
    """Inicializar la base de datos local con SQLite"""
    print("=" * 80)
    print("INICIALIZANDO BASE DE DATOS EASYHOME (SQLite)")
    print("=" * 80)
    print(f"\n📋 Configuración:")
    print(f"   - Base de datos: SQLite")
    print(f"   - Archivo: {settings.database_url.replace('sqlite:///', '')}")
    print(f"   - DEBUG: {settings.DEBUG}")
    print(f"\n🔄 Creando tablas y cargando datos sintéticos...\n")
    try:
        init_db()
        print("\n" + "=" * 80)
        print("✅ Base de datos inicializada correctamente!")
        print("✅ Datos sintéticos cargados!")
        print("=" * 80)
        print("\n🚀 Ahora puedes ejecutar: python -m uvicorn main:app --reload")
    except Exception as e:
        print("\n" + "=" * 80)
        print(f"❌ Error al inicializar la base de datos: {e}")
        print("=" * 80)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()