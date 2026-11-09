import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '@/components/SideNav';
import MobileBottomNav from '@/components/MobileBottomNav';
import AppTopBar from '@/components/AppTopBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSession } from '@/lib/useSession';
import { useLang } from '@/lib/i18n';
import { ROLE } from '@/lib/format';

const NAV = [
  { to: '/dashboard', ar: 'الرئيسية', en: 'Home' },
  { to: '/palms', ar: 'نخيلي', en: 'My Palms' },
  { to: '/health', ar: 'صحة النخيل', en: 'Palm Health' },
  { to: '/weevil', ar: 'السوسة الحمراء', en: 'Red Palm Weevil' },
  { to: '/map', ar: 'الخريطة الذكية', en: 'Smart Map' },
  { to: '/waste', ar: 'المخلفات', en: 'Waste' },
  { to: '/collection', ar: 'مسار الجمع', en: 'Smart Collection' },
  { to: '/circular', ar: 'الاستفادة والتدوير', en: 'Circular Economy' },
  { to: '/store', ar: 'متجر سعفة', en: 'SA’FA Store' },
  { to: '/impact', ar: 'الأثر', en: 'Impact' },
  { to: '/alerts', ar: 'التنبيهات', en: 'Alerts' },
  { to: '/authority', ar: 'لوحة الجهات المختصة', en: 'Authority dashboard' },
  { to: '/facility', ar: 'منشأة التدوير', en: 'Recycling facility' },
  { to: '/admin', ar: 'لوحة الإدارة', en: 'Admin' },
  { to: '/methodology', ar: 'منهجية سعفة', en: 'Methodology' },
];

export default function AppShell() {
  const { role } = useSession();
  const { L, isAr } = useLang();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-safa-cream">
        <SideNav role={role} />
        <div className="lg:ps-[248px] xl:ps-[268px]">
          <AppTopBar role={role} onOpenNav={() => setNavOpen(true)} />
          <main className="mx-auto max-w-[1400px] px-4 pb-28 pt-6 md:px-6 md:pb-16">
            <Outlet />
          </main>
          <AppFooterNote role={role} />
        </div>
        <MobileBottomNav />

        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side={isAr ? 'right' : 'left'} className="w-[280px] border-0 bg-safa-palmDeep p-0 text-safa-cream">
            <div className="flex h-full flex-col px-4 py-5">
              <p className="px-2 pb-4 font-display text-lg font-semibold">
                SA’FA <span className="text-xs font-normal text-safa-sand">| {L('سعفة', 'SA’FA')}</span>
              </p>
              <nav className="flex-1 overflow-y-auto no-scrollbar">
                {NAV.map((n) => (
                  <button
                    key={n.to}
                    onClick={() => {
                      window.history.pushState({}, '', n.to);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      setNavOpen(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2.5 text-start text-[13px] text-safa-cream/80 transition hover:bg-white/10"
                  >
                    {isAr ? n.ar : n.en}
                  </button>
                ))}
              </nav>
              <p className="px-3 pt-4 text-[10px] text-safa-cream/40">
                {isAr ? (ROLE[role]?.ar || ROLE.visitor.ar) : (ROLE[role]?.en || ROLE.visitor.en)} · {L('نسخة تجريبية', 'Prototype')}
              </p>
            </div>
          </SheetContent>
        </Sheet>
    </div>
  );
}

function AppFooterNote({ role }) {
  const { L, isAr } = useLang();
  return (
    <footer className="border-t border-safa-line px-4 pb-28 pt-5 text-[10px] text-safa-ink/40 md:px-6 lg:pb-8">
      <p>
        SA’FA | سعفة — {L('من إرث الأحساء، نبني منظومة زراعية مستدامة.', 'From Al-Ahsa’s Heritage, We Build a Sustainable Agricultural Ecosystem.')} ·{' '}
        {L('نسخة تجريبية | بيئة عرض', 'Prototype | Demo Environment')} · {isAr ? ROLE[role]?.ar : ROLE[role]?.en}
      </p>
    </footer>
  );
}