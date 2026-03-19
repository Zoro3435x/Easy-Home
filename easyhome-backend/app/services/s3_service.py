"""Service for handling file uploads in local development.

If AWS S3 is configured, uploads can be extended to use it, but by default
this service stores files on disk under a local uploads directory.
"""

from pathlib import Path
from typing import BinaryIO
import logging
from app.core.config import settings, BASE_DIR

logger = logging.getLogger(__name__)


class S3Service:
    """Service for interacting with AWS S3"""
    
    def __init__(self):
        """Initialize local upload directory (no AWS required)."""
        self.upload_dir = Path(BASE_DIR) / settings.LOCAL_UPLOAD_DIR
        self.upload_dir.mkdir(parents=True, exist_ok=True)

        # This key is used only for naming; in local mode it can be treated as a folder.
        self.bucket_name = settings.S3_BUCKET_NAME or settings.LOCAL_UPLOAD_DIR
        logger.info(f"Local upload service initialized at: {self.upload_dir}")
    
    def upload_file(
        self,
        file_obj: BinaryIO,
        object_name: str,
        content_type: str = "image/jpeg"
    ) -> str:
        """
        Upload a file to S3 bucket
        
        Args:
            file_obj: File object to upload
            object_name: S3 object name (key/path in bucket)
            content_type: MIME type of the file
            
        Returns:
            str: S3 key (path) of the uploaded file
            
        Raises:
            Exception: If upload fails
        """
        # Guardar archivo localmente bajo uploads/<object_name>
        target_path = self.upload_dir / object_name
        target_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with open(target_path, "wb") as f:
                f.write(file_obj.read())

            logger.info(f"File saved locally: {target_path}")
            return object_name
        except Exception as e:
            logger.error(f"Error saving file locally: {e}")
            raise
    
    def get_presigned_url(
        self,
        object_name: str,
        expiration: int = 3600
    ) -> str:
        """
        Generate a presigned URL for temporary access to a file
        
        Args:
            object_name: S3 object name (key/path in bucket)
            expiration: URL expiration time in seconds (default: 1 hour)
            
        Returns:
            str: Presigned URL for accessing the file
        """
        # En entornos locales, construimos la URL relativa
        return f"{settings.LOCAL_UPLOAD_URL_PREFIX}/{object_name}"
    
    def get_object_url(self, object_name: str) -> str:
        """Devuelve el objeto tal como se almacena en local."""
        return object_name
    
    def delete_file(self, object_name: str) -> bool:
        """
        Delete a file from S3 bucket
        
        Args:
            object_name: S3 object name (key/path in bucket)
            
        Returns:
            bool: True if deletion was successful
        """
        # Borrar archivo local
        target_path = self.upload_dir / object_name
        try:
            if target_path.exists():
                target_path.unlink()
                logger.info(f"File deleted successfully: {target_path}")
                return True
            logger.warning(f"File not found for deletion: {target_path}")
            return False
        except Exception as e:
            logger.error(f"Error deleting local file: {e}")
            return False


# Singleton instance
s3_service = S3Service()
