import { useLang } from '@/lib/i18n';

export default function JourneyDetail({ stage }) {
  const { isAr } = useLang();

  return (
    <div
      aria-live="polite"
      className="mt-8 flex min-h-[76px] flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-start md:gap-8"
    >
      <div className="flex items-baseline gap-3 md:w-64 md:shrink-0">
        <span className="font-display text-2xl leading-none tabular-nums text-safa-gold/70">{stage.n}</span>
        <h3 className="font-display text-lg font-semibold text-safa-bone">{isAr ? stage.ar : stage.en}</h3>
      </div>
      <p key={stage.key} className="animate-rise max-w-2xl text-[13.5px] leading-[1.9] text-safa-cream/65">
        {isAr ? stage.bodyAr : stage.bodyEn}
      </p>
    </div>
  );
}