import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))
from app.services.cognito_service import cognito_service

if __name__ == "__main__":
    print("\n🔍 Obteniendo atributos del usuario en Cognito...\n")
    atributos = cognito_service.get_user_by_email("cristian.martinez.716cm9@gmail.com")
    print(atributos or "⚠️ No se encontraron atributos o credenciales inválidas.")
