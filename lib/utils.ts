import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getWordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

export function getReadTime(content: string): number {
  return Math.max(1, Math.ceil(getWordCount(content) / 200));
}

export async function slow(delay: number = 700) {
  await new Promise(resolve => {
    return setTimeout(resolve, delay);
  });
}
