"""
Servicio para interactuar con AWS Cognito
"""
import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class CognitoService:
    """Servicio para gestionar usuarios y grupos en AWS Cognito"""
    
    def __init__(self):
        """Inicializa el cliente de Cognito"""
        self.client = None
        self.user_pool_id = settings.COGNITO_USER_POOL_ID
        
        # Solo inicializar si tenemos las credenciales configuradas
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            self.client = boto3.client(
                'cognito-idp',
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
    
    def add_user_to_group(self, username: str, group_name: str) -> bool:
        """
        Agrega un usuario a un grupo en Cognito
        
        Args:
            username: El username del usuario (puede ser email o sub)
            group_name: Nombre del grupo
            
        Returns:
            True si se agregó exitosamente, False en caso contrario
        """
        if not self.client or not self.user_pool_id:
            logger.warning("Cliente de Cognito no configurado. Verifica las credenciales de AWS.")
            return False
        
        try:
            self.client.admin_add_user_to_group(
                UserPoolId=self.user_pool_id,
                Username=username,
                GroupName=group_name
            )
            logger.info(f"Usuario {username} agregado al grupo {group_name}")
            return True
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            
            # Si el usuario ya está en el grupo, lo consideramos exitoso
            if error_code == 'ResourceNotFoundException':
                logger.error(f"Grupo {group_name} no encontrado en Cognito")
            elif error_code == 'UserNotFoundException':
                logger.error(f"Usuario {username} no encontrado en Cognito")
            else:
                logger.error(f"Error al agregar usuario al grupo: {e}")
            
            return False
        except Exception as e:
            """Service to mock user and group behavior when AWS Cognito is not used.

            This module is intentionally minimal and is designed to allow the backend to run
            without requiring AWS credentials or boto3.
            """

            from app.core.config import settings
            import logging

            logger = logging.getLogger(__name__)


            class CognitoService:
                """Simplified Cognito-like interface for local development."""

                def __init__(self):
                    # Cuando AWS está configurado, se podría conectar a Cognito.
                    # En modo local, no intentamos realizar ninguna llamada externa.
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
                    logger.warning("Cognito está habilitado pero no soportado en esta versión local")
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

                def ensure_user_has_default_group(self, username: str, current_groups: list[str] = None) -> bool:
                    """Asegura que un usuario tenga el grupo por defecto en modo local."""
                    if current_groups is None or len(current_groups) == 0:
                        return True
                    return True


            # Instancia global del servicio
            cognito_service = CognitoService()
                    if not self.enabled or not self.user_pool_id:
