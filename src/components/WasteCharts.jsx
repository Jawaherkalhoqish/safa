import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useLang } from '@/lib/i18n';
import { num } from '@/lib/format';

const Donut = ({ title, data, onSelect, unit }) => {
  const total = data.reduce((a, d) => a + d.tons, 0);
  return (
    <div className="rounded-2xl border border-safa-line bg-white p-5">
      <p className="text-xs font-medium text-safa-palm">{title}</p>
      <div className="relative mt-3 h-56" style={{ direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="tons" nameKey="label" innerRadius={58} outerRadius={84} paddingAngle={2} onClick={(d) => onSelect?.(d?.key)}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} stroke="white" strokeWidth={1.5} className="cursor-pointer outline-none" />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [`${num(v, 1)} ${unit}`, n]} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--safa-line))', backgroundColor: 'hsl(var(--safa-card))', color: 'hsl(var(--safa-ink))', fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="display-num text-2xl text-safa-palm">{num(total, 1)}</span>
          <span className="text-[10px] text-safa-ink/45">{unit}</span>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {data.map((d) => (
          <li key={d.key}>
            <button onClick={() => onSelect?.(d.key)} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-start transition hover:bg-safa-mist">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              <span className="flex-1 text-xs text-safa-ink/75">{d.label}</span>
              <span className="text-xs font-semibold tabular-nums text-safa-palm">{num(d.tons, 1)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function WasteCharts({ byType = [], byStatus = [], onSelect }) {
  const { L, lang } = useLang();
  const unit = L('طن', 'tons');
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Donut title={L('التوزيع حسب نوع المخلفات', 'Breakdown by waste type')} data={byType} unit={unit} onSelect={(k) => onSelect?.({ kind: 'type', key: k })} />
      <Donut title={L('التوزيع حسب الحالة', 'Breakdown by status')} data={byStatus} unit={unit} onSelect={(k) => onSelect?.({ kind: 'status', key: k })} />
      <p className="text-[10px] text-safa-ink/45 lg:col-span-2">
        {L('اضغط على أي فئة لعرض المخلفات المرتبطة بها.', 'Click any category to view the related waste records.')} ·{' '}
        {L('بيانات تجريبية | Demo Data', 'Demo Data')} {lang === 'ar' ? '' : ''}
      </p>
    </div>
  );
}