import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, ArrowLeft, ArrowRight, Bell, Boxes, Coins, Flame, Gauge, Recycle, ShieldCheck, Sprout, Truck, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard from '@/components/StatCard';
import WasteCharts from '@/components/WasteCharts';
import PalmCard from '@/components/PalmCard';
import AlertRow from '@/components/AlertRow';
import DemoTag from '@/components/DemoTag';
import StartFarmSteps from '@/components/StartFarmSteps';
import AddPalmDialog from '@/components/AddPalmDialog';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { useAggregate, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { useSession } from '@/lib/useSession';
import { CIRCULAR_PATHS } from '@/lib/platform';
import { WASTE_STATUS, WASTE_TYPE, daysLeft, money, num } from '@/lib/format';
import { base44 } from '@/api/base44Client';

const STATUS_ORDER = ['recycled', 'collected', 'processing', 'burning_risk'];
const TYPE_ORDER = ['fronds', 'trunks', 'fiber', 'other'];

export default function Dashboard() {
  const { L, isAr, lang } = useLang();
  const { isVisitor, role } = useSession();
  const { items: farms, loading: farmsLoading } = useList('Farm', {}, { limit: 20, sort: 'name' });
  const [farmId, setFarmId] = useState('');
  const [pathway, setPathway] = useState(null);

  const farm =
    farms.find((f) => f.id === farmId) ||
    farms.find((f) => (f.name_en || '').includes('Al-Ahsa')) ||
    farms.find((f) => (f.name || '').includes('الواحة')) ||
    farms[0];

  const byStatus = useAggregate('WasteRecord', farm ? { farm_id: farm.id } : { farm_id: 'none' }, 'status', ['quantity_tons', 'estimated_value']);
  const byType = useAggregate(
    'WasteRecord',
    farm ? { farm_id: farm.id, status: { $ne: 'predicted' } } : { farm_id: 'none' },
    'waste_type',
    ['quantity_tons']
  );
  const { items: predicted } = useList('WasteRecord', farm ? { farm_id: farm.id, status: 'predicted' } : { farm_id: 'none' }, { limit: 20, sort: '-quantity_tons' });
  const { items: palms } = useList('Palm', farm ? { farm_id: farm.id } : { farm_id: 'none' }, { limit: 200, sort: '-rpw_risk' });
  const { items: alerts } = useList('Alert', { status: 'new' }, { limit: 6, sort: '-created_date' });

  const statusRows = useMemo(() => {
    const map = {};
    (byStatus.rows || []).forEach((r) => { map[r.status] = r; });
    return STATUS_ORDER.map((s) => ({
      key: s,
      label: L(WASTE_STATUS[s].ar, WASTE_STATUS[s].en),
      color: WASTE_STATUS[s].color,
      tons: map[s]?.sum_quantity_tons || 0,
      value: map[s]?.sum_estimated_value || 0,
    }));
  }, [byStatus.rows, L]);

  const typeRows = useMemo(() => {
    const map = {};
    (byType.rows || []).forEach((r) => { map[r.waste_type] = r; });
    return TYPE_ORDER.map((t) => ({
      key: t,
      label: L(WASTE_TYPE[t].ar, WASTE_TYPE[t].en),
      color: WASTE_TYPE[t].color,
      tons: map[t]?.sum_quantity_tons || 0,
    }));
  }, [byType.rows, L]);

  const total = statusRows.reduce((a, r) => a + r.tons, 0);
  const value = statusRows.reduce((a, r) => a + r.value, 0);
  const recycled = statusRows.find((r) => r.key === 'recycled')?.tons || 0;
  const collected = statusRows.find((r) => r.key === 'collected')?.tons || 0;
  const processing = statusRows.find((r) => r.key === 'processing')?.tons || 0;
  const risk = statusRows.find((r) => r.key === 'burning_risk')?.tons || 0;
  const predictedTotal = predicted.reduce((a, p) => a + (p.quantity_tons || 0), 0);
  const diverted = total ? Math.round(((recycled + collected + processing) / total) * 100) : 0;

  const spotlight = palms.find((p) => p.palm_identifier === '104') || palms[0];

  const selectedPathway = pathway ? CIRCULAR_PATHS.find((p) => p.from === pathway) : null;

  if (farmsLoading) {
    return (
      <div className="space-y-5">
        <PageHeader eyebrow={L('لوحة المزارع', 'FARMER DASHBOARD')} title={L('مرحبًا بك في سعفة', 'Welcome to SA’FA')} />
        <LoadingState />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="space-y-5">
        <PageHeader eyebrow={L('لوحة المزارع', 'FARMER DASHBOARD')} title={L('مرحبًا بك في سعفة', 'Welcome to SA’FA')} />
        <EmptyState
          title={L('لنبدأ ببناء مزرعتك', 'Let’s build your farm')}
          body={L('لا توجد مزرعة مرتبطة بعد. أضف مزرعتك لتظهر المؤشرات والمخلفات.', 'No farm is linked yet. Add a farm to see indicators and waste.')}
          action={<AddPalmDialog />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('لوحة المزارع', 'FARMER DASHBOARD')}
        title={L('مرحبًا بك في سعفة', 'Welcome to SA’FA')}
        subtitle={L('نراقب نخيلك، ونحوّل مخلفاتها إلى قيمة.', 'We monitor your palms and turn their waste into value.')}
        actions={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-safa-line bg-white px-3 py-1.5 text-[10px] font-medium text-safa-earth">
              <span className="live-dot" aria-hidden />
              {L('مراقبة نشطة', 'Monitoring live')}
            </span>
            {isVisitor ? <Badge variant="outline" className="rounded-full border-safa-sand bg-safa-sandSoft/60 text-[10px] text-safa-earth">{L('وضع تجريبي', 'Demo Mode')}</Badge> : null}
            <Select value={farm?.id || ''} onValueChange={setFarmId}>
              <SelectTrigger className="h-10 w-[220px] bg-white text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {farms.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddPalmDialog defaultFarmId={farm?.id} />
          </>
        }
      />

      {!palms.length ? <StartFarmSteps /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label={L('إجمالي المخلفات', 'Total waste')} value={total} decimals={1} suffix={L(' طن', ' t')} icon={Boxes} demo delay={0} />
        <StatCard label={L('تم تدويره', 'Recycled')} value={recycled} decimals={1} suffix={L(' طن', ' t')} icon={Recycle} tone="olive" demo delay={70} />
        <StatCard label={L('تم جمعه', 'Collected')} value={collected} decimals={1} suffix={L(' طن', ' t')} icon={Truck} tone="olive" demo delay={140} />
        <StatCard label={L('تم توجيهه للمعالجة', 'Routed to processing')} value={processing} decimals={1} suffix={L(' طن', ' t')} icon={Gauge} demo delay={210} />
        <StatCard label={L('معرض للحرق / غير معالج', 'Burning / unprocessed')} value={risk} decimals={1} suffix={L(' طن', ' t')} icon={Flame} tone="danger" demo delay={280} />
        <StatCard label={L('القيمة المحتملة للمخلفات', 'Potential waste value')} value={value} suffix={L(' ر.س', ' SAR')} icon={Coins} tone="gold" demo delay={350} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Panel
          title={L('تفصيل مخلفات المزرعة', 'Farm waste breakdown')}
          subtitle={`${num(total, 1)} ${L('طن إجمالي المخلفات', 'tons of total waste')} · ${farm.name}`}
          icon={Boxes}
          action={<DemoTag />}
        >
          <WasteCharts key={farm.id} byType={typeRows} byStatus={statusRows} onSelect={(s) => setPathway(s.key)} />
          {selectedPathway ? (
            <div className="mt-4 rounded-2xl border border-safa-line bg-safa-cream/70 p-4">
              <p className="text-xs font-semibold text-safa-palm">
                {L('المسار الدائري المقترح', 'Suggested circular pathway')}: {L(WASTE_TYPE[selectedPathway].ar, WASTE_TYPE[selectedPathway].en)} →{' '}
                {L(CIRCULAR_PATHS.find((c) => c.from === selectedPathway)?.ar, CIRCULAR_PATHS.find((c) => c.from === selectedPathway)?.en)}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-safa-ink/60">
                {L(
                  'التوجيه يعتمد على نوع المادة والكمية والتصنيف؛ المخلفات التي يشتبه في إصابتها لا تُصنَّف تلقائيًا كآمنة للتدوير القياسي.',
                  'Routing depends on material type, quantity and classification; waste with suspected infestation is never auto-labelled safe for standard recycling.'
                )}
              </p>
              <Link to="/circular" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-safa-palm underline-offset-2 hover:underline">
                {L('استكشف المسارات', 'Explore pathways')} {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
              </Link>
            </div>
          ) : null}
        </Panel>

        <div className="space-y-5">
          <Panel title={L('مخلفات معرضة للحرق', 'Waste exposed to burning')} icon={AlertTriangle}>
            <p className="display-num text-4xl text-safa-dangerFg">{num(risk, 1)} <span className="text-base font-normal text-safa-ink/50">{L('طن', 'tons')}</span></p>
            <p className="mt-3 text-[12px] leading-relaxed text-safa-ink/65">
              {L('هذه الكمية تحتاج إلى مسار مناسب لتقليل التخلص غير المستدام منها.', 'This quantity needs an appropriate pathway to reduce unsustainable disposal.')}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-safa-earth">
              {L('يُصطلح عليها «معرضة للحرق / التخلص غير المناسب» ولا يُدّعى حرقها فعليًا دون تحقق.', 'Labelled “exposed to burning / improper disposal”; actual burning is never claimed without verification.')}
            </p>
            <Button asChild className="mt-4 w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
              <Link to="/waste">{L('توجيه هذه الكمية', 'Route this quantity')}</Link>
            </Button>
          </Panel>

          <Panel title={L('قيمة مخلفاتك', 'Your waste value')} icon={Coins} action={<Badge variant="outline" className="rounded-full border-safa-sand bg-safa-sandSoft/60 text-[10px] text-safa-earth">{L('قيمة تقديرية', 'Estimated Value')}</Badge>}>
            <p className="display-num text-4xl text-safa-gold">{money(value, lang)}</p>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="how" className="border-b-0">
                <AccordionTrigger className="py-2 text-xs text-safa-palm hover:no-underline">
                  {L('كيف حسبنا القيمة؟', 'How did we calculate the value?')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 text-[11px] leading-relaxed text-safa-ink/65">
                    <li>• {L('نوع المادة: سعف، جذوع، ليف، ومخلفات أخرى.', 'Material type: fronds, trunks, fiber and other residues.')}</li>
                    <li>• {L('الكمية المتاحة لكل نوع بالطن.', 'Available quantity per type in tons.')}</li>
                    <li>• {L('الجودة وتصنيف المخاطر (قياسي / يحتاج تحقق / مسار خاص).', 'Quality and risk classification (standard / verification / special).')}</li>
                    <li>• {L('مسار المعالجة المحتمل والقيمة السوقية التقديرية للمادة الناتجة.', 'Potential processing pathway and the estimated market value of the output.')}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Panel title={L('مخلفاتك يمكن أن تصبح قيمة', 'Your waste can become value')} icon={TrendingUp} action={<DemoTag />}>
          <p className="text-[13px] text-safa-ink/70">{L(`لديك ${num(total, 1)} طن من المخلفات`, `You have ${num(total, 1)} tons of waste`)}</p>
          <ul className="mt-4 space-y-2.5">
            {[
              { tons: recycled, ar: 'تم تدويره', en: 'Recycled', tone: 'text-safa-okFg' },
              { tons: collected, ar: 'تم جمعه', en: 'Collected', tone: 'text-safa-palm' },
              { tons: processing, ar: 'قيد المعالجة', en: 'In processing', tone: 'text-safa-olive' },
              { tons: risk, ar: 'يحتاج مسارًا', en: 'Needs a pathway', tone: 'text-safa-dangerFg' },
            ].map((r) => (
              <li key={r.en} className="flex items-center justify-between rounded-xl border border-safa-line bg-safa-cream/60 px-4 py-3">
                <span className="text-[12px] text-safa-ink/70">{L(r.ar, r.en)}</span>
                <span className={`display-num text-lg ${r.tone}`}>{num(r.tons, 1)} {L('طن', 't')}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl border border-safa-gold/40 bg-safa-gold/10 p-4">
            <p className="text-[11px] text-safa-earth">{L('القيمة التقديرية المحتملة', 'Estimated potential value')}</p>
            <p className="display-num mt-1 text-2xl text-safa-palm">{money(value, lang)}</p>
          </div>
          <Button asChild variant="outline" className="mt-4 w-full border-safa-line text-safa-palm">
            <Link to="/circular">{L('استكشف المسارات', 'Explore pathways')}</Link>
          </Button>
        </Panel>

        <Panel title={L('ما الذي يمكن أن تصبح إليه مخلفاتك؟', 'What can your waste become?')} icon={Recycle}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: 'fronds', tons: typeRows.find((t) => t.key === 'fronds')?.tons || 0, ar: 'سماد عضوي', en: 'Compost' },
              { key: 'trunks', tons: typeRows.find((t) => t.key === 'trunks')?.tons || 0, ar: 'إعادة استخدام المادة', en: 'Material reuse' },
              { key: 'fiber', tons: typeRows.find((t) => t.key === 'fiber')?.tons || 0, ar: 'منتجات ألياف النخيل', en: 'Palm fiber products' },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setPathway(pathway === c.key ? null : c.key)}
                className={`rounded-2xl border p-4 text-start transition duration-300 hover:-translate-y-0.5 ${pathway === c.key ? 'border-safa-palm bg-safa-palm text-safa-cream shadow-[0_16px_30px_-24px_rgba(30,58,47,0.8)]' : 'border-safa-line bg-white hover:border-safa-sand hover:shadow-[0_16px_30px_-26px_rgba(30,58,47,0.7)]'}`}
              >
                <p className={`display-num text-2xl ${pathway === c.key ? 'text-safa-gold' : 'text-safa-palm'}`}>{num(c.tons, 1)}</p>
                <p className="mt-1 text-[10px] opacity-60">{L('طن', 'tons')}</p>
                <p className="mt-3 text-[12px] font-medium">{L(WASTE_TYPE[c.key].ar, WASTE_TYPE[c.key].en)}</p>
                <p className={`mt-1 text-[11px] ${pathway === c.key ? 'text-safa-cream/70' : 'text-safa-ink/55'}`}>{L(c.ar, c.en)}</p>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/store" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-safa-palm underline-offset-2 hover:underline">
              {L('شاهد المنتجات الناتجة في متجر سعفة', 'See the resulting products in the SA’FA store')}
              {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Panel
          title={L('المخلفات المتوقعة', 'Predicted waste')}
          subtitle={L(`إجمالي ${num(predictedTotal, 1)} طن متوقع خلال الأسابيع القادمة`, `${num(predictedTotal, 1)} tons expected in the coming weeks`)}
          icon={Gauge}
          action={<DemoTag />}
        >
          {!predicted.length ? (
            <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} />
          ) : (
            <ul className="space-y-2.5">
              {predicted.slice(0, 5).map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-safa-line bg-white p-3.5">
                  <div>
                    <p className="text-[12px] font-medium text-safa-palm">
                      {L('النخلة', 'Palm')} #{p.palm_identifier} · {L(WASTE_TYPE[p.waste_type]?.ar, WASTE_TYPE[p.waste_type]?.en)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-safa-ink/50">
                      {p.waste_code} · {L('متوقع خلال', 'Expected within')} {num(daysLeft(p.predicted_date))} {L('يومًا', 'days')}
                    </p>
                  </div>
                  <span className="display-num text-lg text-safa-palm">{num(p.quantity_tons, 1)} {L('طن', 't')}</span>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" className="mt-4 w-full border-safa-line text-safa-palm">
            <Link to="/waste">{L('إدارة كل المخلفات', 'Manage all waste')}</Link>
          </Button>
        </Panel>

        <div className="space-y-5">
          <Panel title={L('أبرز النخيل المراقب', 'Spotlight palm')} icon={Sprout} subtitle={spotlight ? `${L('نخلة', 'Palm')} #${spotlight.palm_identifier}` : undefined} action={<DemoTag />}>
            {spotlight ? <PalmCard palm={spotlight} /> : <EmptyState />}
          </Panel>

          <Panel title={L('أحدث التنبيهات', 'Latest alerts')} icon={Bell} action={<Link to="/alerts" className="text-[11px] text-safa-earth underline-offset-2 hover:underline">{L('عرض الكل', 'View all')}</Link>}>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((a) => (
                <AlertRow key={a.id} alert={a} />
              ))}
              {!alerts.length ? <p className="text-xs text-safa-ink/50">{L('لا توجد تنبيهات جديدة.', 'No new alerts.')}</p> : null}
            </div>
          </Panel>

          {isVisitor ? (
            <div className="rounded-2xl border border-safa-warnLine bg-safa-warnBg/70 px-5 py-4 text-[11px] leading-relaxed text-safa-warnFg">
              <p className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                {L('وضع تجريبي', 'Demo Mode')}
              </p>
              <p className="mt-1.5">
                {L('أنت تستعرض بيئة سعفة التجريبية. يمكنك التنقل وطلب الفحص وجدولة الجمع كعرض، بينما لا يمكن للزائر تعديل سجلات المزارعين الحقيقية.', 'You are exploring the SA’FA demo environment. You can browse, request inspections and schedule collection as part of the demo; visitors cannot modify real farmer records.')}
              </p>
              <p className="mt-2 text-safa-earth">{L('الدور الحالي', 'Current role')}: {role}</p>
            </div>
          ) : null}
        </div>
      </div>

      <p className="text-[10px] text-safa-ink/40">
        {isAr ? 'جميع القيم المعروضة بيانات تجريبية لأغراض العرض والتقييم.' : 'All displayed values are demo data for presentation and evaluation purposes.'}
      </p>
    </div>
  );
}