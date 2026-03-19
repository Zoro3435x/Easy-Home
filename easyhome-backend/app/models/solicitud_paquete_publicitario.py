from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Solicitud_Paquete_Publicitario
# Referencia: SRS 3.4.2.14 (RF-27)
# Descripción: Almacena las solicitudes de espacios publicitarios realizadas por empresas. Incluye los datos de la empresa, el paquete solicitado y el estado de la solicitud.
# ────────────────────────────────────────────────

class Solicitud_Paquete_Publicitario(Base):
    __tablename__ = "solicitud_paquete_publicitario"
    id_solicitud_publicidad = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_paquete = Column(Integer, ForeignKey("paquete_publicidad.id_paquete", ondelete="CASCADE"), nullable=False)
    nombre_empresa = Column(String(200), nullable=False)
    informacion_empresa = Column(Text, nullable=True)
    url_imagen_publicitaria = Column(String(500), nullable=False)
    tamaño_imagen = Column(String(50), nullable=False)
    formato_imagen = Column(String(20), nullable=False)
    estado_solicitud = Column(String(20), nullable=False, default="pendiente")
    fecha_solicitud = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_respuesta = Column(TIMESTAMP, nullable=True)
    comentarios_admin = Column(Text, nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="solicitud_paquete_publicitario")
    paquete_publicidad = relationship("Paquete_Publicidad", back_populates="solicitud_paquete_publicitario")
    publicidad_activa = relationship("Publicidad_Activa", back_populates="solicitud_paquete_publicitario", uselist=False)
