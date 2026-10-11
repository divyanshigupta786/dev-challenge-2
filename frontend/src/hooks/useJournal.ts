import { useState, useEffect, useCallback } from 'react';
import { dbOperations } from '../lib/db';
import type { JournalEntry } from '../lib/types';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const all = await dbOperations.getAllEntries();
      setEntries(all);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntry = useCallback(async (entry: JournalEntry) => {
    await dbOperations.saveEntry(entry);
    await loadEntries();
  }, [loadEntries]);

  const updateEntry = useCallback(async (id: string, updates: Partial<JournalEntry>) => {
    await dbOperations.updateEntry(id, updates);
    await loadEntries();
  }, [loadEntries]);

  const deleteEntry = useCallback(async (id: string) => {
    await dbOperations.deleteEntry(id);
    await loadEntries();
  }, [loadEntries]);

  const getEntry = useCallback(async (id: string) => {
    return dbOperations.getEntry(id);
  }, []);

  const searchEntries = useCallback(async (query: string) => {
    return dbOperations.searchEntries(query);
  }, []);

  const exportEntries = useCallback(async () => {
    return dbOperations.exportAllEntries();
  }, []);

  const deleteAll = useCallback(async () => {
    await dbOperations.deleteAllEntries();
    await loadEntries();
  }, [loadEntries]);

  return {
    entries,
    loading,
    error,
    saveEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    searchEntries,
    exportEntries,
    deleteAll,
    reload: loadEntries,
  };
}
