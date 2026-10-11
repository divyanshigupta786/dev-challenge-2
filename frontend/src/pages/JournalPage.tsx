import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Download, Trash2, ChevronRight, X, Sparkles, Camera } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import { Button } from '../components/Button';
import { PolaroidCardModal } from '../components/PolaroidCardModal';
import { cn, formatDate, formatRelativeTime, THEME_COLORS, truncate } from '../lib/utils';
import type { JournalEntry, QuestTheme } from '../lib/types';

const THEMES: QuestTheme[] = [
  'Pattern Hunt',
  'Urban Archaeology',
  'Design Detective',
  'Light and Shadow',
  'Unexpected Geometry',
];

export function JournalPage() {
  const navigate = useNavigate();
  const { entries, loading, error, searchEntries, exportEntries, deleteAll } = useJournal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<QuestTheme | null>(null);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [, setSearching] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  // Filter entries based on search and theme
  const applyFilters = useCallback(async () => {
    if (!searchQuery && !selectedTheme) {
      setFilteredEntries(entries);
      return;
    }

    setSearching(true);
    try {
      let results = searchQuery ? await searchEntries(searchQuery) : entries;
      if (selectedTheme) {
        results = results.filter((e) => e.theme === selectedTheme);
      }
      setFilteredEntries(results);
    } finally {
      setSearching(false);
    }
  }, [entries, searchQuery, selectedTheme, searchEntries]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleExport = async () => {
    const json = await exportEntries();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mundane-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await deleteAll();
      setShowDeleteAllConfirm(false);
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h1 className="font-heading text-3xl text-graphite tracking-tight leading-none mb-1">Journal</h1>
          <p className="text-sm text-text-muted">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <div className="flex gap-2">
          {entries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="gap-1.5 text-text-muted"
              title="Export journal as JSON"
            >
              <Download size={14} />
              Export
            </Button>
          )}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-3"
      >
        {/* Search input */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search observations, quests, places..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border-subtle rounded-lg text-sm text-graphite placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-oxide/30 focus:border-oxide/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-graphite"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Theme filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTheme(null)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all',
              !selectedTheme
                ? 'bg-graphite text-white border-graphite'
                : 'bg-white text-text-muted border-border-subtle hover:border-weathered-stone',
            )}
          >
            All
          </button>
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                selectedTheme === theme
                  ? 'bg-graphite text-white border-graphite'
                  : 'bg-white text-text-muted border-border-subtle hover:border-weathered-stone',
              )}
            >
              {theme}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Entry list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-lg border border-border-subtle animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg border border-error-red/20 p-6 text-center">
          <p className="text-sm text-error-red">{error}</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          hasFilters={!!(searchQuery || selectedTheme)}
          onClearFilters={() => { setSearchQuery(''); setSelectedTheme(null); }}
          onBeginQuest={() => navigate('/')}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredEntries.map((entry, i) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                index={i}
                onClick={() => navigate(`/journal/${entry.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete all */}
      {entries.length > 0 && (
        <div className="mt-12 pt-6 border-t border-border-subtle">
          {showDeleteAllConfirm ? (
            <div className="bg-error-red/5 border border-error-red/20 rounded-lg p-4">
              <p className="text-sm text-graphite font-medium mb-1">Delete all entries?</p>
              <p className="text-xs text-text-muted mb-4">
                This will permanently remove all {entries.length} journal entries from this device. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteAll}
                  loading={deletingAll}
                >
                  Yes, delete all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteAllConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              className="text-xs text-text-muted hover:text-error-red flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={12} />
              Delete all entries
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, index, onClick }: { entry: JournalEntry; index: number; onClick: () => void }) {
  const themeClass = THEME_COLORS[entry.theme];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg border border-border-subtle p-4 hover:shadow-card-hover hover:border-dust transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', themeClass)}>
              {entry.theme}
            </span>
            {entry.aiReflection && (
              <span className="text-[10px] text-patina flex items-center gap-0.5">
                <Sparkles size={9} />
                Reflected
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-graphite leading-snug mb-1">{entry.questTitle}</p>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {truncate(entry.observationText, 120)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-[11px] text-text-muted">{formatRelativeTime(entry.observedAt)}</span>
          <ChevronRight size={14} className="text-text-muted group-hover:text-oxide transition-colors" />
        </div>
      </div>
    </motion.button>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
  onBeginQuest,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
  onBeginQuest: () => void;
}) {
  if (hasFilters) {
    return (
      <div className="bg-white rounded-lg border border-border-subtle border-dashed p-8 text-center">
        <Search size={24} className="text-dust mx-auto mb-3" strokeWidth={1} />
        <p className="text-sm font-medium text-graphite mb-1">No matching entries</p>
        <p className="text-xs text-text-muted mb-4">Try a different search or clear filters.</p>
        <Button variant="secondary" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border-subtle border-dashed p-10 text-center">
      <BookOpen size={32} className="text-dust mx-auto mb-4" strokeWidth={1} />
      <p className="text-sm font-medium text-graphite mb-1">Your journal is empty</p>
      <p className="text-xs text-text-muted mb-6 max-w-xs mx-auto">
        Complete your first observation quest to start building your field journal.
      </p>
      <Button variant="primary" onClick={onBeginQuest}>
        Begin your first quest
      </Button>
    </div>
  );
}

// ── Entry Detail View ────────────────────────────────────────────
export function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, updateEntry, deleteEntry } = useJournal();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPolaroid, setShowPolaroid] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEntry(id).then((e) => {
      setEntry(e ?? null);
      setLoading(false);
    });
  }, [id, getEntry]);

  const handleSaveEdit = async () => {
    if (!entry || !editText.trim()) return;
    setSaving(true);
    try {
      await updateEntry(entry.id, { observationText: editText.trim() });
      setEntry((prev) => prev ? { ...prev, observationText: editText.trim() } : prev);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    await deleteEntry(entry.id);
    navigate('/journal');
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-6 h-6 border-2 border-dust border-t-weathered-stone rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-text-muted mb-4">Entry not found.</p>
        <Button onClick={() => navigate('/journal')} variant="secondary">
          Back to Journal
        </Button>
      </div>
    );
  }

  const themeClass = THEME_COLORS[entry.theme];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-28 md:pb-8">
      {/* Back */}
      <button
        onClick={() => navigate('/journal')}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-graphite mb-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide rounded"
      >
        <ChevronRight size={14} className="rotate-180" />
        Journal
      </button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-6">
          <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium mb-3 inline-block', themeClass)}>
            {entry.theme}
          </span>
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-heading text-2xl text-graphite leading-tight mb-1">{entry.questTitle}</h1>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPolaroid(true)}
              className="gap-1.5 flex-shrink-0 text-xs shadow-sm hover:border-oxide/40"
            >
              <Camera size={13} />
              Polaroid Card
            </Button>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
            <span>{formatDate(entry.observedAt)}</span>
            {entry.placeLabel && <span>· {entry.placeLabel}</span>}
          </div>
        </div>

        {/* Observation */}
        <section className="mb-6" aria-labelledby="obs-detail-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="obs-detail-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Observation
            </h2>
            {!editing && (
              <button
                onClick={() => { setEditText(entry.observationText); setEditing(true); }}
                className="text-xs text-oxide hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-white border border-oxide/30 rounded-lg text-sm text-graphite leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-oxide/30"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button variant="primary" size="sm" onClick={handleSaveEdit} loading={saving}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border-subtle p-5">
              <p className="text-sm text-graphite leading-relaxed whitespace-pre-wrap">{entry.observationText}</p>
            </div>
          )}
        </section>

        {/* AI Reflection */}
        {entry.aiReflection ? (
          <section className="mb-6" aria-labelledby="ai-detail-heading">
            <h2 id="ai-detail-heading" className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
              <Sparkles size={12} />
              AI Reflection
            </h2>
            <div className="space-y-3">
              <div className="bg-white rounded-lg border border-patina/20 p-5">
                <p className="text-sm text-graphite leading-relaxed">{entry.aiReflection.observation}</p>
              </div>
              <div className="bg-patina/8 border border-patina/20 rounded-lg p-4">
                <p className="text-xs font-medium text-patina uppercase tracking-wide mb-2">Follow-up</p>
                <p className="text-sm text-graphite">{entry.aiReflection.follow_up_question}</p>
              </div>
              {entry.aiReflection.next_quest && (
                <div className="bg-dust/20 border border-dust/60 rounded-lg p-4">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Next quest</p>
                  <p className="text-sm text-graphite">{entry.aiReflection.next_quest}</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/reflection', { state: { entryId: entry.id } })}
              className="gap-1.5"
            >
              <Sparkles size={13} />
              Get AI reflection
            </Button>
          </div>
        )}

        {/* Delete */}
        <div className="pt-6 border-t border-border-subtle">
          {showDeleteConfirm ? (
            <div className="bg-error-red/5 border border-error-red/20 rounded-lg p-4">
              <p className="text-sm font-medium text-graphite mb-3">Delete this entry?</p>
              <div className="flex gap-3">
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-text-muted hover:text-error-red flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={12} />
              Delete entry
            </button>
          )}
        </div>
      </motion.div>

      {/* Polaroid Specimen Modal */}
      <PolaroidCardModal
        entry={entry}
        isOpen={showPolaroid}
        onClose={() => setShowPolaroid(false)}
      />
    </div>
  );
}
