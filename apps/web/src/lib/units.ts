import { lbToKg, type WeightUnit } from '@gym-coach/core';

const CM_PER_INCH = 2.54;
const KM_PER_MILE = 1.609344;

/** Imperial users (lb) also get inches and miles; metric users get cm and km. */
export function unitLabels(unit: WeightUnit) {
  return unit === 'lb'
    ? { weight: 'lb', length: 'in', distance: 'mi' }
    : { weight: 'kg', length: 'cm', distance: 'km' };
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? lbToKg(value) : value;
}

export function lengthToCm(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * CM_PER_INCH : value;
}

export function distanceToKm(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KM_PER_MILE : value;
}
