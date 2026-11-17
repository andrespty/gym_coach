import { SectionLabel } from '@/components/ui';

interface BulletListProps {
  title: string;
  items: readonly string[];
}

/** A titled bullet list that renders nothing when empty. */
export function BulletList({ title, items }: BulletListProps) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>{title}</SectionLabel>
      <ul className="text-ink-soft flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
