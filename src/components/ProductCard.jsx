import { Leaf, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import JourneySheet from '@/components/JourneySheet';
import { useCart } from '@/components/CartProvider';
import { useLang } from '@/lib/i18n';
import { PRODUCT_CATEGORY, money, num, pick } from '@/lib/format';

export default function ProductCard({ product }) {
  const { L, lang } = useLang();
  const { add } = useCart();
  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const description = lang === 'ar' ? product.description_ar : product.description_en;
  const inStock = (product.inventory || 0) > 0;

  return (
    <article className="panel group flex flex-col overflow-hidden transition duration-500 hover:-translate-y-1 hover:border-safa-sand hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-safa-mist">
        {product.image_url ? (
          <img src={product.image_url} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        ) : null}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <StatusBadge tone="sand" label={pick(PRODUCT_CATEGORY, product.category, lang)} className="bg-white/90" />
          <StatusBadge tone={inStock ? 'green' : 'red'} label={inStock ? L('متوفر', 'Available') : L('غير متوفر', 'Out of stock')} className="bg-white/90" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-semibold text-safa-palm">{name}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-safa-ink/60">{description}</p>

        <dl className="mt-4 space-y-1.5 text-[11px]">
          <div className="flex justify-between gap-2">
            <dt className="text-safa-ink/45">{L('مصدر المادة', 'Material source')}</dt>
            <dd className="text-end font-medium text-safa-palm">{product.source_material}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-safa-ink/45">{L('الكمية المستخدمة', 'Material used')}</dt>
            <dd className="font-medium text-safa-palm">{num(product.material_quantity_kg)} {L('كجم', 'kg')}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-safa-ink/45">{L('البائع', 'Seller')}</dt>
            <dd className="text-end font-medium text-safa-palm">{product.facility_name}</dd>
          </div>
        </dl>

        <p className="mt-3 flex items-start gap-1.5 rounded-xl border border-safa-okLine bg-safa-okBg/60 px-3 py-2 text-[10px] leading-relaxed text-safa-okFg">
          <Leaf className="mt-0.5 h-3 w-3 shrink-0" />
          {lang === 'ar' ? product.sustainability_ar : product.sustainability_en}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="display-num text-xl text-safa-palm">{money(product.price, lang)}</p>
          <p className="text-[10px] text-safa-ink/45">{L('المخزون', 'Inventory')} {num(product.inventory)}</p>
        </div>

        <div className="mt-4 grid gap-2">
          <Button onClick={() => add(product)} disabled={!inStock} className="w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            <ShoppingBag className="me-2 h-4 w-4" />
            {L('أضف للسلة', 'Add to cart')}
          </Button>
          <JourneySheet product={product} />
        </div>
      </div>
    </article>
  );
}