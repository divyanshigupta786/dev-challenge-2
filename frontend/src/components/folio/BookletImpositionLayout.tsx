import type { FolioData } from '../../lib/folioContent';
import { FolioPagePanel } from './FolioPagePanel';
import { Scissors } from 'lucide-react';

interface BookletImpositionLayoutProps {
  data: FolioData;
}

/**
 * Renders the 8-page mini-zine imposed on a single A4 Landscape sheet.
 * Top Row (Pages 8, 1, 2, 3) is inverted 180° for true booklet folding.
 * Bottom Row (Pages 7, 6, 5, 4) is upright.
 * Includes central folding guides and central 2-panel cut line.
 */
export function BookletImpositionLayout({ data }: BookletImpositionLayoutProps) {
  return (
    <div className="w-full max-w-[297mm] mx-auto bg-white border border-[#D4C6AD] p-4 sm:p-6 rounded-lg shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full">
      {/* Print-only helper marks */}
      <div className="hidden print:flex justify-between items-center text-[7px] font-mono text-[#A6A89C] px-2 mb-1">
        <span>MUNDANE FIELD FOLIO — ONE-SHEET 8-PAGE MINI-ZINE</span>
        <span>A4 LANDSCAPE (100% SCALE)</span>
        <span>{data.folioNumber}</span>
      </div>

      {/* 2 Rows x 4 Columns Imposition Grid */}
      <div className="relative border-2 border-[#343B38] bg-[#F2EFE7]">
        {/* TOP ROW: Inverted 180° for booklet folding */}
        <div className="grid grid-cols-4 border-b border-[#343B38]">
          {/* Col 1: Page 8 (Back Cover) */}
          <div className="rotate-180 border-r border-[#D4C6AD] min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={8} data={data} isPrintImposition />
          </div>
          {/* Col 2: Page 1 (Front Cover) */}
          <div className="rotate-180 border-r border-[#D4C6AD] min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={1} data={data} isPrintImposition />
          </div>
          {/* Col 3: Page 2 (Invitation) */}
          <div className="rotate-180 border-r border-[#D4C6AD] min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={2} data={data} isPrintImposition />
          </div>
          {/* Col 4: Page 3 (What to Notice) */}
          <div className="rotate-180 min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={3} data={data} isPrintImposition />
          </div>
        </div>

        {/* Central horizontal cut/fold line guide */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20 pointer-events-none flex items-center">
          {/* Outer left fold indicator (solid/dashed) */}
          <div className="w-1/4 border-t border-dotted border-[#A6A89C]" />
          {/* Center 2 panels: CUT SLIT line with scissors marker */}
          <div className="w-2/4 border-t-2 border-dashed border-[#B96649] flex items-center justify-center relative">
            <span className="bg-[#FAF7F2] px-2 py-0.5 rounded text-[8px] font-mono text-[#B96649] border border-[#B96649]/30 -translate-y-1/2 flex items-center gap-1 shadow-xs">
              <Scissors size={9} />
              CUT ALONG THIS DOTTED LINE ONLY (PANELS 2 &amp; 3)
            </span>
          </div>
          {/* Outer right fold indicator */}
          <div className="w-1/4 border-t border-dotted border-[#A6A89C]" />
        </div>

        {/* BOTTOM ROW: Upright */}
        <div className="grid grid-cols-4">
          {/* Col 1: Page 7 (After Observation) */}
          <div className="border-r border-[#D4C6AD] min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={7} data={data} isPrintImposition />
          </div>
          {/* Col 2: Page 6 (Field Notes) */}
          <div className="border-r border-[#D4C6AD] min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={6} data={data} isPrintImposition />
          </div>
          {/* Col 3: Page 5 (Sketchbook) */}
          <div className="border-r border-[#D4C6AD] min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={5} data={data} isPrintImposition />
          </div>
          {/* Col 4: Page 4 (Listen/Look Closer) */}
          <div className="min-h-[190px] sm:min-h-[240px] md:min-h-[280px]">
            <FolioPagePanel pageNumber={4} data={data} isPrintImposition />
          </div>
        </div>
      </div>

      {/* Footer guide below booklet print */}
      <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-[#A6A89C] print:mt-1">
        <span>1. Print at 100% on A4 Landscape</span>
        <span>2. Cut along center dashed line</span>
        <span>3. Fold in half &amp; compress into 8-page booklet</span>
      </div>
    </div>
  );
}
