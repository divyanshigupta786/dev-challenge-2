import pytest
from app.services.groq_provider import GroqProvider

def test_parse_model_response_valid():
    provider = GroqProvider()
    raw = '''{
        "observation": "A moss patch is growing between the split flagstones.",
        "follow_up_question": "Does the moss receive more direct moisture from a nearby downspout?",
        "next_quest": "Check other shadowed pavement seams nearby."
    }'''
    parsed = provider._parse_model_response(raw)
    assert parsed["observation"] == "A moss patch is growing between the split flagstones."
    assert "moss receive" in parsed["follow_up_question"]
    assert parsed["next_quest"] == "Check other shadowed pavement seams nearby."

def test_parse_model_response_with_surrounding_text():
    provider = GroqProvider()
    raw = '''Here is your observation json:
    {
        "observation": "A faint brick stencil outline remains on the rendered stucco.",
        "follow_up_question": "Can you spot where the original brickwork begins underneath?"
    }
    Hope this helps!'''
    parsed = provider._parse_model_response(raw)
    assert "brick stencil outline" in parsed["observation"]
    assert parsed["next_quest"] is None

def test_parse_model_response_missing_observation():
    provider = GroqProvider()
    raw = '{"follow_up_question": "Is this old?"}'
    with pytest.raises(ValueError, match="missing observation"):
        provider._parse_model_response(raw)

def test_parse_model_response_invalid_json():
    provider = GroqProvider()
    with pytest.raises(ValueError):
        provider._parse_model_response("Not JSON at all")
