from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Reporte_Usuario
# Referencia: SRS 3.4.2.16 (RF-30)
# Descripción: Almacena los reportes que los clientes realizan sobre proveedores de servicios. Contiene información del motivo, descripción, estado y comentarios del administrador.
# ────────────────────────────────────────────────

class Reporte_Usuario(Base):
    __tablename__ = "reporte_usuario"
    id_reporte = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_usuario_reportador = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_proveedor_reportado = Column(Integer, ForeignKey("proveedor_servicio.id_proveedor", ondelete="CASCADE"), nullable=False)
    motivo = Column(Text, nullable=False)
    descripcion = Column(Text, nullable=False)
    estado = Column(String(20), nullable=False, default="pendiente")  # pendiente, revisado, resuelto, desestimado
    fecha_reporte = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_revision = Column(TIMESTAMP, nullable=True)
    comentarios_admin = Column(Text, nullable=True)

    # Relaciones
    reportador = relationship("Usuario", back_populates="reporte_usuario")
    proveedor_reportado = relationship("Proveedor_Servicio", back_populates="reporte_usuario")
