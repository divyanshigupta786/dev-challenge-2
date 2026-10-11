import { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Download, Trash2, Shield, ExternalLink, Info, Code2, Heart } from 'lucide-react';
import { useModelStatus } from '../hooks/useModelStatus';
import { useJournal } from '../hooks/useJournal';
import { AIStatusBadge } from '../components/AIStatusBadge';
import { Button } from '../components/Button';

export function SettingsPage() {
  const { status, modelInfo, checkStatus } = useModelStatus();
  const { entries, exportEntries, deleteAll } = useJournal();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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
    setDeleting(true);
    try {
      await deleteAll();
      setShowDeleteConfirm(false);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 4000);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-28 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl text-graphite tracking-tight leading-none mb-8">Settings</h1>

        {/* Privacy */}
        <Section title="Privacy" icon={<Shield size={15} />}>
          <InfoRow label="Storage">
            <span className="text-sm text-graphite">Local only (IndexedDB)</span>
          </InfoRow>
          <InfoRow label="Journal entries">
            <span className="text-sm text-graphite">{entries.length} stored on this device</span>
          </InfoRow>
          <InfoRow label="Cloud sync">
            <span className="text-sm text-text-muted">Off (not implemented)</span>
          </InfoRow>
          <InfoRow label="Telemetry">
            <span className="text-sm text-graphite">None. No data is collected.</span>
          </InfoRow>
          <div className="mt-3 p-3 bg-surface-secondary rounded-lg border border-border-subtle">
            <p className="text-xs text-text-muted leading-relaxed">
              All journal entries and photos are stored in your browser's IndexedDB. They are not encrypted and can be lost if you clear browser data. Mundane never uploads your content automatically.
            </p>
          </div>
        </Section>

        {/* Local AI */}
        <Section title="Local AI" icon={<Code2 size={15} />}>
          <InfoRow label="Status">
            <AIStatusBadge status={status} modelName={modelInfo?.model_name} onRetry={checkStatus} />
          </InfoRow>
          {modelInfo && (
            <>
              <InfoRow label="Model">
                <span className="text-sm font-mono text-graphite">{modelInfo.model_name}</span>
              </InfoRow>
              <InfoRow label="Ollama URL">
                <span className="text-sm font-mono text-graphite">{modelInfo.ollama_url}</span>
              </InfoRow>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={checkStatus}
            className="mt-3 gap-1.5"
          >
            <RefreshCw size={13} />
            Recheck status
          </Button>

          {(status === 'ollama_down' || status === 'model_missing' || status === 'error') && (
            <div className="mt-4 p-4 bg-surface-secondary rounded-lg border border-border-subtle text-xs text-text-muted space-y-2">
              <p className="font-medium text-graphite">How to set up local AI</p>
              <p>1. Install Ollama: <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-oxide underline">ollama.com</a></p>
              <p>2. Start it: <code className="bg-dust/40 px-1 rounded">ollama serve</code></p>
              <p>3. Pull model: <code className="bg-dust/40 px-1 rounded">ollama pull {modelInfo?.model_name ?? 'gemma3:4b'}</code></p>
              <p>4. Start the backend: <code className="bg-dust/40 px-1 rounded">cd backend && uvicorn app.main:app --reload</code></p>
            </div>
          )}
        </Section>

        {/* Data */}
        <Section title="Data" icon={<Download size={15} />}>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-graphite mb-1">Export journal</p>
              <p className="text-xs text-text-muted mb-3">Download all entries as a JSON file. Photos are not included.</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                disabled={entries.length === 0}
                className="gap-1.5"
              >
                <Download size={13} />
                Export as JSON
              </Button>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <p className="text-sm text-graphite mb-1">Delete all data</p>
              <p className="text-xs text-text-muted mb-3">Permanently removes all journal entries from this device.</p>

              {deleteSuccess && (
                <p className="text-xs text-patina mb-3">All entries deleted successfully.</p>
              )}

              {showDeleteConfirm ? (
                <div className="bg-error-red/5 border border-error-red/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-graphite mb-1">Are you sure?</p>
                  <p className="text-xs text-text-muted mb-4">
                    This will permanently delete all {entries.length} entries. This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeleteAll}
                      loading={deleting}
                    >
                      Delete all
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={entries.length === 0}
                  className="text-error-red hover:bg-error-red/10 gap-1.5"
                >
                  <Trash2 size={13} />
                  Delete all entries
                </Button>
              )}
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title="About Mundane" icon={<Info size={15} />}>
          <div className="text-sm text-text-muted space-y-2">
            <p>Version 0.1.0 — Hacktoberfest Dev Challenge 2</p>
            <p>Built with React, TypeScript, FastAPI, and Ollama (Gemma 3).</p>
            <p>Local-first. Open-source. No required accounts.</p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-oxide hover:underline flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              View on GitHub
            </a>
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-oxide hover:underline flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              Ollama — local AI runtime
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-1.5 text-xs text-text-muted">
            <Heart size={11} className="text-oxide" />
            Made to help people look closer at their surroundings.
          </div>
        </Section>
      </motion.div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-text-muted mb-4">
        {icon}
        {title}
      </h2>
      <div className="bg-white rounded-lg border border-border-subtle p-5">{children}</div>
    </section>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border-subtle last:border-0 last:pb-0 first:pt-0">
      <span className="text-xs text-text-muted flex-shrink-0 pt-0.5">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}
