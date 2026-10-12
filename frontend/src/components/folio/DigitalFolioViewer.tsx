import { useState } from 'react';
import type { FolioData } from '../../lib/folioContent';
import { Button } from '../Button';
import { ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { FolioPagePanel } from './FolioPagePanel';
import { useNavigate } from 'react-router-dom';
import type { Quest } from '../../lib/types';

interface DigitalFolioViewerProps {
  data: FolioData;
  quest: Quest;
}

export function DigitalFolioViewer({ data, quest }: DigitalFolioViewerProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  // Local digital response state
  const [checklistMarks, setChecklistMarks] = useState<Record<number, boolean>>({});
  const [sensoryNote, setSensoryNote] = useState('');
  const [fieldNotes, setFieldNotes] = useState('');
  const [finalThought, setFinalThought] = useState('');

  const toggleCheck = (idx: number) => {
    setChecklistMarks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFinishToObserve = () => {
    // Combine digital responses into pre-populated observation text
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

    // Navigate to ObservePage with state pre-populated
    navigate('/observe', {
      state: {
        quest,
        prefillObservation: compiledText,
        source: 'field-folio',
      },
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center mb-4 px-1">
        <span className="text-xs font-mono text-text-muted">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentPage === i + 1 ? 'bg-oxide w-5' : 'bg-dust/60 hover:bg-weathered-stone'
              }`}
              title={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Realistic Pocket Folio Card Frame */}
      <div className="w-full aspect-[1/1.42] max-h-[580px] bg-[#FCFAF6] border border-dust/80 rounded-xl shadow-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all relative">
        <div className="flex-1 w-full flex flex-col justify-between">
          {/* Active Page with interactive enhancements */}
          {currentPage === 3 ? (
            // Interactive checklist on Page 3
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mb-2 border-b border-border-subtle pb-1">
                  <span>03 / DIGITAL CHECKLIST</span>
                  <span>TAP TO TICK</span>
                </div>
                <h2 className="font-instrument italic text-2xl text-graphite mb-1">What to Notice</h2>
                <p className="text-xs text-text-muted mb-4">Tap items as you observe them outdoors:</p>
                <div className="space-y-3">
                  {data.whatToNotice.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className="w-full flex items-start gap-3 text-left p-2 rounded hover:bg-dust/20 transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          checklistMarks[idx] ? 'bg-oxide border-oxide text-white' : 'border-graphite bg-white'
                        }`}
                      >
                        {checklistMarks[idx] && <Check size={14} />}
                      </div>
                      <span className={`text-xs font-serif leading-snug ${checklistMarks[idx] ? 'line-through text-text-muted' : 'text-graphite'}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-mono text-text-muted border-t border-border-subtle pt-2">
                {Object.values(checklistMarks).filter(Boolean).length} of {data.whatToNotice.length} noticed
              </div>
            </div>
          ) : currentPage === 4 ? (
            // Interactive sensory response
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mb-2 border-b border-border-subtle pb-1">
                  <span>04 / SENSORY DETAIL</span>
                  <span>RECORD OBSERVATION</span>
                </div>
                <h2 className="font-instrument italic text-2xl text-graphite mb-1">{data.sensoryTitle}</h2>
                <p className="text-xs font-serif text-graphite/90 mb-3">{data.sensoryPrompt}</p>
                <textarea
                  value={sensoryNote}
                  onChange={(e) => setSensoryNote(e.target.value)}
                  placeholder="Record subtle textures, shadow boundaries, sounds, or tiny overlooked details here..."
                  rows={6}
                  className="w-full p-3 bg-white border border-border-subtle rounded text-xs font-serif text-graphite placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-oxide"
                />
              </div>
              <div className="text-[10px] font-mono text-text-muted border-t border-border-subtle pt-2">
                Page 4 / Sensory Attunement
              </div>
            </div>
          ) : currentPage === 6 ? (
            // Interactive field notes
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mb-2 border-b border-border-subtle pb-1">
                  <span>06 / FIELD NOTES</span>
                  <span>UNFILTERED OBSERVATIONS</span>
                </div>
                <h2 className="font-instrument italic text-2xl text-graphite mb-1">Field Notes</h2>
                <p className="text-[11px] font-serif text-text-muted italic mb-3">
                  What caught your attention? What surprised you? What did you almost miss?
                </p>
                <textarea
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  placeholder="Write what you saw and felt. No need for polished writing — just raw field observations."
                  rows={6}
                  className="w-full p-3 bg-white border border-border-subtle rounded text-xs font-serif text-graphite placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-oxide"
                />
              </div>
              <div className="text-[10px] font-mono text-text-muted border-t border-border-subtle pt-2">
                Page 6 / Field Notes
              </div>
            </div>
          ) : currentPage === 7 ? (
            // Interactive reflection
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mb-2 border-b border-border-subtle pb-1">
                  <span>07 / AFTER OBSERVATION</span>
                  <span>FINAL SYNTHESIS</span>
                </div>
                <h2 className="font-instrument italic text-2xl text-graphite mb-1">After Observation</h2>
                <p className="text-xs font-serif text-graphite mb-3">{data.reflectionPrompts.transformationQuestion}</p>
                <textarea
                  value={finalThought}
                  onChange={(e) => setFinalThought(e.target.value)}
                  placeholder="One final thought or change in perception..."
                  rows={5}
                  className="w-full p-3 bg-white border border-border-subtle rounded text-xs font-serif text-graphite placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-oxide"
                />
              </div>
              <div className="text-[10px] font-mono text-text-muted border-t border-border-subtle pt-2">
                Page 7 / Post-walk Reflection
              </div>
            </div>
          ) : (
            // Regular styled page rendering
            <FolioPagePanel pageNumber={currentPage} data={data} />
          )}
        </div>
      </div>

      {/* Page Navigation & Completion Actions */}
      <div className="w-full flex justify-between items-center mt-5 gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="gap-1.5"
        >
          <ChevronLeft size={14} /> Previous
        </Button>

        {currentPage < totalPages ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1.5"
          >
            Next Page <ChevronRight size={14} />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleFinishToObserve}
            className="gap-1.5"
          >
            Transfer to Journal <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
