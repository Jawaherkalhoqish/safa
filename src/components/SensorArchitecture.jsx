import { ARCHITECTURE, SENSOR_TYPES } from '@/lib/platform';
import { useLang } from '@/lib/i18n';

export default function SensorArchitecture({ compact = false }) {
  const { L, isAr } = useLang();

  return (
    <div className={compact ? '' : 'grid gap-5 lg:grid-cols-[1fr_1.1fr]'}>
      <div className="rounded-2xl border border-safa-line bg-white p-5">
        <p className="text-sm font-semibold text-safa-palm">{L('مصادر الإشارات', 'Signal sources')}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-safa-ink/55">
          {L('تدمج سعفة مصادر متعددة، ولا يعتمد التشخيص على مصدر واحد.', 'SA’FA fuses multiple sources; no single source drives the indicator alone.')}
        </p>
        <ul className="mt-4 space-y-2.5">
          {SENSOR_TYPES.map((s) => (
            <li key={s.en} className="flex items-center gap-3 rounded-xl border border-safa-line/70 bg-safa-cream/60 px-3 py-2.5">
              <s.icon className="h-4 w-4 text-safa-olive" />
              <span className="text-[12px] text-safa-ink/75">{isAr ? s.ar : s.en}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-safa-line bg-safa-palm p-5 text-safa-cream">
        <p className="text-sm font-semibold">{L('مسار المعالجة التحليلية', 'Analytical pipeline')}</p>
        <div className="mt-4 space-y-2">
          {ARCHITECTURE.map((a, i) => (
            <div key={a.en} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/8 text-safa-gold">
                <a.icon className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 text-[12px] text-safa-cream/80">{isAr ? a.ar : a.en}</span>
              <span className="text-[10px] text-safa-cream/35">{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-[10px] leading-relaxed text-safa-cream/60">
          {L(
            'لا يدّعي أي مستشعر بمفرده تشخيص كل الحالات؛ الناتج مؤشر لدعم القرار.',
            'No single sensor definitively diagnoses every condition; the output is a decision-support indicator.'
          )}
        </p>
      </div>
    </div>
  );
}