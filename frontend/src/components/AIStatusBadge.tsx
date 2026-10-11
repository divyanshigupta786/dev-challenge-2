import { cn } from '../lib/utils';
import { Cpu, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import type { AIStatus } from '../lib/types';

interface AIStatusBadgeProps {
  status: AIStatus;
  modelName?: string;
  onRetry?: () => void;
  className?: string;
}

export function AIStatusBadge({ status, modelName, onRetry, className }: AIStatusBadgeProps) {
  const configs: Record<AIStatus, { icon: React.ReactNode; label: string; color: string }> = {
    idle: {
      icon: <Cpu size={12} />,
      label: 'Checking AI...',
      color: 'text-text-muted',
    },
    checking: {
      icon: <RefreshCw size={12} className="animate-spin" />,
      label: 'Checking AI...',
      color: 'text-text-muted',
    },
    available: {
      icon: <CheckCircle size={12} />,
      label: modelName ? `${modelName} ready` : 'Local AI ready',
      color: 'text-patina',
    },
    ollama_down: {
      icon: <AlertCircle size={12} />,
      label: 'Ollama not running',
      color: 'text-error-red',
    },
    model_missing: {
      icon: <AlertCircle size={12} />,
      label: 'Model not downloaded',
      color: 'text-oxide',
    },
    error: {
      icon: <AlertCircle size={12} />,
      label: 'Backend unavailable',
      color: 'text-error-red',
    },
  };

  const config = configs[status];

  return (
    <div className={cn('flex items-center gap-1.5', config.color, className)}>
      {config.icon}
      <span className="text-xs">{config.label}</span>
      {onRetry && (status === 'ollama_down' || status === 'model_missing' || status === 'error') && (
        <button
          onClick={onRetry}
          className="text-xs underline hover:no-underline ml-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
}
