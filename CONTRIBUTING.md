# Contributing to Mundane

Thank you for your interest in contributing to Mundane! Mundane is a local-first AI field journal designed to help people look closely at their cities before seeking machine reflection.

## Philosophy & Guiding Principles

1. **Blind First, AI Second**: Users must record their observations with their own senses before AI reflection is generated.
2. **Local-First & Private**: Data lives on the user's machine by default. No unsolicited cloud sync, tracking, or telemetry.
3. **Honest AI Status**: Never show fake or mock AI responses. If the local model or Ollama is unavailable, clearly guide the user on how to start it.
4. **Thoughtful Aesthetics**: The "Urban Field Notebook" visual language uses curated earth tones, legible serif headings, clean sans-serif body, and generous whitespace.

## Development Setup

### Prerequisites
- Node.js (v20+ recommended)
- Python 3.10+
- (Optional) [Ollama](https://ollama.ai) with `ollama run gemma3:4b` for local AI reflection

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`.

### Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The backend API starts on `http://localhost:8000`.

## Testing

- Frontend: `npm run build` checks TypeScript types and bundles assets.
- Backend: `pytest` runs backend unit tests.

## Submitting Pull Requests

1. Fork the repo and create a feature branch (`git checkout -b feature/new-quest-theme`).
2. Adhere to TypeScript and Python type safety guidelines.
3. Ensure both frontend build and backend tests pass.
4. Submit a clear PR describing your changes and motivation.
