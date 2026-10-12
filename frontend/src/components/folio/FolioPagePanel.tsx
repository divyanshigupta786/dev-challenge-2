import type { FolioData } from '../../lib/folioContent';
import { StreetLampIllustration, BotanicalTraceIllustration } from './FolioIllustrations';

interface FolioPagePanelProps {
  pageNumber: number;
  data: FolioData;
  isPrintImposition?: boolean;
}

export function FolioPagePanel({ pageNumber, data }: FolioPagePanelProps) {
  // Common styling for booklet pages
  const baseClass = "w-full h-full p-4 sm:p-5 flex flex-col justify-between bg-[#FCFAF6] text-[#343B38] border border-[#E8E4DB] relative select-text";

  switch (pageNumber) {
    // ── PAGE 1: COVER ──────────────────────────────────────────────
    case 1:
      return (
        <div className={`${baseClass} items-center text-center`}>
          <div className="w-full flex justify-between items-baseline border-b border-[#D4C6AD]/60 pb-1.5 text-[9px] font-mono tracking-wider text-[#A6A89C]">
            <span>{data.series}</span>
            <span className="font-semibold text-[#B96649]">{data.folioNumber}</span>
          </div>

          <div className="my-auto py-2 flex flex-col items-center max-w-[90%]">
            <span className="text-[9px] uppercase tracking-widest text-[#A6A89C] mb-1 font-sans">{data.theme}</span>
            <h1 className="font-instrument italic text-2xl sm:text-3xl leading-[1.08] text-[#343B38] mb-3">
              {data.questTitle}
            </h1>
            <div className="my-2 text-[#343B38]/80">
              <StreetLampIllustration className="w-10 h-20 text-[#343B38]" />
            </div>
            <p className="text-[10px] font-serif italic text-[#A6A89C] tracking-wide mt-1">
              A small study of the overlooked.
            </p>
          </div>

          <div className="w-full pt-2 border-t border-[#D4C6AD]/60 flex items-center justify-between text-[9px] text-[#A6A89C]">
            <span className="font-mono">DATE: ___________</span>
            <span className="font-heading font-medium tracking-tight text-[#343B38]">Mundane</span>
          </div>
        </div>
      );

    // ── PAGE 2: INVITATION ──────────────────────────────────────────
    case 2:
      return (
        <div className={baseClass}>
          <div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] mb-2 border-b border-[#E8E4DB] pb-1">
              <span>02 / INVITATION</span>
              <span>OBSERVE FIRST</span>
            </div>
            <h2 className="font-instrument italic text-xl leading-snug text-[#343B38] mb-2">
              Today's Invitation
            </h2>
            <p className="text-xs font-serif leading-relaxed text-[#343B38]/90 mb-3">
              {data.invitationText}
            </p>
          </div>

          <div className="my-auto p-2.5 bg-[#F2EFE7]/70 border border-[#D4C6AD]/50 rounded text-[10px] font-serif italic text-[#343B38] leading-relaxed">
            {data.reminderRule}
          </div>

          <div className="pt-2 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>PAGE 2</span>
            <span>NO PHONES / NO AI</span>
          </div>
        </div>
      );

    // ── PAGE 3: WHAT TO NOTICE ───────────────────────────────────────
    case 3:
      return (
        <div className={baseClass}>
          <div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] mb-2 border-b border-[#E8E4DB] pb-1">
              <span>03 / CHECKLIST</span>
              <span>LOOK CLOSER</span>
            </div>
            <h2 className="font-instrument italic text-xl leading-snug text-[#343B38] mb-1">
              What to Notice
            </h2>
            <p className="text-[10px] text-[#A6A89C] mb-3">Tick what you discover on your walk:</p>

            <div className="space-y-2.5">
              {data.whatToNotice.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 mt-0.5 border border-[#343B38] rounded-sm flex-shrink-0 bg-white" />
                  <span className="text-[11px] font-serif leading-snug text-[#343B38]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>PAGE 3</span>
            <span>PHYSICAL OBSERVATIONS ONLY</span>
          </div>
        </div>
      );

    // ── PAGE 4: LISTEN OR LOOK CLOSER ────────────────────────────────
    case 4:
      return (
        <div className={baseClass}>
          <div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] mb-2 border-b border-[#E8E4DB] pb-1">
              <span>04 / SENSORY</span>
              <span>PAUSE &amp; ATTUNE</span>
            </div>
            <h2 className="font-instrument italic text-xl leading-snug text-[#343B38] mb-1">
              {data.sensoryTitle}
            </h2>
            <p className="text-[10px] font-serif leading-relaxed text-[#343B38]/90 mb-3">
              {data.sensoryPrompt}
            </p>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-end">
            <span className="text-[9px] font-mono text-[#A6A89C] mb-1">I noticed:</span>
            <div className="space-y-3.5 w-full">
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>PAGE 4</span>
            <span>ATTUNEMENT</span>
          </div>
        </div>
      );

    // ── PAGE 5: SKETCHBOOK ───────────────────────────────────────────
    case 5:
      return (
        <div className={baseClass}>
          <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] mb-1.5 border-b border-[#E8E4DB] pb-1">
            <span>05 / SKETCHBOOK</span>
            <span>DRAWING SPACE</span>
          </div>

          <div className="flex-1 my-1.5 border border-dashed border-[#D4C6AD] rounded bg-white/70 p-2 relative flex flex-col justify-between">
            <div className="w-2.5 h-2.5 border-t border-l border-[#A6A89C] absolute top-1.5 left-1.5" />
            <div className="w-2.5 h-2.5 border-t border-r border-[#A6A89C] absolute top-1.5 right-1.5" />
            <div className="w-2.5 h-2.5 border-b border-l border-[#A6A89C] absolute bottom-1.5 left-1.5" />
            <div className="w-2.5 h-2.5 border-b border-r border-[#A6A89C] absolute bottom-1.5 right-1.5" />
            <div className="flex-1" />
            <p className="text-[9px] font-serif italic text-center text-[#A6A89C] mb-1 px-4 leading-tight">
              {data.sketchCaption}
            </p>
          </div>

          <div className="pt-1.5 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>PAGE 5</span>
            <span>ROUGH CONTOURS &amp; DETAILS</span>
          </div>
        </div>
      );

    // ── PAGE 6: FIELD NOTES ──────────────────────────────────────────
    case 6:
      return (
        <div className={baseClass}>
          <div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] mb-1.5 border-b border-[#E8E4DB] pb-1">
              <span>06 / FIELD NOTES</span>
              <span>UNFILTERED WORDS</span>
            </div>
            <h2 className="font-instrument italic text-xl leading-snug text-[#343B38] mb-1">
              Field Notes
            </h2>
            <div className="space-y-0.5 text-[9.5px] font-serif text-[#A6A89C] italic mb-2">
              <p>• What caught your attention? What surprised you?</p>
              <p>• What did you almost miss? What do you still wonder?</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-around py-1">
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
          </div>

          <div className="pt-1.5 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>PAGE 6</span>
            <span>HANDWRITING SPACE</span>
          </div>
        </div>
      );

    // ── PAGE 7: AFTER THE OBSERVATION ────────────────────────────────
    case 7:
      return (
        <div className={baseClass}>
          <div>
            <div className="flex justify-between items-center text-[9px] font-mono text-[#A6A89C] mb-1.5 border-b border-[#E8E4DB] pb-1">
              <span>07 / POST-WALK</span>
              <span>SYNTHESIS</span>
            </div>
            <h2 className="font-instrument italic text-xl leading-snug text-[#343B38] mb-1">
              After the Observation
            </h2>
            <p className="text-[10px] font-serif italic text-[#343B38]/80 mb-2">
              {data.reflectionPrompts.finalThought}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-around py-1">
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="border-b border-[#D4C6AD] w-full" />
            <div className="pt-2">
              <p className="text-[10px] font-serif text-[#343B38]/90 mb-1 leading-snug">
                {data.reflectionPrompts.transformationQuestion}
              </p>
              <div className="border-b border-[#D4C6AD] w-full mt-2" />
              <div className="border-b border-[#D4C6AD] w-full mt-3" />
            </div>
          </div>

          <div className="pt-1.5 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>PAGE 7</span>
            <span>{data.reflectionPrompts.closingInstruction}</span>
          </div>
        </div>
      );

    // ── PAGE 8: BACK COVER ───────────────────────────────────────────
    case 8:
      return (
        <div className={`${baseClass} items-center text-center justify-between`}>
          <div className="w-full flex justify-between text-[9px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1">
            <span>FIELD FOLIO</span>
            <span>BACK COVER</span>
          </div>

          <div className="my-auto py-2 flex flex-col items-center">
            <p className="text-xs font-serif italic text-[#A6A89C] mb-2">
              Made by noticing.
            </p>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-[#343B38] mb-3">
              Mundane
            </h3>
            <div className="my-2">
              <BotanicalTraceIllustration className="w-10 h-16 text-[#728B83]" />
            </div>
            <div className="w-6 h-6 rounded-full bg-[#B96649]/20 flex items-center justify-center my-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B96649]" />
            </div>
            <p className="text-[10px] font-serif italic text-[#343B38] mt-3 px-4 max-w-[200px] leading-relaxed">
              "{data.backCoverClosing}"
            </p>
          </div>

          <div className="w-full pt-1.5 border-t border-[#E8E4DB] flex justify-between items-center text-[8px] font-mono text-[#A6A89C]">
            <span>RETURN TO APP FOR REFLECTION</span>
            <span>PAGE 8</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
