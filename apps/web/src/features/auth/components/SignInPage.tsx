import { useMutation } from '@tanstack/react-query';
import { useId, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, ErrorState } from '@/components/ui';
import { sendMagicLink } from '../api/authApi';
import { useSession } from '../hooks/useSession';

export function SignInPage() {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const { session } = useSession();
  const send = useMutation({ mutationFn: sendMagicLink });

  if (session) return <Navigate to="/" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send.mutate(email.trim());
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Gym Coach</h1>
        <p className="text-ink-soft">Sign in with a one-time link sent to your email.</p>
      </div>

      {send.isSuccess ? (
        <p role="status" className="text-ink-soft">
          Check <strong className="text-ink">{email}</strong> for your sign-in link.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label
            htmlFor={emailId}
            className="text-muted text-xs font-semibold uppercase tracking-wider"
          >
            Email
          </label>
          <input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-surface border-line focus:border-accent h-12 rounded-xl border px-3 outline-none"
          />
          <Button type="submit" fullWidth disabled={send.isPending}>
            {send.isPending ? 'Sending…' : 'Send sign-in link'}
          </Button>
          {send.error && <ErrorState error={send.error} />}
        </form>
      )}
    </main>
  );
}
