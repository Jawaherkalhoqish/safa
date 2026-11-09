import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import BrandLogo from '@/components/BrandLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

export const SITE_SECTIONS = [
  { id: 'about', ar: 'عن سعفة', en: 'About SA’FA' },
  { id: 'how', ar: 'كيف تعمل سعفة', en: 'How it works' },
  { id: 'services', ar: 'خدماتنا', en: 'Services' },
  { id: 'subscriptions', ar: 'الاشتراكات', en: 'Subscriptions' },
  { id: 'contact', ar: 'تواصل معنا', en: 'Contact' },
];

export default function SiteHeader({ solid = false }) {
  const { L, toggle, isAr } = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const opaque = solid || scrolled || open;

  const goSection = useCallback(
    (id) => {
      setOpen(false);
      if (pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate(`/#${id}`);
      }
    },
    [pathname, navigate]
  );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        opaque ? 'border-b border-white/10 bg-safa-palmDeep/92 backdrop-blur-xl' : 'bg-gradient-to-b from-black/45 to-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <BrandLogo tone="onDark" className="h-9 md:h-10" />
          <span className="font-display text-sm font-semibold tracking-[0.16em] text-safa-bone/85">SA’FA</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="link-underline text-[13px] text-safa-bone/80 transition hover:text-safa-bone">
            {L('الرئيسية', 'Home')}
          </Link>
          {SITE_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goSection(s.id)}
              className="link-underline text-[13px] text-safa-bone/80 transition hover:text-safa-bone"
            >
              {isAr ? s.ar : s.en}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle tone="onDark" className="hidden sm:flex" />
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-safa-bone/90 transition hover:bg-white/10"
            aria-label={L('تغيير اللغة', 'Switch language')}
          >
            <Globe className="h-3.5 w-3.5" />
            {isAr ? 'EN' : 'ع'}
          </button>
          <Link
            to="/access"
            className="hidden rounded-full bg-safa-bone px-4 py-2 text-xs font-semibold text-safa-palmDeep transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_26px_-14px_rgba(251,249,242,0.7)] sm:block"
          >
            {L('اكتشف سعفة', 'Explore SA’FA')}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/20 p-2 text-safa-bone lg:hidden"
            aria-label={L('القائمة', 'Menu')}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-5 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-sm text-safa-bone/85">
              {L('الرئيسية', 'Home')}
            </Link>
            {SITE_SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goSection(s.id)}
                className="rounded-lg px-2 py-2.5 text-start text-sm text-safa-bone/85"
              >
                {isAr ? s.ar : s.en}
              </button>
            ))}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5">
              <span className="text-xs text-safa-bone/60">{L('المظهر', 'Appearance')}</span>
              <ThemeToggle tone="onDark" />
            </div>
            <Link
              to="/access"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-safa-bone px-4 py-2.5 text-center text-sm font-semibold text-safa-palmDeep"
            >
              {L('اكتشف سعفة', 'Explore SA’FA')}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}