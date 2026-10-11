import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, RefreshCw, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

import { useJournal } from '../hooks/useJournal';
import { useModelStatus } from '../hooks/useModelStatus';
import { Button } from '../components/Button';
import { AIStatusBadge } from '../components/AIStatusBadge';
import { Badge } from '../components/Badge';
import { cn, THEME_COLORS } from '../lib/utils';
import type { JournalEntry, AIReflection } from '../lib/types';
import { generateLocalHeuristicReflection } from '../lib/heuristicReflection';

export function ReflectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getEntry, updateEntry } = useJournal();
  const { status: aiStatus, modelInfo, checkStatus } = useModelStatus();

  const entryId = location.state?.entryId as string | undefined;
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loadingEntry, setLoadingEntry] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reflection, setReflection] = useState<AIReflection | null>(null);

  // Load the entry from IndexedDB
  useEffect(() => {
    if (!entryId) {
      setLoadingEntry(false);
      return;
    }
    getEntry(entryId).then((e) => {
      setEntry(e ?? null);
      if (e?.aiReflection) {
        setReflection(e.aiReflection);
      }
      setLoadingEntry(false);
    });
  }, [entryId, getEntry]);

  const generateReflection = useCallback(async () => {
    if (!entry) return;
    setError(null);
    setGenerating(true);

    try {
      const result = await api.reflect({
        observation_text: entry.observationText,
        quest_title: entry.questTitle,
        quest_theme: entry.theme,
        place_label: entry.placeLabel,
      });

      setReflection(result);
      await updateEntry(entry.id, { aiReflection: result });
      setEntry((prev) => prev ? { ...prev, aiReflection: result } : prev);
    } catch (err) {
      // Offline fallback: Use the smart local heuristic engine
      console.info('Backend/Ollama unavailable, falling back to local heuristic reflection engine');
      const heuristicResult = generateLocalHeuristicReflection(
        entry.observationText,
        entry.questTitle,
        entry.theme,
        entry.placeLabel,
      );
      setReflection(heuristicResult);
      await updateEntry(entry.id, { aiReflection: heuristicResult });
      setEntry((prev) => prev ? { ...prev, aiReflection: heuristicResult } : prev);
    } finally {
      setGenerating(false);
    }
  }, [entry, updateEntry]);

  // Auto-generate reflection when viewing an unreflected entry
  useEffect(() => {
    if (entry && !entry.aiReflection && !generating && !error) {
      generateReflection();
    }
  }, [entry, generating, error, generateReflection]);

  if (loadingEntry) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-6 h-6 border-2 border-dust border-t-weathered-stone rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <AlertCircle size={32} className="text-text-muted mx-auto mb-4" strokeWidth={1} />
        <h2 className="font-heading text-2xl text-graphite mb-2">No entry found</h2>
        <p className="text-sm text-text-muted mb-6">
          {entryId ? 'This entry could not be loaded.' : 'Navigate from the Observe page after saving an observation.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('/observe')} variant="primary">
            Go to Observe
          </Button>
          <Button onClick={() => navigate('/journal')} variant="secondary">
            View Journal
          </Button>
        </div>
      </div>
    );
  }

  const themeClass = THEME_COLORS[entry.theme];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-28 md:pb-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-graphite mb-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide rounded"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Entry header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Badge className={cn('mb-3', themeClass)}>{entry.theme}</Badge>
        <h1 className="font-heading text-2xl text-graphite leading-tight mb-1">{entry.questTitle}</h1>
        {entry.placeLabel && (
          <p className="text-xs text-text-muted mb-6">{entry.placeLabel}</p>
        )}
      </motion.div>

      {/* User observation */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
        aria-labelledby="observation-heading"
      >
        <h2 id="observation-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3">
          Your Observation
        </h2>
        <div className="bg-white rounded-lg border border-border-subtle p-5">
          <p className="text-sm text-graphite leading-relaxed whitespace-pre-wrap">{entry.observationText}</p>
        </div>
      </motion.section>

      {/* AI Reflection panel */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        aria-labelledby="ai-reflection-heading"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="ai-reflection-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Sparkles size={12} />
            AI Reflection
          </h2>
          <AIStatusBadge status={aiStatus} modelName={modelInfo?.model_name} onRetry={checkStatus} />
        </div>

        <AnimatePresence mode="wait">
          {generating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg border border-border-subtle p-6 text-center"
            >
              <div className="w-6 h-6 border-2 border-patina/30 border-t-patina rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-text-muted">Generating reflection with local AI...</p>
              <p className="text-xs text-text-muted mt-1 opacity-60">This may take up to a minute.</p>
            </motion.div>
          )}

          {error && !generating && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-lg border border-error-red/20 p-5 mb-3">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-error-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-error-red mb-1">Reflection failed</p>
                    <p className="text-xs text-text-muted leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
              {(aiStatus === 'ollama_down' || aiStatus === 'model_missing') && (
                <AIOllamaSetupInstructions status={aiStatus} modelName={modelInfo?.model_name} />
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={generateReflection}
                className="mt-3 gap-1.5"
              >
                <RefreshCw size={13} />
                Try again
              </Button>
            </motion.div>
          )}

          {!generating && !error && !reflection && (aiStatus === 'ollama_down' || aiStatus === 'model_missing' || aiStatus === 'error') && (
            <motion.div key="unavailable" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-lg border border-border-subtle p-5 mb-3">
                <p className="text-sm text-text-muted">Local AI is not available. Your observation has been saved.</p>
              </div>
              <AIOllamaSetupInstructions status={aiStatus} modelName={modelInfo?.model_name} />
            </motion.div>
          )}

          {reflection && !generating && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Reflection text */}
              <div className="bg-white rounded-lg border border-patina/20 p-5 mb-3">
                <p className="text-sm text-graphite leading-relaxed">{reflection.observation}</p>
              </div>

              {/* Follow-up question */}
              <div className="bg-patina/8 border border-patina/20 rounded-lg p-4 mb-3">
                <p className="text-xs font-medium text-patina uppercase tracking-wide mb-2">
                  Follow-up question
                </p>
                <p className="text-sm text-graphite leading-relaxed font-medium">
                  {reflection.follow_up_question}
                </p>
              </div>

              {/* Next quest */}
              {reflection.next_quest && (
                <div className="bg-dust/20 border border-dust/60 rounded-lg p-4">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                    Next quest suggestion
                  </p>
                  <p className="text-sm text-graphite leading-relaxed">{reflection.next_quest}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/journal/${entry.id}`)}
          className="w-full gap-2"
        >
          <BookOpen size={15} />
          View in journal
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/')}
          className="w-full gap-2"
        >
          Back to Today
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}

function AIOllamaSetupInstructions({ status, modelName }: { status: string; modelName?: string }) {
  return (
    <div className="bg-surface-secondary rounded-lg border border-border-subtle p-4 text-xs text-text-muted space-y-2">
      <p className="font-medium text-graphite">Setup instructions</p>
      {status === 'ollama_down' ? (
        <>
          <p>1. Install Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline text-oxide">ollama.com</a></p>
          <p>2. Start Ollama: <code className="bg-dust/40 px-1 rounded">ollama serve</code></p>
          <p>3. Pull the model: <code className="bg-dust/40 px-1 rounded">ollama pull {modelName ?? 'llama3.2:3b'}</code></p>
        </>
      ) : (
        <>
          <p>Run this in your terminal:</p>
          <code className="block bg-dust/40 px-2 py-1.5 rounded">ollama pull {modelName ?? 'llama3.2:3b'}</code>
        </>
      )}
    </div>
  );
}
