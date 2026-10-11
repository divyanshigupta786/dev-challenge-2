from pydantic import BaseModel, Field
from typing import Optional


class ReflectRequest(BaseModel):
    observation_text: str = Field(..., min_length=1, max_length=5000)
    quest_title: str = Field(..., min_length=1, max_length=200)
    quest_theme: str = Field(..., min_length=1, max_length=100)
    place_label: Optional[str] = Field(None, max_length=200)


class ReflectionResponse(BaseModel):
    observation: str
    follow_up_question: str
    next_quest: Optional[str] = None


class ModelStatusResponse(BaseModel):
    """Provider-agnostic AI status. Field names kept backward-compatible."""
    ollama_available: bool   # True when the configured AI provider is reachable
    model_available: bool
    model_name: str
    ollama_url: str          # Provider URL (groq://api.groq.com or http://localhost:11434)
    provider: str = "groq"   # "groq" | "ollama"
    error: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str


class ConfigResponse(BaseModel):
    model_name: str
    ollama_url: str          # Provider URL
    provider: str = "groq"   # "groq" | "ollama"


class QuestResponse(BaseModel):
    id: str
    title: str
    description: str
    theme: str
    difficulty: str
    tips: list[str]
