import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SessionState {
  session: Session | null;
  isLoading: boolean;
}

/** The current auth session, kept in sync with Supabase auth events. */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ session: null, isLoading: true });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setState({ session: data.session, isLoading: false }));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setState({ session, isLoading: false }),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  return state;
}
