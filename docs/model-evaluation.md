# Model Evaluation & Selection Notes

This document captures the evaluation and selection rationale for local language models supporting **Mundane**.

---

## Task Requirements & Negative Constraints

The AI reflection task in Mundane is strictly structured:
1. **Observation Reflection**: Grounded *only* in the text written by the user. Must use careful epistemic hedging (*"may", "appears", "could", "seems"*).
2. **Follow-Up Question**: Exactly one inquiry encouraging closer physical scrutiny.
3. **Next Quest**: One micro-observation suggestion.
4. **Structured JSON Output**: Must reliably return `{ "observation": string, "follow_up_question": string, "next_quest": string | null }`.

---

## Model Comparison Matrix

| Model | Parameters | Download Size | JSON Adherence | Speed / Resource Footprint | Evaluation Verdict |
|---|---|---|---|---|---|
| **Llama 3.2 3B** | 3.21B | ~2.0 GB | ⭐⭐⭐⭐⭐ Exceptional | Fast inference on CPU & integrated GPUs (~20-30 tok/s) | **Selected Default**: Optimal balance of size, JSON reliability, and prompt compliance. |
| **Gemma 3 4B** | 4B | ~2.8 GB | ⭐⭐⭐⭐☆ Very Good | Moderate resource use; slightly slower download | **Strong Alternative**: Highly articulate tone, but higher VRAM requirement. |
| **Llama 3.2 1B** | 1.23B | ~1.3 GB | ⭐⭐⭐☆☆ Good | Blazing fast; lowest memory consumption | **Ultra-lightweight fallback**: Recommended for low-spec machines. |
| **Qwen 2.5 3B** | 3.09B | ~1.9 GB | ⭐⭐⭐⭐⭐ Exceptional | Very fast; excellent precision | **Alternative**: High reasoning quality. |
| **Mistral 7B** | 7.24B | ~4.1 GB | ⭐⭐⭐⭐☆ High | Slower; requires 8GB+ RAM | **Heavyweight**: Overkill for short 3-field reflections. |

---

## Selected Default: `llama3.2:3b`

Meta's Llama 3.2 3B was selected as the project default for three reasons:
- **Trained on Function Calling & JSON**: The instruction-tuned variant exhibits near-zero parsing failures with Ollama's `format: "json"`.
- **Low Barrier to Entry**: At ~2.0 GB, it downloads in a couple of minutes even on moderate connections.
- **Tone Alignment**: Adheres cleanly to negative system prompt constraints without hallucinating historical dates or identifying bystanders.
