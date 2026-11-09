import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/AnimatedNumber';
import useReveal from '@/hooks/useReveal';
import { useLang } from '@/lib/i18n';

const TONES = {
  palm: 'text-safa-palm',
  gold: 'text-safa-gold',
  olive: 'text-safa-olive',
  danger: 'text-safa-dangerFg',
};

export default function StatCard({ label, value, decimals = 0, suffix, hint, icon: Icon, tone = 'palm', onClick, demo, delay = 0 }) {
  const { lang } = useLang();
  const revealRef = useReveal({ delay });

  return (
    <div
      ref={revealRef}
      onClick={onClick}
      className={cn(
        'panel glow-card reveal group relative overflow-hidden p-5',
        onClick && 'cursor-pointer'
      )}
    >
      <span
        className="pointer-events-none absolute -end-10 -top-12 h-28 w-28 rounded-full bg-safa-oliveSoft/12 blur-2xl transition duration-500 group-hover:bg-safa-oliveSoft/25"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        {Icon ? (
          <span className="card-icon flex h-9 w-9 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
            <Icon className="h-4 w-4" />
          </span>
        ) : <span />}
        {demo ? <span className="text-[10px] text-safa-ink/35">{lang === 'ar' ? 'بيانات تجريبية' : 'Demo Data'}</span> : null}
      </div>
      <p className={cn('display-num mt-5 text-3xl md:text-4xl', TONES[tone])}>
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="mt-2 text-xs font-medium text-safa-ink/70">{label}</p>
      {hint ? <p className="mt-1 text-[11px] leading-relaxed text-safa-ink/45">{hint}</p> : null}
    </div>
  );
}