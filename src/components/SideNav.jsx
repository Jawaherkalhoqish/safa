import { BadgeCheck, BarChart3, Bell, Boxes, Factory, FileText, LayoutDashboard, LandPlot, MapPin, PlayCircle, Recycle, ScanLine, Settings, ShieldAlert, ShoppingBag, Sprout, Activity, Truck, Users, Globe, LogIn } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import BrandLogo from '@/components/BrandLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { ROLE } from '@/lib/format';

const GROUPS = [
  {
    ar: 'المراقبة', en: 'Monitoring',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, ar: 'الرئيسية', en: 'Home' },
      { to: '/palms', icon: Sprout, ar: 'نخيلي', en: 'My Palms' },
      { to: '/health', icon: Activity, ar: 'صحة النخيل', en: 'Palm Health' },
      { to: '/analysis', icon: ScanLine, ar: 'تحليل صور النخيل بالذكاء الاصطناعي', en: 'AI Palm Image Analysis' },
      { to: '/weevil', icon: ShieldAlert, ar: 'السوسة الحمراء', en: 'Red Palm Weevil' },
      { to: '/map', icon: MapPin, ar: 'الخريطة الذكية', en: 'Smart Map' },
    ],
  },
  {
    ar: 'المخلفات والاقتصاد الدائري', en: 'Waste & circular economy',
    items: [
      { to: '/waste', icon: Boxes, ar: 'المخلفات', en: 'Waste' },
      { to: '/collection', icon: Truck, ar: 'مسار الجمع', en: 'Smart Collection' },
      { to: '/circular', icon: Recycle, ar: 'الاستفادة والتدوير', en: 'Circular Economy' },
      { to: '/store', icon: ShoppingBag, ar: 'متجر سعفة', en: 'SA’FA Store' },
      { to: '/lands', icon: LandPlot, ar: 'الأراضي الزراعية', en: 'Agricultural Lands' },
      { to: '/community', icon: Users, ar: 'المجتمع الزراعي', en: 'Agricultural Community' },
    ],
  },
  {
    ar: 'القياس والإدارة', en: 'Insight & operations',
    items: [
      { to: '/impact', icon: BarChart3, ar: 'الأثر', en: 'Impact' },
      { to: '/alerts', icon: Bell, ar: 'التنبيهات', en: 'Alerts' },
      { to: '/facility', icon: Factory, ar: 'منشأة التدوير', en: 'Facility', roles: ['facility', 'admin', 'visitor'] },
      { to: '/admin', icon: Settings, ar: 'لوحة الإدارة', en: 'Admin', roles: ['admin'] },
      { to: '/methodology', icon: FileText, ar: 'منهجية سعفة', en: 'Methodology' },
    ],
  },
];

export default function SideNav({ role }) {
  const { L, isAr, toggle } = useLang();
  const roleLabel = ROLE[role] || ROLE.visitor;

  const visible = (item) => !item.roles || item.roles.includes(role);

  return (
    <aside className="fixed inset-y-0 start-0 z-40 hidden w-[248px] flex-col border-e border-white/10 bg-safa-palmDeep text-safa-cream lg:flex xl:w-[268px]">
      <div className="flex items-center gap-3 px-5 py-5">
        <BrandLogo tone="onDark" className="h-8" />
        <p className="font-display text-sm font-semibold tracking-[0.16em] text-safa-cream/85">SA’FA</p>
      </div>

      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
        <p className="text-[10px] text-safa-cream/50">{L('وضع الدخول الحالي', 'Current access')}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <BadgeCheck className="h-3.5 w-3.5 text-safa-gold" />
            {isAr ? roleLabel.ar : roleLabel.en}
          </span>
          <NavLink to="/access" className="text-[10px] text-safa-gold underline-offset-2 hover:underline">
            {L('تغيير', 'Change')}
          </NavLink>
        </div>
      </div>

      <NavLink
        to="/tour"
        className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-safa-gold/15 px-3.5 py-3 text-sm font-medium text-safa-goldSoft transition hover:bg-safa-gold/25"
      >
        <PlayCircle className="h-4 w-4" />
        {L('الجولة التعريفية', 'Guided tour')}
      </NavLink>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 no-scrollbar">
        {GROUPS.map((g) => {
          const items = g.items.filter(visible);
          if (!items.length) return null;
          return (
            <div key={g.en} className="mb-5">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-safa-cream/35">
                {isAr ? g.ar : g.en}
              </p>
              <div className="space-y-0.5">
                {items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition',
                        isActive ? 'bg-safa-bone text-safa-palmDeep shadow-sm' : 'text-safa-cream/70 hover:bg-white/8 hover:text-safa-cream'
                      )
                    }
                  >
                    <it.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{isAr ? it.ar : it.en}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] text-safa-cream/40">
            <p>{L('نسخة تجريبية | بيئة عرض', 'Prototype | Demo Environment')}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle tone="onDark" className="h-7 w-[54px]" />
            <button onClick={toggle} className="rounded-full border border-white/15 p-1.5 text-safa-cream/70 transition hover:bg-white/10" aria-label={L('تغيير اللغة', 'Switch language')}>
              <Globe className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <NavLink to="/login" className="mt-3 flex items-center gap-2 text-[11px] text-safa-cream/55 transition hover:text-safa-cream">
          <LogIn className="h-3.5 w-3.5" />
          {L('تسجيل الدخول', 'Sign in')}
        </NavLink>
      </div>
    </aside>
  );
}