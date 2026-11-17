import { Card, SectionLabel } from '@/components/ui';

export function CoachNotes({ notes }: { notes: readonly string[] }) {
  if (notes.length === 0) return null;
  return (
    <Card className="flex flex-col gap-2">
      <SectionLabel>Coach notes</SectionLabel>
      <ul className="text-ink-soft flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </Card>
  );
}
