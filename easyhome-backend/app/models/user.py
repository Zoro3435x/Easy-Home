# app/models/user.py
from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, Boolean, ForeignKey, Text, DECIMAL
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


# ────────────────────────────────────────────────
# Entidad: Usuario
# Referencia: SRS 3.4.2.1 a 3.4.2.5 (RF-01 al RF-05)
# Descripción: Representa a los usuarios registrados en el sistema,
# incluyendo clientes, proveedores y administradores.
# Gestiona registro, inicio de sesión, autenticación con Google,
# restablecimiento de contraseña, edición, eliminación de cuenta y
# relaciones con otros módulos como servicios contratados, reseñas,
# reportes y solicitudes publicitarias.
# ────────────────────────────────────────────────
class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo_electronico = Column(String(150), unique=True, nullable=False, index=True)
    contraseña = Column(String(255), nullable=False)
    numero_telefono = Column(String(20), nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)
    tipo_usuario = Column(String(20), nullable=False, default="cliente", index=True)
    estado_cuenta = Column(String(20), nullable=False, default="activo")
    metodo_autenticacion = Column(String(20), nullable=False, default="local")
    google_id = Column(String(255), nullable=True)
    foto_perfil = Column(String(500), nullable=True)  # S3 key de la foto de perfil
    fecha_registro = Column(TIMESTAMP(timezone=True), server_default=func.now())
    ultima_sesion = Column(TIMESTAMP(timezone=True), nullable=True)

    # Relaciones
    proveedor_servicio = relationship("Proveedor_Servicio", back_populates="usuario", uselist=False)
    servicio_contratado = relationship("Servicio_Contratado", back_populates="usuario", cascade="all, delete")
    reseña_servicio = relationship("Reseña_Servicio", back_populates="usuario", cascade="all, delete")
    alerta_sistema = relationship("Alerta_Sistema", back_populates="usuario", cascade="all, delete")
    solicitud_paquete_publicitario = relationship("Solicitud_Paquete_Publicitario", back_populates="usuario", cascade="all, delete")
    reporte_usuario = relationship("Reporte_Usuario", back_populates="reportador", cascade="all, delete")
    token_recuperacion_password = relationship("Token_Recuperacion_Password", back_populates="usuario", cascade="all, delete")


# ────────────────────────────────────────────────
# Entidad: Proveedor_Servicio
# Referencia: SRS 3.4.2.6 a 3.4.2.7 (RF-06 y RF-07)
# Descripción: Representa a los usuarios que solicitan y obtienen permisos
# para ofrecer servicios dentro de la plataforma. Incluye datos personales,
# experiencia laboral, publicaciones, reseñas recibidas, historial de suscripciones,
# reportes, servicios contratados y plan de suscripción actual.
# ────────────────────────────────────────────────
class Proveedor_Servicio(Base):
    __tablename__ = "proveedor_servicio"

    id_proveedor = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)
    nombre_completo = Column(String(200), nullable=False)
    direccion = Column(Text, nullable=True)
    curp = Column(String(18), unique=True, nullable=False, index=True)
    años_experiencia = Column(Integer, nullable=False)
    foto_perfil = Column(String(500), nullable=True)
    biografia = Column(Text, nullable=True)
    experiencia_profesional = Column(Text, nullable=True)
    trayectoria_laboral = Column(Text, nullable=True)
    especializaciones = Column(Text, nullable=True)
    enlace_whatsapp = Column(String(500), nullable=True)
    estado_solicitud = Column(String(20), nullable=False, default="pendiente", index=True)
    fecha_solicitud = Column(TIMESTAMP(timezone=True), server_default=func.now())
    fecha_aprobacion = Column(TIMESTAMP(timezone=True), nullable=True)
    tiempo_activo_desde = Column(TIMESTAMP(timezone=True), nullable=True)
    cantidad_trabajos_realizados = Column(Integer, nullable=False, server_default="0")
    calificacion_promedio = Column(DECIMAL(3, 2), nullable=True, index=True)
    id_plan_suscripcion = Column(Integer, ForeignKey("plan_suscripcion.id_plan"), nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="proveedor_servicio")
    foto_trabajo = relationship("Foto_Trabajo_Anterior", back_populates="proveedor_servicio", cascade="all, delete")
    publicacion_servicio = relationship("Publicacion_Servicio", back_populates="proveedor_servicio", cascade="all, delete")
    servicio_contratado = relationship("Servicio_Contratado", back_populates="proveedor_servicio", cascade="all, delete")
    reseña_servicio = relationship("Reseña_Servicio", back_populates="proveedor_servicio", cascade="all, delete")
    historial_suscripcion = relationship("Historial_Suscripcion", back_populates="proveedor_servicio", cascade="all, delete")
    reporte_usuario = relationship("Reporte_Usuario", back_populates="proveedor_reportado", cascade="all, delete")
    reporte_mensual_premium = relationship("Reporte_Mensual_Premium", back_populates="proveedor_servicio", cascade="all, delete")
    plan_suscripcion = relationship("Plan_Suscripcion", back_populates="proveedor_servicio")
