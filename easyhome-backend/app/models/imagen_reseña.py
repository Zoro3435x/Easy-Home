from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Imagen_Reseña
# Referencia: SRS 3.4.2.10 (RF-20)
# Descripción: Almacena las imágenes de evidencia que los clientes adjuntan a sus reseñas (máximo 10 por reseña). Cada imagen se almacena en un bucket S3.
# ────────────────────────────────────────────────

class Imagen_Reseña(Base):
    __tablename__ = "imagen_reseña"
    id_imagen_reseña = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_reseña = Column(Integer, ForeignKey("reseña_servicio.id_reseña", ondelete="CASCADE"), nullable=False)
    url_imagen = Column(String(500), nullable=False)
    fecha_subida = Column(TIMESTAMP, nullable=False, server_default=func.now())

    # Relaciones
    reseña_servicio = relationship("Reseña_Servicio", back_populates="imagen_reseña")
