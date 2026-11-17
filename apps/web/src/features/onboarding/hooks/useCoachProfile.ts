import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PROFILE_QUERY_KEY } from '@/features/profile';
import { confirmProfile, generateProfile, generateProgram } from '../api/onboardingApi';

/** Asks the coach for a profile, then (once the user confirms it) drafts their first program. */
export function useCoachProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const generate = useMutation({ mutationFn: generateProfile });

  const confirm = useMutation({
    mutationFn: async () => {
      if (!generate.data) throw new Error('No profile to confirm');
      await confirmProfile(generate.data);
      await generateProgram();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      navigate('/program');
    },
  });

  return { generate, confirm };
}
