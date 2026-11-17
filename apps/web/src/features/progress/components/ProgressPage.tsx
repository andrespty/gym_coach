import { EmptyState, PageHeader } from '@/components/ui';

/** Planned: goal charts (metric trend + projected date), consistency heatmap and PRs. See docs/PLAN.md. */
export function ProgressPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Progress" />
      <EmptyState
        title="Coming next"
        description="Charts for each goal, your consistency over time, and PRs from every type of training will appear here once you’ve logged a few sessions."
      />
    </div>
  );
}
