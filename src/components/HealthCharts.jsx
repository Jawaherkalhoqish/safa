import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLang } from '@/lib/i18n';
import EmptyState from '@/components/EmptyState';

const RANGES = [
  { key: '24h', hours: 24 },
  { key: '7d', hours: 24 * 7 },
  { key: '30d', hours: 24 * 30 },
];

export default function HealthCharts({ readings = [] }) {
  const { L } = useLang();
  const [range, setRange] = useState('7d');

  const data = useMemo(() => {
    const hours = RANGES.find((r) => r.key === range)?.hours ?? 168;
    const cutoff = Date.now() - hours * 3600 * 1000;
    return readings
      .filter((r) => new Date(r.recorded_at).getTime() >= cutoff)
      .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))
      .map((r) => ({
        t: new Date(r.recorded_at).toLocaleString('en-GB', range === '24h' ? { hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: 'short' }),
        electrical: r.electrical_activity,
        acoustic: r.acoustic_activity,
        soil: r.soil_moisture,
        temp: r.temperature,
      }));
  }, [readings, range]);

  if (!readings.length) {
    return <EmptyState title={L('لا توجد قراءات استشعار لهذه النخلة بعد', 'No sensor readings for this palm yet')} body={L('اربط وحدة استشعار لعرض المؤشرات الزمنية.', 'Connect a sensor unit to display time-series indicators.')} />;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Tabs value={range} onValueChange={setRange}>
          <TabsList className="bg-safa-mist">
            <TabsTrigger value="24h" className="text-xs">{L('24 ساعة', '24 hours')}</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs">{L('7 أيام', '7 days')}</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs">{L('30 يومًا', '30 days')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-[10px] text-safa-ink/45">{L('بيانات تجريبية | Demo Data', 'Demo Data')}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-safa-line bg-white p-4">
          <p className="text-xs font-medium text-safa-palm">{L('النشاط الكهربائي والصوتي / الاهتزازي', 'Electrical and acoustic / vibration activity')}</p>
          <div className="mt-3 h-56" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--safa-line))" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'hsl(var(--safa-earth))' }} minTickGap={24} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--safa-earth))' }} domain={[0, 1]} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--safa-line))', backgroundColor: 'hsl(var(--safa-card))', color: 'hsl(var(--safa-ink))', fontSize: 11 }} />
                <Line type="monotone" dataKey="electrical" stroke="hsl(var(--safa-forest))" strokeWidth={2} dot={false} name={L('كهربائي', 'Electrical')} />
                <Line type="monotone" dataKey="acoustic" stroke="#C8A15A" strokeWidth={2} dot={false} name={L('صوتي', 'Acoustic')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-safa-line bg-white p-4">
          <p className="text-xs font-medium text-safa-palm">{L('رطوبة التربة ودرجة الحرارة', 'Soil moisture and temperature')}</p>
          <div className="mt-3 h-56" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="soilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--safa-forest))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--safa-forest))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--safa-line))" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'hsl(var(--safa-earth))' }} minTickGap={24} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--safa-earth))' }} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--safa-line))', backgroundColor: 'hsl(var(--safa-card))', color: 'hsl(var(--safa-ink))', fontSize: 11 }} />
                <Area type="monotone" dataKey="soil" stroke="hsl(var(--chart-2))" fill="url(#soilFill)" strokeWidth={2} name={L('رطوبة التربة %', 'Soil %')} />
                <Line type="monotone" dataKey="temp" stroke="#B03A2E" strokeWidth={1.5} dot={false} name={L('الحرارة °C', 'Temp °C')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}