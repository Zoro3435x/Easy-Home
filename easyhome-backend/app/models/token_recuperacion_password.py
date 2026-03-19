
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

# ────────────────────────────────────────────────
# Entidad: Token_Recuperacion_Password
# Referencia: SRS 3.4.2.17 (RF-03)
# Descripción: Almacena tokens temporales para el proceso de recuperación de contraseña. Cada token tiene un tiempo de expiración y se invalida tras su uso.
# ────────────────────────────────────────────────

class Token_Recuperacion_Password(Base):
    __tablename__ = "token_recuperacion_password"
    id_token = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), nullable=False, unique=True)
    fecha_creacion = Column(TIMESTAMP, nullable=False, server_default=func.now())
    fecha_expiracion = Column(TIMESTAMP, nullable=False)
    usado = Column(Boolean, nullable=False, default=False)

    # Relaciones
    usuario = relationship("Usuario", back_populates="token_recuperacion_password")

    __table_args__ = (UniqueConstraint("token", name="uq_token_recuperacion"),)
