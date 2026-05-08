import io

from sqlalchemy.orm import Session
from fastapi.testclient import TestClient

from app.models.user import Usuario
from app.services.s3_service import s3_service


def create_user(db: Session, id_usuario: int, foto_perfil: str | None = None) -> Usuario:
    usuario = Usuario(
        id_usuario=id_usuario,
        nombre="Usuario de prueba",
        correo_electronico=f"test{id_usuario}@example.com",
        contraseña="password123",
        tipo_usuario="cliente",
        foto_perfil=foto_perfil,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def test_upload_profile_photo(client: TestClient, db_session: Session, monkeypatch):
    create_user(db_session, id_usuario=1)

    monkeypatch.setattr(
        s3_service,
        "upload_file",
        lambda file_obj, object_name, content_type: object_name,
    )
    monkeypatch.setattr(
        s3_service,
        "get_presigned_url",
        lambda object_name, expiration=3600: f"http://localhost/uploads/{object_name}",
    )
    monkeypatch.setattr(s3_service, "delete_file", lambda object_name: True)

    fake_image = io.BytesIO(b"fake image content")
    fake_image.name = "test_photo.jpg"

    response = client.put(
        "/api/v1/usuarios/1/foto-perfil",
        files={"file": ("test_photo.jpg", fake_image, "image/jpeg")},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Foto de perfil actualizada correctamente"
    assert "foto_perfil_url" in response.json()

    usuario = db_session.query(Usuario).filter(Usuario.id_usuario == 1).first()
    assert usuario is not None
    assert usuario.foto_perfil == "profile-images/1_test_photo.jpg"


def test_get_profile_photo_returns_404_when_missing(client: TestClient, db_session: Session):
    create_user(db_session, id_usuario=2)

    response = client.get("/api/v1/usuarios/2/foto-perfil")

    assert response.status_code == 404
    assert response.json()["detail"] == "Foto de perfil no encontrada"


def test_get_profile_photo_returns_url(client: TestClient, db_session: Session, monkeypatch):
    create_user(
        db_session,
        id_usuario=3,
        foto_perfil="profile-images/3_test_photo.jpg",
    )
    monkeypatch.setattr(
        s3_service,
        "get_presigned_url",
        lambda object_name, expiration=3600: f"http://localhost/uploads/{object_name}",
    )

    response = client.get("/api/v1/usuarios/3/foto-perfil")

    assert response.status_code == 200
    assert response.json() == {
        "foto_perfil_url": "http://localhost/uploads/profile-images/3_test_photo.jpg"
    }


def test_delete_profile_photo(client: TestClient, db_session: Session, monkeypatch):
    create_user(
        db_session,
        id_usuario=4,
        foto_perfil="profile-images/4_test_photo.jpg",
    )
    monkeypatch.setattr(s3_service, "delete_file", lambda object_name: True)

    response = client.delete("/api/v1/usuarios/4/foto-perfil")

    assert response.status_code == 200
    assert response.json() == {"message": "Foto de perfil eliminada correctamente"}

    usuario = db_session.query(Usuario).filter(Usuario.id_usuario == 4).first()
    assert usuario is not None
    assert usuario.foto_perfil is None


def test_invalid_file_type(client: TestClient, db_session: Session):
    create_user(db_session, id_usuario=5)

    fake_file = io.BytesIO(b"this is not an image")
    response = client.put(
        "/api/v1/usuarios/5/foto-perfil",
        files={"file": ("document.txt", fake_file, "text/plain")},
    )

    assert response.status_code == 400
    assert "Tipo de archivo no permitido" in response.json()["detail"]


def test_file_too_large(client: TestClient, db_session: Session):
    create_user(db_session, id_usuario=6)

    large_file = io.BytesIO(b"0" * (6 * 1024 * 1024))
    response = client.put(
        "/api/v1/usuarios/6/foto-perfil",
        files={"file": ("large_photo.jpg", large_file, "image/jpeg")},
    )

    assert response.status_code == 400
    assert "Archivo muy grande" in response.json()["detail"]


def test_nonexistent_user_returns_404(client: TestClient):
    fake_image = io.BytesIO(b"fake image content")
    response = client.put(
        "/api/v1/usuarios/99999/foto-perfil",
        files={"file": ("test_photo.jpg", fake_image, "image/jpeg")},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Usuario no encontrado"
