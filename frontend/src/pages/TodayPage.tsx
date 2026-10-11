import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, BookOpen } from 'lucide-react';
import { useQuests } from '../hooks/useQuests';
import { useJournal } from '../hooks/useJournal';
import { useModelStatus } from '../hooks/useModelStatus';
import { QuestCard } from '../components/QuestCard';
import { AIStatusBadge } from '../components/AIStatusBadge';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { cn, formatRelativeTime, THEME_COLORS, truncate } from '../lib/utils';
import type { Quest } from '../lib/types';

const THEMES = [
  'Pattern Hunt',
  'Urban Archaeology',
  'Design Detective',
  'Light and Shadow',
  'Unexpected Geometry',
] as const;

const THEME_DESCRIPTIONS: Record<string, string> = {
  'Pattern Hunt': 'Notice repetition in unexpected places.',
  'Urban Archaeology': 'Find traces of what came before.',
  'Design Detective': 'Discover intentional (and unintentional) design.',
  'Light and Shadow': 'Watch how light transforms surfaces.',
  'Unexpected Geometry': 'Spot shapes hiding in plain sight.',
};

export function TodayPage() {
  const navigate = useNavigate();
  const { loading: questsLoading, error: questsError, getDailyQuest, getQuestsByTheme } = useQuests();
  const { entries, loading: journalLoading } = useJournal();
  const { status: aiStatus, modelInfo, checkStatus, isGroq } = useModelStatus();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [themeQuests, setThemeQuests] = useState<Quest[]>([]);

  const dailyQuest = getDailyQuest();
  const latestEntry = entries[0];

  useEffect(() => {
    if (selectedTheme) {
      setThemeQuests(getQuestsByTheme(selectedTheme));
    }
  }, [selectedTheme, getQuestsByTheme]);

  const handleBeginQuest = (quest: Quest) => {
    navigate('/observe', { state: { quest } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        {/* Mobile wordmark */}
        <div className="md:hidden mb-6">
          <h1 className="font-heading text-3xl text-graphite tracking-tight">Mundane</h1>
          <p className="text-sm text-text-muted mt-1">Your city is more interesting than you think.</p>
        </div>

        <h2 className="font-heading text-4xl md:text-5xl text-graphite leading-none tracking-tight mb-3">
          Look a little closer.
        </h2>
        <p className="text-text-muted leading-relaxed max-w-md">
          Step outside, find the quest below, and record what you actually notice—before asking the AI to reflect on it.
        </p>

        <div className="mt-4">
          <AIStatusBadge
            status={aiStatus}
            modelName={modelInfo?.model_name}
            isGroq={isGroq}
            onRetry={checkStatus}
          />
        </div>
      </motion.div>

      {/* Daily Quest */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-10"
        aria-labelledby="daily-quest-heading"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="daily-quest-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Today's Quest
          </h3>
          <span className="text-[11px] text-text-muted border border-border-subtle rounded px-2 py-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {questsLoading && (
          <div className="bg-white rounded-lg border border-border-subtle p-6 text-center">
            <div className="w-6 h-6 border-2 border-dust border-t-weathered-stone rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-text-muted">Loading quest...</p>
          </div>
        )}

        {questsError && (
          <div className="bg-white rounded-lg border border-error-red/20 p-6 text-center">
            <p className="text-sm text-error-red">Could not load quests. Check your connection.</p>
          </div>
        )}

        {dailyQuest && !questsLoading && (
          <QuestCard quest={dailyQuest} onBegin={handleBeginQuest} featured />
        )}
      </motion.section>

      {/* Category Browse */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-10"
        aria-labelledby="categories-heading"
      >
        <h3 id="categories-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted mb-4">
          Browse by Category
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme;
            return (
              <button
                key={theme}
                onClick={() => setSelectedTheme(isSelected ? null : theme)}
                className={cn(
                  'text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide',
                  isSelected
                    ? 'border-oxide/30 bg-oxide/5 text-graphite shadow-sm'
                    : 'border-border-subtle bg-white hover:border-dust text-text-muted hover:text-graphite',
                )}
                aria-pressed={isSelected}
              >
                <div className="font-medium text-graphite mb-0.5">{theme}</div>
                <div className="text-xs text-text-muted">{THEME_DESCRIPTIONS[theme]}</div>
              </button>
            );
          })}
        </div>

        {selectedTheme && themeQuests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 mt-4"
          >
            <p className="text-xs text-text-muted mb-3">{themeQuests.length} quests in {selectedTheme}</p>
            {themeQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onBegin={handleBeginQuest} compact />
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Latest Journal Entry */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        aria-labelledby="journal-preview-heading"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="journal-preview-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Latest Entry
          </h3>
          {entries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/journal')}
              className="text-xs text-text-muted gap-1"
            >
              View all <ArrowRight size={12} />
            </Button>
          )}
        </div>

        {journalLoading ? (
          <div className="h-24 bg-white rounded-lg border border-border-subtle animate-pulse" />
        ) : latestEntry ? (
          <button
            onClick={() => navigate(`/journal/${latestEntry.id}`)}
            className="w-full text-left bg-white rounded-lg border border-border-subtle p-5 hover:shadow-card-hover hover:border-dust transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <Badge className={cn('text-[10px] mb-1.5', THEME_COLORS[latestEntry.theme])}>
                  {latestEntry.theme}
                </Badge>
                <p className="text-sm font-medium text-graphite leading-snug">{latestEntry.questTitle}</p>
              </div>
              <span className="text-[11px] text-text-muted flex-shrink-0 mt-0.5 flex items-center gap-1">
                <MapPin size={10} />
                {latestEntry.placeLabel ?? formatRelativeTime(latestEntry.observedAt)}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
              {truncate(latestEntry.observationText, 180)}
            </p>
            {latestEntry.aiReflection && (
              <div className="mt-3 pt-3 border-t border-border-subtle">
                <p className="text-xs text-patina">✦ AI reflection available</p>
              </div>
            )}
          </button>
        ) : (
          <div className="bg-white rounded-lg border border-border-subtle border-dashed p-8 text-center">
            <BookOpen size={28} className="text-dust mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm font-medium text-graphite mb-1">Your journal is empty</p>
            <p className="text-xs text-text-muted mb-4">
              Start your first quest to begin building your field journal.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dailyQuest && handleBeginQuest(dailyQuest)}
            >
              Begin today's quest
            </Button>
          </div>
        )}
      </motion.section>
    </div>
  );
}
