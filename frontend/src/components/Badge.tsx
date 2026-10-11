import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'accent' | 'error';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variant === 'default' && 'bg-dust/40 text-graphite border-dust',
        variant === 'muted' && 'bg-transparent text-text-muted border-border-subtle',
        variant === 'accent' && 'bg-patina/10 text-patina border-patina/30',
        variant === 'error' && 'bg-error-red/10 text-error-red border-error-red/30',
        className,
      )}
    >
      {children}
    </span>
  );
}
