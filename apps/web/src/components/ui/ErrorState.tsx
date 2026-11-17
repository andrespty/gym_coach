export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Something went wrong.';
  return (
    <p role="alert" className="text-danger py-6 text-sm">
      {message}
    </p>
  );
}
