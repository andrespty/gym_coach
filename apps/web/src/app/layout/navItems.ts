import type { IconName } from '@/components/ui';

export interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Today', icon: 'home' },
  { to: '/program', label: 'Program', icon: 'program' },
  { to: '/progress', label: 'Progress', icon: 'progress' },
  { to: '/coach', label: 'Coach', icon: 'coach' },
];
