import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { saveWorkout } from '../api/logApi';

export function useSaveWorkout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: saveWorkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      navigate('/');
    },
  });
}
