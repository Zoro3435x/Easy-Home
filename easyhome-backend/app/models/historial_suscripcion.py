from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Historial_Suscripcion
# Referencia: SRS 3.4.2.12 (RF-23)
# Descripción: Registra el historial completo de suscripciones de cada proveedor, incluyendo inicio, fin, estado y pagos asociados a Stripe.
# ────────────────────────────────────────────────

class Historial_Suscripcion(Base):
    __tablename__ = "historial_suscripcion"
    id_historial_suscripcion = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False)
    id_plan = Column(Integer, ForeignKey("plan_suscripcion.id_plan", ondelete="CASCADE"), nullable=False)
    fecha_inicio = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_fin = Column(TIMESTAMP, nullable=True)
    estado = Column(String(20), nullable=False, default="activa")
    id_pago_stripe = Column(String(255), nullable=True)
    monto_pagado = Column(DECIMAL(10, 2), nullable=False)

    # Relaciones
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="historial_suscripcion")
    plan_suscripcion = relationship("Plan_Suscripcion", back_populates="historial_suscripcion")

    __table_args__ = (
        Index("idx_historial_proveedor", "id_proveedor"),
        Index("idx_historial_estado", "estado"),
    )
