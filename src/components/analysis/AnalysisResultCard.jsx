import { AlertTriangle, ArrowDownRight, ArrowUpRight, Check, Minus, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const RISK = {
  low: { ar: 'منخفض', en: 'Low', cls: 'border-safa-okLine bg-safa-okBg text-safa-okFg' },
  medium: { ar: 'متوسط', en: 'Medium', cls: 'border-safa-warnLine bg-safa-warnBg text-safa-warnFg' },
  high: { ar: 'مرتفع', en: 'High', cls: 'border-safa-dangerLine bg-safa-dangerBg text-safa-dangerFg' },
};

function Compare({ previous, result }) {
  const { L } = useLang();
  if (!previous) return null;
  const delta = Math.round(result.health_score) - Math.round(previous.health_score);
  const better = delta > 0;
  const same = delta === 0;
  return (
    <div className="mt-5 rounded-2xl border border-safa-line bg-safa-mist/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-safa-earth">{L('مقارنة بالتحليل السابق', 'Compared with the previous analysis')}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
        <span className="flex items-center gap-1.5 text-safa-ink/70">
          {same ? <Minus className="h-4 w-4" /> : better ? <ArrowUpRight className="h-4 w-4 text-safa-okFg" /> : <ArrowDownRight className="h-4 w-4 text-safa-dangerFg" />}
          {same ? L('بلا تغيير في المؤشر', 'No change in score') : `${better ? '+' : ''}${delta} ${L('نقطة', 'points')}`}
        </span>
        <span className="text-safa-ink/55">
          {L('السابق:', 'Previous:')} {Math.round(previous.health_score)} · {L('الحالي:', 'Now:')} {Math.round(result.health_score)}
        </span>
        <span className="text-safa-ink/45">
          {new Date(previous.created_date).toLocaleDateString('en-GB')}
        </span>
      </div>
    </div>
  );
}

export default function AnalysisResultCard({ result, previous, saved, onSave, onNew }) {
  const { L, isAr } = useLang();
  const risk = RISK[result.risk_level] || RISK.medium;
  const isDemo = result.source === 'demo';

  return (
    <section className="panel palm-glow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-safa-line bg-safa-mist/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-safa-palm text-safa-gold">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-safa-palm">{L('نتيجة التحليل البصري', 'Visual analysis result')}</p>
        </div>
        <span
          className={cn(
            'rounded-full border px-3 py-1 text-[10.5px] font-semibold',
            isDemo ? 'border-safa-warnLine bg-safa-warnBg text-safa-warnFg' : 'border-safa-okLine bg-safa-okBg text-safa-okFg'
          )}
        >
          {isDemo ? L('تحليل تجريبي — لم يُستخدم نموذج بصري', 'Demo analysis — no vision model used') : L('ناتج نموذج رؤية', 'Vision model output')}
        </span>
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-safa-line bg-safa-mist/40 px-4 py-6">
          <p className="text-[11px] text-safa-earth">{L('مؤشر الحالة البصرية', 'Visual condition score')}</p>
          <p className="display-num text-5xl text-safa-palm">{Math.round(result.health_score)}</p>
          <span className={cn('rounded-full border px-3 py-1 text-[11px] font-semibold', risk.cls)}>
            {L('خطورة المتابعة', 'Follow-up risk')}: {isAr ? risk.ar : risk.en}
          </span>
        </div>

        <div>
          <p className="text-[13px] leading-relaxed text-safa-ink/75">{isAr ? result.summary_ar : result.summary_en}</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-safa-earth">
                <Check className="h-3.5 w-3.5" /> {L('المؤشرات المرصودة', 'Detected indicators')}
              </p>
              <ul className="mt-2.5 space-y-2">
                {(result.indicators || []).map((it, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-safa-ink/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-safa-oliveSoft" />
                    {isAr ? it.ar : it.en}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-safa-earth">
                <AlertTriangle className="h-3.5 w-3.5" /> {L('احتمالات تحتاج انتباهًا', 'Possible concerns')}
              </p>
              <ul className="mt-2.5 space-y-2">
                {(result.concerns || []).length ? (
                  result.concerns.map((it, i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-safa-ink/70">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safa-warnFg" />
                      {isAr ? it.ar : it.en}
                    </li>
                  ))
                ) : (
                  <li className="text-[12.5px] text-safa-ink/50">{L('لا توجد احتمالات واضحة في هذه الصورة.', 'No clear concerns in this image.')}</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-safa-earth">
              <ShieldAlert className="h-3.5 w-3.5" /> {L('الخطوات المقترحة', 'Suggested next steps')}
            </p>
            <ol className="mt-2.5 space-y-2">
              {(result.next_steps || []).map((it, i) => (
                <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed text-safa-ink/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-safa-palm/10 text-[10px] font-semibold text-safa-palm">
                    {i + 1}
                  </span>
                  {isAr ? it.ar : it.en}
                </li>
              ))}
            </ol>
          </div>

          <Compare previous={previous} result={result} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-safa-line bg-safa-mist/40 px-6 py-4">
        <p className="max-w-md text-[11px] leading-relaxed text-safa-ink/45">{result.model_note}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNew} className="rounded-full border-safa-line">
            <RefreshCw className="h-4 w-4" />
            {L('تحليل جديد', 'New analysis')}
          </Button>
          <Button onClick={onSave} disabled={saved} className="rounded-full bg-safa-palm text-safa-bone hover:bg-safa-palmMid">
            <Check className="h-4 w-4" />
            {saved ? L('محفوظ في السجل', 'Saved to record') : L('حفظ في سجل النخلة', 'Save to palm record')}
          </Button>
        </div>
      </div>
    </section>
  );
}