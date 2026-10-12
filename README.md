# Mundane
> **“Your city is more interesting than you think.”**  
> *An Editorial Urban Field Journal for Discovering the Overlooked*  
> Built for Hacktoberfest Open-Source AI Challenge: **Touch Grass**

[![Live Demo](https://img.shields.io/badge/Demo-Vercel-black?style=flat&logo=vercel)](https://dev-challenge-2-ten.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Railway-blueviolet?style=flat&logo=railway)](https://dev-challenge-2-production.up.railway.app)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌿 Overview

Most modern AI applications trap users behind infinite glowing screens, generating pre-chewed summaries of things they never physically touched or witnessed.

**Mundane** is designed as the antidote: a tactile, editorial urban field journal inspired by documentary photography and independent print zines. It encourages people to step outside, walk with intentional curiosity, and record the subtle architectural textures, unexpected geometries, and forgotten artifacts of their everyday neighborhood.

### Core Philosophy: Blind First, AI Second
Mundane is governed by a strict, non-negotiable rule: **AI is quarantined until your physical observations are committed.**
1. **Observe**: Pick an observational quest (e.g., *Pattern Hunt*, *Urban Archaeology*, *Design Detective*, *Light and Shadow*, or *Unexpected Geometry*).
2. **Record**: Capture raw notes, audio transcripts, or photos in your own words. Everything is saved strictly on-device in **IndexedDB**.
3. **Reflect**: Only after your observation is saved can you request an AI reflection. The model reflects strictly on what you registered, asks **one** inquisitive follow-up question, and recommends your next urban walk.

---

## 🌐 Live Deployments

- **Frontend Application (Vercel):** [https://dev-challenge-2-ten.vercel.app](https://dev-challenge-2-ten.vercel.app)
- **Backend API (Railway):** [https://dev-challenge-2-production.up.railway.app](https://dev-challenge-2-production.up.railway.app)
- **API Health Check:** [https://dev-challenge-2-production.up.railway.app/health](https://dev-challenge-2-production.up.railway.app/health)
- **Interactive Swagger Docs:** [https://dev-challenge-2-production.up.railway.app/docs](https://dev-challenge-2-production.up.railway.app/docs)

---

## 🏛️ System Architecture

Mundane adopts a **Local-First, Privacy-Preserving Architecture**. The user's device is the primary source of truth, and the remote backend acts as a stateless, strictly-grounded inference proxy.

### 1. High-Level Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER (Vercel)                         │
│                                                                        │
│   React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion         │
│                                                                        │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌─────────┐ │
│   │ Landing Page  │  │ Folio Studio  │  │ Observe Deck  │  │ Journal │ │
│   └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └────┬────┘ │
│           │                  │                  │               │      │
│           ▼                  ▼                  ▼               ▼      │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │                     Dexie.js (IndexedDB Engine)                  │ │
│   │        Entries • Themes • Observations • Photos • Dates          │ │
│   │               [100% On-Device, Offline-Capable]                  │ │
│   └────────────────────────────────┬─────────────────────────────────┘ │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     │ HTTPS (POST /api/reflect)
                                     │ HTTPS (GET /api/model/status)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICE (Railway)                         │
│                                                                        │
│   Python 3.11+ / FastAPI / Pydantic v2 / HTTPX / Docker                │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │ Routes: /health, /api/model/status, /api/config, /api/reflect    │ │
│   └────────────────────────────────┬─────────────────────────────────┘ │
│                                    │ Strict Grounding Engine           │
│                                    │ (prompt_service.py)               │
│                                    ▼                                   │
│            ┌───────────────────────────────────────────────┐           │
│            │            AI Provider Abstraction            │           │
│            └───────┬───────────────────────────────┬───────┘           │
└────────────────────┼───────────────────────────────┼───────────────────┘
                     │                               │
        Cloud Mode   │                               │  Local Mode
                     ▼                               ▼
      ┌─────────────────────────────┐  ┌─────────────────────────────┐
      │     Groq Cloud Inference    │  │   Ollama Local Inference    │
      │       qwen/qwen3.8-27b      │  │    gemma3:4b / llama3.2     │
      │  (Low-latency open weights) │  │  (100% Offline on-device)   │
      └─────────────────────────────┘  └─────────────────────────────┘
```

---

### 2. The "Blind First, AI Second" Execution Sequence

```
User (Physical)         Browser Client (IndexedDB)         FastAPI Backend            AI Model
      │                             │                             │                      │
      │ 1. Walks & Observes         │                             │                      │
      │────────────────────────────>│                             │                      │
      │                             │                             │                      │
      │ 2. Submits Field Note       │                             │                      │
      │────────────────────────────>│                             │                      │
      │                             │ 3. Saves to IndexedDB       │                      │
      │                             │────┐                        │                      │
      │                             │    │                        │                      │
      │                             │<───┘                        │                      │
      │                             │                             │                      │
      │ 4. Explicitly requests AI   │                             │                      │
      │────────────────────────────>│ 5. POST /api/reflect        │                      │
      │                             │────────────────────────────>│                      │
      │                             │                             │ 6. Grounded Prompt   │
      │                             │                             │─────────────────────>│
      │                             │                             │                      │
      │                             │                             │ 7. JSON Reflection   │
      │                             │                             │<─────────────────────│
      │                             │ 8. Enriched Response        │                      │
      │                             │<────────────────────────────│                      │
      │                             │ 9. Updates Local DB         │                      │
      │                             │────┐                        │                      │
      │                             │    │                        │                      │
      │                             │<───┘                        │                      │
      │ 10. Displays Synthesis      │                             │                      │
      │<────────────────────────────│                             │                      │
```

---

### 3. Data Schema & Storage Architecture

#### Client-Side Storage: `IndexedDB` (Dexie.js)
The core database name is `mundane-journal`. Data never leaves the browser without an explicit user action.

```typescript
interface JournalEntry {
  id: string;                    // UUID v4
  questId: string;               // e.g., "quest-001"
  questTitle: string;            // e.g., "The Things We Walk Past"
  theme: QuestTheme;             // Pattern Hunt, Urban Archaeology, Design Detective, etc.
  observationText: string;       // User's raw text notes (min 10 chars)
  aiReflection?: {               // Quarantined until requested
    observation: string;         // 2-4 sentence synthesis of user's notes
    follow_up_question: string;  // Exactly ONE grounded inquiry
    next_quest: string;          // Suggested follow-up walk
  } | null;
  photoBlob?: Blob | null;       // Stored locally in binary format
  placeLabel?: string | null;    // e.g., "Main St & 4th Ave"
  observedAt: Date;              // Timestamp of physical walk
  createdAt: Date;
  updatedAt: Date;
}
```

#### Optional Cloud Backup: `Supabase` (PostgreSQL)
For cross-device syncing, the repository provides [`supabase/migrations/20261011_journal_entries.sql`](supabase/migrations/20261011_journal_entries.sql) configured with **Row-Level Security (RLS)**:
```sql
CREATE POLICY "Users can select own entries" 
  ON public.journal_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

---

### 4. Mathematical Mini-Zine Imposition (Field Folio)

The **Field Folio** enables zero-screen exploration by converting any quest into an 8-page pocket booklet from a single A4 landscape sheet (`297mm × 210mm`).

To ensure pages read in natural consecutive order (Pages 1 to 8) when folded and cut along a central slit, the imposition matrix applies a 180° geometric rotation to the upper row:

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│     PAGE 1      │     PAGE 8      │     PAGE 7      │     PAGE 6      │
│    (Cover)      │     (Back)      │   (Synthesis)   │  (Field Notes)  │
│  [Rotated 180°] │  [Rotated 180°] │  [Rotated 180°] │  [Rotated 180°] │
├─────────────────┼═════════════════┼═════════════════┼─────────────────┤
│    [Crease]     │=== Center Slit (Cut Here) ========│    [Crease]     │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│     PAGE 2      │     PAGE 3      │     PAGE 4      │     PAGE 5      │
│   (Attunement)  │  (Checklist)    │   (Sketchbook)  │  (Sketchbook)   │
│   [Upright 0°]  │  [Upright 0°]   │   [Upright 0°]  │   [Upright 0°]  │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

**Folding Algorithm:**
1. Fold horizontally in half (hot dog fold).
2. Fold vertically into quarters (accordion fold).
3. Cut along the central slit between pages 2-3 and 8-7.
4. Push sides together into an 8-page booklet. **Zero glue required.**

---

### 5. Strict Grounding Prompt Engineering

The backend prompt engine ([`prompt_service.py`](backend/app/services/prompt_service.py)) enforces negative constraints against hallucination:
- Reflects **strictly** on sensory clues explicitly written by the user.
- Employs epistemic hedging (*"may indicate", "suggests", "appears to be"*).
- Forbids assuming historical certainty without explicit archival evidence.
- Restricts outputs to valid JSON containing:
  - `observation`: Synthesis of human notes.
  - `follow_up_question`: Single curiosity prompt.
  - `next_quest`: Micro-observation prompt for the next outing.

---

## 🧭 Screen Tour

- **Landing Page (`/`):** Editorial entry point with rotating urban photography (cracked pavement sprouts, raking sunlight on fire escapes, weathered chisel marks), interactive *"LOOK CLOSER"* card, hand-drawn observation marks, and an interactive 3D folding booklet showcase.
- **Quests & Today (`/quests`):** Daily rotating observation quest, categorized by theme: *Pattern Hunt*, *Urban Archaeology*, *Design Detective*, *Light and Shadow*, and *Unexpected Geometry*.
- **Field Folio Studio (`/folio`):** Generate and print physical 8-page pocket zines or single-page A4 field worksheets, plus an interactive 3D digital book spread viewer.
- **Observation Deck (`/observe`):** Distraction-free field note entry with real-time text validation, location tagging, and local photo attachment.
- **Reflection (`/reflection`):** Grounded AI reflection with observation synthesis, an inquisitive follow-up question, and a recommended next quest.
- **Journal Archive (`/journal`):** Chronological offline field log with keyword search, theme filtering, inline note editing, and entry deletion.
- **Settings (`/settings`):** Live AI status diagnostics, one-click full JSON journal export, and on-device storage reset.

---

## 🚀 Local Development

### Prerequisites
- [Node.js](https://nodejs.org) (v20+)
- [Python](https://python.org) (v3.10+)
- [Ollama](https://ollama.ai) (optional, for local offline inference)

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend health check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing & Validation

```bash
# Run backend pytest suite (10/10 tests)
cd backend
pytest -v

# Run frontend type-check & build
cd frontend
npm run build

# Run frontend linter
npm run lint
```

---

## 📄 Documentation

- [System Architecture Details](docs/architecture.md)
- [Privacy & Data Sovereignty Architecture](docs/privacy.md)
- [Hacktoberfest Submission Draft](SUBMISSION.md)
- [Contributing Guide](CONTRIBUTING.md)
- [License (MIT)](LICENSE)

---

*“Step outside. Notice the overlooked. Keep a record of the ordinary.”* 🌿
