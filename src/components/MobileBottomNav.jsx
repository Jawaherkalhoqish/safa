import { NavLink } from 'react-router-dom';
import { Bell, Boxes, LayoutDashboard, MapPin, Sprout } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, ar: 'الرئيسية', en: 'Home' },
  { to: '/palms', icon: Sprout, ar: 'نخيلي', en: 'Palms' },
  { to: '/map', icon: MapPin, ar: 'الخريطة', en: 'Map' },
  { to: '/waste', icon: Boxes, ar: 'المخلفات', en: 'Waste' },
  { to: '/alerts', icon: Bell, ar: 'التنبيهات', en: 'Alerts' },
];

export default function MobileBottomNav() {
  const { isAr } = useLang();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-safa-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] transition',
                isActive ? 'text-safa-palm' : 'text-safa-ink/55'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('rounded-xl px-3 py-1 transition', isActive && 'bg-safa-palm/10')}>
                  <it.icon className="h-[18px] w-[18px]" />
                </span>
                {isAr ? it.ar : it.en}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}