import { useState, useEffect } from 'react';
import type { Quest } from '../lib/types';

interface QuestsData {
  quests: Quest[];
}

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/quests.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load quests');
        return res.json() as Promise<QuestsData>;
      })
      .then((data) => {
        setQuests(data.quests);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getDailyQuest = (): Quest | null => {
    if (quests.length === 0) return null;
    // Deterministic daily quest based on day-of-year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
    );
    return quests[dayOfYear % quests.length];
  };

  const getRandomQuest = (theme?: string): Quest | null => {
    if (quests.length === 0) return null;
    const pool = theme ? quests.filter((q) => q.theme === theme) : quests;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const getQuestsByTheme = (theme: string): Quest[] => {
    return quests.filter((q) => q.theme === theme);
  };

  return { quests, loading, error, getDailyQuest, getRandomQuest, getQuestsByTheme };
}
