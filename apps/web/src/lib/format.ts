import { fromKg, type WeightUnit } from '@gym-coach/core';

export function formatWeight(kg: number, unit: WeightUnit): string {
  const value = fromKg(kg, unit);
  const rounded = unit === 'kg' ? Math.round(value * 2) / 2 : Math.round(value);
  return `${rounded} ${unit}`;
}

/** 1452 → "24:12", 3725 → "1:02:05" */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}
