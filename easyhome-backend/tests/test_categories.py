import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient

from app.models.property import Categoria_Servicio


def create_category(db: Session, nombre_categoria: str, orden_visualizacion: int = 1) -> Categoria_Servicio:
    categoria = Categoria_Servicio(
        nombre_categoria=nombre_categoria,
        descripcion=f"Descripción de {nombre_categoria}",
        icono_url=f"icono_{nombre_categoria}.png",
        orden_visualizacion=orden_visualizacion,
    )
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


def test_listar_categorias_retorna_lista_vacia(client: TestClient, db_session: Session):
    response = client.get("/api/v1/categories/")

    assert response.status_code == 200
    assert response.json() == []


def test_listar_categorias_retorna_existentes(client: TestClient, db_session: Session):
    create_category(db_session, "Plomería", 1)
    create_category(db_session, "Electricidad", 2)

    response = client.get("/api/v1/categories/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["nombre_categoria"] == "Plomería"
    assert data[1]["nombre_categoria"] == "Electricidad"


def test_listar_categorias_respeta_orden(client: TestClient, db_session: Session):
    create_category(db_session, "Electricidad", 2)
    create_category(db_session, "Plomería", 1)
    create_category(db_session, "Jardinería", 3)

    response = client.get("/api/v1/categories/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["orden_visualizacion"] == 1
    assert data[1]["orden_visualizacion"] == 2
    assert data[2]["orden_visualizacion"] == 3


def test_crear_categoria_exitosamente(client: TestClient, db_session: Session):
    category_data = {
        "nombre_categoria": "Plomería",
        "descripcion": "Servicios de plomería",
        "icono_url": "plumber.png",
        "orden_visualizacion": 1
    }

    response = client.post("/api/v1/categories/", json=category_data)

    assert response.status_code == 201
    data = response.json()
    assert data["nombre_categoria"] == "Plomería"
    assert data["descripcion"] == "Servicios de plomería"
    assert data["icono_url"] == "plumber.png"
    assert data["orden_visualizacion"] == 1


def test_crear_categoria_sin_nombre_retorna_422(client: TestClient, db_session: Session):
    category_data = {
        "descripcion": "Sin nombre",
        "icono_url": "icon.png",
        "orden_visualizacion": 1
    }

    response = client.post("/api/v1/categories/", json=category_data)

    assert response.status_code == 422  # Unprocessable Entity


def test_crear_categoria_duplicada_retorna_400(client: TestClient, db_session: Session):
    create_category(db_session, "Plomería", 1)

    category_data = {
        "nombre_categoria": "Plomería",
        "descripcion": "Otra descripción",
        "icono_url": "another.png",
        "orden_visualizacion": 2
    }

    response = client.post("/api/v1/categories/", json=category_data)

    assert response.status_code == 400
    assert "Ya existe una categoría" in response.json()["detail"]


def test_actualizar_categoria(client: TestClient, db_session: Session):
    categoria = create_category(db_session, "Plomería", 1)

    update_data = {
        "nombre_categoria": "Plomería Avanzada",
        "descripcion": "Servicios avanzados de plomería",
        "icono_url": "advanced_plumber.png",
        "orden_visualizacion": 5
    }

    response = client.put(f"/api/v1/categories/{categoria.id_categoria}", json=update_data)

    assert response.status_code == 200
    data = response.json()
    assert data["nombre_categoria"] == "Plomería Avanzada"
    assert data["descripcion"] == "Servicios avanzados de plomería"
    assert data["icono_url"] == "advanced_plumber.png"
    assert data["orden_visualizacion"] == 5


def test_eliminar_categoria(client: TestClient, db_session: Session):
    categoria = create_category(db_session, "Plomería", 1)

    response = client.delete(f"/api/v1/categories/{categoria.id_categoria}")

    assert response.status_code == 204

    # Verificar que ya no existe
    response = client.get("/api/v1/categories/")
    assert response.status_code == 200
    assert len(response.json()) == 0