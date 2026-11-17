import { EmptyState, PageHeader } from '@/components/ui';

/** Planned: chat with the coach, weekly check-ins and program-change proposals. See docs/PLAN.md. */
export function CoachPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Coach" />
      <EmptyState
        title="Coming next"
        description="Ask your coach about your training, get a weekly check-in, and review any changes it proposes to your program. Nothing changes without your approval."
      />
    </div>
  );
}
