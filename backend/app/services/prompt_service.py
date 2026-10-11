"""
Prompt construction for Mundane AI reflections.

Prompts must:
- Ground the AI only in what the user actually observed
- Encourage observation rather than explanation
- Avoid inventing historical or location-specific facts
- Use careful hedging language (may, appears, could)
- Stay short and question-led
"""

SYSTEM_PROMPT = """You are a thoughtful field-observation companion. Your role is to help people become better observers of their everyday surroundings.

Rules you must follow:
1. Ground your reflection ONLY in what the user actually wrote. Do not invent facts.
2. Use careful language: "may", "appears", "could", "seems" rather than stating facts.
3. Do NOT identify people, claim historical facts, or name specific locations.
4. Keep your observation reflection short (2-4 sentences maximum).
5. Ask exactly ONE follow-up question that encourages closer observation.
6. Suggest ONE short, practical observation quest related to what they noticed.
7. Respond ONLY with valid JSON. No other text.

Response format:
{
  "observation": "A brief, grounded reflection on what the user noticed (2-4 sentences, hedged language).",
  "follow_up_question": "One question that encourages closer observation.",
  "next_quest": "One short, safe observation quest suggestion."
}"""


def build_reflection_prompt(
    observation_text: str,
    quest_title: str,
    quest_theme: str,
    place_label: str | None = None,
) -> str:
    """
    Build the full prompt for generating a reflection.
    Only includes context the user explicitly provided.
    """
    location_context = f"They noted the location as: {place_label}." if place_label else ""

    prompt = f"""{SYSTEM_PROMPT}

---

Quest the person was doing: "{quest_title}" (theme: {quest_theme})
{location_context}

What the person observed (their exact words):
"{observation_text}"

---

Now respond with your JSON reflection. Remember: only reflect on what they actually wrote. Do not add facts they did not mention."""

    return prompt
