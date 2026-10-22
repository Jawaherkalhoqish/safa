import { Inbox } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function EmptyState({ title, body, action, icon: Icon = Inbox }) {
  const { L } = useLang();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-safa-line bg-safa-cream/60 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-safa-line bg-white text-safa-earth">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-safa-palm">{title || L('لا توجد بيانات كافية بعد', 'Not enough data yet')}</p>
      {body ? <p className="mt-2 max-w-sm text-xs leading-relaxed text-safa-ink/55">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label }) {
  const { L } = useLang();
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-safa-line bg-white px-5 py-4 text-sm text-safa-ink/60">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-safa-line border-t-safa-palm" />
      {label || L('جاري تحليل البيانات…', 'Analyzing data…')}
    </div>
  );
}

export function ErrorState({ label }) {
  const { L } = useLang();
  return (
    <div className="rounded-2xl border border-safa-dangerLine bg-safa-dangerBg/60 px-5 py-4 text-sm text-safa-dangerFg">
      {label || L('تعذر تحميل البيانات', 'Could not load data')}
    </div>
  );
}