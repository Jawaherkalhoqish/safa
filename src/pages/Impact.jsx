import { useMemo } from 'react';
import { BarChart3, Boxes, Coins, Flame, Package, Recycle, Truck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard from '@/components/StatCard';
import DemoTag from '@/components/DemoTag';
import { Progress } from '@/components/ui/progress';
import { useAggregate, useCount, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { WASTE_STATUS, money, num } from '@/lib/format';

export default function Impact() {
  const { L, lang } = useLang();
  const { rows } = useAggregate('WasteRecord', {}, 'status', ['quantity_tons', 'estimated_value']);
  const { items: requests } = useList('CollectionRequest', {}, { limit: 200, sort: '-created_date' });
  const products = useCount('Product', {});

  const stats = useMemo(() => {
    const map = {};
    rows.forEach((r) => { map[r.status] = r; });
    const tons = (keys) => keys.reduce((a, k) => a + (map[k]?.sum_quantity_tons || 0), 0);
    const value = (keys) => keys.reduce((a, k) => a + (map[k]?.sum_estimated_value || 0), 0);
    const total = tons(['recycled', 'collected', 'processing', 'burning_risk', 'ready', 'scheduled', 'needs_verification', 'special_pathway', 'routed']);
    const recycled = tons(['recycled']);
    const processed = tons(['collected', 'processing', 'recycled', 'routed']);
    const risk = tons(['burning_risk']);
    return {
      total,
      recycled,
      processed,
      risk,
      diverted: tons(['recycled', 'collected', 'processing', 'routed']),
      value: value(['recycled', 'collected', 'processing']),
      recycledShare: total ? Math.round((recycled / total) * 100) : 0,
      divertedShare: total ? Math.round(((total - risk) / total) * 100) : 0,
    };
  }, [rows]);

  const bars = [
    { ar: 'المخلفات الموجهة بعيدًا عن التخلص غير المناسب', en: 'Waste diverted from improper disposal', tons: stats.diverted, pct: stats.divertedShare, color: '#2F5D3F' },
    { ar: 'المخلفات المعاد تدويرها', en: 'Recycled waste', tons: stats.recycled, pct: stats.recycledShare, color: '#4A7C59' },
    { ar: 'المخلفات قيد المعالجة', en: 'Waste in processing', tons: stats.processed, pct: stats.total ? Math.round((stats.processed / stats.total) * 100) : 0, color: '#C8A15A' },
    { ar: 'المخلفات المعرضة للحرق', en: 'Waste exposed to burning', tons: stats.risk, pct: stats.total ? Math.round((stats.risk / stats.total) * 100) : 0, color: '#B03A2E' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('القياس', 'MEASUREMENT')}
        title={L('الأثر البيئي', 'Environmental Impact')}
        subtitle={L('قياس ما تم توجيهه بعيدًا عن التخلص غير المناسب، وما تم تدويره، وعمليات الجمع، والقيمة الدائرية.', 'Measuring what has been diverted from improper disposal, recycled, collected and created as circular value.')}
        actions={<DemoTag />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label={L('مخلفات موجهة لدوائر آمنة', 'Diverted to safe pathways')} value={stats.diverted} decimals={1} suffix={L(' طن', ' t')} icon={Recycle} tone="olive" demo />
        <StatCard label={L('مخلفات معاد تدويرها', 'Recycled')} value={stats.recycled} decimals={1} suffix={L(' طن', ' t')} icon={Recycle} demo />
        <StatCard label={L('مخلفات معالجة', 'Processed')} value={stats.processed} decimals={1} suffix={L(' طن', ' t')} icon={Boxes} demo />
        <StatCard label={L('عمليات الجمع', 'Collection operations')} value={requests.length} icon={Truck} demo />
        <StatCard label={L('منتجات دائرية', 'Circular products')} value={products} icon={Package} tone="gold" demo />
        <StatCard label={L('القيمة الدائرية التقديرية', 'Estimated circular value')} value={stats.value} suffix={L(' ر.س', ' SAR')} icon={Coins} tone="gold" demo />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Panel title={L('مؤشرات الأثر', 'Impact indicators')} icon={BarChart3} subtitle={L('بيانات تجريبية | Demo Data', 'Demo Data')}>
          <ul className="space-y-5">
            {bars.map((b) => (
              <li key={b.en}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-safa-ink/70">{L(b.ar, b.en)}</span>
                  <span className="display-num text-base text-safa-palm">{num(b.tons, 1)} {L('طن', 't')}</span>
                </div>
                <Progress value={b.pct} className="mt-2 h-2 bg-safa-mist" indicatorClassName="bg-safa-palm" />
                <p className="mt-1 text-[10px] text-safa-ink/45">{b.pct}% {L('من إجمالي المخلفات المسجلة', 'of total recorded waste')}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel title={L('ملخص الأثر', 'Impact summary')} icon={Flame}>
            <p className="text-sm leading-relaxed text-safa-ink/70">
              {L(
                `${stats.recycledShare}% من المخلفات المسجلة تم تدويرها، و${stats.divertedShare}% تم توجيهها بعيدًا عن التخلص غير المناسب.`,
                `${stats.recycledShare}% of recorded waste has been recycled and ${stats.divertedShare}% has been diverted from improper disposal.`
              )}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                <p className="text-safa-ink/50">{L('إجمالي المخلفات المسجلة', 'Total recorded waste')}</p>
                <p className="display-num mt-1 text-xl text-safa-palm">{num(stats.total, 1)} {L('طن', 't')}</p>
              </div>
              <div className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                <p className="text-safa-ink/50">{L('القيمة التقديرية', 'Estimated value')}</p>
                <p className="display-num mt-1 text-xl text-safa-gold">{money(stats.value, lang)}</p>
              </div>
            </div>
          </Panel>

          <Panel title={L('مؤشر الكربون', 'Carbon indicator')}>
            <p className="text-[12px] leading-relaxed text-safa-ink/65">
              {L(
                'لا تُعرض في هذه النسخة أرقام أرصدة كربون دقيقة. أي مؤشر تقديري يُعرض بوصفه:',
                'This prototype does not display exact carbon-credit figures. Any estimate is labelled:'
              )}
            </p>
            <p className="mt-3 inline-flex rounded-full border border-safa-sand bg-safa-sandSoft/60 px-3 py-1.5 text-[11px] font-medium text-safa-earth">
              {L('مؤشر تقديري أولي | Estimated Prototype Indicator', 'Estimated Prototype Indicator')}
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-safa-ink/45">
              {L(
                'القياس النهائي للأثر يحتاج بيانات تشغيلية موثقة من المنشآت والجهات المختصة.',
                'A final impact measurement requires verified operational data from facilities and authorities.'
              )}
            </p>
          </Panel>

          <Panel title={L('حالات المخلفات', 'Waste states')}>
            <ul className="grid grid-cols-2 gap-3 text-[11px]">
              {['recycled', 'collected', 'processing', 'burning_risk'].map((k) => {
                const map = {};
                rows.forEach((r) => { map[r.status] = r; });
                return (
                  <li key={k} className="rounded-xl border border-safa-line bg-white p-3">
                    <p className="text-safa-ink/50">{L(WASTE_STATUS[k].ar, WASTE_STATUS[k].en)}</p>
                    <p className="display-num mt-1 text-lg text-safa-palm">{num(map[k]?.sum_quantity_tons || 0, 1)} {L('طن', 't')}</p>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}