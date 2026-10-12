import { cn, THEME_COLORS, THEME_DOTS } from '../lib/utils';
import type { Quest } from '../lib/types';
import { Button } from './Button';
import { ChevronRight, Lightbulb } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onBegin?: (quest: Quest) => void;
  onMakeFolio?: (quest: Quest) => void;
  featured?: boolean;
  compact?: boolean;
}

export function QuestCard({ quest, onBegin, onMakeFolio, featured = false, compact = false }: QuestCardProps) {
  const themeColorClass = THEME_COLORS[quest.theme] ?? 'bg-dust/40 text-graphite border-dust';
  const themeDotClass = THEME_DOTS[quest.theme] ?? 'bg-weathered-stone';

  if (compact) {
    return (
      <div className="flex items-center gap-2 group bg-white rounded-lg border border-border-subtle p-3 hover:border-dust transition-all">
        <button
          onClick={() => onBegin?.(quest)}
          className="flex-1 text-left flex items-start justify-between gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('w-2 h-2 rounded-full flex-shrink-0', themeDotClass)} />
              <span className="text-[11px] text-text-muted font-medium uppercase tracking-wide">{quest.theme}</span>
            </div>
            <p className="text-sm text-graphite font-medium leading-snug">{quest.title}</p>
          </div>
          <ChevronRight size={16} className="text-text-muted group-hover:text-oxide transition-colors mt-0.5 flex-shrink-0" />
        </button>
        {onMakeFolio && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMakeFolio(quest)}
            className="text-xs px-2.5 py-1 text-text-muted hover:text-oxide border border-border-subtle hover:border-dust"
            title="Make Field Folio booklet"
          >
            Folio
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-border-subtle shadow-card overflow-hidden',
        featured && 'border-oxide/20',
      )}
    >
      {/* Theme label */}
      <div className={cn('px-5 py-2 border-b border-border-subtle flex justify-between items-center', featured ? 'bg-oxide/5' : 'bg-surface-secondary')}>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', themeColorClass)}>
          {quest.theme}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
          {quest.difficulty}
        </span>
      </div>

      {/* Main content */}
      <div className="p-5">
        <h2 className={cn('font-heading text-graphite leading-snug mb-3', featured ? 'text-2xl' : 'text-lg')}>
          {quest.title}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed mb-4">{quest.description}</p>

        {/* Tips */}
        {quest.tips.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-1.5 text-xs text-patina font-medium mb-2">
              <Lightbulb size={12} />
              <span>Observation tips</span>
            </div>
            <ul className="space-y-1">
              {quest.tips.map((tip, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                  <span className="text-dust mt-1">—</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          {onBegin && (
            <Button onClick={() => onBegin(quest)} variant="primary" className="flex-1">
              Begin in app
            </Button>
          )}
          {onMakeFolio && (
            <Button
              onClick={() => onMakeFolio(quest)}
              variant="secondary"
              className="flex-1 border-dust/80 hover:border-graphite"
            >
              Print Field Folio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

