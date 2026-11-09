import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import Reveal from '@/components/motion/Reveal';
import JourneyTrack from '@/components/site/lifecycle/JourneyTrack';
import JourneyDetail from '@/components/site/lifecycle/JourneyDetail';
import useJourneyProgress from '@/components/site/lifecycle/useJourneyProgress';
import { JOURNEY } from '@/components/site/lifecycle/journeyData';

export default function PlatformFlow() {
  const { L } = useLang();
  const { ref, progress } = useJourneyProgress();
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const active = Math.round(progress * (JOURNEY.length - 1));
  const shown = selected === null ? hovered ?? active : selected;

  return (
    <section ref={ref} className="relative overflow-hidden bg-safa-palm py-20 text-safa-cream md:py-28">
      <div className="absolute inset-0 grain opacity-40" />
      <div className="journey-aura" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-safa-gold">
            {L('دورة حياة واحدة متصلة', 'ONE CONNECTED LIFECYCLE')}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold md:text-5xl">
            {L('من النخلة.. إلى المنتج الدائري', 'From the palm… to the circular product')}
          </h2>
        </div>

        <Reveal>
          <JourneyTrack
            stages={JOURNEY}
            active={active}
            progress={progress}
            selected={selected}
            onSelect={(i) => setSelected((current) => (current === i ? null : i))}
            onHover={setHovered}
          />
          <JourneyDetail stage={JOURNEY[shown]} />
        </Reveal>

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