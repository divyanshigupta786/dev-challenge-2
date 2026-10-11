# Mundane
> **Your city is more interesting than you think.**
> Built for Hacktoberfest Dev Challenge 2: *"Touch Grass"*

Mundane is a local-first AI field journal designed to help you slow down, explore the overlooked corners of your everyday city, and register physical observations before consulting artificial intelligence.

---

## 🌿 Core Tenets

1. **Blind First, AI Second**: You must look and write first. The AI reflection stays locked until your own field observation is recorded.
2. **Local-First & Private**: Observations and photos remain stored on your machine in IndexedDB. No forced cloud accounts, tracking, or telemetry.
3. **Honest AI**: Clear real-time status reporting against your local Ollama runtime (`gemma3:4b`). No fake responses or mocked status badges.
4. **Urban Field Notebook Aesthetic**: Tailored typography (Newsreader serif headings, DM Sans body) with concrete paper tones and natural mineral accents (oxide, weathered stone, dust, patina).

---

## 🧭 Screen Tour

- **Today**: Daily rotating observation quest, quick category filter (Pattern Hunt, Urban Archaeology, Design Detective, Light and Shadow, Unexpected Geometry), and latest field note recap.
- **Observe**: Observation recording interface with text validation, photo attachment preview, and privacy guarantees.
- **Reflection**: Grounded AI reflection with observation synthesis, an inquisitive follow-up question, and a recommended next quest.
- **Journal**: Full chronological field log with keyword search, category filters, inline editing, and entry deletion.
- **Settings**: Direct local AI connection diagnostics, full JSON journal export, and local storage database reset.

---

## 🚀 Quickstart

### Prerequisites
- [Node.js](https://nodejs.org) (v20+)
- [Python](https://python.org) (v3.10+)
- [Ollama](https://ollama.ai) (optional, for local AI reflection)

```bash
# Optional: Pull local model
ollama run gemma3:4b
```

### 1. Start the Backend API
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend health check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend application: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing & Validation

### Backend
```bash
cd backend
$env:PYTHONPATH="."
.\venv\Scripts\pytest -v
```

### Frontend Build
```bash
cd frontend
npm run build
```

---

## 📄 Documentation

- [System Architecture](docs/architecture.md)
- [Privacy & Data Sovereignty](docs/privacy.md)
- [Contributing Guide](CONTRIBUTING.md)
- [License (MIT)](LICENSE)
