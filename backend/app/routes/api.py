from fastapi import APIRouter, HTTPException
from app.schemas.models import (
    HealthResponse,
    ModelStatusResponse,
    ConfigResponse,
    ReflectRequest,
    ReflectionResponse,
)
from app.services.ollama_provider import get_provider as get_ollama_provider
from app.services.groq_provider import get_groq_provider
from app.services.prompt_service import build_reflection_prompt
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


def get_active_provider():
    """Return the configured AI provider (Groq or Ollama)."""
    if settings.ai_provider == "groq":
        return get_groq_provider()
    return get_ollama_provider()


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", version="0.1.0")


@router.get("/api/model/status", response_model=ModelStatusResponse)
async def model_status():
    provider = get_active_provider()
    is_groq = settings.ai_provider == "groq"

    available, error = await provider.is_available()
    if not available:
        return ModelStatusResponse(
            ollama_available=False,
            model_available=False,
            model_name=provider.model,
            ollama_url="groq://api.groq.com" if is_groq else provider.base_url,
            error=error,
        )

    model_ok, model_error = await provider.is_model_available()
    return ModelStatusResponse(
        ollama_available=True,
        model_available=model_ok,
        model_name=provider.model,
        ollama_url="groq://api.groq.com" if is_groq else provider.base_url,
        error=model_error,
    )


@router.get("/api/config", response_model=ConfigResponse)
async def get_config():
    is_groq = settings.ai_provider == "groq"
    return ConfigResponse(
        model_name=settings.groq_model if is_groq else settings.ollama_model,
        ollama_url="groq://api.groq.com" if is_groq else settings.ollama_base_url,
    )


@router.post("/api/reflect", response_model=ReflectionResponse)
async def reflect(request: ReflectRequest):
    """
    Generate a grounded AI reflection from a user observation.
    Works with either Groq (cloud) or Ollama (local) based on AI_PROVIDER setting.
    """
    stripped = request.observation_text.strip()
    if len(stripped) < 10:
        raise HTTPException(
            status_code=422,
            detail="Observation is too short. Please write at least a few words about what you noticed.",
        )

    provider = get_active_provider()
    is_groq = settings.ai_provider == "groq"

    available, error = await provider.is_available()
    if not available:
        hint = "Add GROQ_API_KEY to backend/.env" if is_groq else "Start Ollama with: ollama serve"
        raise HTTPException(
            status_code=503,
            detail=f"AI is unavailable: {error}. {hint}",
        )

    model_ok, model_error = await provider.is_model_available()
    if not model_ok:
        raise HTTPException(status_code=503, detail=f"Model not ready: {model_error}")

    prompt = build_reflection_prompt(
        observation_text=stripped,
        quest_title=request.quest_title,
        quest_theme=request.quest_theme,
        place_label=request.place_label,
    )

    try:
        result = await provider.generate(prompt)
        return ReflectionResponse(**result)
    except (ConnectionError, PermissionError) as e:
        raise HTTPException(status_code=503, detail=str(e))
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except ValueError as e:
        logger.warning(f"Model output parsing failed: {e}")
        raise HTTPException(
            status_code=422,
            detail=f"The model returned an unexpected response. Please try again. ({e})",
        )
    except Exception as e:
        logger.error(f"Reflection generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during reflection generation.",
        )
