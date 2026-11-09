import { useLang } from '@/lib/i18n';
import JourneyNode from './JourneyNode';

export default function JourneyTrack({ stages, active, progress, selected, onSelect, onHover }) {
  const { isAr } = useLang();
  const fill = Math.min(1, Math.max(0, progress)) * 100;

  return (
    <div className="mt-12" onMouseLeave={() => onHover(null)}>
      <div className="no-scrollbar overflow-x-auto pb-1 md:overflow-visible">
        <div className="relative min-w-[900px] md:min-w-0">
          <div
            className="absolute top-[42px] h-[1.5px]"
            style={{ insetInlineStart: '5%', insetInlineEnd: '5%' }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full bg-safa-cream/12" />
            <div
              className="absolute inset-y-0 rounded-full"
              style={{
                insetInlineStart: 0,
                width: `${fill}%`,
                transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                background: isAr
                  ? 'linear-gradient(270deg, rgba(125,139,93,0.55), rgba(200,161,90,0.95))'
                  : 'linear-gradient(90deg, rgba(125,139,93,0.55), rgba(200,161,90,0.95))',
                boxShadow: '0 0 16px rgba(200,161,90,0.45)',
              }}
            >
              <span className="journey-runner" />
            </div>
          </div>

          <ol className="relative grid grid-cols-10">
            {stages.map((stage, i) => (
              <JourneyNode
                key={stage.key}
                stage={stage}
                index={i}
                isActive={i === active}
                isDone={i < active}
                isSelected={i === selected}
                visible={progress > 0}
                onSelect={() => onSelect(i)}
                onHover={() => onHover(i)}
              />
            ))}
          </ol>
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] tracking-wide text-safa-cream/25 md:hidden">
        {isAr ? 'اسحب لاستعراض المراحل' : 'Swipe to explore the stages'}
      </p>
    </div>
  );
}