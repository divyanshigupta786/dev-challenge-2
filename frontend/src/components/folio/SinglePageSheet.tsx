import type { FolioData } from '../../lib/folioContent';

interface SinglePageSheetProps {
  data: FolioData;
}

export function SinglePageSheet({ data }: SinglePageSheetProps) {
  return (
    <div className="w-full max-w-[210mm] mx-auto bg-[#FCFAF6] border border-[#D4C6AD] text-[#343B38] p-6 sm:p-8 rounded-lg shadow-sm print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full">
      {/* Top Header */}
      <div className="border-b-2 border-[#343B38] pb-3 mb-5">
        <div className="flex justify-between items-baseline text-xs font-mono text-[#A6A89C] mb-1">
          <span className="tracking-widest uppercase">{data.series} / SINGLE SHEET</span>
          <span className="font-semibold text-[#B96649]">{data.folioNumber}</span>
          <span className="text-[10px] tracking-wider font-sans uppercase font-bold text-[#728B83]">OBSERVE • DON'T ASSUME</span>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#A6A89C] block mb-0.5">{data.theme}</span>
            <h1 className="font-instrument italic text-3xl sm:text-4xl leading-tight text-[#343B38]">
              {data.questTitle}
            </h1>
          </div>
          <div className="hidden sm:block text-right">
            <span className="font-heading text-lg font-medium text-[#343B38]">Mundane</span>
            <p className="text-[10px] text-[#A6A89C] italic">Field Observation Sheet</p>
          </div>
        </div>
        <p className="text-sm font-serif italic text-[#343B38]/90 mt-2 leading-relaxed">
          {data.invitationText}
        </p>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
        {/* Left Column: Checklist & Sensory */}
        <div className="space-y-6">
          {/* Section 01: Look Closer */}
          <div className="border border-[#E8E4DB] rounded bg-white/70 p-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-3">
              <span className="font-bold text-[#343B38]">01 / LOOK CLOSER</span>
              <span>OBSERVATION CHECKLIST</span>
            </div>
            <div className="space-y-3">
              {data.whatToNotice.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 mt-0.5 border border-[#343B38] rounded-sm flex-shrink-0 bg-white" />
                  <span className="text-xs font-serif leading-snug text-[#343B38]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 02: Sensory attunement */}
          <div className="border border-[#E8E4DB] rounded bg-white/70 p-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-2">
              <span className="font-bold text-[#343B38]">02 / SENSORY DETAIL</span>
              <span>PAUSE &amp; ATTUNE</span>
            </div>
            <p className="text-xs font-serif text-[#343B38] mb-1.5">{data.sensoryPrompt}</p>
            <p className="text-[11px] font-mono text-[#A6A89C] mb-3">{data.sensoryPromptDetail}</p>
            <div className="space-y-4">
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
            </div>
          </div>
        </div>

        {/* Right Column: Sketch & Field Notes */}
        <div className="space-y-6">
          {/* Section 03: Sketch a Detail */}
          <div className="border border-[#E8E4DB] rounded bg-white/70 p-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-2">
              <span className="font-bold text-[#343B38]">03 / SKETCH A DETAIL</span>
              <span>DRAW WHAT YOU SEE</span>
            </div>
            <div className="h-44 border border-dashed border-[#D4C6AD] rounded bg-white flex flex-col justify-between p-2 relative">
              <div className="w-2.5 h-2.5 border-t border-l border-[#A6A89C] absolute top-1.5 left-1.5" />
              <div className="w-2.5 h-2.5 border-t border-r border-[#A6A89C] absolute top-1.5 right-1.5" />
              <div className="w-2.5 h-2.5 border-b border-l border-[#A6A89C] absolute bottom-1.5 left-1.5" />
              <div className="w-2.5 h-2.5 border-b border-r border-[#A6A89C] absolute bottom-1.5 right-1.5" />
              <div className="flex-1" />
              <p className="text-[10px] font-serif italic text-center text-[#A6A89C] px-2">
                {data.sketchCaption}
              </p>
            </div>
          </div>

          {/* Section 04: Your Field Notes */}
          <div className="border border-[#E8E4DB] rounded bg-white/70 p-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1.5 mb-2">
              <span className="font-bold text-[#343B38]">04 / YOUR FIELD NOTES</span>
              <span>UNFILTERED OBSERVATIONS</span>
            </div>
            <p className="text-[11px] font-serif italic text-[#A6A89C] mb-3">
              What caught your attention? What did you almost miss? What surprised you?
            </p>
            <div className="space-y-4">
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
              <div className="border-b border-[#D4C6AD] w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer & Signature Bar */}
      <div className="mt-8 pt-4 border-t-2 border-[#343B38] flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-[#A6A89C]">
        <div className="flex items-center gap-4">
          <span>DATE: _______________</span>
          <span>LOCATION: _________________________</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-[#343B38]">Made by noticing.</span>
          <span className="font-bold text-[#343B38] font-sans">Mundane</span>
        </div>
      </div>
    </div>
  );
}
