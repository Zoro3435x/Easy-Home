from sqlalchemy import Column, Integer, String, Text, ForeignKey, DECIMAL, TIMESTAMP, Table, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


# ────────────────────────────────────────────────
# Tabla intermedia: Publicacion_Etiqueta
# Referencia: SRS 3.4.2.8 (RF-15, RF-16)
# Descripción: Tabla puente que asocia las publicaciones con sus etiquetas.
# ────────────────────────────────────────────────
Publicacion_Etiqueta = Table(
    "publicacion_etiqueta",
    Base.metadata,
    Column("id_publicacion", Integer, ForeignKey("publicacion_servicio.id_publicacion", ondelete="CASCADE")),
    Column("id_etiqueta", Integer, ForeignKey("etiqueta.id_etiqueta", ondelete="CASCADE"))
)


# ────────────────────────────────────────────────
# Entidad: Categoria_Servicio
# Referencia: SRS 3.4.2.4 (RF-13, RF-14)
# Descripción: Catálogo de categorías de servicios disponibles en la plataforma
# (plomería, electricidad, jardinería, etc.). Cada categoría agrupa publicaciones
# de servicios y se muestra en la interfaz principal.
# ────────────────────────────────────────────────

class Categoria_Servicio(Base):
    __tablename__ = "categoria_servicio"

    id_categoria = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre_categoria = Column(String(100), unique=True, nullable=False)
    descripcion = Column(Text, nullable=True)
    icono_url = Column(String(500), nullable=True)
    orden_visualizacion = Column(Integer, nullable=False, default=1)

    # Relaciones
    publicacion_servicio = relationship("Publicacion_Servicio", back_populates="categoria_servicio", cascade="all, delete")


# ────────────────────────────────────────────────
# Entidad: Publicacion_Servicio
# Referencia: SRS 3.4.2.5 (RF-09 al RF-12, RF-15, RF-16)
# Descripción: Representa las publicaciones creadas por los proveedores
# para ofrecer sus servicios. Contiene datos como título, descripción,
# precios de referencia, categoría, estado, imágenes, etiquetas y relación
# con servicios contratados.
# ────────────────────────────────────────────────

class Publicacion_Servicio(Base):
    __tablename__ = "publicacion_servicio"

    id_publicacion = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False, index=True)
    id_categoria = Column(Integer, ForeignKey("categoria_servicio.id_categoria", ondelete="CASCADE"), nullable=False, index=True)

    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=False)
    rango_precio_min = Column(DECIMAL(10, 2), nullable=False)
    rango_precio_max = Column(DECIMAL(10, 2), nullable=False)
    fecha_publicacion = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, index=True)
    fecha_actualizacion = Column(TIMESTAMP, nullable=True)
    estado = Column(String(20), nullable=False, default="activo", index=True)
    vistas = Column(Integer, nullable=False, default=0)

    # Relaciones
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="publicacion_servicio")
    categoria_servicio = relationship("Categoria_Servicio", back_populates="publicacion_servicio")
    imagen_publicacion = relationship("Imagen_Publicacion", back_populates="publicacion_servicio", cascade="all, delete")
    servicio_contratado = relationship("Servicio_Contratado", back_populates="publicacion_servicio", cascade="all, delete")

    # Relación N:M con Etiqueta (a través de Publicacion_Etiqueta)
    etiqueta = relationship(
        "Etiqueta",
        secondary=Publicacion_Etiqueta,
        back_populates="publicacion_servicio"
    )

# ────────────────────────────────────────────────
# Entidad: Imagen_Publicacion
# Referencia: SRS 3.4.2.6 (RF-09, RF-11)
# Descripción: Almacena las imágenes asociadas a cada publicación
# (máximo de 10 por publicación). Se guardan en Amazon S3.
# ────────────────────────────────────────────────

class Imagen_Publicacion(Base):
    __tablename__ = "imagen_publicacion"

    id_imagen = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_publicacion = Column(Integer, ForeignKey("publicacion_servicio.id_publicacion", ondelete="CASCADE"), nullable=False)
    url_imagen = Column(String(500), nullable=False)
    orden = Column(Integer, nullable=False, default=1)
    fecha_subida = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

    # Relaciones
    publicacion_servicio = relationship("Publicacion_Servicio", back_populates="imagen_publicacion")
