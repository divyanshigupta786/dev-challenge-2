# Mundane — System Architecture

**Mundane** is a local-first AI field journal designed to help individuals observe the overlooked textures, geometries, and histories of their everyday physical environment.

## Architectural Principles

1. **Blind First, AI Second**: AI reflection is strictly quarantined until after the human has registered their own unfiltered physical observation.
2. **Local-First Reliability**: The entire core journaling loop (quests, observations, search, tagging, filtering, local photo attachments, JSON export) executes on-device via IndexedDB.
3. **Transparent AI State**: Real-time health polling directly checks whether the local Ollama instance and requested model (`gemma3:4b`) are reachable. No mocked status badges or pre-generated illusions.

---

## High-Level Topology

```
┌──────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│                                                              │
│  React 19 + TypeScript + Vite + Tailwind CSS                │
│                                                              │
│  ┌────────────────┐     ┌──────────────┐    ┌──────────────┐ │
│  │ Today / Quests │     │ Observe Page │    │ Journal Page │ │
│  └───────┬────────┘     └──────┬───────┘    └──────┬───────┘ │
│          │                     │                   │         │
│          ▼                     ▼                   ▼         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │               Dexie.js (IndexedDB Engine)               │ │
│  │  Stores: Entries, Themes, Observations, Photos, Dates  │ │
│  └─────────────────────────────┬───────────────────────────┘ │
└────────────────────────────────┼─────────────────────────────┘
                                 │ HTTP (POST /api/reflect)
                                 │ HTTP (GET /api/model/status)
                                 ▼
┌──────────────────────────────────────────────────────────────┐
│                    Local FastAPI Daemon                      │
│                                                              │
│  Python 3.10+ / FastAPI / Pydantic / HTTPX                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Routes: /health, /api/model/status, /api/reflect        │ │
│  └─────────────────────────────┬───────────────────────────┘ │
│                                │ Prompt Engineering          │
│                                │ (Strict Grounding Rules)    │
│                                ▼                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     Ollama Provider                     │ │
│  │             Calls http://localhost:11434                │ │
│  └─────────────────────────────┬───────────────────────────┘ │
└────────────────────────────────┼─────────────────────────────┘
                                 │ Native REST
                                 ▼
┌──────────────────────────────────────────────────────────────┐
│                 Local Inference (Ollama)                     │
│                        gemma3:4b                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Schema & Storage

### Client Side (IndexedDB)
Table: `entries`
- `id`: UUID (Primary Key)
- `questId`: ID of the quest prompt
- `questTitle`: Title of the quest
- `theme`: One of 5 categories (`Pattern Hunt`, `Urban Archaeology`, `Design Detective`, `Light and Shadow`, `Unexpected Geometry`)
- `observationText`: Raw text written by the user (minimum 10 characters)
- `aiReflection`: Structured JSON object (`{ observation, follow_up_question, next_quest }`) or `null`
- `photoBlob`: Binary Blob of an optional attached photo
- `placeLabel`: Optional contextual label (e.g., "7th and Elm Street")
- `observedAt`: ISO timestamp
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

---

## AI Reflection Engine

### Prompt Construction
The backend prompt isolates the user's observation text and imposes strict negative constraints:
- Reflect **only** on what the user saw.
- Use explicit hedged phrasing (*may, appears, could, seems*).
- Never claim historical certainty without direct evidence in the prompt.
- Never identify people or make sensitive facial/demographic assertions.
- Output clean JSON with schema:
  - `observation` (string: 2-4 sentences)
  - `follow_up_question` (string: single inquiry)
  - `next_quest` (string: micro observation suggestion)
