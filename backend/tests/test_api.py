import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "0.1.0"

@pytest.mark.asyncio
async def test_get_config():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/config")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "ollama_url" in data

@pytest.mark.asyncio
async def test_model_status():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/model/status")
    assert response.status_code == 200
    data = response.json()
    assert "ollama_available" in data
    assert "model_available" in data
    assert "model_name" in data
    assert "ollama_url" in data

@pytest.mark.asyncio
async def test_reflect_validation_too_short():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/reflect",
            json={
                "observation_text": "short",
                "quest_title": "Test Quest",
                "theme": "Pattern Hunt",
            },
        )
    assert response.status_code == 422
