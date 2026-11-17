export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <p role="status" className="text-muted py-12 text-center text-sm">
      {label}
    </p>
  );
}
