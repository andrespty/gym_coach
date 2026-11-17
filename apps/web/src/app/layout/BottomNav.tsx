import { NavLink } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from './navItems';

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="border-line-soft bg-ground/95 fixed inset-x-0 bottom-0 border-t backdrop-blur"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'min-h-13 flex flex-col items-center justify-center gap-1 text-xs font-semibold',
                  isActive ? 'text-accent' : 'text-muted hover:text-ink-soft',
                )
              }
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
