import { useEffect, useMemo, useState } from 'react';
import { Leaf, Package, Search, ShoppingBag } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import Panel from '@/components/Panel';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { ORDER_STATUS, PRODUCT_CATEGORY, dateStr, money, num, pick } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function Store() {
  const { L, lang } = useLang();
  const { items: products, loading } = useList('Product', {}, { limit: 60, sort: '-created_date' });
  const [category, setCategory] = useState('all');
  const [q, setQ] = useState('');
  const [orders, setOrders] = useState([]);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ok = await base44.auth.isAuthenticated();
        setAuthed(!!ok);
        if (ok) {
          const page = await base44.entities.Order.filter({}, { limit: 20, sort: '-created_date' });
          setOrders(page?.items ?? []);
        }
      } catch (e) {
        /* anonymous demo visitor: order history stays hidden */
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!term) return true;
      return [p.name_ar, p.name_en, p.description_ar, p.description_en, p.facility_name, p.source_material]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [products, category, q]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('متجر سعفة', 'SA’FA STORE')}
        title={L('متجر سعفة', 'SA’FA Store')}
        subtitle={L('من مخلفات النخيل.. منتجات جديدة', 'From palm waste… new products')}
        actions={<DemoTag />}
      />

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-safa-ink/40 start-3" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('ابحث في المنتجات…', 'Search products…')} className="h-9 ps-9 text-xs" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', category === 'all' ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/60')}
          >
            {L('الكل', 'All')}
          </button>
          {Object.entries(PRODUCT_CATEGORY).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCategory(k)}
              className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', category === k ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/60')}
            >
              {L(v.ar, v.en)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('منتجات دائرية', 'Circular products')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(products.length)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('فئات المتجر', 'Store categories')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(Object.keys(PRODUCT_CATEGORY).length)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('منشآت منتجة', 'Producing facilities')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(new Set(products.map((p) => p.facility_id)).size)}</p>
        </div>
      </div>

      {loading ? <LoadingState /> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          icon={Package}
          title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')}
          body={L('لا توجد منتجات مطابقة للفلاتر الحالية.', 'No products match the current filters.')}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <Panel
        title={L('سجل طلباتك', 'Your orders')}
        icon={ShoppingBag}
        subtitle={authed ? L('الطلبات المرتبطة بحسابك', 'Orders linked to your account') : L('سجّل الدخول لعرض سجل طلباتك', 'Sign in to view your order history')}
      >
        {!authed ? (
          <p className="text-xs text-safa-ink/55">
            {L('الطلبات في هذه النسخة تعمل بوضع تجريبي، ويمكن إتمامها دون حساب.', 'Orders in this prototype run in demo mode and can be completed without an account.')}
          </p>
        ) : !orders.length ? (
          <EmptyState icon={Leaf} title={L('لا توجد طلبات بعد', 'No orders yet')} body={L('أضف منتجًا إلى السلة لإتمام أول طلب.', 'Add a product to the cart to place your first order.')} />
        ) : (
          <ul className="space-y-2.5">
            {orders.map((o) => {
              const st = ORDER_STATUS[o.status] || ORDER_STATUS.placed;
              return (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-safa-line bg-white p-3.5">
                  <div>
                    <p className="text-[12px] font-medium text-safa-palm">{o.order_code} · {o.product_name}</p>
                    <p className="mt-0.5 text-[10px] text-safa-ink/50">{o.facility_name} · {num(o.quantity)} × · {dateStr(o.created_date, lang, true)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-safa-palm">{money(o.total, lang)}</span>
                    <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <p className="text-[10px] text-safa-ink/40">
        {L('كل منتج مرتبط بمصدر مادة من مخلفات نخيل الأحساء — اضغط «تعرف على رحلة المادة» لعرض الرحلة.', 'Every product is linked to a material source from Al-Ahsa palm waste — open “See the material journey” to follow it.')}
        {pick(PRODUCT_CATEGORY, 'fiber', lang) ? '' : ''}
      </p>
    </div>
  );
}