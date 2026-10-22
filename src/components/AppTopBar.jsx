import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Globe, Menu, Search, ShoppingBag, Sprout } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useCount } from '@/lib/data';
import { ASSETS } from '@/lib/assets';
import { ROLE } from '@/lib/format';
import GlobalSearch from '@/components/GlobalSearch';
import { useCart } from '@/components/CartProvider';

export default function AppTopBar({ role, onOpenNav }) {
  const { L, isAr, toggle } = useLang();
  const [searchOpen, setSearchOpen] = useState(false);
  const newAlerts = useCount('Alert', { status: 'new' });
  const { count, setOpen } = useCart();
  const roleLabel = ROLE[role] || ROLE.visitor;

  return (
    <header className="sticky top-0 z-30 border-b border-safa-line bg-safa-cream/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button onClick={onOpenNav} className="rounded-xl border border-safa-line p-2 text-safa-palm lg:hidden" aria-label={L('القائمة', 'Menu')}>
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
          <img src={ASSETS.logo} alt="SA’FA" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-display text-sm font-semibold text-safa-palm">SA’FA</span>
        </Link>

        <button
          onClick={() => setSearchOpen(true)}
          className="group hidden flex-1 items-center gap-2 rounded-xl border border-safa-line bg-white px-3.5 py-2.5 text-start text-xs text-safa-ink/45 transition hover:border-safa-sand sm:flex sm:max-w-md"
        >
          <Search className="h-4 w-4" />
          {L('ابحث عن نخلة، مخلفات، تنبيه، منشأة أو منتج…', 'Search palm, waste, alert, facility or product…')}
          <span className="ms-auto rounded-md border border-safa-line px-1.5 py-0.5 text-[10px]">⌘K</span>
        </button>

        <div className="ms-auto flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} className="rounded-xl border border-safa-line bg-white p-2 text-safa-palm sm:hidden" aria-label={L('بحث', 'Search')}>
            <Search className="h-4 w-4" />
          </button>

          <button onClick={setOpen} className="relative rounded-xl border border-safa-line bg-white p-2 text-safa-palm" aria-label={L('السلة', 'Cart')}>
            <ShoppingBag className="h-4 w-4" />
            {count > 0 ? (
              <span className="absolute -end-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-safa-palm px-1 text-[9px] font-semibold text-safa-cream">
                {count}
              </span>
            ) : null}
          </button>

          <Link to="/alerts" className="relative rounded-xl border border-safa-line bg-white p-2 text-safa-palm" aria-label={L('التنبيهات', 'Alerts')}>
            <Bell className="h-4 w-4" />
            {newAlerts > 0 ? (
              <span className="absolute -end-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-safa-dangerFg px-1 text-[9px] font-semibold text-white">
                {newAlerts}
              </span>
            ) : null}
          </Link>

          <button onClick={toggle} className="rounded-xl border border-safa-line bg-white p-2 text-safa-palm" aria-label={L('تغيير اللغة', 'Switch language')}>
            <Globe className="h-4 w-4" />
          </button>

          <Link to="/access" className="hidden items-center gap-2 rounded-xl border border-safa-line bg-white px-3 py-2 text-[11px] font-medium text-safa-palm sm:flex">
            <Sprout className="h-3.5 w-3.5 text-safa-gold" />
            {isAr ? roleLabel.ar : roleLabel.en}
          </Link>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}