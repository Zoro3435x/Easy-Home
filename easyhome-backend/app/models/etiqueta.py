from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base
from .property import Publicacion_Etiqueta

# ────────────────────────────────────────────────
# Entidad: Etiqueta
# Referencia: SRS 3.4.2.9 (RF-15, RF-16)
# Descripción: Catálogo de etiquetas que se pueden asociar a las publicaciones
# de servicios para facilitar su búsqueda y categorización.
# ────────────────────────────────────────────────

class Etiqueta(Base):
    __tablename__ = "etiqueta"

    id_etiqueta = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre_etiqueta = Column(String(50), nullable=False, unique=True)

    # Relación N:M con Publicacion_Servicio
    publicacion_servicio = relationship(
        "Publicacion_Servicio",
        secondary=Publicacion_Etiqueta,
        back_populates="etiqueta"
    )
