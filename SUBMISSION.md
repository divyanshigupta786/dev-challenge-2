# Mundane — An Editorial Field Journal for the Overlooked

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

**Tagline:** *“Your city is more interesting than you think.”*

Most modern AI apps do the exact opposite of getting you outside: they trap you in infinite chat windows, summarize things you never experienced, and replace physical curiosity with simulated answers.

**Mundane** is designed with the opposite intention: a tactile, editorial urban field journal that invites you to slow down, put your phone in your pocket, and explore the hidden textures, geometries, and histories of your everyday surroundings.

### Core Philosophy: Blind First, AI Second
Mundane is governed by one non-negotiable rule: **The AI is kept strictly locked until you have observed and recorded with your own senses.**
1. **Observe**: Pick an observational quest (e.g., *Pattern Hunt*, *Urban Archaeology*, *Design Detective*, *Light and Shadow*, or *Unexpected Geometry*).
2. **Record**: Write down what you saw, felt, or heard in your own unfiltered words. Attach an optional photo. Everything is saved locally to your device in **IndexedDB**.
3. **Reflect (Optional)**: Only after your observation is safely committed can you request an AI reflection. The model reflects strictly on what you registered, synthesis-style, asks **one** inquisitive follow-up question, and recommends your next urban walk.

### The Mundane Field Folio Studio (Zero-Screen Exploration)
For true "Touch Grass" immersion, Mundane includes the **Field Folio Studio**:
- **8-Page Pocket Mini-Zine**: Uses algorithmic imposition to fit an entire 8-page observation booklet onto a **single sheet of A4 paper**.
- **No Glue Required**: Follow the 4-step folding guide—three creases and a single center cut transform the sheet into a pocket notebook with a cover, field prompts, sketching area, and reflection log.
- **Single-Page Field Worksheet**: A clean, printable A4 field sheet for clipboards.
- **Interactive 3D Digital Folio Viewer**: A realistic digital book-opening simulator with authentic paper folds, spine gutter shading, and tactile page-turning for previewing your booklet.

---

## Demo

- **Live Application:** [Deploy your Vercel URL here]
- **API & Backend:** [Deploy your Railway URL here]
- **GitHub Repository:** [https://github.com/divyanshigupta786/dev-challenge-2](https://github.com/divyanshigupta786/dev-challenge-2)

### Highlights Tour:
- **Editorial Landing Page:** Features a rotating urban documentary photo carousel (cracked asphalt sprouts, raking sunlight on fire escapes, weathered masonry chisel marks), interactive *"LOOK CLOSER"* discovery marks, and an animated 3D folding booklet showcase.
- **Field Folio Studio (`/folio`):** Generate and print physical pocket booklets directly from your browser with `@media print` stylesheets optimized for A4 paper.
- **Observation Deck (`/observe`):** Fast, distraction-free field note entry with real-time word counting and photo attachment previews.
- **Offline Journal Archive (`/journal`):** Search, filter by theme or location, review past entries, and view AI reflections—100% offline.
- **Settings & Diagnostics (`/settings`):** Live AI status diagnostics, one-click full JSON journal export, and on-device storage management.

---

## Code

{% github https://github.com/divyanshigupta786/dev-challenge-2 %}

### Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, `motion/react` (Framer Motion).
- **Local Storage:** Dexie.js (IndexedDB wrapper) for private, zero-cloud data persistence.
- **Backend API:** FastAPI (Python 3.11+), Pydantic v2 Settings, HTTPX, Uvicorn.
- **AI Runtimes:**
  - **Local Offline Inference:** Ollama integration (`gemma3:4b` / `llama3.2:3b`).
  - **Fast Cloud Inference:** Groq provider with open-weight models (`qwen/qwen3.8-27b`).
- **Containerization & Deployment:** Docker multi-stage images, Railway for backend hosting, Vercel/Render for frontend CDN hosting.

---

## How I Built It

### 1. Open-Weight AI Architecture
Mundane is built from the ground up around open-weight models:
- **Local Ollama Support:** For complete off-grid walks (in the park, on the subway, or in a forest), users can run open-weight models locally with zero internet connection via Ollama (`http://localhost:11434`).
- **Groq Open-Weight Inference:** In production cloud deployments, Mundane calls open-weight models like `qwen/qwen3.8-27b` via Groq, achieving sub-second latency while keeping costs zero on free tiers.

### 2. Strict Anti-Hallucination Grounding
Generic AI prompts often over-explain or make up poetic nonsense about what you "probably saw". Mundane uses a specialized grounding prompt engine ([`prompt_service.py`](file:///backend/app/services/prompt_service.py)) that strictly prohibits the model from introducing external facts not mentioned by the user:
- Grounded synthesis of the user's specific words.
- One curiosity question that invites deeper physical inspection.
- Recommendation of a relevant future quest based on the sensory theme.

### 3. Mathematical Mini-Zine Imposition
Creating an 8-page foldable booklet from a single piece of paper requires precise geometric imposition:
- Panels 1, 8, 7, and 6 on the top row are rotated **180 degrees** so that when folded along the horizontal crease, all pages face upright.
- Panels 2, 3, 4, and 5 occupy the bottom row.
- Fold lines and center slit cut markers are mathematically calculated to match international ISO 216 A4 margins (`210mm × 297mm`).

### 4. Local-First Privacy (Dexie & IndexedDB)
Rather than forcing users to create an account before taking a walk, observations and photographs are saved directly in browser IndexedDB. Users have complete data sovereignty: zero tracking scripts, zero third-party analytics, and full JSON data export.

---

## Why Does Open Innovation Matter?

Open innovation is what makes a project like Mundane possible and ethical:

1. **Human Sovereignty & Privacy**: A personal journal of your private thoughts, daily walking routes, and neighborhood observations should never be locked behind a walled-garden SaaS or used to train corporate advertising models. Open-source local-first software ensures your data stays on your machine.
2. **True Disconnected Independence**: Closed API ecosystems require an active, uninterrupted internet connection. Open-weight models (running on Ollama or edge runtimes) allow true digital detox: you can download the model, turn off Wi-Fi and mobile data, take your laptop or tablet into the wild, and have an AI companion that respects your solitude.
3. **Transparent & Grounded AI**: Closed commercial models often come with opaque system instructions designed to flatter or maximize user engagement time. Open innovation allowed us to write transparent, reproducible, grounded prompts that prioritize real-world physical mindfulness over digital retention metrics.

---

## My Agent Session

This project was built and refined using advanced agentic AI pair programming:
- Explored and integrated the tactile Field Folio mini-zine imposition algorithm.
- Designed an editorial design system with bespoke typography (`Instrument Serif`, `Newsreader`, `DM Sans`, `Caveat`).
- Containerized the FastAPI backend for Railway deployment and verified test suites with 100% passing pytest and TypeScript builds.

<!-- If you have a DevRelay session link, embed it here:
{% agent_session <session-id> %}
-->

---

## Prize Categories

- **Touch Grass** (Primary Category) — Designed specifically to get people away from infinite feeds, outside into their physical cities, and engaging with real-world sensory details through hands-on observation and printable pocket folios.
- **Open Innovation** — Built completely around open-weight models (Ollama local inference and Groq open-weight inference), local-first data architecture, and reproducible open-source tooling.

---

<!-- Team Submissions: Credit teammates by listing their DEV usernames below -->
<!-- Author: @divyanshigupta786 -->

*Thank you for reading — now step outside, look closer, and keep a record of the ordinary! 🌿*
