import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/features/auth';
import { LoadingState } from '@/components/ui';

export function RequireAuth() {
  const { session, isLoading } = useSession();
  if (isLoading) return <LoadingState />;
  if (!session) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}
