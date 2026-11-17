import { useQuery } from '@tanstack/react-query';
import { fetchCurrentProgram } from '../api/programApi';

export const CURRENT_PROGRAM_QUERY_KEY = ['program', 'current'] as const;

export function useCurrentProgram() {
  return useQuery({ queryKey: CURRENT_PROGRAM_QUERY_KEY, queryFn: fetchCurrentProgram });
}
