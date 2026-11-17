import type { WeightUnit } from '@gym-coach/core';
import { useProfile } from './useProfile';

export function usePreferredUnit(): WeightUnit {
  return useProfile().data?.preferredUnit ?? 'kg';
}
