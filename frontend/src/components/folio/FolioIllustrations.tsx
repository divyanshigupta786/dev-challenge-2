interface IllustrationProps {
  className?: string;
}

// Handcrafted editorial architectural illustrations inspired by the physical field book aesthetic
export function StreetLampIllustration({ className = 'w-16 h-28 text-graphite' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Brick/curb base */}
      <line x1="10" y1="115" x2="50" y2="115" />
      <line x1="15" y1="110" x2="45" y2="110" />
      <rect x="22" y="98" width="16" height="12" rx="1" />
      {/* Post */}
      <line x1="30" y1="98" x2="30" y2="35" strokeWidth="2" />
      {/* Decorative finials/brackets */}
      <path d="M22 65 C22 55, 38 55, 38 65" />
      <path d="M20 40 Q30 36 40 40" />
      {/* Lantern top */}
      <polygon points="30,12 18,22 42,22" />
      <line x1="30" y1="8" x2="30" y2="12" />
      {/* Glass enclosure */}
      <polygon points="20,22 40,22 36,36 24,36" />
      {/* Inner bulb/mantle */}
      <circle cx="30" cy="28" r="2.5" fill="currentColor" opacity="0.3" />
      {/* Subdued brickwork trace on side */}
      <path d="M38 102 L48 102 L48 110" strokeDasharray="2 2" strokeWidth="1" opacity="0.6" />
      <path d="M42 106 L52 106" strokeDasharray="2 2" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function ArchwayIllustration({ className = 'w-16 h-20 text-graphite' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 75 L12 36 Q12 14 30 14 Q48 14 48 36 L48 75" />
      <path d="M18 75 L18 38 Q18 20 30 20 Q42 20 42 38 L42 75" strokeWidth="1" strokeDasharray="2 2" />
      {/* Keystone */}
      <polygon points="27,10 33,10 32,18 28,18" />
      <line x1="6" y1="75" x2="54" y2="75" />
    </svg>
  );
}

export function BotanicalTraceIllustration({ className = 'w-14 h-20 text-patina' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 50 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M25 75 Q28 45 22 15" />
      {/* Leaflets */}
      <path d="M25 60 Q34 54 30 46 Q25 50 25 60" fill="currentColor" fillOpacity="0.1" />
      <path d="M24 50 Q14 44 18 36 Q23 40 24 50" fill="currentColor" fillOpacity="0.1" />
      <path d="M23 38 Q32 30 28 22 Q23 26 23 38" fill="currentColor" fillOpacity="0.1" />
      <path d="M22 25 Q16 18 20 10 Q24 14 22 25" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}
