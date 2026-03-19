"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from typing import Generator, AsyncGenerator
from app.core.config import settings

# Synchronous database engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # Verify connections before using them
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_size=10,  # Maximum number of connections to keep in the pool
    max_overflow=20,  # Maximum number of connections that can be created beyond pool_size
)

# Synchronous session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Asynchronous database engine (for async operations)
async_engine = create_async_engine(
    settings.async_database_url,
    pool_pre_ping=True,
    echo=settings.DEBUG,
    pool_size=10,
    max_overflow=20,
)

# Asynchronous session factory
AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session for synchronous operations
    
    Usage:
        @app.get("/items/")
        def read_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function to get database session for asynchronous operations
    
    Usage:
        @app.get("/items/")
        async def read_items(db: AsyncSession = Depends(get_async_db)):
            result = await db.execute(select(Item))
            return result.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


def init_db():
    """
    Initialize database tables
    Call this function to create all tables defined in models
    """
    from app.models.base import Base
    # Import all models here to ensure they are registered with Base
    from app.models import (
        Usuario,
        Proveedor_Servicio,
        Categoria_Servicio,
        Publicacion_Servicio,
        Imagen_Publicacion,
        Publicacion_Etiqueta,
        Etiqueta,
        Foto_Trabajo_Anterior,
        Servicio_Contratado,
        Alerta_Sistema,
        Reseña_Servicio,
        Imagen_Reseña,
        Plan_Suscripcion,
        Historial_Suscripcion,
        Paquete_Publicidad,
        Solicitud_Paquete_Publicitario,
        Publicidad_Activa,
        Reporte_Usuario,
        Token_Recuperacion_Password,
        Reporte_Mensual_Premium,
    )
    
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")


async def init_async_db():
    """
    Initialize database tables asynchronously
    """
    from app.models.base import Base
    # Import all models
    from app.models import (
        Usuario,
        Proveedor_Servicio,
        Categoria_Servicio,
        Publicacion_Servicio,
        Imagen_Publicacion,
        Publicacion_Etiqueta,
        Etiqueta,
        Foto_Trabajo_Anterior,
        Servicio_Contratado,
        Alerta_Sistema,
        Reseña_Servicio,
        Imagen_Reseña,
        Plan_Suscripcion,
        Historial_Suscripcion,
        Paquete_Publicidad,
        Solicitud_Paquete_Publicitario,
        Publicidad_Activa,
        Reporte_Usuario,
        Token_Recuperacion_Password,
        Reporte_Mensual_Premium,
    )
    
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database tables created successfully (async)!")
