# ────────────────────────────────────────────────
# Entidad: Reporte_Mensual_Premium
# Referencia: SRS 3.4.2.18 (RF-32, RF-33)
# Descripción: Almacena los reportes mensuales generados automáticamente para proveedores con plan premium. Incluye estadísticas de servicios, ingresos y totales de contrataciones.
# ────────────────────────────────────────────────
from sqlalchemy import Column, Integer, Text, DECIMAL, TIMESTAMP, Boolean, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class Reporte_Mensual_Premium(Base):
    __tablename__ = "reporte_mensual_premium"
    id_reporte_mensual = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False)
    mes = Column(Integer, nullable=False)
    año = Column(Integer, nullable=False)
    servicios_mas_contratados = Column(Text, nullable=True)
    total_contrataciones = Column(Integer, nullable=False, default=0)
    ingresos_generados = Column(DECIMAL(10, 2), nullable=True)
    fecha_generacion = Column(TIMESTAMP, nullable=False, server_default=func.now())
    enviado = Column(Boolean, nullable=False, default=False)

    # Relaciones
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="reporte_mensual_premium")

    __table_args__ = (
        Index("idx_reporte_proveedor", "id_proveedor"),
        Index("idx_reporte_periodo", "mes", "año"),
    )