import { LIFECYCLE } from '@/lib/platform';
import { useLang } from '@/lib/i18n';

export default function PlatformFlow() {
  const { L, isAr } = useLang();

  return (
    <section className="relative overflow-hidden bg-safa-palm py-20 text-safa-cream md:py-28">
      <div className="absolute inset-0 grain opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-safa-gold">{L('دورة حياة واحدة متصلة', 'ONE CONNECTED LIFECYCLE')}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold md:text-5xl">
            {L('من النخلة.. إلى المنتج الدائري', 'From the palm… to the circular product')}
          </h2>
        </div>

        <div className="mt-14 flex snap-x gap-3 overflow-x-auto pb-4 no-scrollbar">
          {LIFECYCLE.map((step, i) => (
            <div key={step.en} className="flex shrink-0 items-center gap-3">
              <div className="w-40 snap-start rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur-sm transition hover:border-safa-gold/40 hover:bg-white/10">
                <step.icon className="h-5 w-5 text-safa-gold" />
                <p className="mt-3 text-sm font-medium">{isAr ? step.ar : step.en}</p>
                <p className="mt-1 font-display text-xs text-safa-cream/45">{String(i + 1).padStart(2, '0')}</p>
              </div>
              {i < LIFECYCLE.length - 1 ? <span className="h-px w-6 bg-safa-gold/40" aria-hidden /> : null}
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-safa-cream/60">
          {L(
            'كل إشارة من النخلة يمكن أن تولّد تنبيهًا، والتنبيه يقود إلى فحص ميداني، وحالة النخلة تساهم في التنبؤ بالمخلفات، والتصنيف يحدد مسار المعالجة، والمسار يحدد متطلبات الجمع، والمخلفات تصبح في النهاية منتجًا دائريًا.',
            'A palm signal can create a warning, a warning triggers field inspection, palm condition contributes to waste prediction, classification determines the treatment pathway, the pathway sets collection requirements, and waste eventually becomes a circular product.'
          )}
        </p>
      </div>
    </section>
  );
}