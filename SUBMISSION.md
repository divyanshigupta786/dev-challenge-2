---
title: Mundane — Your City Is More Interesting Than You Think (Offline Urban Field Journal)
published: true
tags: devchallenge, hf26challenge, opensource, ai
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

> 🌿 **Quick Note on Cover Image:** When publishing on DEV.to, remember to click **"Add a cover image"** at the top and upload a screenshot of the Mundane Landing Page hero! It ensures the post renders beautifully across the DEV home feed and social cards.

---

## What I Built

**Tagline:** *“Your city is more interesting than you think.”*

Most modern AI applications do the exact opposite of getting you outside: they trap you in infinite chat windows, summarize experiences you never had, and replace genuine human curiosity with pre-digested answers.

I built **Mundane** as an antidote: a tactile, editorial urban field journal inspired by documentary photography and independent print zines. It invites you to step outside, slow down, put your phone in your pocket, and record the subtle, overlooked textures, geometries, and artifacts of your everyday neighborhood.

<!-- 📸 Screenshot: Mundane Landing Page Hero with rotating urban documentary scenes & "LOOK CLOSER" prompt -->

### The Defining Principle: Blind First, AI Second
Mundane is governed by a strict philosophy: **AI never interprets before you observe.**
1. **Observe**: Pick an observational quest (e.g., *Pattern Hunt*, *Urban Archaeology*, *Design Detective*, *Light and Shadow*, or *Unexpected Geometry*).
2. **Record**: Register your physical observations in your own unfiltered words. Attach an optional photo. Everything is stored locally on-device in **IndexedDB**.
3. **Reflect (Optional & Grounded)**: Only after your observation is saved can you request an AI reflection. The model reflects strictly on what you documented, synthesizes your field note, asks **one** thought-provoking follow-up question, and recommends your next urban walk.

<!-- 📸 Screenshot: The Observation Deck and Grounded AI Reflection flow -->

### The Mundane Field Folio Studio (Zero-Screen Immersion)
To achieve true digital detox, Mundane features the **Field Folio Studio**:
- **8-Page Pocket Mini-Zine**: An algorithmic imposition engine formats an entire 8-page observation booklet onto a **single sheet of A4 paper**.
- **No Glue Required**: Three simple creases and one center slit transform the printed sheet into an authentic pocket zine complete with cover art, observation checklist, sketching frame, and notes log.
- **Single-Page Worksheet**: Printable A4 field notes sheet for clipboards.
- **3D Digital Folio Viewer**: An interactive book-opening simulator featuring authentic paper folds, spine gutter shading, and tactile page-turning controls.

<!-- 📸 Screenshot: Field Folio 8-page imposition layout and 3D folding booklet showcase -->

---

## Demo

