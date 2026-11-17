import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '@/features/profile';
import { ErrorState, LoadingState } from '@/components/ui';

export function RequireOnboarded() {
  const { data: profile, isLoading, error } = useProfile();
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile?.onboardedAt) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
