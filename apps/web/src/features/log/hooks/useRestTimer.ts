import { useEffect, useState } from 'react';

/** Countdown for rest between sets. `remaining` is null when no timer is running. */
export function useRestTimer() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endsAt === null) return;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [endsAt]);

  const remainingMs = endsAt === null ? null : endsAt - now;
  const isRunning = remainingMs !== null && remainingMs > 0;

  return {
    remaining: isRunning ? Math.ceil(remainingMs / 1000) : null,
    start: (seconds: number) => {
      setNow(Date.now());
      setEndsAt(Date.now() + seconds * 1000);
    },
    addSeconds: (seconds: number) =>
      setEndsAt((current) => (current === null ? null : current + seconds * 1000)),
    skip: () => setEndsAt(null),
  };
}
