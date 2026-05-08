import pytest
import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from datetime import datetime

# Agregar el directorio padre al path de Python
sys.path.insert(0, str(Path(__file__).parent.parent))

# ===============================================
# CONFIGURACIÓN DE VARIABLES DE ENTORNO
# ===============================================
# Configurar ANTES de importar la aplicación
os.environ["DB_NAME"] = ":memory:"  # SQLite en memoria
os.environ["SECRET_KEY"] = "test-secret-key-12345"
os.environ["JWT_SECRET_KEY"] = "test-jwt-secret-key-12345"
os.environ["COGNITO_USER_POOL_ID"] = ""  # Sin AWS/Cognito para tests
os.environ["AWS_ACCESS_KEY_ID"] = ""
os.environ["AWS_SECRET_ACCESS_KEY"] = ""
os.environ["AWS_REGION"] = "us-east-1"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from main import app
from app.core.database import get_db, engine, SessionLocal
from app.models.base import Base
from app.models.user import Usuario, Proveedor_Servicio
from app.models.property import Categoria_Servicio, Publicacion_Servicio, Imagen_Publicacion
from app.models.etiqueta import Etiqueta


# ===============================================
# CONFIGURACIÓN DE BASE DE DATOS PARA TESTING
# ===============================================
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="session")
def db_engine():
    """
    Crea un engine de SQLAlchemy en memoria para testing.
    SQLite en memoria es más rápido y no requiere servidor.
    """
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Habilitar foreign keys en SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    
    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)
    
    yield engine
    
    # Limpiar después de los tests
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(db_engine):
    """
    Crea una sesión de base de datos para cada test.
    Cada test usa su propia transacción que se revierte después.
    """
    connection = db_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(autocommit=False, autoflush=False, bind=connection)()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """
    Crea un TestClient de FastAPI con una sesión de base de datos mockeada.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


# ===============================================
# FIXTURES DE DATOS SINTÉTICOS
# ===============================================

@pytest.fixture
def sample_category(db_session: Session):
    """
    Crea una categoría de prueba en la base de datos.
    """
    category = Categoria_Servicio(
        nombre_categoria="Plomería",
        descripcion="Servicios de plomería",
        icono_url="https://example.com/plomeria.png",
        orden_visualizacion=1
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


@pytest.fixture
def sample_user(db_session: Session):
    """
    Crea un usuario cliente de prueba en la base de datos.
    """
    user = Usuario(
        nombre="Juan Pérez",
        correo_electronico="juan@example.com",
        contraseña="hashed_password_12345",
        numero_telefono="5551234567",
        tipo_usuario="cliente",
        estado_cuenta="activo",
        metodo_autenticacion="local",
        google_id="google_123",
        fecha_registro=datetime.now(),
        ultima_sesion=datetime.now()
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def sample_provider_user(db_session: Session):
    """
    Crea un usuario proveedor de prueba con perfil aprobado.
    """
    user = Usuario(
        nombre="Carlos Trabajador",
        correo_electronico="carlos@example.com",
        contraseña="hashed_password_67890",
        numero_telefono="5559876543",
        tipo_usuario="proveedor",
        estado_cuenta="activo",
        metodo_autenticacion="local",
        google_id="google_456",
        fecha_registro=datetime.now(),
        ultima_sesion=datetime.now()
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Crear el perfil de proveedor con estado aprobado
    provider = Proveedor_Servicio(
        id_proveedor=user.id_usuario,
        nombre_completo="Carlos Trabajador García",
        curp="CARG000101HDFRRL05",
        años_experiencia=5,
        estado_solicitud="aprobado",
        fecha_aprobacion=datetime.now()
    )
    db_session.add(provider)
    db_session.commit()
    db_session.refresh(provider)
    
    return user, provider


@pytest.fixture
def sample_publication(db_session: Session, sample_provider_user, sample_category):
    """
    Crea una publicación de servicio activa de prueba.
    """
    user, provider = sample_provider_user
    
    publication = Publicacion_Servicio(
        id_proveedor=provider.id_proveedor,
        id_categoria=sample_category.id_categoria,
        titulo="Servicio de Plomería Profesional",
        descripcion="Reparación de tuberías, instalación de sanitarios y más",
        rango_precio_min=100.00,
        rango_precio_max=500.00,
        estado="activo",
        fecha_publicacion=datetime.now()
    )
    db_session.add(publication)
    db_session.commit()
    db_session.refresh(publication)
    return publication


@pytest.fixture
def sample_inactive_publication(db_session: Session, sample_provider_user, sample_category):
    """
    Crea una publicación inactiva de prueba.
    """
    user, provider = sample_provider_user
    
    publication = Publicacion_Servicio(
        id_proveedor=provider.id_proveedor,
        id_categoria=sample_category.id_categoria,
        titulo="Servicio Inactivo",
        descripcion="Este servicio está inactivo",
        rango_precio_min=50.00,
        rango_precio_max=200.00,
        estado="inactivo",
        fecha_publicacion=datetime.now()
    )
    db_session.add(publication)
    db_session.commit()
    db_session.refresh(publication)
    return publication
