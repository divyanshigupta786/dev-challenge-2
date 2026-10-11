// ── Quest Types ─────────────────────────────────────────────────
export type QuestTheme =
  | 'Pattern Hunt'
  | 'Urban Archaeology'
  | 'Design Detective'
  | 'Light and Shadow'
  | 'Unexpected Geometry';

export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface Quest {
  id: string;
  title: string;
  description: string;
  theme: QuestTheme;
  difficulty: QuestDifficulty;
  tips: string[];
}

// ── Journal Entry Types ─────────────────────────────────────────
export interface AIReflection {
  observation: string;
  follow_up_question: string;
  next_quest: string | null;
}

export interface JournalEntry {
  id: string;                       // stable UUID
  questId: string;
  questTitle: string;
  theme: QuestTheme;
  observationText: string;          // user's original words — never overwritten
  aiReflection: AIReflection | null;
  photoBlob: Blob | null;           // stored locally in IndexedDB
  placeLabel: string | null;        // optional user-entered place label
  observedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── API Response Types ──────────────────────────────────────────
export interface ModelStatus {
  ollama_available: boolean;
  model_available: boolean;
  model_name: string;
  ollama_url: string;
  provider: 'groq' | 'ollama'; // which AI backend is active
  error: string | null;
}

export interface AppConfig {
  model_name: string;
  ollama_url: string;
  provider: 'groq' | 'ollama';
}

// ── App State Types ─────────────────────────────────────────────
export type AIStatus = 'idle' | 'checking' | 'available' | 'ollama_down' | 'model_missing' | 'error';

export interface ActiveObservation {
  quest: Quest;
  entryId?: string; // set after initial save
}
