import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function JourneyNode({ stage, isActive, isDone, onSelect, onHover }) {
  const { isAr } = useLang();
  const Icon = stage.icon;

  return (
    <li className="relative flex justify-center">
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={onHover}
        onFocus={onHover}
        aria-pressed={isActive}
        className="group flex w-full flex-col items-center rounded-xl outline-none"
      >
        <span
          className={cn(
            'flex h-3 items-center text-[10px] font-semibold tabular-nums transition-colors duration-300',
            isActive ? 'text-safa-gold' : isDone ? 'text-safa-cream/50' : 'text-safa-cream/25'
          )}
        >
          {stage.n}
        </span>

        <span className="relative mt-2 flex h-11 w-11 items-center justify-center">
          {isActive ? <span className="journey-halo" aria-hidden /> : null}
          <span
            className={cn(
              'relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 group-hover:-translate-y-0.5',
              isActive
                ? 'journey-node-glow border-safa-gold/80 bg-safa-gold text-safa-palmDeep'
                : isDone
                  ? 'border-safa-oliveSoft/45 bg-safa-oliveSoft/15 text-safa-cream'
                  : 'border-white/15 bg-safa-palmDeep/50 text-safa-cream/55 group-hover:border-safa-gold/45 group-hover:text-safa-cream'
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </span>
        </span>

        <span
          className={cn(
            'mt-3 max-w-[108px] text-center text-[11px] leading-snug transition-colors duration-300',
            isActive
              ? 'font-semibold text-safa-bone'
              : isDone
                ? 'text-safa-cream/70'
                : 'text-safa-cream/40 group-hover:text-safa-cream/70'
          )}
        >
          {isAr ? stage.ar : stage.en}
        </span>
      </button>
    </li>
  );
}