import { ArrowDown, Check } from 'lucide-react';
import { AFTER_ITEMS, BEFORE_ITEMS, SAFA_ITEMS } from '@/lib/platform';
import { useLang } from '@/lib/i18n';

const Column = ({ tone, title, items, check }) => (
  <div className={`rounded-3xl border p-7 ${tone}`}>
    <h3 className="font-display text-xl font-semibold">{title}</h3>
    <ul className="mt-5 space-y-3">
      {items.map((it) => (
        <li key={it.en} className="flex gap-3 text-sm leading-relaxed">
          {check ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-safa-oliveSoft" /> : <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />}
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function LandingStory() {
  const { L, isAr } = useLang();
  const map = (arr) => arr.map((i) => ({ en: i.en, label: isAr ? i.ar : i.en }));

  return (
    <section className="bg-safa-mist py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">{L('قصة المنتج', 'THE PRODUCT STORY')}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-safa-palm md:text-5xl">
            {L('قبل سعفة، وماذا تتغير', 'Before SA’FA, and what changes')}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Column tone="border-safa-dangerLine bg-safa-dangerBg/60 text-safa-dangerFg" title={L('قبل', 'BEFORE')} items={map(BEFORE_ITEMS)} />
          <Column tone="border-safa-palm/25 bg-safa-palm text-safa-cream" title={L('سعفة', 'SA’FA')} items={map(SAFA_ITEMS)} check />
          <Column tone="border-safa-okLine bg-safa-okBg/70 text-safa-okFg" title={L('بعد', 'AFTER')} items={map(AFTER_ITEMS)} />
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="eyebrow">{L('النتيجة', 'OUTCOME')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {map(AFTER_ITEMS).map((a) => (
              <span key={a.en} className="rounded-full border border-safa-line bg-white px-5 py-2.5 text-sm font-medium text-safa-palm">
                {a.label}
              </span>
            ))}
            <ArrowDown className="h-4 w-4 text-safa-earth" />
          </div>
        </div>
      </div>
    </section>
  );
}