- **Live Application:** [https://dev-challenge-2-ten.vercel.app](https://dev-challenge-2-ten.vercel.app)
- **API & Backend:** [https://dev-challenge-2-production.up.railway.app](https://dev-challenge-2-production.up.railway.app)
- **GitHub Repository:** [https://github.com/divyanshigupta786/dev-challenge-2](https://github.com/divyanshigupta786/dev-challenge-2)

### Highlights to Try Out:
1. **The Hero Carousel (`/`):** Explore the 4 rotating photographic scenarios with hover-pause and manual `< >` slides. Tap the hand-drawn observation circle to discover hidden urban clues.
2. **The 3D Booklet Preview (`/` & `/folio`):** Toggle the *"Fold Booklet / Open Booklet"* animation to see the pocket zine open flat in 3D perspective.
3. **Printable Folio (`/folio`):** Click *"Print Booklet (A4)"* to trigger the pre-configured print stylesheet.
4. **Local Journal (`/journal`):** Browse, search, and edit past entries with zero internet connection.

---

## Code

{% github https://github.com/divyanshigupta786/dev-challenge-2 %}

### Architectural Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, `motion/react` (Framer Motion).
- **Local Storage Engine:** Dexie.js (IndexedDB) for client-side privacy and offline persistence.
- **Backend Service:** FastAPI, Pydantic v2 Settings, HTTPX, Uvicorn, Docker.
- **AI Runtimes:**
  - **Local Offline Inference:** Ollama integration (`gemma3:4b` / `llama3.2:3b`).
  - **Fast Cloud Inference:** Groq open-weight provider (`qwen/qwen3.8-27b`).
- **Deployment:** Containerized on Railway (backend) and Vercel CDN (frontend).

---

## How I Built It

### 1. Open-Weight AI Architecture
Mundane is built around open-weight models:
- **Local Offline Inference with Ollama:** When walking through parks or subways with no reception, users can run open-weight models completely offline on `http://localhost:11434`.
- **High-Speed Cloud Inference with Groq:** In the cloud deployment, Mundane connects to open-weight models like `qwen/qwen3.8-27b` via Groq, delivering sub-second latency with zero cold-start delay.

### 2. Strict Grounding Prompt Engineering
Commercial chatbots often hallucinate what you "probably saw". Mundane uses an isolated prompt engine (`prompt_service.py`) with strict negative constraints:
- Must reflect **only** on details explicitly mentioned in the user's field note.
- Never flatters or praises artificially.
- Concludes with exactly **one** grounded question that challenges the user to return to the physical location and look closer.

### 3. Mathematical Mini-Zine Imposition
Fitting 8 pages onto a single A4 landscape sheet requires precise geometric inversion:
- The top 4 panels (Pages 1, 8, 7, 6) are rotated **180 degrees** so they face right-side-up once the paper is folded horizontally.
- Bottom panels (Pages 2, 3, 4, 5) remain upright.
- Fold and cut guides are calibrated to ISO 216 dimensions (`210mm × 297mm`).

### 4. Local-First Privacy Sovereignty
All entries, timestamps, and camera photo blobs reside in browser IndexedDB. Zero tracking cookies, zero external analytics, and zero required account sign-ups.

---

## Why Does Open Innovation Matter?

Open innovation is fundamental to why this project works:

1. **Human Sovereignty & Privacy**: Personal thoughts recorded during solitary walks should never be monetized, profiled, or ingested by closed AI corporations to train ad-targeting models. Open innovation ensures that local-first, on-device computing remains viable.
2. **True Digital Detox & Off-Grid Independence**: Closed AI APIs demand constant connectivity. Open-weight models empower you to disconnect your Wi-Fi, turn off cellular data, step into nature or quiet city alleys, and still enjoy an intelligent companion that respects your focus.
3. **Grounded Reflection Over Engagement Optimization**: Proprietary consumer AI models are optimized to keep users chatting for as long as possible. Open-source models allowed us to craft a focused system whose primary mission is to get you off the screen and back into the world.

---

## My Agent Session

This application was engineered using agentic AI pair programming:
- Implemented and verified the mathematical Field Folio booklet imposition.
- Polished the responsive editorial design system (`Instrument Serif`, `Newsreader`, `Caveat`).
- Containerized the FastAPI backend with multi-stage Docker and verified 10/10 passing unit tests.

<!-- Optional: Embed your DevRelay session ID below:
{% agent_session ID %}
-->

---

## Prize Categories

- **Touch Grass** (Primary) — Built entirely to break screen fatigue, inspire real-world urban exploration, and enable zero-screen observations via printable 8-page pocket booklets.
- **Open Innovation** — Centered on open-weight inference (Ollama local inference and Groq open-weight models), transparent grounding prompts, and local-first data architecture.

---

## Community Discussion & Feedback 💬

I wrote Mundane because I found myself constantly looking down at my phone during walks instead of noticing the incredible architectural history, moss patterns, and transient light in my own city.

- Have you ever noticed a tiny detail on your daily commute that you had walked past for years?
- Would you print out a pocket zine like the Field Folio, or do you prefer logging notes digitally?

**Drop your thoughts and questions in the comments below — I would love to hear how you explore your city!** 🌿
