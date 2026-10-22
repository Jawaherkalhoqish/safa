import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { ASSETS } from '@/lib/assets';
import { cn } from '@/lib/utils';

export default function SiteHeader({ solid = false }) {
  const { L, toggle, isAr } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const opaque = solid || scrolled || open;
  const links = [
    { to: '/#how', label: L('كيف تعمل سعفة', 'How SA’FA works') },
    { to: '/methodology', label: L('منهجية سعفة', 'Methodology') },
    { to: '/authority', label: L('للواجهات المختصة', 'For authorities') },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        opaque ? 'border-b border-white/10 bg-safa-palmDeep/90 backdrop-blur-xl' : 'bg-gradient-to-b from-black/45 to-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={ASSETS.logo} alt="SA’FA" className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/25 md:h-11 md:w-11" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-safa-cream md:text-xl">SA’FA</span>
            <span className="block text-[10px] tracking-[0.3em] text-safa-sand">{isAr ? 'سعفة' : 'SA’FA | سعفة'}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="link-underline text-sm text-safa-cream/80 transition hover:text-safa-cream">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-safa-cream/90 transition hover:bg-white/10"
            aria-label={L('تغيير اللغة', 'Switch language')}
          >
            <Globe className="h-3.5 w-3.5" />
            {isAr ? 'EN' : 'ع'}
          </button>
          <Link
            to="/access"
            className="hidden rounded-full bg-safa-cream px-4 py-2 text-xs font-semibold text-safa-palm transition hover:bg-white sm:block"
          >
            {L('ابدأ مع سعفة', 'Explore SA’FA')}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/20 p-2 text-safa-cream md:hidden"
            aria-label={L('القائمة', 'Menu')}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-sm text-safa-cream/85">
                {l.label}
              </a>
            ))}
            <Link to="/access" onClick={() => setOpen(false)} className="mt-1 rounded-full bg-safa-cream px-4 py-2 text-center text-sm font-semibold text-safa-palm">
              {L('ابدأ مع سعفة', 'Explore SA’FA')}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}