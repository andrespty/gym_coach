import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activateProgram } from '../api/programApi';
import { CURRENT_PROGRAM_QUERY_KEY } from './useCurrentProgram';

export function useActivateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CURRENT_PROGRAM_QUERY_KEY }),
  });
}
