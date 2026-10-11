import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { ModelStatus, AIStatus } from '../lib/types';

export function useModelStatus() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [modelInfo, setModelInfo] = useState<ModelStatus | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = useCallback(async () => {
    setStatus('checking');
    try {
      const info = await api.getModelStatus();
      setModelInfo(info);
      setLastChecked(new Date());

      if (!info.ollama_available) {
        setStatus('ollama_down');
      } else if (!info.model_available) {
        setStatus('model_missing');
      } else {
        setStatus('available');
      }
    } catch {
      setStatus('error');
      setModelInfo(null);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const statusLabel: Record<AIStatus, string> = {
    idle: 'Checking...',
    checking: 'Checking...',
    available: 'Local AI ready',
    ollama_down: 'Ollama not running',
    model_missing: 'Model not downloaded',
    error: 'Backend unavailable',
  };

  return {
    status,
    modelInfo,
    lastChecked,
    checkStatus,
    label: statusLabel[status],
    isAvailable: status === 'available',
  };
}
