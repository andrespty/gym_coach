import type { WeightUnit } from '../schemas/common.ts';

const LB_PER_KG = 2.2046226218;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function toKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : lbToKg(value);
}

export function fromKg(kg: number, unit: WeightUnit): number {
  return unit === 'kg' ? kg : kgToLb(kg);
}

export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}
