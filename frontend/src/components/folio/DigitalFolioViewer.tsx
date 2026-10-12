import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FolioData } from '../../lib/folioContent';
import { Button } from '../Button';
import { ChevronLeft, ChevronRight, Check, ArrowRight, BookOpen } from 'lucide-react';
import { FolioPagePanel } from './FolioPagePanel';
import { useNavigate } from 'react-router-dom';
import type { Quest } from '../../lib/types';

interface DigitalFolioViewerProps {
  data: FolioData;
  quest: Quest;
}

/**
 * Interactive book-like two-page spread viewer inspired by Paper Trail.
 * Allows readers to flip through paired pages with realistic 3D paper fold angles,
 * central gutter crease, and tactile transitions.
 */
export function DigitalFolioViewer({ data, quest }: DigitalFolioViewerProps) {
  const navigate = useNavigate();

  // Spreads: [1 & 2], [3 & 4], [5 & 6], [7 & 8]
  const [currentSpread, setCurrentSpread] = useState(0);
  const totalSpreads = 4;

  const leftPage = currentSpread * 2 + 1;
  const rightPage = currentSpread * 2 + 2;

  // Local digital response state
  const [checklistMarks, setChecklistMarks] = useState<Record<number, boolean>>({});
  const [sensoryNote, setSensoryNote] = useState('');
  const [fieldNotes, setFieldNotes] = useState('');
  const [finalThought, setFinalThought] = useState('');

  const toggleCheck = (idx: number) => {
    setChecklistMarks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFinishToObserve = () => {
    const parts: string[] = [];
    if (sensoryNote.trim()) {
      parts.push(`[Sensory Attunement]\n${sensoryNote.trim()}`);
    }
    if (fieldNotes.trim()) {
      parts.push(`[Field Notes]\n${fieldNotes.trim()}`);
    }
    if (finalThought.trim()) {
      parts.push(`[Post-Walk Thought]\n${finalThought.trim()}`);
    }

    const compiledText = parts.join('\n\n') || '';

    navigate('/observe', {
      state: {
        quest,
        prefillObservation: compiledText,
        source: 'field-folio',
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Controls & Navigation Bar */}
      <div className="w-full flex flex-wrap justify-between items-center mb-6 px-2 gap-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-oxide" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#343B38] font-semibold">
            Spread {currentSpread + 1} of {totalSpreads} (Pages {leftPage} &amp; {rightPage})
          </span>
        </div>

        {/* Spread step indicator dots */}
        <div className="flex items-center gap-2 bg-[#E8E4DB]/60 px-3 py-1.5 rounded-full border border-[#D4C6AD]/60">
          {Array.from({ length: totalSpreads }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSpread(i)}
              className={`transition-all rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                currentSpread === i
                  ? 'w-7 h-4 bg-oxide text-white shadow-xs'
                  : 'w-4 h-4 bg-dust/60 text-graphite hover:bg-weathered-stone'
              }`}
              title={`View pages ${i * 2 + 1} & ${i * 2 + 2}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3D Realistic Folded Book Container ────────────────────── */}
      <div className="w-full perspective-1000 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSpread}
            initial={{ opacity: 0, rotateY: 4, scale: 0.98 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -4, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#FCFAF6] border border-[#D4C6AD] rounded-xl paper-sheet-shadow overflow-hidden relative"
          >
            {/* Center Gutter Crease (hidden on stacked mobile) */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 z-30 pointer-events-none paper-crease-vertical" />
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 z-30 pointer-events-none bg-black/10" />

            {/* ── LEFT PAGE PANEL ───────────────────────────────────── */}
            <div className="p-5 sm:p-7 md:border-r border-[#E8E4DB] min-h-[480px] flex flex-col justify-between relative bg-[#FAF7F2]">
              {leftPage === 3 ? (
                // Interactive Checklist on Page 3
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-3">
                      <span>03 / WHAT TO NOTICE</span>
                      <span>PAGE 3</span>
                    </div>
                    <h2 className="font-instrument italic text-2xl text-[#343B38] mb-1">What to Notice</h2>
                    <p className="text-xs text-[#A6A89C] mb-4">Tap items as you notice them:</p>
                    <div className="space-y-3">
                      {data.whatToNotice.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCheck(idx)}
                          className="w-full flex items-start gap-2.5 text-left p-2 rounded hover:bg-dust/20 transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center flex-shrink-0 transition-colors ${
                              checklistMarks[idx] ? 'bg-oxide border-oxide text-white' : 'border-[#343B38] bg-white'
                            }`}
                          >
                            {checklistMarks[idx] && <Check size={12} />}
                          </div>
                          <span className={`text-xs font-serif leading-snug ${checklistMarks[idx] ? 'line-through text-[#A6A89C]' : 'text-[#343B38]'}`}>
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#E8E4DB] text-[9px] font-mono text-[#A6A89C] flex justify-between">
                    <span>{Object.values(checklistMarks).filter(Boolean).length} of {data.whatToNotice.length} NOTICED</span>
                    <span>TICK WHEN FOUND</span>
                  </div>
                </div>
              ) : leftPage === 7 ? (
                // Interactive Synthesis on Page 7
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-2">
                      <span>07 / AFTER OBSERVATION</span>
                      <span>PAGE 7</span>
                    </div>
                    <h2 className="font-instrument italic text-2xl text-[#343B38] mb-1">After Observation</h2>
                    <p className="text-xs font-serif italic text-[#343B38]/85 mb-3">
                      {data.reflectionPrompts.transformationQuestion}
                    </p>
                    <textarea
                      value={finalThought}
                      onChange={(e) => setFinalThought(e.target.value)}
                      placeholder="One final thought or change in your perspective..."
                      rows={6}
                      className="w-full p-3 bg-white border border-[#D4C6AD] rounded text-xs font-serif text-[#343B38] placeholder:text-[#A6A89C] focus:outline-none focus:ring-1 focus:ring-oxide"
                    />
                  </div>
                  <div className="pt-2 border-t border-[#E8E4DB] text-[9px] font-mono text-[#A6A89C] flex justify-between">
                    <span>POST-WALK SYNTHESIS</span>
                    <span>PAGE 7</span>
                  </div>
                </div>
              ) : (
                <FolioPagePanel pageNumber={leftPage} data={data} />
              )}
            </div>

            {/* ── RIGHT PAGE PANEL ──────────────────────────────────── */}
            <div className="p-5 sm:p-7 min-h-[480px] flex flex-col justify-between relative bg-[#FCFAF6]">
              {rightPage === 4 ? (
                // Interactive Sensory on Page 4
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-2">
                      <span>04 / SENSORY DETAIL</span>
                      <span>PAGE 4</span>
                    </div>
                    <h2 className="font-instrument italic text-2xl text-[#343B38] mb-1">{data.sensoryTitle}</h2>
                    <p className="text-xs font-serif text-[#343B38]/85 mb-3">{data.sensoryPrompt}</p>
                    <textarea
                      value={sensoryNote}
                      onChange={(e) => setSensoryNote(e.target.value)}
                      placeholder="Record subtle textures, sounds, shadows, or tiny details here..."
                      rows={6}
                      className="w-full p-3 bg-white border border-[#D4C6AD] rounded text-xs font-serif text-[#343B38] placeholder:text-[#A6A89C] focus:outline-none focus:ring-1 focus:ring-oxide"
                    />
                  </div>
                  <div className="pt-2 border-t border-[#E8E4DB] text-[9px] font-mono text-[#A6A89C] flex justify-between">
                    <span>ATTUNEMENT</span>
                    <span>PAGE 4</span>
                  </div>
                </div>
              ) : rightPage === 6 ? (
                // Interactive Field Notes on Page 6
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-2">
                      <span>06 / FIELD NOTES</span>
                      <span>PAGE 6</span>
                    </div>
                    <h2 className="font-instrument italic text-2xl text-[#343B38] mb-1">Field Notes</h2>
                    <p className="text-[11px] font-serif text-[#A6A89C] italic mb-3">
                      What caught your attention? What surprised you? What did you almost miss?
                    </p>
                    <textarea
                      value={fieldNotes}
                      onChange={(e) => setFieldNotes(e.target.value)}
                      placeholder="Write your raw, unpolished field notes here..."
                      rows={6}
                      className="w-full p-3 bg-white border border-[#D4C6AD] rounded text-xs font-serif text-[#343B38] placeholder:text-[#A6A89C] focus:outline-none focus:ring-1 focus:ring-oxide"
                    />
                  </div>
                  <div className="pt-2 border-t border-[#E8E4DB] text-[9px] font-mono text-[#A6A89C] flex justify-between">
                    <span>HANDWRITING SPACE</span>
                    <span>PAGE 6</span>
                  </div>
                </div>
              ) : (
                <FolioPagePanel pageNumber={rightPage} data={data} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Flipping Controls */}
      <div className="w-full flex justify-between items-center mt-6 gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCurrentSpread((s) => Math.max(0, s - 1))}
          disabled={currentSpread === 0}
          className="gap-1.5 text-xs bg-white border-[#D4C6AD]"
        >
          <ChevronLeft size={14} /> Turn Previous Pages
        </Button>

        {currentSpread < totalSpreads - 1 ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentSpread((s) => Math.min(totalSpreads - 1, s + 1))}
            className="gap-1.5 text-xs bg-white border-[#D4C6AD]"
          >
            Turn Next Pages <ChevronRight size={14} />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleFinishToObserve}
            className="gap-1.5 text-xs"
          >
            Transfer to Journal <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
