import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const getAccentColor = (seed?: string | null) => {
  // Handle undefined, null, or empty string
  if (!seed || seed === 'undefined') {
    return 'from-violet-400 to-green-400'; // Default gradient
  }

  // Special cases for important UI elements
  if (seed === 'login' || seed === 'brand' || seed === 'default') {
    return 'from-violet-400 to-green-400';
  }

  const colors = [
    'from-violet-400 to-green-400', // Our new primary gradient
    'from-blue-500 to-purple-600',
    'from-green-500 to-emerald-700',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-indigo-800',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-teal-600',
    'from-red-500 to-pink-600',
    'from-yellow-500 to-amber-600',
    'from-emerald-500 to-green-600',
    'from-purple-500 to-violet-600',
    'from-sky-500 to-blue-600',
    'from-orange-500 to-red-600',
    'from-teal-500 to-cyan-600',
    'from-lime-500 to-green-600',
    'from-fuchsia-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-slate-500 to-gray-600',
    'from-zinc-500 to-stone-600',
    'from-neutral-500 to-gray-600',
  ];

  try {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  } catch {
    // If any error occurs, return the default gradient
    return 'from-violet-400 to-green-400';
  }
};
