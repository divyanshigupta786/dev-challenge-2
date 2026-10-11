import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return uuidv4();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const THEME_COLORS: Record<string, string> = {
  'Pattern Hunt': 'bg-amber-50 text-amber-800 border-amber-200',
  'Urban Archaeology': 'bg-stone-100 text-stone-700 border-stone-300',
  'Design Detective': 'bg-blue-50 text-blue-800 border-blue-200',
  'Light and Shadow': 'bg-orange-50 text-orange-800 border-orange-200',
  'Unexpected Geometry': 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export const THEME_DOTS: Record<string, string> = {
  'Pattern Hunt': 'bg-amber-500',
  'Urban Archaeology': 'bg-stone-500',
  'Design Detective': 'bg-blue-500',
  'Light and Shadow': 'bg-orange-500',
  'Unexpected Geometry': 'bg-emerald-500',
};
