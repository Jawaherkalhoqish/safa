import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, Factory, Package, Recycle, Sprout } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import DemoTag from '@/components/DemoTag';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { useAggregate, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { CIRCULAR_PATHS, PATHWAYS } from '@/lib/platform';
import { WASTE_TYPE, num } from '@/lib/format';

const FLOW = [
  { icon: Recycle, ar: 'مخلفات النخيل', en: 'Palm waste' },
  { icon: Factory, ar: 'المعالجة', en: 'Processing' },
  { icon: Sprout, ar: 'مادة جديدة', en: 'New material' },
  { icon: Package, ar: 'منتج جديد', en: 'New product' },
];

export default function Circular() {
  const { L, isAr } = useLang();
  const { items: products } = useList('Product', {}, { limit: 60, sort: '-created_date' });
  const { rows } = useAggregate('WasteRecord', {}, 'waste_type', ['quantity_tons']);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const byType = useMemo(() => {
    const map = {};
    rows.forEach((r) => { map[r.waste_type] = r.sum_quantity_tons || 0; });
    return map;
  }, [rows]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('الاقتصاد الدائري', 'CIRCULAR ECONOMY')}
        title={L('الاستفادة والتدوير', 'Circular Economy')}
        subtitle={L('تحويل المخلفات إلى مادة جديدة ثم إلى منتج دائري يمكن تتبعه من النخلة إلى المتجر.', 'Turning waste into new material and then into a circular product traceable from the palm to the store.')}
        actions={<DemoTag />}
      />

      <div className="panel p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {FLOW.map((s, i) => (
            <div key={s.en} className="relative rounded-2xl border border-safa-line bg-safa-cream/60 p-5">
              <s.icon className="h-5 w-5 text-safa-olive" />
              <p className="mt-4 text-[13px] font-medium text-safa-palm">{L(s.ar, s.en)}</p>
              <span className="mt-1 block font-display text-[10px] text-safa-earth">{String(i + 1).padStart(2, '0')}</span>
              {i < FLOW.length - 1 ? (
                <Arrow className="absolute -end-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-safa-sand sm:block" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
          <ArrowDown className="h-4 w-4 text-safa-sand" />
          <span className="text-[10px] text-safa-ink/45">{L('المسار من المخلفات إلى المنتج', 'Path from waste to product')}</span>
        </div>
      </div>

      <Panel title={L('المسارات الدائرية المحتملة', 'Potential circular pathways')} subtitle={L('مرتبطة بمصدر المادة المتاح في المزارع', 'Linked to the material sources available on farms')} icon={Recycle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CIRCULAR_PATHS.map((p) => (
            <div key={p.en} className="rounded-2xl border border-safa-line bg-white p-5 transition hover:border-safa-sand hover:shadow-md">
              <div className="flex items-start justify-between">
                <p.icon className="h-5 w-5 text-safa-olive" />
                <span className="display-num text-xl text-safa-palm">{num(byType[p.from] || 0, 1)}</span>
              </div>
              <p className="mt-4 text-[13px] font-semibold text-safa-palm">{L(p.ar, p.en)}</p>
              <p className="mt-1 text-[11px] text-safa-ink/55">
                {L('المصدر', 'Source')}: {L(WASTE_TYPE[p.from].ar, WASTE_TYPE[p.from].en)} · {L('طن', 'tons')}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={L('مسارات المعالجة البيولوجية', 'Bio-risk processing pathways')} subtitle={L('التصنيف يحدد المسار المناسب', 'Classification determines the appropriate pathway')} icon={Factory}>
        <div className="grid gap-4 lg:grid-cols-3">
          {PATHWAYS.map((p) => (
            <div
              key={p.key}
              className={`rounded-2xl border p-5 ${
                p.tone === 'green' ? 'border-safa-okLine bg-safa-okBg/60' : p.tone === 'amber' ? 'border-safa-warnLine bg-safa-warnBg/70' : 'border-safa-dangerLine bg-safa-dangerBg/60'
              }`}
            >
              <p className="text-[13px] font-semibold text-safa-palm">{L(p.ar.title, p.en.title)}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-safa-ink/65">{L(p.ar.body, p.en.body)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-safa-earth">
          {L(
            'عند الاشتباه في إصابة المخلفات، لا تُصنَّف تلقائيًا كآمنة للتدوير القياسي، بل تُوجَّه إلى مسار تحقق أو مسار معالجة خاص.',
            'When infestation is suspected, waste is not automatically labelled safe for ordinary recycling; it is routed to verification or a special treatment pathway.'
          )}
        </p>
      </Panel>

      <Panel title={L('منتجات دائرية من متجر سعفة', 'Circular products from the SA’FA store')} icon={Package} action={<Button asChild variant="outline" className="border-safa-line text-xs text-safa-palm"><Link to="/store">{L('المتجر بالكامل', 'Full store')}</Link></Button>}>
        {!products.length ? (
          <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}