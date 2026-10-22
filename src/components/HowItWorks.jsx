import { STAGES } from '@/lib/platform';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function HowItWorks({ compact = false }) {
  const { L, isAr } = useLang();

  return (
    <section id="how" className="relative bg-safa-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">{L('كيف تعمل سعفة', 'HOW SA’FA WORKS')}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-safa-palm md:text-5xl">
            {L('سبع مراحل من الإشارة إلى القيمة', 'Seven stages from signal to value')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-safa-ink/70">
            {L(
              'سعفة لا تنتظر المخلفات حتى تتكوّن؛ تستشعر النخلة، تتنبأ بما سيحدث، وتخطط لمصير مخلفاتها.',
              'SA’FA does not wait for palm waste to appear. It senses the palm, predicts what comes next, and plans the waste’s next destination.'
            )}
          </p>
        </div>

        <div className={cn('mt-14 grid gap-4', compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')}>
          {STAGES.map((s, i) => (
            <div
              key={s.n}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-safa-line bg-white p-6 transition duration-500 hover:-translate-y-1 hover:border-safa-sand hover:shadow-xl',
                !compact && i === 6 ? 'lg:col-span-2 lg:bg-safa-palm lg:text-safa-cream' : ''
              )}
            >
              <div className="flex items-start justify-between">
                <span className={cn('font-display text-3xl font-semibold tabular-nums', !compact && i === 6 ? 'text-safa-gold' : 'text-safa-sand')}>
                  {s.n}
                </span>
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border transition',
                    !compact && i === 6 ? 'border-white/20 bg-white/10 text-safa-cream' : 'border-safa-line bg-safa-mist text-safa-palm'
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className={cn('mt-5 text-lg font-semibold', !compact && i === 6 ? 'text-safa-cream' : 'text-safa-palm')}>
                {isAr ? s.ar.title : s.en.title}
              </h3>
              <p className={cn('mt-2 text-sm leading-relaxed', !compact && i === 6 ? 'text-safa-cream/75' : 'text-safa-ink/65')}>
                {isAr ? s.ar.body : s.en.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}