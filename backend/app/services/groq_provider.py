from typing import Optional
import httpx
import json
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class GroqProvider:
    """
    Handles communication with Groq cloud API.
    Uses OpenAI-compatible chat completions endpoint.
    Runs the same llama3.2 model as Ollama - just hosted in the cloud.
    No installation required; only needs a free API key from console.groq.com.
    """

    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.groq_api_key
        self.model = self.settings.groq_model
        self.timeout = 30.0

    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def is_available(self) -> tuple[bool, Optional[str]]:
        if not self.api_key:
            return False, "GROQ_API_KEY not set. Get a free key at console.groq.com"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(
                    "https://api.groq.com/openai/v1/models",
                    headers=self._headers(),
                )
                if response.status_code == 200:
                    return True, None
                if response.status_code == 401:
                    return False, "Invalid GROQ_API_KEY. Check console.groq.com"
                return False, f"Groq returned status {response.status_code}"
        except httpx.ConnectError:
            return False, "Cannot reach Groq API. Check your internet connection."
        except httpx.TimeoutException:
            return False, "Groq API connection timed out."
        except Exception as e:
            return False, str(e)

    async def is_model_available(self) -> tuple[bool, Optional[str]]:
        return await self.is_available()

    async def generate(self, prompt: str) -> dict:
        if not self.api_key:
            raise ConnectionError("GROQ_API_KEY not configured. Add it to backend/.env")

        payload = {
            "model": self.model,
            "messages": [
                # The prompt already contains the full SYSTEM_PROMPT from prompt_service.py.
                # We use a single user message so the model receives all grounding rules as context.
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 512,
            "response_format": {"type": "json_object"},
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    GROQ_API_URL,
                    headers=self._headers(),
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()

            raw_text = data["choices"][0]["message"]["content"]
            return self._parse_model_response(raw_text)

        except httpx.ConnectError:
            raise ConnectionError("Cannot reach Groq API. Check your internet connection.")
        except httpx.TimeoutException:
            raise TimeoutError(f"Groq took too long to respond (>{self.timeout}s).")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise PermissionError("Invalid GROQ_API_KEY.")
            if e.response.status_code == 429:
                raise RuntimeError("Groq rate limit hit. Wait a moment and try again.")
            raise RuntimeError(f"Groq API error: {e.response.status_code}")

    def _parse_model_response(self, raw: str) -> dict:
        if not raw or not raw.strip():
            raise ValueError("Groq returned an empty response")

        text = raw.strip()
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("Groq response did not contain valid JSON")

        try:
            data = json.loads(text[start:end])
        except json.JSONDecodeError as e:
            raise ValueError(f"Could not parse Groq JSON: {e}")

        if "observation" not in data or not data["observation"]:
            raise ValueError("Model response missing observation field")
        if "follow_up_question" not in data or not data["follow_up_question"]:
            raise ValueError("Model response missing follow_up_question field")

        return {
            "observation": str(data["observation"])[:1000],
            "follow_up_question": str(data["follow_up_question"])[:500],
            "next_quest": str(data.get("next_quest", ""))[:300] or None,
        }


_provider: Optional[GroqProvider] = None


def get_groq_provider() -> GroqProvider:
    global _provider
    if _provider is None:
        _provider = GroqProvider()
    return _provider
