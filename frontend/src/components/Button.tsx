import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-body font-medium rounded transition-all duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',

        // Variants
        variant === 'primary' && [
          'bg-oxide text-white',
          'hover:bg-primary-hover active:scale-[0.98]',
          'shadow-sm',
        ],
        variant === 'secondary' && [
          'bg-white text-graphite border border-dust',
          'hover:bg-concrete-paper hover:border-weathered-stone',
          'active:scale-[0.98]',
        ],
        variant === 'ghost' && [
          'text-graphite',
          'hover:bg-dust/40',
          'active:scale-[0.98]',
        ],
        variant === 'danger' && [
          'bg-error-red text-white',
          'hover:opacity-90 active:scale-[0.98]',
        ],

        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
