from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, Index, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Reseña_Servicio
# Referencia: SRS 3.4.2.10 (RF-17 al RF-20)
# Descripción: Reseña emitida por el cliente para un servicio contratado. Incluye calificaciones por rubro, comentario y recomendación.
# ────────────────────────────────────────────────

class Reseña_Servicio(Base):
    __tablename__ = "reseña_servicio"
    id_reseña = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_servicio_contratado = Column(Integer, ForeignKey("servicio_contratado.id_servicio_contratado", ondelete="CASCADE"), nullable=False, unique=True)
    id_cliente = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_proveedor = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False)
    calificacion_general = Column(Integer, nullable=False)
    calificacion_puntualidad = Column(Integer, nullable=False)
    calificacion_calidad_servicio = Column(Integer, nullable=False)
    calificacion_calidad_precio = Column(Integer, nullable=False)
    comentario = Column(Text, nullable=True)
    recomendacion = Column(String(20), nullable=False)
    fecha_reseña = Column(TIMESTAMP, nullable=False, server_default=func.now())
    estado = Column(String(20), nullable=False, default="activa")

    # Relaciones
    servicio_contratado = relationship("Servicio_Contratado", back_populates="reseña_servicio", uselist=False)
    usuario = relationship("Usuario", back_populates="reseña_servicio")
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="reseña_servicio")
    imagen_reseña = relationship("Imagen_Reseña", back_populates="reseña_servicio", cascade="all, delete")

    __table_args__ = (
        UniqueConstraint("id_servicio_contratado", name="uq_reseña_servicio_contratado"),
        Index("idx_reseña_proveedor", "id_proveedor"),
        Index("idx_reseña_fecha", "fecha_reseña")
    )
