import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Printer, HelpCircle, ArrowLeft, ArrowRight, Eye, FileText, Smartphone } from 'lucide-react';
import { useQuests } from '../hooks/useQuests';
import { deriveFolioData } from '../lib/folioContent';
import { BookletImpositionLayout } from '../components/folio/BookletImpositionLayout';
import { SinglePageSheet } from '../components/folio/SinglePageSheet';
import { DigitalFolioViewer } from '../components/folio/DigitalFolioViewer';
import { FoldingGuideModal } from '../components/folio/FoldingGuideModal';
import { Button } from '../components/Button';

type FormatMode = 'booklet' | 'single' | 'digital';

export function FolioPage() {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { quests, loading, getDailyQuest } = useQuests();
  const [activeFormat, setActiveFormat] = useState<FormatMode>('booklet');
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Find quest by ID or fall back to daily quest
  const quest = quests.find((q) => q.id === questId) ?? getDailyQuest() ?? quests[0];
  const folioData = quest ? deriveFolioData(quest) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleBeginDigitalObservation = () => {
    if (!quest) return;
    navigate('/observe', { state: { quest, source: 'field-folio' } });
  };

  if (loading || !folioData || !quest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-6 h-6 border-2 border-dust border-t-weathered-stone rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-text-muted">Loading Field Folio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 pb-28 md:pb-12">
      {/* Top Breadcrumb & Action bar (Hidden when printing) */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-graphite transition-colors"
        >
          <ArrowLeft size={14} /> Back to Quests
        </button>

        {/* Format Selector Tabs */}
        <div className="flex bg-dust/30 p-1 rounded-lg border border-border-subtle">
          <button
            onClick={() => setActiveFormat('booklet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFormat === 'booklet'
                ? 'bg-white text-graphite shadow-xs'
                : 'text-text-muted hover:text-graphite'
            }`}
          >
            <FileText size={13} />
            <span>Foldable Mini-Zine (A4)</span>
          </button>

          <button
            onClick={() => setActiveFormat('single')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFormat === 'single'
                ? 'bg-white text-graphite shadow-xs'
                : 'text-text-muted hover:text-graphite'
            }`}
          >
            <Eye size={13} />
            <span>Single-Page Field Sheet</span>
          </button>

          <button
            onClick={() => setActiveFormat('digital')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFormat === 'digital'
                ? 'bg-white text-graphite shadow-xs'
                : 'text-text-muted hover:text-graphite'
            }`}
          >
            <Smartphone size={13} />
            <span>Digital Folio</span>
          </button>
        </div>

        {/* Actions: Print & Guide */}
        <div className="flex items-center gap-2">
          {activeFormat !== 'digital' ? (
            <>
              {activeFormat === 'booklet' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowGuideModal(true)}
                  className="gap-1.5 text-xs"
                >
                  <HelpCircle size={13} />
                  Folding Guide
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs"
              >
                <Printer size={13} />
                Print {activeFormat === 'booklet' ? 'Booklet' : 'Sheet'}
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleBeginDigitalObservation}
              className="gap-1.5 text-xs"
            >
              Start Observing in App <ArrowRight size={13} />
            </Button>
          )}
        </div>
      </div>

      {/* Editorial Header (Hidden when printing) */}
      <div className="print:hidden mb-8">
        <div className="flex items-center gap-2 text-[10px] font-mono text-oxide uppercase tracking-widest mb-1.5">
          <span>{folioData.series}</span>
          <span>•</span>
          <span>{folioData.folioNumber}</span>
          <span>•</span>
          <span className="text-patina font-sans font-bold">100% PRIVATE • ZERO CLOUD / NO AI REQUIRED</span>
        </div>
        <h1 className="font-instrument italic text-3xl sm:text-4xl text-graphite leading-tight mb-2">
          {folioData.questTitle}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-text-muted max-w-xl leading-relaxed">
          Take your field journal outdoors. Print and fold this pocket-sized companion, complete your observations by hand, and return to reflect on what you found.
        </p>

        {/* Printing Notice Card */}
        {activeFormat !== 'digital' && (
          <div className="mt-4 p-3 bg-surface-secondary border border-border-subtle rounded-lg text-xs text-text-muted flex flex-wrap items-center justify-between gap-2">
            <span>
              💡 <strong>Print Tip:</strong> Set printer scale to <strong>100% (Actual Size)</strong> and orientation to{' '}
              <strong>{activeFormat === 'booklet' ? 'Landscape' : 'Portrait'}</strong>.
            </span>
            {activeFormat === 'booklet' && (
              <button
                onClick={() => setShowGuideModal(true)}
                className="text-oxide underline font-medium hover:text-oxide/80 text-[11px]"
              >
                View 4-step folding instructions
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main View Area (Printed element) */}
      <motion.div
        key={activeFormat}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {activeFormat === 'booklet' && <BookletImpositionLayout data={folioData} />}
        {activeFormat === 'single' && <SinglePageSheet data={folioData} />}
        {activeFormat === 'digital' && <DigitalFolioViewer data={folioData} quest={quest} />}
      </motion.div>

      {/* Post-print instruction footer (Hidden when printing) */}
      <div className="print:hidden mt-10 p-6 bg-white border border-border-subtle rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg text-graphite mb-1">Completed your Field Folio?</h3>
          <p className="text-xs text-text-muted leading-relaxed max-w-md">
            Once you return from your walk, record your physical observations into Mundane to store them in your local journal and unlock an optional grounded AI reflection.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleBeginDigitalObservation}
          className="whitespace-nowrap gap-1.5"
        >
          Enter Observations in App <ArrowRight size={14} />
        </Button>
      </div>

      {/* Folding Guide Modal */}
      <FoldingGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />
    </div>
  );
}
