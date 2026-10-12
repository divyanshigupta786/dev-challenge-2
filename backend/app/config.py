from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
from typing import Literal


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- AI Provider selector ---
    # Set AI_PROVIDER=groq in .env to use Groq cloud (recommended)
    # Set AI_PROVIDER=ollama to use local Ollama
    ai_provider: Literal["groq", "ollama"] = "groq"

    # --- Groq (cloud, free tier) ---
    groq_api_key: str = ""
    groq_model: str = "qwen/qwen3.8-27b"

    # --- Ollama (local) ---
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"
    ollama_timeout: float = 120.0

    # CORS origins for local dev - restrict or set "*" in production
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
    ]

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    max_observation_length: int = 5000
    max_quest_title_length: int = 200


@lru_cache
def get_settings() -> Settings:
    return Settings()
