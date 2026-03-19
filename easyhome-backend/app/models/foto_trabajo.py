from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Foto_Trabajo_Anterior
# Referencia: SRS 3.4.2.7 (RF-06)
# Descripción: Almacena fotografías de trabajos anteriores con
# una descripción opcional para contextualizar la evidencia.
# ────────────────────────────────────────────────

class Foto_Trabajo_Anterior(Base):
    __tablename__ = "foto_trabajo_anterior"

    id_foto = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False)
    url_imagen = Column(String(500), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_subida = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

    # Relaciones
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="foto_trabajo")
