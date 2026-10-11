from typing import Optional
import httpx
import json
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)


class OllamaProvider:
    """
    Handles communication with a local Ollama instance.
    Provider logic is isolated here so adding new providers
    only requires a new module, not touching routes.
    """

    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.ollama_base_url
        self.model = self.settings.ollama_model
        self.timeout = self.settings.ollama_timeout

    async def is_available(self) -> tuple[bool, Optional[str]]:
        """Check if Ollama service is reachable."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    return True, None
                return False, f"Ollama returned status {response.status_code}"
        except httpx.ConnectError:
            return False, "Cannot connect to Ollama. Make sure it's running: ollama serve"
        except httpx.TimeoutException:
            return False, "Ollama connection timed out"
        except Exception as e:
            return False, str(e)

    async def is_model_available(self) -> tuple[bool, Optional[str]]:
        """Check if the configured model is downloaded."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code != 200:
                    return False, "Could not fetch model list"
                data = response.json()
                models = [m.get("name", "") for m in data.get("models", [])]
                # Match by prefix (e.g. "gemma3:4b" matches "gemma3:4b" or "gemma3:4b-instruct")
                model_base = self.model.split(":")[0]
                for m in models:
                    if m == self.model or m.startswith(model_base):
                        return True, None
                return (
                    False,
                    f"Model '{self.model}' not found. Run: ollama pull {self.model}",
                )
        except Exception as e:
            return False, str(e)

    async def generate(self, prompt: str) -> dict:
        """
        Generate a completion using Ollama's /api/generate endpoint.
        Returns a dict with keys: observation, follow_up_question, next_quest
        Raises ValueError for invalid model output, httpx errors for service failures.
        """
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 512,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
                raw_text = data.get("response", "")

            # Parse the JSON response from the model
            parsed = self._parse_model_response(raw_text)
            return parsed

        except httpx.ConnectError:
            raise ConnectionError(
                "Cannot connect to Ollama. Please start it with: ollama serve"
            )
        except httpx.TimeoutException:
            raise TimeoutError(
                f"Model took too long to respond (>{self.timeout}s). "
                "Try a smaller model like gemma3:1b"
            )
        except httpx.HTTPStatusError as e:
            raise RuntimeError(f"Ollama API error: {e.response.status_code}")

    def _parse_model_response(self, raw: str) -> dict:
        """
        Parse the model's JSON output and validate required fields.
        Raises ValueError if the response cannot be parsed.
        """
        if not raw or not raw.strip():
            raise ValueError("Model returned an empty response")

        # Try to extract JSON even if there's surrounding text
        text = raw.strip()
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("Model response did not contain valid JSON")

        json_str = text[start:end]
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Could not parse model JSON: {e}")

        # Validate required fields
        if "observation" not in data or not data["observation"]:
            raise ValueError("Model response missing 'observation' field")
        if "follow_up_question" not in data or not data["follow_up_question"]:
            raise ValueError("Model response missing 'follow_up_question' field")

        return {
            "observation": str(data["observation"])[:1000],
            "follow_up_question": str(data["follow_up_question"])[:500],
            "next_quest": str(data.get("next_quest", ""))[:300] or None,
        }


# Module-level singleton
_provider: Optional[OllamaProvider] = None


def get_provider() -> OllamaProvider:
    global _provider
    if _provider is None:
        _provider = OllamaProvider()
    return _provider
