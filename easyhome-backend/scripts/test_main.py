import pytest
from httpx import ASGITransport, AsyncClient
from main import app  # Ajusta la ruta según tu archivo principal

@pytest.mark.asyncio
async def test_read_main():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/") # Cambia "/" por un endpoint que exista
    assert response.status_code == 200
