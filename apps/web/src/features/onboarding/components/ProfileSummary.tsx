import type { AthleteProfile } from '@gym-coach/core';
import { Card, SectionLabel } from '@/components/ui';
import { BulletList } from './BulletList';

/** The coach's read of the athlete, shown for confirmation before a program is built. */
export function ProfileSummary({ profile }: { profile: AthleteProfile }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-ink leading-relaxed">{profile.summary}</p>
      <SectionLabel>Level: {profile.experienceLevel}</SectionLabel>

      {profile.goals.map((goal) => (
        <Card key={goal.title} className="flex flex-col gap-1">
          <SectionLabel>{goal.priority}</SectionLabel>
          <h2 className="text-lg font-semibold">{goal.title}</h2>
          <p className="text-ink-soft text-sm leading-relaxed">{goal.assessment}</p>
        </Card>
      ))}

      <BulletList title="Trade-offs" items={profile.conflicts} />
      <BulletList title="Rules from your limitations" items={profile.constraints} />
      <BulletList title="Questions for you" items={profile.missingInformation} />
    </div>
  );
}
