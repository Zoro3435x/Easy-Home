import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient

from app.models.user import Usuario, Proveedor_Servicio


def create_user(db: Session, email: str, tipo_usuario: str = "cliente", nombre: str = None) -> Usuario:
    usuario = Usuario(
        nombre=nombre or email.split('@')[0],
        correo_electronico=email,
        contraseña="password123",
        tipo_usuario=tipo_usuario,
        estado_cuenta="activo",
        metodo_autenticacion="local",
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def create_proveedor(db: Session, usuario: Usuario) -> Proveedor_Servicio:
    proveedor = Proveedor_Servicio(
        id_proveedor=usuario.id_usuario,
        nombre_completo=usuario.nombre,
        curp="TEST12345678901",
        años_experiencia=5,
        estado_solicitud="aprobado",
    )
    db.add(proveedor)
    db.commit()
    db.refresh(proveedor)
    return proveedor


def test_crear_nuevo_usuario_cliente(client: TestClient, db_session: Session, monkeypatch):
    # Mock del servicio de Cognito
    def mock_get_user_by_email(email):
        return {
            "name": "Juan Pérez",
            "phone_number": "+1234567890",
            "sub": "cognito-sub-123"
        }

    def mock_ensure_user_has_default_group(username, current_groups):
        return True

    def mock_get_user_groups(email):
        return ["Clientes"]

    monkeypatch.setattr("app.services.cognito_service.cognito_service.get_user_by_email", mock_get_user_by_email)
    monkeypatch.setattr("app.services.cognito_service.cognito_service.ensure_user_has_default_group", mock_ensure_user_has_default_group)
    monkeypatch.setattr("app.services.cognito_service.cognito_service.get_user_groups", mock_get_user_groups)

    user_data = {
        "email": "juan@example.com",
        "cognito_sub": "cognito-sub-123",
        "name": "Juan Pérez",
        "phone": "+1234567890",
        "cognito_groups": []
    }

    response = client.post("/api/v1/auth/sync-cognito-user", json=user_data)

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Usuario creado exitosamente"
    assert data["is_new"] is True
    assert "user_id" in data


def test_actualizar_usuario_no_crea_duplicado(client: TestClient, db_session: Session, monkeypatch):
    # Crear usuario existente
    existing_user = create_user(db_session, "juan@example.com", "cliente", "Juan Pérez")

    # Mock del servicio de Cognito
    def mock_get_user_by_email(email):
        return {
            "name": "Juan Pérez Actualizado",
            "phone_number": "+0987654321",
            "sub": "cognito-sub-123"
        }

    def mock_ensure_user_has_default_group(username, current_groups):
        return True

    def mock_get_user_groups(email):
        return ["Clientes"]

    monkeypatch.setattr("app.services.cognito_service.cognito_service.get_user_by_email", mock_get_user_by_email)
    monkeypatch.setattr("app.services.cognito_service.cognito_service.ensure_user_has_default_group", mock_ensure_user_has_default_group)
    monkeypatch.setattr("app.services.cognito_service.cognito_service.get_user_groups", mock_get_user_groups)

    user_data = {
        "email": "juan@example.com",
        "cognito_sub": "cognito-sub-123",
        "name": "Juan Pérez Actualizado",
        "phone": "+0987654321",
        "cognito_groups": ["Clientes"]
    }

    response = client.post("/api/v1/auth/sync-cognito-user", json=user_data)

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Usuario actualizado"
    assert data["is_new"] is False
    assert data["user_id"] == existing_user.id_usuario


def test_usuario_proveedor_tipo_correcto(client: TestClient, db_session: Session, monkeypatch):
    # Mock del servicio de Cognito
    def mock_get_user_by_email(email):
        return {
            "name": "María García",
            "phone_number": "+1234567890",
            "sub": "cognito-sub-456"
        }

    def mock_ensure_user_has_default_group(username, current_groups):
        return True

    def mock_get_user_groups(email):
        return ["Trabajadores"]

    monkeypatch.setattr("app.services.cognito_service.cognito_service.get_user_by_email", mock_get_user_by_email)
    monkeypatch.setattr("app.services.cognito_service.cognito_service.ensure_user_has_default_group", mock_ensure_user_has_default_group)
    monkeypatch.setattr("app.services.cognito_service.cognito_service.get_user_groups", mock_get_user_groups)

    user_data = {
        "email": "maria@example.com",
        "cognito_sub": "cognito-sub-456",
        "name": "María García",
        "phone": "+1234567890",
        "cognito_groups": ["Trabajadores"]
    }

    response = client.post("/api/v1/auth/sync-cognito-user", json=user_data)

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Usuario creado exitosamente"
    assert data["is_new"] is True

    # Verificar que el usuario creado tenga tipo "proveedor"
    usuario = db_session.query(Usuario).filter(Usuario.correo_electronico == "maria@example.com").first()
    assert usuario is not None
    assert usuario.tipo_usuario == "proveedor"


def test_sync_email_invalido_retorna_422(client: TestClient, db_session: Session):
    user_data = {
        "email": "invalid-email",  # Email inválido
        "cognito_sub": "cognito-sub-123",
        "name": "Usuario",
        "phone": "+1234567890",
        "cognito_groups": []
    }

    response = client.post("/api/v1/auth/sync-cognito-user", json=user_data)

    assert response.status_code == 422  # Unprocessable Entity


def test_get_user_info(client: TestClient, db_session: Session):
    usuario = create_user(db_session, "juan@example.com", "cliente", "Juan Pérez")

    response = client.get("/api/v1/auth/user-info/juan@example.com")

    assert response.status_code == 200
    data = response.json()
    assert data["id_usuario"] == usuario.id_usuario
    assert data["nombre"] == "Juan Pérez"
    assert data["correo_electronico"] == "juan@example.com"
    assert data["tipo_usuario"] == "cliente"
    assert data["id_proveedor"] is None


def test_get_user_info_proveedor(client: TestClient, db_session: Session):
    usuario = create_user(db_session, "maria@example.com", "proveedor", "María García")
    proveedor = create_proveedor(db_session, usuario)

    response = client.get("/api/v1/auth/user-info/maria@example.com")

    assert response.status_code == 200
    data = response.json()
    assert data["id_usuario"] == usuario.id_usuario
    assert data["tipo_usuario"] == "proveedor"
    assert data["id_proveedor"] == proveedor.id_proveedor


def test_get_user_info_404(client: TestClient, db_session: Session):
    response = client.get("/api/v1/auth/user-info/nonexistent@example.com")

    assert response.status_code == 404
    assert response.json()["detail"] == "Usuario no encontrado"