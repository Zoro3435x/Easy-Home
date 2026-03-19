from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Publicidad_Activa
# Referencia: SRS 3.4.2.15 (RF-27)
# Descripción: Registra las publicidades actualmente mostradas en la plataforma y sus métricas. Cada registro se origina de una solicitud aprobada.
# ────────────────────────────────────────────────

class Publicidad_Activa(Base):
    __tablename__ = "publicidad_activa"
    id_publicidad_activa = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_solicitud_publicidad = Column(Integer, ForeignKey("solicitud_paquete_publicitario.id_solicitud_publicidad", ondelete="CASCADE"), nullable=False, unique=True)
    fecha_inicio = Column(TIMESTAMP, nullable=False)
    fecha_fin = Column(TIMESTAMP, nullable=False)
    estado = Column(String(20), nullable=False, default="activa")  # activa, pausada, finalizada, cancelada
    impresiones = Column(Integer, nullable=False, default=0)
    clics = Column(Integer, nullable=False, default=0)
    id_pago_stripe = Column(String(255), nullable=True)

    # Relaciones
    solicitud_paquete_publicitario = relationship("Solicitud_Paquete_Publicitario", back_populates="publicidad_activa", uselist=False)
