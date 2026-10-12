import { motion, AnimatePresence } from 'motion/react';
import { X, Scissors, Layers } from 'lucide-react';
import { Button } from '../Button';

interface FoldingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FoldingGuideModal({ isOpen, onClose }: FoldingGuideModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/60 backdrop-blur-sm print:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FAF7F2] border border-dust rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between border-b border-border-subtle pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-oxide">Printing &amp; Folding Guide</span>
              <h2 className="font-heading text-2xl text-graphite mt-1">How to Fold Your Mini-Zine</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-graphite hover:bg-dust/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 4 Step Process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Step 1 */}
            <div className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-graphite text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
                  <h3 className="font-medium text-sm text-graphite">Print at 100% (Actual Size)</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Print the <strong>A4 Landscape</strong> layout. Ensure your printer scale is set to <strong>100%</strong> (do not "Fit to printable area" so margins remain aligned).
                </p>
              </div>
              <div className="mt-3 py-4 bg-[#F5F2EB] rounded border border-dust/50 flex items-center justify-center text-[10px] text-text-muted font-mono">
                [ 8 Panels on 1 Sheet ]
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-graphite text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
                  <h3 className="font-medium text-sm text-graphite">Crease All 8 Panels</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Fold the paper in half lengthwise (hotdog fold), then fold in half and half again crosswise (hamburger folds) so all 8 panels are creased sharply.
                </p>
              </div>
              <div className="mt-3 py-4 bg-[#F5F2EB] rounded border border-dust/50 flex items-center justify-center text-[10px] text-text-muted font-mono">
                [ Crease Along Grid Lines ]
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-graphite text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
                  <h3 className="font-medium text-sm text-graphite">Cut the Center Slit</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Fold sheet in half crosswise. Cut along the central horizontal dotted line between pages 1/2 and 6/7. <strong>Only cut the middle 2 panels!</strong>
                </p>
              </div>
              <div className="mt-3 py-4 bg-[#F5F2EB] rounded border border-dust/50 flex items-center justify-center text-[10px] text-oxide font-mono">
                <Scissors size={12} className="inline mr-1" />
                [ Cut Central 2-Panel Slit ]
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-graphite text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
                  <h3 className="font-medium text-sm text-graphite">Push &amp; Fold into Booklet</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Fold lengthwise again and push the two ends inward. The center cut will open into a diamond, then flatten into an 8-page booklet. Front cover on outside.
                </p>
              </div>
              <div className="mt-3 py-4 bg-[#F5F2EB] rounded border border-dust/50 flex items-center justify-center text-[10px] text-patina font-mono">
                <Layers size={12} className="inline mr-1" />
                [ Ready: Pocket Mini-Zine! ]
              </div>
            </div>
          </div>

          <div className="bg-oxide/5 border border-oxide/20 rounded-lg p-3.5 mb-6 text-xs text-graphite leading-relaxed">
            <strong className="text-oxide font-medium">Why are top panels inverted?</strong> When you fold the landscape sheet with a central slit, the top row rotates 180° so every page faces right-side up once folded.
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={onClose} className="px-6">
              Got it, ready to print
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
