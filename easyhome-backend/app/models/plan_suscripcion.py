from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Plan_Suscripcion
# Referencia: SRS 3.4.2.11 (RF-21 al RF-23)
# Descripción: Catálogo de planes de suscripción disponibles para proveedores de servicios. Contiene información del nombre, precio, beneficios y estado del plan.
# ────────────────────────────────────────────────

class Plan_Suscripcion(Base):
    __tablename__ = "plan_suscripcion"
    id_plan = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre_plan = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text, nullable=True)
    precio_mensual = Column(DECIMAL(10, 2), nullable=False)
    beneficios = Column(Text, nullable=True)
    estado = Column(String(20), nullable=False, default="activo")
    fecha_creacion = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, nullable=True)

    # Relaciones
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="plan_suscripcion", cascade="all, delete")
    historial_suscripcion = relationship("Historial_Suscripcion", back_populates="plan_suscripcion", cascade="all, delete")
