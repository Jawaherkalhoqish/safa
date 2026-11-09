import { useEffect, useState } from 'react';
import { History, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const RISK_CLS = {
  low: 'bg-safa-okBg text-safa-okFg border-safa-okLine',
  medium: 'bg-safa-warnBg text-safa-warnFg border-safa-warnLine',
  high: 'bg-safa-dangerBg text-safa-dangerFg border-safa-dangerLine',
};

export default function AnalysisHistory({ items, loading, palmLabel }) {
  const { L, isAr } = useLang();
  const [urls, setUrls] = useState({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const entries = await Promise.all(
        items.slice(0, 8).map(async (it) => {
          if (!it.image_uri) return [it.id, ''];
          try {
            const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: it.image_uri });
            return [it.id, signed_url];
          } catch (e) {
            return [it.id, ''];
          }
        })
      );
      if (!cancelled) setUrls(Object.fromEntries(entries));
    };
    if (items.length) load();
    return () => {
      cancelled = true;
    };
  }, [items]);

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-safa-palm">
          <History className="h-4 w-4 text-safa-oliveSoft" />
          {L('سجل التحليلات', 'Analysis history')}
        </p>
        <span className="text-[11px] text-safa-earth">{items.length}</span>
      </div>
      <p className="mt-1 text-[11.5px] text-safa-ink/50">
        {palmLabel ? `${L('النخلة:', 'Palm:')} ${palmLabel}` : L('كل التحليلات المحفوظة', 'All saved analyses')}
      </p>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-[12px] text-safa-ink/50">
          <Loader2 className="h-4 w-4 animate-spin" /> {L('جارٍ التحميل...', 'Loading...')}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-safa-line px-4 py-8 text-center text-[12px] text-safa-ink/45">
          {L('لا توجد تحليلات محفوظة بعد.', 'No saved analyses yet.')}
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.slice(0, 8).map((it, i) => {
            const next = items[i + 1];
            const delta = next ? Math.round(it.health_score) - Math.round(next.health_score) : null;
            return (
              <li key={it.id} className="flex gap-3 rounded-xl border border-safa-line bg-white p-2.5">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-safa-mist">
                  {urls[it.id] ? (
                    <Image src={urls[it.id]} alt={L('صورة التحليل', 'Analysis image')} className="h-full w-full" fittingType="fill" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[12px] font-medium text-safa-palm">
                      {it.palm_identifier || it.analysis_code || L('تحليل', 'Analysis')}
                    </p>
                    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', RISK_CLS[it.risk_level] || RISK_CLS.medium)}>
                      {Math.round(it.health_score)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-safa-ink/45">
                    {new Date(it.created_date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    {' · '}
                    {it.source === 'ai' ? L('نموذج رؤية', 'Vision model') : L('تجريبي', 'Demo')}
                  </p>
                  {delta !== null ? (
                    <p className="mt-0.5 text-[10.5px] text-safa-ink/55">
                      {delta === 0
                        ? L('مطابق للتحليل السابق', 'Same as previous')
                        : `${delta > 0 ? '+' : ''}${delta} ${L('مقارنة بالسابق', 'vs previous')}`}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {isAr ? null : null}
    </section>
  );
}