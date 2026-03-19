"""
Script para configurar la política del bucket S3 para acceso público de lectura
"""
import sys
import os
from pathlib import Path
import json

# Añadir el directorio raíz al path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from app.core.config import settings
import boto3


def configure_bucket_policy():
    """Configura la política del bucket para permitir lectura pública"""
    
    print("=" * 60)
    print("🔧 CONFIGURACIÓN DE POLÍTICA DEL BUCKET S3")
    print("=" * 60)
    
    bucket_name = settings.S3_BUCKET_NAME
    
    print(f"\n📦 Bucket: {bucket_name}")
    print(f"🌍 Región: {settings.S3_REGION}")
    
    # Crear cliente S3
    s3_client = boto3.client(
        's3',
        region_name=settings.S3_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )
    
    # Política que permite lectura pública de todos los objetos
    bucket_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{bucket_name}/*"
            }
        ]
    }
    
    try:
        # 1. Desbloquear acceso público del bucket
        print("\n🔓 Habilitando acceso público del bucket...")
        s3_client.delete_public_access_block(Bucket=bucket_name)
        print("   ✅ Acceso público habilitado")
        
    except Exception as e:
        print(f"   ⚠️  Advertencia: {e}")
        print("   💡 Puede que ya esté habilitado o necesites hacerlo manualmente desde la consola AWS")
    
    try:
        # 2. Aplicar política de bucket
        print("\n📋 Aplicando política de bucket...")
        policy_string = json.dumps(bucket_policy)
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=policy_string
        )
        print("   ✅ Política aplicada correctamente")
        print("\n📄 Política aplicada:")
        print(json.dumps(bucket_policy, indent=2))
        
    except Exception as e:
        print(f"   ❌ Error al aplicar política: {e}")
        print("\n💡 Aplica esta política manualmente desde la consola AWS:")
        print("\n" + "="*60)
        print(json.dumps(bucket_policy, indent=2))
        print("="*60)
        return False
    
    print("\n" + "=" * 60)
    print("✅ CONFIGURACIÓN COMPLETADA")
    print("=" * 60)
    print("\n💡 Los archivos en el bucket ahora son públicamente accesibles")
    print("   Puedes probar la conexión nuevamente con:")
    print("   python scripts/test_s3_connection.py\n")
    
    return True


if __name__ == "__main__":
    try:
        success = configure_bucket_policy()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
