import { useEffect, useState } from 'react';
import {
  Banknote,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Cog,
  Factory,
  Package,
  Pause,
  Play,
  Sprout,
  Store,
  Truck,
  Users,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const ACTORS = [
  { icon: Sprout, ar: 'المزارع', en: 'Farmer' },
  { icon: Building2, ar: 'الشركات والمنشآت', en: 'Companies & facilities' },
  { icon: Banknote, ar: 'المستثمر', en: 'Investor' },
];

const STEPS = [
  {
    icon: Sprout,
    ar: { title: 'المزرعة', body: 'نخيل مسجّل ومراقب، وسجل صحة لكل نخلة يجعل المخلفة معروفة قبل أن تتكوّن.' },
    en: { title: 'Farm', body: 'Registered, monitored palms with a health record per palm, so waste is known before it forms.' },
  },
  {
    icon: ClipboardList,
    ar: { title: 'إدراج المخلفات', body: 'تُدرج الكمية المتوقعة ونوعها وتاريخها المتوقع، مع تصنيف أولي للمسار.' },
    en: { title: 'Waste listing', body: 'Expected quantity, type and date are listed, with an initial pathway classification.' },
  },
  {
    icon: ClipboardCheck,
    ar: { title: 'طلب الجمع', body: 'يُحوَّل الإدراج إلى طلب جمع يحدد الأولوية والموقع والكمية المطلوب استلامها.' },
    en: { title: 'Collection request', body: 'The listing becomes a collection request defining priority, location and quantity to receive.' },
  },
  {
    icon: Truck,
    ar: { title: 'النقل', body: 'تُجدول الرحلة إلى المنشأة حسب المسافة والسعة المتاحة، ويتحدث الطلب مع كل مرحلة.' },
    en: { title: 'Transport', body: 'The trip to the facility is scheduled by distance and available capacity, and the request updates at each stage.' },
  },
  {
    icon: Factory,
    ar: { title: 'منشأة التدوير', body: 'تستلم المنشأة الكمية وتؤكد الوزن الفعلي وتحدد مسار المعالجة المناسب.' },
    en: { title: 'Recycling facility', body: 'The facility receives the load, confirms actual weight and sets the appropriate treatment path.' },
  },
  {
    icon: Cog,
    ar: { title: 'المعالجة', body: 'تُحوَّل المادة إلى ألياف أو سماد أو مواد قابلة لإعادة الاستخدام حسب تصنيفها.' },
    en: { title: 'Processing', body: 'Material is converted to fiber, compost or reusable material according to its classification.' },
  },
  {
    icon: Package,
    ar: { title: 'منتجات معاد تدويرها', body: 'كل منتج مرتبط بمادة مصدره وكميتها، ما يجعل الأثر قابلًا للقياس والتتبع.' },
    en: { title: 'Recycled products', body: 'Each product is linked to its source material and quantity, making impact measurable and traceable.' },
  },
  {
    icon: Store,
    ar: { title: 'السوق', body: 'تُعرض المنتجات في متجر سعفة للشراء، ويُغلق بذلك المسار من النخلة إلى المنتج.' },
    en: { title: 'Marketplace', body: 'Products are offered in the SA’FA store, closing the loop from palm to final product.' },
  },
];

export default function EcosystemJourney() {
  const { L, isAr } = useLang();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 3800);
    return () => clearInterval(t);
  }, [auto]);

  const step = STEPS[active];
  const StepIcon = step.icon;

  return (
    <section id="journey" className="scroll-mt-24 border-y border-safa-line bg-safa-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">{L('كيف تعمل سعفة', 'HOW SA’FA WORKS')}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-safa-palm md:text-4xl">
              {L('رحلة المخلفة الزراعية من المزرعة إلى السوق', 'The agricultural waste journey, farm to market')}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-safa-ink/65">
              {L(
                'ثماني محطات مترابطة، يمر بها كل طرف في المنظومة: المزارع الذي يبدأها، والمنشأة التي تعالجها، والمستثمر الذي يقرأ أثرها.',
                'Eight connected stations that every party passes through: the farmer who starts it, the facility that processes it, and the investor who reads its impact.'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-safa-line bg-white px-3.5 py-2 text-[12px] text-safa-ink/70 transition hover:border-safa-sand"
          >
            {auto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {auto ? L('إيقاف العرض التلقائي', 'Pause auto play') : L('تشغيل العرض التلقائي', 'Play automatically')}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {ACTORS.map((a, i) => (
            <div key={a.en} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-safa-line bg-white px-3.5 py-2 text-[12px] font-medium text-safa-palm">
                <a.icon className="h-3.5 w-3.5 text-safa-oliveSoft" />
                {isAr ? a.ar : a.en}
              </span>
              <Users className={cn('h-3.5 w-3.5 text-safa-earth/40', i === ACTORS.length - 1 && 'hidden')} aria-hidden />
            </div>
          ))}
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-x-0 top-6 hidden h-px bg-safa-line lg:block" aria-hidden />
          <div
            className="absolute top-6 hidden h-px bg-gradient-to-r from-safa-oliveSoft to-safa-gold transition-all duration-700 ease-out lg:block"
            style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
            aria-hidden
          >
            <span className="flow-dot" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active;
              const isDone = i < active;
              return (
                <button
                  key={s.en.title}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  className="group flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:-translate-y-0.5"
                  aria-pressed={isActive}
                >
                  <span
                    className={cn(
                      'relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500',
                      isActive
                        ? 'border-safa-gold/70 bg-safa-palm text-safa-bone ring-glow'
                        : isDone
                          ? 'border-safa-oliveSoft/40 bg-safa-okBg text-safa-okFg'
                          : 'border-safa-line bg-white text-safa-ink/50 group-hover:border-safa-sand group-hover:text-safa-palm group-hover:shadow-[0_10px_22px_-16px_rgba(30,58,47,0.6)]'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {isActive ? <span className="absolute inset-0 -z-10 animate-ring-out rounded-2xl bg-safa-gold/25" aria-hidden /> : null}
                  </span>
                  <span className={cn('text-[11px] leading-tight', isActive ? 'font-semibold text-safa-palm' : 'text-safa-ink/55')}>
                    {String(i + 1).padStart(2, '0')} · {isAr ? s.ar.title : s.en.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel palm-glow mt-8 flex flex-col gap-5 p-6 md:flex-row md:items-start md:p-8">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-safa-palm text-safa-gold">
            <StepIcon className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-safa-earth">
              {L('المحطة', 'Station')} {String(active + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-1.5 font-display text-xl font-semibold text-safa-palm">{isAr ? step.ar.title : step.en.title}</h3>
            <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-safa-ink/70">{isAr ? step.ar.body : step.en.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}