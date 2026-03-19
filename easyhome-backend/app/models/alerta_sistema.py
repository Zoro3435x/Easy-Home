from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Alerta_Sistema
# Referencia: SRS 3.4.2.8 (RF-30, RF-32)
# Descripción: Alerta dirigida a un usuario, opcionalmente asociada
# a un servicio contratado específico.
# ────────────────────────────────────────────────


class Alerta_Sistema(Base):
    __tablename__ = "alerta_sistema"

    id_alerta = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_servicio_contratado = Column(Integer,ForeignKey("servicio_contratado.id_servicio_contratado", ondelete="SET NULL"),nullable=True)
    tipo_alerta = Column(String(30), nullable=False)
    mensaje = Column(Text, nullable=False)
    leida = Column(Boolean, nullable=False, default=False)
    fecha_envio = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_lectura = Column(TIMESTAMP, nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="alerta_sistema")
    servicio_contratado = relationship("Servicio_Contratado", back_populates="alerta_sistema")
