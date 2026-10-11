import pytest
from app.services.prompt_service import build_reflection_prompt, SYSTEM_PROMPT

def test_build_reflection_prompt():
    prompt = build_reflection_prompt(
        observation_text="Found yellow chalk hopscotch near the rusted iron storm drain.",
        quest_title="Traces of Play",
        quest_theme="Urban Archaeology",
        place_label="Maple St Alley",
    )
    assert "Traces of Play" in prompt
    assert "Urban Archaeology" in prompt
    assert "Maple St Alley" in prompt
    assert "Found yellow chalk hopscotch" in prompt
    assert "JSON" in prompt

def test_system_prompt_rules():
    assert "Ground your reflection ONLY in what the user actually wrote" in SYSTEM_PROMPT
    assert "Respond ONLY with valid JSON" in SYSTEM_PROMPT
