import Dexie, { type EntityTable } from 'dexie';
import type { JournalEntry } from './types';

// Dexie stores Dates as numbers, so we define a storage type
interface StoredJournalEntry extends Omit<JournalEntry, 'observedAt' | 'createdAt' | 'updatedAt'> {
  observedAt: number;
  createdAt: number;
  updatedAt: number;
}

class MundaneDB extends Dexie {
  entries!: EntityTable<StoredJournalEntry, 'id'>;

  constructor() {
    super('mundane-journal');

    this.version(1).stores({
      // Index id, questId, theme, and dates for search/filter
      entries: 'id, questId, theme, observedAt, createdAt, updatedAt',
    });
  }
}

const db = new MundaneDB();

// ── Helpers to convert Date <-> number ─────────────────────────
function toStored(entry: JournalEntry): StoredJournalEntry {
  return {
    ...entry,
    observedAt: entry.observedAt.getTime(),
    createdAt: entry.createdAt.getTime(),
    updatedAt: entry.updatedAt.getTime(),
  };
}

function fromStored(stored: StoredJournalEntry): JournalEntry {
  return {
    ...stored,
    observedAt: new Date(stored.observedAt),
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

// ── DB Operations ───────────────────────────────────────────────
export const dbOperations = {
  async saveEntry(entry: JournalEntry): Promise<void> {
    await db.entries.put(toStored(entry));
  },

  async getEntry(id: string): Promise<JournalEntry | undefined> {
    const stored = await db.entries.get(id);
    return stored ? fromStored(stored) : undefined;
  },

  async getAllEntries(): Promise<JournalEntry[]> {
    const stored = await db.entries.orderBy('observedAt').reverse().toArray();
    return stored.map(fromStored);
  },

  async deleteEntry(id: string): Promise<void> {
    await db.entries.delete(id);
  },

  async updateEntry(id: string, updates: Partial<JournalEntry>): Promise<void> {
    const existing = await db.entries.get(id);
    if (!existing) throw new Error(`Entry ${id} not found`);
    const merged: StoredJournalEntry = {
      ...existing,
      ...toStored({ ...fromStored(existing), ...updates, updatedAt: new Date() }),
    };
    await db.entries.put(merged);
  },

  async searchEntries(query: string): Promise<JournalEntry[]> {
    const all = await dbOperations.getAllEntries();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (e) =>
        e.observationText.toLowerCase().includes(q) ||
        e.questTitle.toLowerCase().includes(q) ||
        e.theme.toLowerCase().includes(q) ||
        (e.placeLabel?.toLowerCase().includes(q) ?? false),
    );
  },

  async exportAllEntries(): Promise<string> {
    const all = await dbOperations.getAllEntries();
    const exportable = all.map((e) => ({
      ...e,
      photoBlob: e.photoBlob ? '[photo attached - not exported]' : null,
      observedAt: e.observedAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
    return JSON.stringify(exportable, null, 2);
  },

  async deleteAllEntries(): Promise<void> {
    await db.entries.clear();
  },
};

export default db;
