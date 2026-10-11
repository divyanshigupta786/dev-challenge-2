import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Camera, Printer, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { formatDate, truncate } from '../lib/utils';
import type { JournalEntry } from '../lib/types';

interface PolaroidCardModalProps {
  entry: JournalEntry;
  isOpen: boolean;
  onClose: () => void;
}

export function PolaroidCardModal({ entry, isOpen, onClose }: PolaroidCardModalProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (entry.photoBlob) {
      const url = URL.createObjectURL(entry.photoBlob);
      setPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoUrl(null);
    }
  }, [entry.photoBlob]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Use dynamic HTML5 Canvas rendering for crisp, zero-dependency client export
      const card = cardRef.current;
      const canvas = document.createElement('canvas');
      const scale = 2; // high-DPI retina
      const width = card.offsetWidth;
      const height = card.offsetHeight;

      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;
      ctx.scale(scale, scale);

      // Card background (Vintage Polaroid warm eggshell)
      ctx.fillStyle = '#FDFCF7';
      ctx.fillRect(0, 0, width, height);

      // Subtle drop shadow / card border
      ctx.strokeStyle = '#D4C6AD';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, height);

      // Photo frame dimensions
      const photoPadding = 16;
      const photoSize = width - photoPadding * 2;

      if (photoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = photoUrl;
        });

        // Draw image cover-cropped
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoPadding, photoPadding, photoSize, photoSize);
        ctx.clip();

        const aspect = img.width / img.height;
        let drawW = photoSize;
        let drawH = photoSize;
        let drawX = photoPadding;
        let drawY = photoPadding;

        if (aspect > 1) {
          drawW = photoSize * aspect;
          drawX = photoPadding - (drawW - photoSize) / 2;
        } else {
          drawH = photoSize / aspect;
          drawY = photoPadding - (drawH - photoSize) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      } else {
        // Aesthetic monochrome engraved specimen fallback placeholder
        ctx.fillStyle = '#E8E5DC';
        ctx.fillRect(photoPadding, photoPadding, photoSize, photoSize);

        ctx.fillStyle = '#728B83';
        ctx.font = 'italic 16px Newsreader, Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Urban Specimen No. ' + entry.id.slice(0, 6).toUpperCase(), width / 2, photoPadding + photoSize / 2);
      }

      // Chin / Label typography
      const textStartY = photoPadding + photoSize + 24;

      // Quest Title
      ctx.fillStyle = '#343B38';
      ctx.font = '600 15px "DM Sans", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(truncate(entry.questTitle, 36), photoPadding, textStartY);

      // Observation text quote
      ctx.fillStyle = '#5A625E';
      ctx.font = 'italic 13px Newsreader, Georgia, serif';
      const quote = `"${truncate(entry.observationText, 70)}"`;
      ctx.fillText(quote, photoPadding, textStartY + 24);

      // Footer metadata
      ctx.fillStyle = '#A6A89C';
      ctx.font = '11px "DM Sans", system-ui, sans-serif';
      const meta = `${formatDate(entry.observedAt)}  •  ${entry.placeLabel || entry.theme}  •  Mundane`;
      ctx.fillText(meta, photoPadding, textStartY + 48);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `mundane-polaroid-${entry.id.slice(0, 8)}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to export polaroid:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-border-subtle relative flex flex-col items-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-graphite transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-oxide font-medium mb-4">
            <Camera size={13} />
            <span>Field Specimen Polaroid</span>
          </div>

          {/* Physical Polaroid Card Display */}
          <div
            ref={cardRef}
            className="w-full bg-[#FDFCF7] border border-dust rounded-sm shadow-md p-4 pb-6 flex flex-col transition-transform"
          >
            {/* Square Photo viewport */}
            <div className="w-full aspect-square bg-[#E8E5DC] rounded-[2px] overflow-hidden relative shadow-inner border border-dust/40">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={entry.questTitle}
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.98] sepia-[0.08]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-patina bg-gradient-to-b from-stone-light to-dust/30">
                  <Sparkles size={28} strokeWidth={1.5} className="mb-2 opacity-80" />
                  <p className="font-heading italic text-sm text-graphite/80">Urban Specimen</p>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">{entry.theme}</p>
                </div>
              )}
            </div>

            {/* Polaroid lower margin (The "Chin") */}
            <div className="pt-4 px-1 text-left">
              <h3 className="font-sans font-semibold text-sm text-graphite leading-tight mb-1">
                {entry.questTitle}
              </h3>
              <p className="font-heading italic text-xs text-graphite/80 leading-relaxed mb-3">
                "{truncate(entry.observationText, 85)}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-dust/40">
                <span>{formatDate(entry.observedAt)}</span>
                <span>{entry.placeLabel || entry.theme}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full mt-6">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              loading={downloading}
              className="flex-1 gap-1.5 text-xs"
            >
              <Download size={13} />
              Save PNG Card
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs"
            >
              <Printer size={13} />
              Print
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
