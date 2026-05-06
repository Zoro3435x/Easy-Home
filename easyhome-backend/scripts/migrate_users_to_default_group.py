"""Script local sin migración activa de Cognito.

El proyecto ahora está preparado para ejecutarse localmente sin AWS Cognito.
Si necesitas migrar usuarios contra un user pool real, restaura la
configuración de Cognito y usa un script dedicado.
"""

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    """Entrada principal del script."""
    logger.info(
        "Este script no hace nada en modo local. Usa AWS Cognito solo si está configurado."
    )


if __name__ == "__main__":
    main()
