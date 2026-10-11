# Privacy & Data Sovereignty Architecture

Mundane is intentionally designed with a **zero-cloud default** policy.

## 1. Storage Location
- All journal entries, user notes, and attached photographs are stored strictly within the user's browser using **IndexedDB (Dexie.js)**.
- Nothing is sent to any centralized remote server or third-party cloud analytics.

## 2. Artificial Intelligence Processing
- AI reflections are executed locally via [Ollama](https://ollama.ai) on `http://localhost:11434`.
- Prompt construction runs via the local FastAPI backend on `http://localhost:8000`.
- Your thoughts, observations, and photos do **not** transit commercial AI provider APIs (e.g. OpenAI, Anthropic, or external cloud endpoints).

## 3. Telemetry & Tracking
- Zero external analytics scripts (no Google Analytics, Mixpanel, or PostHog).
- Zero user profiling cookies or trackers.
- Fonts are loaded via Google Fonts or system defaults with preconnect headers.

## 4. User Data Control
- **Export**: Users can export their full field journal at any time as an unencrypted, portable JSON file.
- **Delete**: Users can delete individual entries or purge the entire local database directly in the Settings screen with a single action.
