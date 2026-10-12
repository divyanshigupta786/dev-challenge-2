// Hand-drawn sketch style SVG arrows and discovery circles
export function HandDrawnCircle({ className = 'w-24 h-24 text-oxide' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M50 10 C75 9, 92 25, 90 52 C88 78, 68 91, 46 90 C22 89, 8 72, 10 46 C12 21, 28 11, 52 10 C58 9.8, 64 11, 70 14" strokeDasharray="300" strokeDashoffset="0" />
    </svg>
  );
}

export function HandDrawnArrow({ className = 'w-16 h-12 text-graphite' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 32 Q32 20 48 10" />
      <path d="M38 8 L49 10 L44 21" />
    </svg>
  );
}

export function BotanicalCornerIllustration({ className = 'w-20 h-24 text-graphite/40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M40 90 Q42 50 35 15" />
      <path d="M40 70 Q52 64 48 54 Q40 58 40 70" fill="currentColor" fillOpacity="0.08" />
      <path d="M38 58 Q24 50 30 40 Q37 45 38 58" fill="currentColor" fillOpacity="0.08" />
      <path d="M37 42 Q48 34 44 24 Q36 30 37 42" fill="currentColor" fillOpacity="0.08" />
      <path d="M36 26 Q28 18 32 10 Q38 14 36 26" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}
