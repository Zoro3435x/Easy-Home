"""Service to mock user and group behavior when AWS Cognito is not used.

This module is intentionally minimal and is designed to allow the backend to run
without requiring AWS credentials or boto3.
"""

import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class CognitoService:
    """Simplified Cognito-like interface for local development."""

    def __init__(self):
        # Cuando AWS está configurado, el servicio podría usarlo.
        # En modo local, no intentamos realizar llamadas externas.
        self.enabled = bool(
            settings.AWS_ACCESS_KEY_ID
            and settings.AWS_SECRET_ACCESS_KEY
            and settings.COGNITO_USER_POOL_ID
        )

    def add_user_to_group(self, username: str, group_name: str) -> bool:
        """No-op local implementation.

        En entorno local, asumimos que la asignación es exitosa.
        """
        if not self.enabled:
            logger.debug("Cognito no configurado: omitiendo add_user_to_group")
            return True

        # En caso de que se habilite Cognito en el futuro, aquí iría la implementación.
        logger.warning(
            "Cognito está habilitado pero no soportado en esta versión local"
        )
        return False

    def get_user_groups(self, username: str) -> list[str]:
        """Devuelve grupos por defecto en modo local."""
        if not self.enabled:
            return [settings.COGNITO_DEFAULT_GROUP]

        return []

    def get_user_attributes(self, username: str) -> dict:
        """Devuelve un diccionario vacío en modo local."""
        return {}

    def get_user_by_email(self, email: str) -> dict:
        """Devuelve un diccionario vacío en modo local."""
        return {}

    def ensure_user_has_default_group(
        self, username: str, current_groups: list[str] = None
    ) -> bool:
        """Asegura que un usuario tenga el grupo por defecto en modo local."""
        if current_groups is None or len(current_groups) == 0:
            return True
        return True


# Instancia global del servicio
cognito_service = CognitoService()
