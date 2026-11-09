import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ClipboardList, Pause, Play, Recycle, ShieldAlert, Sprout, Truck, X } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import AiAnalysisCard from '@/components/AiAnalysisCard';
import Timeline, { COLLECTION_FLOW } from '@/components/Timeline';
import ProductCard from '@/components/ProductCard';
import DemoTag from '@/components/DemoTag';
import { Button } from '@/components/ui/button';
import SmartMapCanvas from '@/components/SmartMapCanvas';
import { useAggregate, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { PATHWAYS } from '@/lib/platform';
import { HEALTH_BAND, ORDER_STATUS, WASTE_STATUS, WASTE_TYPE, daysLeft, money, num, rpwLevel, RPW_LEVEL } from '@/lib/format';
import { ASSETS } from '@/lib/assets';
import BrandLogo from '@/components/BrandLogo';
import { cn } from '@/lib/utils';

const STEPS = [
  { ar: 'صحة النخلة', en: 'Palm health' },
  { ar: 'الإنذار المبكر', en: 'Early warning' },
  { ar: 'خطر السوسة', en: 'RPW risk' },
  { ar: 'التنبؤ بالمخلفات', en: 'Waste prediction' },
  { ar: 'تصنيف المخلفات', en: 'Waste classification' },
  { ar: 'الجمع الذكي', en: 'Smart collection' },
  { ar: 'الاقتصاد الدائري', en: 'Circular economy' },
  { ar: 'متجر سعفة', en: 'SA’FA store' },
  { ar: 'الأثر', en: 'Impact' },
];

export default function Tour() {
  const { L, isAr } = useLang();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  const { items: palms } = useList('Palm', {}, { limit: 300, sort: 'palm_identifier' });
  const { items: alerts } = useList('Alert', { type: 'rpw_suspicion' }, { limit: 10, sort: '-created_date' });
  const { items: waste } = useList('WasteRecord', {}, { limit: 300, sort: '-created_date' });
  const { items: products } = useList('Product', {}, { limit: 10, sort: '-created_date' });
  const { items: requests } = useList('CollectionRequest', {}, { limit: 20, sort: '-created_date' });
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 10, sort: 'name' });
  const { rows } = useAggregate('WasteRecord', {}, 'status', ['quantity_tons', 'estimated_value']);

  const focusPalm = palms.find((p) => p.palm_identifier === '104') || palms[0];
  const rpwPalm = palms.find((p) => rpwLevel(p.rpw_risk) === 'high') || palms[0];
  const predicted = useMemo(() => waste.filter((w) => w.status === 'predicted').slice(0, 4), [waste]);
  const spotlightWaste = useMemo(
    () => waste.find((w) => w.palm_identifier === '104' && w.status === 'predicted') || predicted[0],
    [waste, predicted]
  );
  const spotlightRequest = requests.find((r) => r.status !== 'rejected') || requests[0];

  const tons = useMemo(() => {
    const map = {};
    rows.forEach((r) => { map[r.status] = r; });
    return map;
  }, [rows]);

  useEffect(() => {
    if (!playing || !started) return undefined;
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 14000);
    return () => clearTimeout(t);
  }, [playing, started, step]);

  const Arrow = isAr ? ArrowLeft : ArrowRight;

  if (!started) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-safa-palmDeep">
        <img src={ASSETS.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-safa-palmDeep via-safa-palmDeep/85 to-safa-palmDeep/60" />
        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-20 text-center">
          <BrandLogo tone="onDark" className="mx-auto h-16" />
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-safa-gold">{L('الوضع التعريفي', 'PRESENTATION MODE')}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-safa-cream md:text-5xl">
            {L('التجربة الكاملة لسعفة في دقيقتين', 'The full SA’FA story in two minutes')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-safa-cream/70">
            {L(
              'تسعة مشاهد متتابعة: صحة النخلة، الإنذار المبكر، خطر السوسة، التنبؤ بالمخلفات، التصنيف، الجمع الذكي، الاقتصاد الدائري، المتجر، والأثر.',
              'Nine consecutive scenes: palm health, early warning, RPW risk, waste prediction, classification, smart collection, circular economy, the store and impact.'
            )}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => setStarted(true)} className="bg-safa-bone px-7 py-3.5 text-sm font-semibold text-safa-palmDeep hover:bg-white">
              {L('ابدأ الجولة', 'Start the tour')}
              <Arrow className="ms-2 h-4 w-4" />
            </Button>
            <Link to="/dashboard" className="rounded-full border border-white/25 px-7 py-3.5 text-sm text-safa-cream transition hover:bg-white/10">
              {L('تخطي إلى المنصة', 'Skip to the platform')}
            </Link>
          </div>
          <p className="mt-6 text-[11px] text-safa-cream/40">{L('بيانات تجريبية | Demo Data', 'Demo Data')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-safa-cream">
      <header className="sticky top-0 z-30 border-b border-safa-line bg-safa-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-4">
          <BrandLogo tone="onDark" className="h-8" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-safa-palm">
              {L('الجولة التعريفية', 'Guided tour')} · {step + 1}/{STEPS.length}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-safa-mist">
              <div className="h-full rounded-full bg-safa-palm transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={() => setPlaying((p) => !p)} className="rounded-xl border border-safa-line bg-white p-2 text-safa-palm" aria-label={L('تشغيل/إيقاف', 'Play/Pause')}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <Link to="/dashboard" className="rounded-xl border border-safa-line bg-white p-2 text-safa-palm" aria-label={L('إنهاء الجولة', 'End the tour')}>
            <X className="h-4 w-4" />
          </Link>
        </div>
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
          {STEPS.map((s, i) => (
            <button
              key={s.en}
              onClick={() => setStep(i)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-[10px] transition',
                i === step ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/55'
              )}
            >
              {String(i + 1).padStart(2, '0')} {L(s.ar, s.en)}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold text-safa-palm">{L(STEPS[step].ar, STEPS[step].en)}</h1>
          <DemoTag />
        </div>

        <div className="mt-6 animate-rise" key={step}>
          {step === 0 && focusPalm ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
              <div className="panel p-6">
                <p className="eyebrow">{focusPalm.region} — {focusPalm.farm_name}</p>
                <p className="mt-3 font-display text-xl font-semibold text-safa-palm">{L('نخلة', 'Palm')} #{focusPalm.palm_identifier}</p>
                <p className="display-num mt-5 text-6xl text-safa-palm">{num(focusPalm.health_score)}<span className="text-xl text-safa-ink/40"> / 100</span></p>
                <p className="mt-3">
                  <StatusBadge tone={(HEALTH_BAND[focusPalm.status] || HEALTH_BAND.stable).tone} label={L((HEALTH_BAND[focusPalm.status] || HEALTH_BAND.stable).ar, (HEALTH_BAND[focusPalm.status] || HEALTH_BAND.stable).en)} />
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
                  {[
                    [L('النشاط الكهربائي', 'Electrical'), num(focusPalm.electrical_activity, 2)],
                    [L('النشاط الصوتي', 'Acoustic'), num(focusPalm.acoustic_activity, 2)],
                    [L('رطوبة التربة', 'Soil'), `${num(focusPalm.soil_moisture)}%`],
                    [L('الحرارة', 'Temperature'), `${num(focusPalm.temperature)}°C`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                      <p className="text-safa-ink/50">{k}</p>
                      <p className="display-num mt-1 text-lg text-safa-palm">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <AiAnalysisCard
                tone="green"
                riskLevel={rpwLevel(focusPalm.rpw_risk)}
                confidence="medium"
                indicator={num(focusPalm.rpw_risk, 2)}
                title={L('تحليل سعفة الآلي', 'SA’FA automated analysis')}
                body={L('تشير البيانات الحالية إلى استقرار عام في مؤشرات النخلة، مع عدم وجود ارتفاع ملحوظ في مؤشر خطر السوسة.', 'Current data indicates generally stable palm conditions, with no significant elevation in the Red Palm Weevil risk indicator.')}
                reason={L('دمج الإشارات الكهربائية والصوتية مع رطوبة التربة وسجل الفحص.', 'Fusion of electrical and acoustic signals with soil moisture and inspection history.')}
                recommendation={L('متابعة القراءات الدورية.', 'Continue routine monitoring.')}
              />
            </div>
          ) : null}

          {step === 1 && alerts[0] ? (
            <div className="space-y-5">
              <div className="panel p-6">
                <ShieldAlert className="h-5 w-5 text-safa-dangerFg" />
                <p className="mt-4 text-lg font-semibold text-safa-palm">{alerts[0].title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-safa-ink/70">{alerts[0].reason}</p>
                <p className="mt-2 text-[12px] text-safa-earth">{L('الإجراء المقترح', 'Recommended')}: {alerts[0].recommendation}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {alerts.slice(1, 4).map((a) => (
                  <div key={a.id} className="panel p-4">
                    <p className="text-[12px] font-medium text-safa-palm">{a.title}</p>
                    <p className="mt-1.5 text-[11px] text-safa-ink/60">{a.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 && rpwPalm ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="panel p-6">
                <p className="eyebrow">{L('أعلى مؤشر مسجل', 'Highest recorded indicator')}</p>
                <p className="mt-3 font-display text-xl font-semibold text-safa-palm">{L('نخلة', 'Palm')} #{rpwPalm.palm_identifier}</p>
                <p className="display-num mt-4 text-5xl text-safa-dangerFg">{num(rpwPalm.rpw_risk, 2)}</p>
                <p className="mt-2">
                  <StatusBadge tone={RPW_LEVEL.high.tone} label={L('الخطر: مرتفع', 'Risk: high')} />
                </p>
                <p className="mt-4 text-[12px] leading-relaxed text-safa-ink/65">
                  {L('المؤشر من 0 إلى 1، ويقود إلى طلب فحص ميداني لا إلى تشخيص نهائي.', 'The indicator runs 0–1 and leads to a field inspection request, not a definitive diagnosis.')}
                </p>
                <Button asChild className="mt-5 bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
                  <Link to="/weevil">
                    <ClipboardList className="me-2 h-4 w-4" />
                    {L('الانتقال إلى طلب فحص', 'Go to inspection request')}
                  </Link>
                </Button>
              </div>
              <div className="panel p-6">
                <p className="text-sm font-semibold text-safa-palm">{L('فحوصات مرتبطة', 'Linked inspections')}</p>
                <ul className="mt-4 space-y-2.5">
                  {alerts.slice(0, 3).map((a) => (
                    <li key={a.id} className="rounded-xl border border-safa-line bg-white p-3 text-[11px]">
                      <p className="font-medium text-safa-palm">{a.alert_code}</p>
                      <p className="mt-1 text-safa-ink/60">{a.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {predicted.map((w) => (
                <div key={w.id} className="panel p-5">
                  <p className="text-[11px] text-safa-ink/50">{w.waste_code}</p>
                  <p className="display-num mt-2 text-3xl text-safa-palm">{num(w.quantity_tons, 1)}</p>
                  <p className="text-[11px] text-safa-ink/50">{L('طن متوقعة', 'tons expected')}</p>
                  <p className="mt-3 text-[11px] text-safa-earth">
                    {L('خلال', 'Within')} {num(daysLeft(w.predicted_date))} {L('يومًا', 'days')} · {L(WASTE_TYPE[w.waste_type]?.ar, WASTE_TYPE[w.waste_type]?.en)}
                  </p>
                  <p className="mt-1 text-[11px] text-safa-ink/55">{w.farm_name}</p>
                </div>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
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
          ) : null}

          {step === 5 && spotlightWaste ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="panel p-6">
                <Truck className="h-5 w-5 text-safa-olive" />
                <p className="display-num mt-4 text-5xl text-safa-palm">{num(spotlightWaste.quantity_tons, 1)}</p>
                <p className="text-xs text-safa-ink/50">{L('طن', 'tons')} · {spotlightWaste.waste_code}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
                  <div><dt className="text-safa-ink/50">{L('الموقع', 'Location')}</dt><dd className="mt-1 font-medium text-safa-palm">{spotlightWaste.farm_name}</dd></div>
                  <div><dt className="text-safa-ink/50">{L('المسافة', 'Distance')}</dt><dd className="mt-1 font-medium text-safa-palm">{L('12 كم', '12 km')}</dd></div>
                  <div><dt className="text-safa-ink/50">{L('الجهة المقترحة', 'Suggested facility')}</dt><dd className="mt-1 font-medium text-safa-palm">{facilities[0]?.name}</dd></div>
                  <div><dt className="text-safa-ink/50">{L('الموعد', 'Date')}</dt><dd className="mt-1 font-medium text-safa-palm">{L('الخميس', 'Thursday')}</dd></div>
                </dl>
              </div>
              <div className="panel p-6">
                <p className="text-sm font-semibold text-safa-palm">{L('تتبع الجمع', 'Collection tracking')}</p>
                <div className="mt-4">
                  <Timeline
                    steps={COLLECTION_FLOW.map((s, i) => ({
                      ...s,
                      done: spotlightRequest ? i <= COLLECTION_FLOW.findIndex((f) => f.key === spotlightRequest.status) : i < 2,
                    }))}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="panel p-6">
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { ar: 'مخلفات النخيل', en: 'Palm waste' },
                  { ar: 'المعالجة', en: 'Processing' },
                  { ar: 'مادة جديدة', en: 'New material' },
                  { ar: 'منتج دائري', en: 'Circular product' },
                ].map((s, i) => (
                  <div key={s.en} className="rounded-2xl border border-safa-line bg-safa-cream/60 p-5">
                    <Recycle className="h-5 w-5 text-safa-olive" />
                    <p className="mt-4 text-[13px] font-medium text-safa-palm">{L(s.ar, s.en)}</p>
                    <span className="mt-1 block font-display text-[10px] text-safa-earth">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[12px] leading-relaxed text-safa-ink/65">
                {L(
                  'المخلفات المصنّفة تتحول إلى سماد، أعلاف، ألياف، ومواد قابلة لإعادة الاستخدام ومنتجات حرفية.',
                  'Classified waste becomes compost, feed, fiber, reusable materials and artisan products.'
                )}
              </p>
            </div>
          ) : null}

          {step === 7 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : null}

          {step === 8 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { ar: 'مخلفات موجهة لدوائر آمنة', en: 'Diverted to safe pathways', value: (tons.recycled?.sum_quantity_tons || 0) + (tons.collected?.sum_quantity_tons || 0) + (tons.processing?.sum_quantity_tons || 0), unit: 'طن' },
                { ar: 'مخلفات معاد تدويرها', en: 'Recycled waste', value: tons.recycled?.sum_quantity_tons || 0, unit: 'طن' },
                { ar: 'عمليات الجمع', en: 'Collection operations', value: requests.length, unit: '' },
                { ar: 'القيمة التقديرية', en: 'Estimated value', value: (tons.recycled?.sum_estimated_value || 0) + (tons.collected?.sum_estimated_value || 0), unit: 'ر.س' },
              ].map((m) => (
                <div key={m.en} className="panel p-5">
                  <Sprout className="h-4 w-4 text-safa-gold" />
                  <p className="display-num mt-4 text-3xl text-safa-palm">{num(m.value, 1)}</p>
                  <p className="text-[10px] text-safa-ink/45">{m.unit}</p>
                  <p className="mt-3 text-[11px] text-safa-ink/60">{L(m.ar, m.en)}</p>
                </div>
              ))}
              <div className="sm:col-span-2 lg:col-span-4">
                <div className="panel p-6">
                  <p className="text-sm font-semibold text-safa-palm">{L('المشهد الإقليمي', 'Regional view')}</p>
                  <div className="mt-4">
                    <SmartMapCanvas palms={palms} facilities={facilities} compact />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="outline" className="border-safa-line text-safa-palm" onClick={() => setStep((s) => (s - 1 + STEPS.length) % STEPS.length)}>
            {L('السابق', 'Previous')}
          </Button>
          <p className="text-[11px] text-safa-ink/45">{L('تنقل تلقائي كل 14 ثانية — يمكنك إيقافه', 'Auto-advance every 14 seconds — you can pause it')}</p>
          <Button onClick={() => setStep((s) => (s + 1) % STEPS.length)} className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            {L('التالي', 'Next')}
            <Arrow className="ms-2 h-4 w-4" />
          </Button>
        </div>

        <p className="mt-8 text-[10px] leading-relaxed text-safa-ink/40">
          {L(
            'قراءات سعفة والمؤشرات الناتجة عنها في هذه النسخة تمثل نموذجًا أوليًا لدعم القرار والإنذار المبكر، ولا تُعد تشخيصًا ميدانيًا نهائيًا.',
            'SA’FA indicators in this prototype are intended for early-warning and decision support and do not constitute a definitive field diagnosis.'
          )}
        </p>
      </main>
    </div>
  );
}