import { Check, Clock } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { COLLECTION_STATUS, dateStr, pick } from '@/lib/format';
import { cn } from '@/lib/utils';

export const COLLECTION_FLOW = [
  { key: 'requested', ar: 'تم إنشاء الطلب', en: 'Request created' },
  { key: 'accepted', ar: 'تم قبول الطلب', en: 'Request accepted' },
  { key: 'scheduled', ar: 'تم تحديد الموعد', en: 'Pickup scheduled' },
  { key: 'in_transit', ar: 'في الطريق', en: 'In transit' },
  { key: 'received', ar: 'تم الاستلام', en: 'Received' },
  { key: 'at_facility', ar: 'تم الوصول للمنشأة', en: 'Arrived at facility' },
  { key: 'processing', ar: 'قيد المعالجة', en: 'In processing' },
  { key: 'recycled', ar: 'تم التدوير', en: 'Recycled' },
];

export default function Timeline({ steps = [], compact = false }) {
  const { L, lang } = useLang();
  const list = steps.length ? steps : COLLECTION_FLOW.map((s, i) => ({ ...s, done: i === 0 }));

  return (
    <ol className="relative space-y-0">
      {list.map((s, i) => {
        const active = s.current || (s.done && (i === list.length - 1 || !list[i + 1]?.done));
        return (
          <li key={s.key || i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition',
                  s.done ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/40',
                  active && 'ring-4 ring-safa-gold/20'
                )}
              >
                {s.done ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              </span>
              {i < list.length - 1 ? <span className={cn('my-0.5 w-px flex-1', s.done ? 'bg-safa-palm/40' : 'bg-safa-line')} style={{ minHeight: compact ? 18 : 26 }} /> : null}
            </div>
            <div className={cn('pb-5', compact && 'pb-3')}>
              <p className={cn('text-[13px]', s.done ? 'font-medium text-safa-palm' : 'text-safa-ink/45')}>{L(s.ar, s.en)}</p>
              {s.at ? <p className="mt-0.5 text-[10px] text-safa-ink/45">{dateStr(s.at, lang, true)}</p> : null}
            </div>
          </li>
        );
      })}
      <li className="sr-only">{pick(COLLECTION_STATUS, 'requested', lang)}</li>
    </ol>
  );
}