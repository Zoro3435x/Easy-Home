"""
Script de pruebas para los endpoints de foto de perfil
Ejecutar con: python scripts/test_foto_perfil.py
"""
import sys
from pathlib import Path

# Añadir el directorio raíz al path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

import io
from fastapi.testclient import TestClient
from main import app
from app.core.database import get_db
from app.models.user import Usuario
from sqlalchemy.orm import Session

client = TestClient(app)


def test_upload_profile_photo():
    """Prueba subir una foto de perfil"""
    print("\n" + "="*60)
    print("🧪 TEST 1: Subir foto de perfil")
    print("="*60)
    
    # Crear un archivo de imagen falso
    fake_image = io.BytesIO(b"fake image content")
    fake_image.name = "test_photo.jpg"
    
    response = client.put(
        "/api/v1/usuarios/1/foto-perfil",
        files={"file": ("test_photo.jpg", fake_image, "image/jpeg")}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Test PASADO")
    else:
        print("❌ Test FALLIDO")
    
    return response.status_code == 200


def test_get_profile_photo():
    """Prueba obtener la URL de la foto de perfil"""
    print("\n" + "="*60)
    print("🧪 TEST 2: Obtener URL de foto de perfil")
    print("="*60)
    
    response = client.get("/api/v1/usuarios/1/foto-perfil")
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        print("✅ Test PASADO")
    else:
        print(f"Error: {response.json()}")
        print("❌ Test FALLIDO")
    
    return response.status_code == 200


def test_delete_profile_photo():
    """Prueba eliminar la foto de perfil"""
    print("\n" + "="*60)
    print("🧪 TEST 3: Eliminar foto de perfil")
    print("="*60)
    
    response = client.delete("/api/v1/usuarios/1/foto-perfil")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Test PASADO")
    else:
        print("❌ Test FALLIDO")
    
    return response.status_code == 200


def test_invalid_file_type():
    """Prueba subir un archivo no permitido"""
    print("\n" + "="*60)
    print("🧪 TEST 4: Validación de tipo de archivo")
    print("="*60)
    
    # Crear un archivo de texto
    fake_file = io.BytesIO(b"this is not an image")
    
    response = client.put(
        "/api/v1/usuarios/1/foto-perfil",
        files={"file": ("document.txt", fake_file, "text/plain")}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 400:
        print("✅ Test PASADO (rechazó correctamente el archivo)")
    else:
        print("❌ Test FALLIDO (debería rechazar archivos no válidos)")
    
    return response.status_code == 400


def test_file_too_large():
    """Prueba subir un archivo muy grande"""
    print("\n" + "="*60)
    print("🧪 TEST 5: Validación de tamaño de archivo")
    print("="*60)
    
    # Crear un archivo de 6MB (mayor que el límite de 5MB)
    large_file = io.BytesIO(b"0" * (6 * 1024 * 1024))
    
    response = client.put(
        "/api/v1/usuarios/1/foto-perfil",
        files={"file": ("large_photo.jpg", large_file, "image/jpeg")}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 400:
        print("✅ Test PASADO (rechazó archivo muy grande)")
    else:
        print("❌ Test FALLIDO (debería rechazar archivos grandes)")
    
    return response.status_code == 400


def test_nonexistent_user():
    """Prueba con un usuario que no existe"""
    print("\n" + "="*60)
    print("🧪 TEST 6: Usuario no existente")
    print("="*60)
    
    fake_image = io.BytesIO(b"fake image content")
    
    response = client.put(
        "/api/v1/usuarios/99999/foto-perfil",
        files={"file": ("test_photo.jpg", fake_image, "image/jpeg")}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 404:
        print("✅ Test PASADO (usuario no encontrado)")
    else:
        print("❌ Test FALLIDO (debería retornar 404)")
    
    return response.status_code == 404


def run_all_tests():
    """Ejecuta todos los tests"""
    print("\n" + "="*60)
    print("🚀 INICIANDO SUITE DE PRUEBAS - FOTO DE PERFIL")
    print("="*60)
    
    results = {
        "Test 1: Upload": test_upload_profile_photo(),
        "Test 2: Get URL": test_get_profile_photo(),
        "Test 3: Delete": test_delete_profile_photo(),
        "Test 4: Invalid Type": test_invalid_file_type(),
        "Test 5: File Size": test_file_too_large(),
        "Test 6: User Not Found": test_nonexistent_user(),
    }
    
    print("\n" + "="*60)
    print("📊 RESUMEN DE RESULTADOS")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASADO" if result else "❌ FALLIDO"
        print(f"{test_name}: {status}")
    
    print("\n" + "-"*60)
    print(f"Total: {passed}/{total} tests pasados ({(passed/total)*100:.1f}%)")
    print("="*60 + "\n")
    
    return passed == total


if __name__ == "__main__":
    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error ejecutando tests: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
