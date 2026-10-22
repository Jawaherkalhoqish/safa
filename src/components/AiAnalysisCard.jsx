import { Activity, Brain, Info, ShieldAlert, Target } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TONES = {
  green: 'border-safa-okLine bg-safa-okBg/60',
  amber: 'border-safa-warnLine bg-safa-warnBg/70',
  red: 'border-safa-dangerLine bg-safa-dangerBg/60',
};

export default function AiAnalysisCard({
  title,
  body,
  riskLevel = 'low',
  reason,
  confidence = 'medium',
  recommendation,
  indicator,
  tone = 'green',
}) {
  const { L } = useLang();
  const levelLabels = {
    low: { ar: 'منخفض', en: 'Low', t: 'green' },
    medium: { ar: 'متوسط', en: 'Medium', t: 'amber' },
    high: { ar: 'مرتفع', en: 'High', t: 'red' },
  };
  const confLabels = {
    low: { ar: 'قوة المؤشر: محدودة', en: 'Indicator strength: limited' },
    medium: { ar: 'قوة المؤشر: متوسطة', en: 'Indicator strength: moderate' },
    high: { ar: 'قوة المؤشر: واضحة', en: 'Indicator strength: clear' },
  };
  const lvl = levelLabels[riskLevel] || levelLabels.low;

  return (
    <div className={cn('rounded-2xl border p-5', TONES[tone] || TONES.green)}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-safa-palm">
          <Brain className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-safa-palm">{title || L('تحليل سعفة', 'SA’FA analysis')}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-safa-ink/75">{body}</p>

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-[11px] text-safa-ink/70">
              <ShieldAlert className="h-3.5 w-3.5 text-safa-earth" />
              {L('مستوى الخطر', 'Risk level')}: <StatusBadge tone={lvl.t} label={L(lvl.ar, lvl.en)} />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-safa-ink/70">
              <Target className="h-3.5 w-3.5 text-safa-earth" />
              {L(confLabels[confidence]?.ar || '', confLabels[confidence]?.en || '')}
            </div>
            {indicator != null ? (
              <div className="flex items-center gap-2 text-[11px] text-safa-ink/70">
                <Activity className="h-3.5 w-3.5 text-safa-earth" />
                {L('المؤشر', 'Indicator')}: <span className="font-semibold tabular-nums">{indicator}</span>
              </div>
            ) : null}
            {reason ? (
              <div className="text-[11px] leading-relaxed text-safa-ink/70 sm:col-span-2">
                {L('السبب', 'Reason')}: {reason}
              </div>
            ) : null}
          </dl>

          {recommendation ? (
            <p className="mt-3 rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-[11px] font-medium text-safa-palm">
              {L('الإجراء المقترح', 'Recommended action')}: {recommendation}
            </p>
          ) : null}

          <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-safa-ink/50">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            {L(
              'المؤشرات في هذه النسخة لدعم القرار والإنذار المبكر ولا تُعد تشخيصًا ميدانيًا نهائيًا.',
              'Indicators in this prototype support early warning and decision making; they are not a definitive field diagnosis.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}