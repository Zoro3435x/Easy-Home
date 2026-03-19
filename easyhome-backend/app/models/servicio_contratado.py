from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Servicio_Contratado
# Referencia: Modelo entidad-relación (RF-17 al RF-20)
# Descripción: Representa el proceso de contratación entre un cliente
# y un proveedor, originado a partir de una publicación. Contiene los
# estados de confirmación, fechas y validaciones del servicio.
# ────────────────────────────────────────────────

class Servicio_Contratado(Base):
    __tablename__ = "servicio_contratado"

    id_servicio_contratado = Column(Integer, primary_key=True, autoincrement=True, index=True)

    # Llaves foráneas
    id_cliente = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_proveedor = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False)
    id_publicacion = Column(Integer, ForeignKey("publicacion_servicio.id_publicacion", ondelete="SET NULL"), nullable=True)

    # Campos
    fecha_contacto = Column(TIMESTAMP, nullable=False, server_default=func.now())
    acuerdo_confirmado = Column(Boolean, nullable=False, default=False)
    fecha_confirmacion_acuerdo = Column(TIMESTAMP, nullable=True)
    estado_servicio = Column(String(20), nullable=False, default="contactado")  # contactado, confirmado, en_proceso, finalizado, cancelado
    fecha_finalizacion = Column(TIMESTAMP, nullable=True)
    confirmacion_cliente_finalizado = Column(Boolean, nullable=False, default=False)
    fecha_confirmacion_finalizacion = Column(TIMESTAMP, nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="servicio_contratado")
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="servicio_contratado")
    publicacion_servicio = relationship("Publicacion_Servicio", back_populates="servicio_contratado")
    reseña_servicio = relationship("Reseña_Servicio", back_populates="servicio_contratado", cascade="all, delete")
    alerta_sistema = relationship("Alerta_Sistema", back_populates="servicio_contratado", cascade="all, delete")

    __table_args__ = (
        Index("idx_servicio_cliente", "id_cliente"),
        Index("idx_servicio_proveedor", "id_proveedor"),
        Index("idx_servicio_estado", "estado_servicio"),
    )
