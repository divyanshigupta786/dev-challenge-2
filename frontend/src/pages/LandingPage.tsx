import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Printer, 
  Clock, 
  Compass, 
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  PenLine,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/Button';
import { useQuests } from '../hooks/useQuests';
import { useJournal } from '../hooks/useJournal';
import { HandDrawnCircle, HandDrawnArrow, BotanicalCornerIllustration } from '../components/ObservationMarks';
import { StreetLampIllustration } from '../components/folio/FolioIllustrations';

// Curated collection of authentic urban observational scenes
interface UrbanScene {
  id: string;
  url: string;
  title: string;
  detailPrompt: string;
  discoveredNote: string;
  annotation: string;
  tag: string;
}

const URBAN_SCENES: UrbanScene[] = [
  {
    id: 'sprout',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    title: 'The Unnoticed Sprout',
    detailPrompt: 'Have you noticed the wild life surviving in the joints between concrete slabs?',
    discoveredNote: '“A resilient green sprout pushing through cracked asphalt beside a cast-iron streetlight.”',
    annotation: 'Same street.\nNew details.',
    tag: 'SPROUT IN ASPHALT'
  },
  {
    id: 'shadow',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    title: 'Raking Shadows',
    detailPrompt: 'Look at the stark geometric angle created where late sunlight hits the fire escape.',
    discoveredNote: '“An acute diagonal shadow transforming a plain brick wall into an abstract grid.”',
    annotation: 'Ephemeral geometry.\nLook up.',
    tag: 'RAKING SUNLIGHT'
  },
  {
    id: 'brick',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    title: 'Masonry Strata',
    detailPrompt: 'Can you spot where three different repair patches overlap on this ancient wall?',
    discoveredNote: '“Victorian red brick meeting 1960s mortar and a weathered iron tie-plate.”',
    annotation: 'Layers of time.\nTouch the stone.',
    tag: 'WEATHERED MASONRY'
  },
  {
    id: 'iron',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    title: 'Iron & Rain',
    detailPrompt: 'Observe the oxidized patina and copper stain dripping down the limestone curb.',
    discoveredNote: '“Decades of rain runoff creating a vivid turquoise rust trail down the foundation.”',
    annotation: 'Chemical traces.\nSlow down.',
    tag: 'OXIDIZED PATINA'
  }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { getDailyQuest } = useQuests();
  const { entries } = useJournal();
  
  const dailyQuest = getDailyQuest();
  
  // Interactive "Look Closer" discovery state on Hero image
  const [isDetailDiscovered, setIsDetailDiscovered] = useState(false);

  // Rotating scenarios carousel
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % URBAN_SCENES.length);
      setIsDetailDiscovered(false); // Reset discovery prompt for new scene
    }, 6000);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  const handleNextScene = () => {
    setActiveSceneIndex((prev) => (prev + 1) % URBAN_SCENES.length);
    setIsDetailDiscovered(false);
  };

  const handlePrevScene = () => {
    setActiveSceneIndex((prev) => (prev - 1 + URBAN_SCENES.length) % URBAN_SCENES.length);
    setIsDetailDiscovered(false);
  };

  const activeScene = URBAN_SCENES[activeSceneIndex];

  // Book opening toggle in showcase section
  const [isBookletOpen, setIsBookletOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F2EFE7] text-[#343B38] font-body selection:bg-dust selection:text-graphite">
      {/* ── SECTION A: TOP EDITORIAL NAVIGATION ──────────────────────── */}
      <header className="border-b border-[#D4C6AD]/60 bg-[#F2EFE7]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-heading font-semibold text-2xl tracking-tight text-[#343B38] hover:opacity-90">
              Mundane
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-mono text-[#A6A89C]">
              <Link to="/" className="text-[#343B38] font-bold border-b-2 border-oxide pb-0.5">
                Home
              </Link>
              <Link to="/quests" className="hover:text-[#343B38] transition-colors">
                Quests
              </Link>
              <Link to="/folio" className="hover:text-[#343B38] transition-colors">
                Field Folio
              </Link>
              <Link to="/journal" className="hover:text-[#343B38] transition-colors">
                Journal
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:block text-xs font-serif italic text-[#A6A89C]">
              Your city is more interesting than you think.
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/quests')}
              className="text-xs font-medium px-4 py-2"
            >
              Start noticing
            </Button>
          </div>
        </div>
      </header>

      {/* ── SECTION B: HERO ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#D4C6AD]/60 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Column: Typography & Intent */}
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E8E4DB]/70 border border-[#D4C6AD]/60 text-[10px] font-mono uppercase tracking-widest text-oxide"
            >
              <span>FIELD JOURNAL 001</span>
              <span>•</span>
              <span className="text-patina font-bold">BLIND FIRST, AI SECOND</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-instrument italic text-5xl sm:text-6xl md:text-7xl text-[#343B38] leading-[1.04] tracking-tight"
            >
              Your city is more interesting than you think.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg font-serif text-[#343B38]/85 max-w-xl leading-relaxed"
            >
              Step outside. Notice the overlooked. Keep a record of the ordinary. Mundane invites you to explore everyday street textures, unexpected geometries, and physical clues before asking AI to reflect on what you found.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="pt-2 flex flex-wrap items-center gap-3"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/quests')}
                className="gap-2 text-sm shadow-md"
              >
                Start noticing <ArrowRight size={16} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/folio')}
                className="gap-2 text-sm bg-white/70 border-[#D4C6AD] hover:bg-white"
              >
                <Printer size={15} /> Explore the Field Folio
              </Button>
            </motion.div>

            {/* Micro stats / Trust note */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#A6A89C] font-mono">
              <span>Local-first (IndexedDB)</span>
              <span>•</span>
              <span>Zero cloud accounts required</span>
              <span>•</span>
              <span>100% On-device</span>
            </div>
          </motion.div>

          {/* Right Hero Column: Rotating Scenarios Documentary Urban Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4C6AD] bg-white p-3 shadow-xl">
              
              {/* Photo Frame with Animated Scene Carousel */}
              <div 
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#2C2E2B] group"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScene.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(52, 59, 56, 0.05), rgba(52, 59, 56, 0.45)), url('${activeScene.url}')`
                    }}
                  />
                </AnimatePresence>

                {/* Previous & Next manual scene buttons */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevScene();
                  }}
                  aria-label="Previous urban scene"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-md"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextScene();
                  }}
                  aria-label="Next urban scene"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-md"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Hand-drawn observation circle around an overlooked detail */}
                <button
                  type="button"
                  onClick={() => setIsDetailDiscovered(!isDetailDiscovered)}
                  onMouseEnter={() => setIsDetailDiscovered(true)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/circle focus:outline-none"
                  aria-label="Look closer at this detail"
                >
                  <HandDrawnCircle className={`w-36 h-36 transition-transform duration-300 ${isDetailDiscovered ? 'scale-110 text-oxide' : 'text-oxide/90'}`} />
                  <span className="sr-only">Interactive observation point</span>
                </button>

                {/* Handwritten callout pointing to circle */}
                <div className="absolute top-10 right-6 z-20 pointer-events-none text-right">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScene.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="font-handwritten text-2xl text-white drop-shadow-md block rotate-[-4deg] whitespace-pre-line leading-tight">
                        {activeScene.annotation}
                      </span>
                      <HandDrawnArrow className="w-12 h-10 text-white ml-auto mt-1 rotate-12 drop-shadow-md" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Scenario Navigation Bullets & Counter */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {URBAN_SCENES.map((scene, idx) => (
                    <button
                      key={scene.id}
                      onClick={() => {
                        setActiveSceneIndex(idx);
                        setIsDetailDiscovered(false);
                      }}
                      className={`transition-all rounded-full ${
                        activeSceneIndex === idx ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                      }`}
                      title={scene.title}
                    />
                  ))}
                  <span className="text-[9px] font-mono text-white/80 ml-1 uppercase">{activeScene.tag}</span>
                  <span className="text-[9px] font-mono text-white/50 ml-1">0{activeSceneIndex + 1}/0{URBAN_SCENES.length}</span>
                </div>

                {/* Signature "LOOK CLOSER" Floating Tag */}
                <div 
                  onClick={() => setIsDetailDiscovered(!isDetailDiscovered)}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-[#D4C6AD] rounded-lg p-3.5 z-20 shadow-md cursor-pointer transition-all hover:bg-white"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-oxide font-bold block mb-0.5">
                        {isDetailDiscovered ? 'DETAIL DISCOVERED' : 'LOOK CLOSER • TAP TO NOTICE'}
                      </span>
                      <p className="text-xs font-serif text-[#343B38] leading-tight">
                        {isDetailDiscovered 
                          ? activeScene.discoveredNote 
                          : activeScene.detailPrompt}
                      </p>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-oxide/10 text-oxide flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ✦
                    </span>
                  </div>
                </div>
              </div>

              {/* Ripped-paper botanical illustration accent */}
              <div className="absolute -bottom-6 -right-6 hidden sm:block w-28 h-32 bg-[#FCFAF6] border border-[#D4C6AD] rounded-lg shadow-md p-2 transform rotate-6 z-30">
                <div className="w-full h-full border border-dashed border-[#D4C6AD] rounded flex flex-col items-center justify-center p-1 text-center">
                  <BotanicalCornerIllustration className="w-12 h-14 text-patina" />
                  <span className="font-handwritten text-xs text-[#343B38] mt-1">What else is waiting?</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION C: TODAY'S OBSERVATION QUEST ───────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 border-b border-[#D4C6AD]/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-oxide font-semibold block mb-1">
              TODAY'S OBSERVATION QUEST
            </span>
            <h2 className="font-instrument italic text-4xl sm:text-5xl text-[#343B38]">
              {dailyQuest ? dailyQuest.title : 'The Things We Walk Past'}
            </h2>
            <p className="text-sm font-serif text-[#343B38]/80 mt-2 max-w-lg leading-relaxed">
              {dailyQuest ? dailyQuest.description : 'Notice the small details that make an ordinary street unique.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => dailyQuest && navigate('/observe', { state: { quest: dailyQuest } })}
              className="gap-2"
            >
              View Quest <ArrowRight size={15} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => dailyQuest && navigate(`/folio/${dailyQuest.id}`)}
              className="bg-white/80 border-[#D4C6AD]"
            >
              Folio
            </Button>
          </div>
        </div>

        {/* Quest Card Grid with Notebook Post-it Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Quest Card */}
          <div className="lg:col-span-8 bg-white border border-[#D4C6AD] rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E4DB] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-oxide/10 text-oxide border border-oxide/20 text-xs font-medium font-sans">
                  {dailyQuest?.theme ?? 'Pattern Hunt'}
                </span>
                <span className="text-xs font-mono text-[#A6A89C] flex items-center gap-1">
                  <Clock size={13} /> ~10 mins
                </span>
                <span className="text-xs font-mono text-[#A6A89C] flex items-center gap-1">
                  <Compass size={13} /> {dailyQuest?.difficulty ?? 'Easy'}
                </span>
              </div>
              <span className="text-xs font-mono text-[#A6A89C]">
                QUEST #{dailyQuest?.id ?? 'ph-001'}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-heading text-2xl text-[#343B38]">Observation Prompts:</h3>
              <div className="space-y-2.5">
                {(dailyQuest?.tips ?? [
                  'Find a surface marked by time or repeated human contact',
                  'Notice a shadow creating an unexpected geometric shape',
                  'Find a pattern that repeats in an unusual place',
                  'Notice something repaired, reused, or improvised'
                ]).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E4DB]">
                    <div className="w-4 h-4 mt-0.5 rounded-sm border border-[#343B38] bg-white flex-shrink-0" />
                    <span className="text-sm font-serif leading-snug text-[#343B38]">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8E4DB]">
              <span className="text-xs font-serif italic text-[#A6A89C]">
                Ready to explore? Step outside with fresh eyes.
              </span>
              <Button
                variant="primary"
                onClick={() => dailyQuest && navigate('/observe', { state: { quest: dailyQuest } })}
                className="gap-1.5"
              >
                Begin observation in app <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Sticky Field Note / Look Closer Card */}
          <div className="lg:col-span-4 bg-[#FAF7F2] border border-[#D4C6AD] rounded-xl p-6 shadow-sm relative">
            <div className="flex justify-between items-center text-xs font-mono text-[#A6A89C] border-b border-[#D4C6AD] pb-2 mb-4">
              <span className="text-oxide font-bold">LOOK CLOSER</span>
              <span>FIELD TIP</span>
            </div>

            <p className="font-serif italic text-sm text-[#343B38] leading-relaxed mb-4">
              "The goal is not to find something beautiful or famous. The goal is to notice what everyone else steps over without seeing."
            </p>

            <div className="pt-3 border-t border-[#E8E4DB] flex items-center justify-between">
              <span className="font-handwritten text-lg text-graphite">
                Small details.<br />Big stories.
              </span>
              <BotanicalCornerIllustration className="w-12 h-16 text-patina" />
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION D: FIELD FOLIO SHOWCASE WITH BOOK OPENING ANIMATION ─ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#D4C6AD]/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-oxide font-semibold block">
              THE MUNDANE FIELD FOLIO
            </span>
            <h2 className="font-instrument italic text-4xl sm:text-5xl text-[#343B38] leading-tight">
              A pocket-sized observation booklet.
            </h2>
            <p className="text-sm font-serif text-[#343B38]/85 leading-relaxed">
              Turn any quest into a foldable 8-page zine. Print it on a single A4 sheet, fold it along the creases, carry it in your jacket pocket, and fill it by hand. A tactile way to slow down and attune to your surroundings.
            </p>

            <div className="space-y-2 text-xs font-mono text-[#343B38]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-patina" />
                <span>1 Sheet of A4 paper folds into 8 pocket pages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-patina" />
                <span>Zero batteries, zero screens, zero distraction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-patina" />
                <span>Interactive book-opening spread simulator</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/folio')}
                className="gap-2"
              >
                Create Your Field Folio <ArrowRight size={16} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsBookletOpen(!isBookletOpen)}
                className="gap-1.5 text-xs bg-white border-[#D4C6AD]"
              >
                <BookOpen size={14} />
                {isBookletOpen ? 'Fold Booklet' : 'Open Booklet'}
              </Button>
            </div>
          </div>

          {/* Interactive Animated Book-Opening Showcase */}
          <div className="lg:col-span-7 bg-[#E8E4DB]/60 border border-[#D4C6AD] rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
            {/* Top Badge with Toggle */}
            <div className="flex justify-between items-center mb-6 text-[10px] font-mono text-[#A6A89C]">
              <span className="uppercase tracking-widest text-oxide font-bold">1 SHEET • 8 PAGES • MINI-ZINE</span>
              <button 
                onClick={() => setIsBookletOpen(!isBookletOpen)}
                className="font-handwritten text-base text-oxide hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isBookletOpen ? 'Tap to close cover ✦' : 'Tap to unfold booklet ✦'}
              </button>
            </div>

            {/* 3D-effect Physical Book Spread with Animated Folding */}
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 perspective-1000 py-4 min-h-[360px]">
              
              {/* Left Booklet Cover (flips closed / opens flat) */}
              <motion.div 
                animate={{ 
                  rotateY: isBookletOpen ? 0 : 75,
                  scale: isBookletOpen ? 1 : 0.95
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-1/2 bg-[#FCFAF6] border border-[#D4C6AD] rounded-l-lg rounded-r-xs p-5 shadow-xl sm:origin-right flex flex-col justify-between aspect-[1/1.42] text-center relative z-20 border-r-[#D4C6AD]/40"
              >
                <div className="flex justify-between items-center text-[8px] font-mono text-[#A6A89C] border-b border-[#D4C6AD]/60 pb-1">
                  <span>MUNDANE / FIELD FOLIO</span>
                  <span className="text-oxide font-bold">No. 001</span>
                </div>
                <div className="my-auto py-2">
                  <span className="text-[8px] uppercase tracking-widest text-[#A6A89C] block mb-1">PAGE 1 / COVER</span>
                  <h4 className="font-instrument italic text-2xl text-[#343B38] mb-2 leading-tight">
                    The Things We Walk Past
                  </h4>
                  <StreetLampIllustration className="w-8 h-16 mx-auto text-[#343B38]" />
                  <p className="text-[9px] font-serif italic text-[#A6A89C] mt-2">
                    A small study of the overlooked.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4C6AD]/60 text-[8px] font-mono text-[#A6A89C] flex justify-between">
                  <span>DATE: _________</span>
                  <span>Mundane</span>
                </div>
              </motion.div>

              {/* Spine shadow crease */}
              <div className="hidden sm:block w-1.5 h-full absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-gradient-to-r from-black/15 via-black/5 to-black/15 rounded-full" />

              {/* Right Booklet Interior Spread (Revealed when open) */}
              <motion.div 
                animate={{ 
                  rotateY: isBookletOpen ? 0 : -75,
                  opacity: isBookletOpen ? 1 : 0.6
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-1/2 bg-[#FAF7F2] border border-[#D4C6AD] rounded-r-lg rounded-l-xs p-5 shadow-xl sm:origin-left flex flex-col justify-between aspect-[1/1.42] relative z-10 border-l-[#D4C6AD]/40"
              >
                <div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-1 mb-2">
                    <span>03 / WHAT TO NOTICE</span>
                    <span>PAGE 3</span>
                  </div>
                  <h4 className="font-instrument italic text-xl text-[#343B38] mb-1">
                    What to Notice
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[9.5px] font-serif text-[#343B38]">
                      <div className="w-2.5 h-2.5 border border-[#343B38] rounded-xs bg-white" />
                      <span>Surfaces marked by time or use</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px] font-serif text-[#343B38]">
                      <div className="w-2.5 h-2.5 border border-[#343B38] rounded-xs bg-white" />
                      <span>Unexpected geometric shadows</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px] font-serif text-[#343B38]">
                      <div className="w-2.5 h-2.5 border border-[#343B38] rounded-xs bg-white" />
                      <span>Repeating street patterns</span>
                    </div>
                  </div>
                </div>

                {/* Interior sketch frame */}
                <div className="border border-dashed border-[#D4C6AD] rounded p-2 text-center my-2 bg-white/60">
                  <span className="text-[7.5px] font-mono text-[#A6A89C] block mb-1">PAGE 5 • SKETCHBOOK</span>
                  <div className="h-8 flex items-center justify-center">
                    <p className="text-[8px] font-serif italic text-[#A6A89C]">
                      "Draw what you noticed, not what you think should be there."
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E4DB] text-[8px] font-mono text-[#A6A89C] flex justify-between">
                  <span>TOUCH GRASS</span>
                  <span>PAGE 4 &amp; 5</span>
                </div>
              </motion.div>

            </div>

            {/* Bottom Folding Cue */}
            <div className="mt-4 flex flex-wrap justify-between items-center text-xs text-graphite border-t border-[#D4C6AD]/60 pt-3">
              <span className="font-handwritten text-base text-oxide">
                Folds along 3 simple creases with a center slit ✦
              </span>
              <button
                onClick={() => navigate('/folio')}
                className="text-xs font-mono underline hover:text-oxide transition-colors flex items-center gap-1"
              >
                Open in Folio Studio <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION E: BLIND FIRST, AI SECOND WORKFLOW ────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#D4C6AD]/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-oxide font-semibold block mb-1">
            HOW IT WORKS
          </span>
          <h2 className="font-instrument italic text-4xl sm:text-5xl text-[#343B38]">
            Blind First, AI Second
          </h2>
          <p className="text-sm font-serif text-[#343B38]/80 mt-3 leading-relaxed">
            You observe, record, and reflect in your own words. AI never interprets for you ahead of time — it comes in only after you've had the physical experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white border border-[#D4C6AD] rounded-xl p-6 sm:p-7 shadow-sm relative hover:border-oxide/40 transition-colors">
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#D4C6AD] text-oxide font-mono text-base font-bold flex items-center justify-center">
                1
              </div>
              <div className="w-8 h-8 rounded-full bg-dust/30 text-graphite flex items-center justify-center">
                <Eye size={16} />
              </div>
            </div>
            <h3 className="font-heading text-xl text-[#343B38] mb-2">Go outside</h3>
            <p className="text-xs font-serif text-[#343B38]/85 leading-relaxed">
              Choose a quest or take a printed Field Folio. Walk with intentional curiosity. Seek out ordinary textures, brick patterns, rusted iron, or hidden architectural traces.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E8E4DB] text-[11px] font-mono text-[#A6A89C]">
              No AI answers beforehand
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#D4C6AD] rounded-xl p-6 sm:p-7 shadow-sm relative hover:border-oxide/40 transition-colors">
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#D4C6AD] text-oxide font-mono text-base font-bold flex items-center justify-center">
                2
              </div>
              <div className="w-8 h-8 rounded-full bg-dust/30 text-graphite flex items-center justify-center">
                <PenLine size={16} />
              </div>
            </div>
            <h3 className="font-heading text-xl text-[#343B38] mb-2">Save your notes</h3>
            <p className="text-xs font-serif text-[#343B38]/85 leading-relaxed">
              Describe what you saw, heard, or felt in your own unfiltered words. Attach an optional photo of your subject or completed booklet. Your observations are saved locally first.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E8E4DB] text-[11px] font-mono text-[#A6A89C]">
              Stored in your on-device journal
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#D4C6AD] rounded-xl p-6 sm:p-7 shadow-sm relative hover:border-oxide/40 transition-colors">
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#D4C6AD] text-oxide font-mono text-base font-bold flex items-center justify-center">
                3
              </div>
              <div className="w-8 h-8 rounded-full bg-oxide/10 text-oxide flex items-center justify-center">
                <Sparkles size={16} />
              </div>
            </div>
            <h3 className="font-heading text-xl text-[#343B38] mb-2">Request AI reflection</h3>
            <p className="text-xs font-serif text-[#343B38]/85 leading-relaxed">
              When you're ready, explicitly ask for an AI reflection. The model reflects ONLY on what you recorded, asking one thought-provoking follow-up question and suggesting your next quest.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E8E4DB] text-[11px] font-mono text-[#A6A89C]">
              Strictly grounded in your words
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION F: JOURNAL PREVIEW ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#D4C6AD]/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-oxide font-semibold block">
              YOUR JOURNAL
            </span>
            <h2 className="font-instrument italic text-4xl sm:text-5xl text-[#343B38]">
              A record of what you notice.
            </h2>
            <p className="text-sm font-serif text-[#343B38]/85 leading-relaxed">
              Save your observations, sketches, and reflections into a personal offline archive. Build a collection of the quiet, unnoticed moments that make your everyday city come alive.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/journal')}
                className="gap-2"
              >
                Explore Journal <ArrowRight size={15} />
              </Button>
              <span className="text-xs font-mono text-[#A6A89C]">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} stored on this device
              </span>
            </div>
          </div>

          {/* Journal Archive Card Preview */}
          <div className="lg:col-span-7 bg-white border border-[#D4C6AD] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center text-xs font-mono text-[#A6A89C] border-b border-[#E8E4DB] pb-3 mb-5">
              <span>FIELD ARCHIVE</span>
              <span>RECENT OBSERVATION</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E4DB] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2 py-0.5 rounded bg-oxide/10 text-oxide border border-oxide/20 font-medium">
                  Light and Shadow
                </span>
                <span className="text-xs font-mono text-[#A6A89C]">
                  Brick Lane, North Corner
                </span>
              </div>
              <h4 className="font-heading text-lg text-[#343B38]">
                The way afternoon light splits on old masonry
              </h4>
              <p className="text-xs font-serif text-[#343B38]/80 leading-relaxed italic">
                "Noticed how the acute rake of the late 4pm sun revealed horizontal chisel marks on Victorian Portland stone that are completely invisible at noon."
              </p>
              <div className="pt-2 border-t border-[#E8E4DB] flex justify-between items-center text-[11px] font-mono text-patina">
                <span>✦ AI Reflection available</span>
                <span className="text-[#A6A89C]">Stored in IndexedDB</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs font-mono text-[#A6A89C]">
              <span>Searchable by keyword, theme, &amp; location</span>
              <span className="font-handwritten text-lg text-graphite">Look closer.</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION G: CLOSING DEEP GRAPHITE CALLOUT & FOOTER ────────── */}
      <section className="bg-[#343B38] text-[#F2EFE7] py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dust mb-2">
              <span>TOUCH GRASS • DEV CHALLENGE 2026</span>
            </div>
            <h2 className="font-instrument italic text-4xl sm:text-5xl leading-tight">
              Same city. New perspective.
            </h2>
            <p className="text-sm font-serif text-[#F2EFE7]/80 mt-2 max-w-md leading-relaxed">
              Your next urban discovery is waiting right outside your door. Pick a quest and step out.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/quests')}
            className="bg-oxide text-white hover:bg-oxide/90 text-sm px-6 py-3.5 gap-2 shadow-lg whitespace-nowrap"
          >
            Start noticing <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#D4C6AD]/60 py-8 px-4 sm:px-6 bg-[#F2EFE7] text-xs font-mono text-[#A6A89C]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-heading font-semibold text-sm text-[#343B38]">Mundane</span>
            <span>•</span>
            <span>Local-first field journal</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/quests" className="hover:text-[#343B38]">Quests</Link>
            <Link to="/folio" className="hover:text-[#343B38]">Field Folio</Link>
            <Link to="/journal" className="hover:text-[#343B38]">Journal</Link>
            <Link to="/settings" className="hover:text-[#343B38]">Settings</Link>
          </div>

          <div>
            Made to help people look closer.
          </div>
        </div>
      </footer>
    </div>
  );
}
