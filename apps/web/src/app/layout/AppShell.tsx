import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

/** Layout for the main tabs: page content plus the bottom navigation. */
export function AppShell() {
  return (
    <div className="mx-auto min-h-dvh max-w-md px-5 pb-28 pt-6">
      <Outlet />
      <BottomNav />
    </div>
  );
}
