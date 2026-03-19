"""
Script para migrar usuarios de Cognito sin grupo al grupo "Clientes"

Este script:
1. Se conecta a AWS Cognito
2. Lista todos los usuarios
3. Identifica usuarios sin grupos
4. Los agrega automáticamente al grupo "Clientes"

Uso:
    python scripts/migrate_users_to_default_group.py
"""
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.cognito_service import cognito_service
from app.core.config import settings
import boto3
from botocore.exceptions import ClientError
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def list_all_users():
    """Lista todos los usuarios del User Pool"""
    if not cognito_service.client or not cognito_service.user_pool_id:
        logger.error("Cliente de Cognito no configurado. Verifica las credenciales en .env")
        return []
    
    users = []
    pagination_token = None
    
    try:
        while True:
            if pagination_token:
                response = cognito_service.client.list_users(
                    UserPoolId=cognito_service.user_pool_id,
                    PaginationToken=pagination_token
                )
            else:
                response = cognito_service.client.list_users(
                    UserPoolId=cognito_service.user_pool_id
                )
            
            users.extend(response.get('Users', []))
            
            # Verificar si hay más páginas
            pagination_token = response.get('PaginationToken')
            if not pagination_token:
                break
        
        return users
    
    except ClientError as e:
        logger.error(f"Error al listar usuarios: {e}")
        return []


def get_user_email(user):
    """Extrae el email de los atributos del usuario"""
    for attr in user.get('Attributes', []):
        if attr['Name'] == 'email':
            return attr['Value']
    return None


def migrate_users_without_groups():
    """Migra todos los usuarios sin grupos al grupo por defecto"""
    logger.info("=" * 60)
    logger.info("MIGRACIÓN DE USUARIOS SIN GRUPO A 'Clientes'")
    logger.info("=" * 60)
    
    # Verificar configuración
    if not settings.COGNITO_USER_POOL_ID:
        logger.error("❌ COGNITO_USER_POOL_ID no está configurado en .env")
        return
    
    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
        logger.error("❌ Credenciales de AWS no configuradas en .env")
        return
    
    logger.info(f"📋 User Pool ID: {settings.COGNITO_USER_POOL_ID}")
    logger.info(f"🎯 Grupo por defecto: {settings.COGNITO_DEFAULT_GROUP}")
    logger.info("")
    
    # Listar usuarios
    logger.info("🔍 Listando todos los usuarios...")
    users = list_all_users()
    
    if not users:
        logger.warning("⚠️  No se encontraron usuarios")
        return
    
    logger.info(f"✅ Se encontraron {len(users)} usuarios")
    logger.info("")
    
    # Procesar cada usuario
    users_migrated = 0
    users_already_in_group = 0
    users_with_error = 0
    
    for user in users:
        username = user['Username']
        email = get_user_email(user)
        
        # Obtener grupos del usuario
        groups = cognito_service.get_user_groups(username)
        
        if not groups or len(groups) == 0:
            # Usuario sin grupos - migrar
            logger.info(f"📤 Migrando: {email or username}")
            success = cognito_service.add_user_to_group(
                username=username,
                group_name=settings.COGNITO_DEFAULT_GROUP
            )
            
            if success:
                users_migrated += 1
                logger.info(f"   ✅ Agregado al grupo '{settings.COGNITO_DEFAULT_GROUP}'")
            else:
                users_with_error += 1
                logger.error(f"   ❌ Error al agregar al grupo")
        else:
            # Usuario ya tiene grupos
            users_already_in_group += 1
            logger.info(f"✓ {email or username} ya tiene grupos: {', '.join(groups)}")
    
    # Resumen
    logger.info("")
    logger.info("=" * 60)
    logger.info("RESUMEN DE MIGRACIÓN")
    logger.info("=" * 60)
    logger.info(f"Total de usuarios: {len(users)}")
    logger.info(f"✅ Usuarios migrados: {users_migrated}")
    logger.info(f"✓ Usuarios que ya tenían grupo: {users_already_in_group}")
    if users_with_error > 0:
        logger.info(f"❌ Usuarios con error: {users_with_error}")
    logger.info("=" * 60)


if __name__ == "__main__":
    migrate_users_without_groups()
