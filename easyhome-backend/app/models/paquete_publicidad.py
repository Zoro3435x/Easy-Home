from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Paquete_Publicidad
# Referencia: SRS 3.4.2.13 (RF-24 al RF-26)
# Descripción: Catálogo de paquetes publicitarios disponibles para empresas externas. Define tipo, duración, precio y estado del paquete.
# ────────────────────────────────────────────────

class Paquete_Publicidad(Base):
    __tablename__ = "paquete_publicidad"
    id_paquete = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre_paquete = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text, nullable=True)
    precio_mensual = Column(DECIMAL(10, 2), nullable=False)
    tipo_espacio = Column(String(20), nullable=False)  # estándar, lateral, superior
    duracion_dias = Column(Integer, nullable=False)
    estado = Column(String(20), nullable=False, default="activo")
    fecha_creacion = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, nullable=True)

    # Relaciones
    solicitud_paquete_publicitario = relationship("Solicitud_Paquete_Publicitario", back_populates="paquete_publicidad", cascade="all, delete")
