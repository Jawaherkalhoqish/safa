import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/AnimatedNumber';
import { useLang } from '@/lib/i18n';

const TONES = {
  palm: 'text-safa-palm',
  gold: 'text-safa-gold',
  olive: 'text-safa-olive',
  danger: 'text-safa-dangerFg',
};

export default function StatCard({ label, value, decimals = 0, suffix, hint, icon: Icon, tone = 'palm', onClick, demo }) {
  const { lang } = useLang();
  return (
    <div
      onClick={onClick}
      className={cn(
        'panel palm-glow-hover group relative overflow-hidden p-5 transition duration-500',
        onClick && 'cursor-pointer hover:border-safa-sand'
      )}
    >
      <span
        className="pointer-events-none absolute -end-10 -top-12 h-28 w-28 rounded-full bg-safa-oliveSoft/12 blur-2xl transition duration-500 group-hover:bg-safa-oliveSoft/25"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        {Icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm transition group-hover:border-safa-sand">
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