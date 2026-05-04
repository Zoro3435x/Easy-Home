from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import Usuario

TIPO_USUARIO_TO_GROUP = {
    "administrador": "Admin",
    "proveedor": "Trabajadores",
    "cliente": "Clientes",
}


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> Usuario:
    """
    Resuelve el usuario actual a partir del header X-User-Email.
    """
    email = request.headers.get("x-user-email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falta cabecera de autenticación (X-User-Email).",
        )

    user = db.query(Usuario).filter(Usuario.correo_electronico == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no autenticado o no encontrado.",
        )

    if user.estado_cuenta != "activo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta inactiva.",
        )

    return user


def require_roles(*allowed_roles: str):
    """
    Dependency factory para autorizar por roles funcionales.
    allowed_roles usa nombres de grupo: Admin, Trabajadores, Clientes.
    """

    def role_guard(current_user: Usuario = Depends(get_current_user)) -> Usuario:
        user_group = TIPO_USUARIO_TO_GROUP.get(
            (current_user.tipo_usuario or "").lower()
        )
        if user_group not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para realizar esta acción.",
            )
        return current_user

    return role_guard


def ensure_self_or_admin(target_user_id: int, current_user: Usuario):
    """
    Permite acceso al propio usuario o a administradores.
    """
    user_group = TIPO_USUARIO_TO_GROUP.get((current_user.tipo_usuario or "").lower())
    if current_user.id_usuario != target_user_id and user_group != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para operar sobre este recurso.",
        )
