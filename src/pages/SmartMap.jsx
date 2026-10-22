import { useMemo, useState } from 'react';
import { Layers, MapPin, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import SmartMapCanvas, { LAYERS } from '@/components/SmartMapCanvas';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { HEALTH_BAND, RPW_LEVEL, WASTE_TYPE, dateStr, daysLeft, num, rpwLevel } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function SmartMap() {
  const { L, lang } = useLang();
  const { items: palms } = useList('Palm', {}, { limit: 300, sort: 'palm_identifier' });
  const { items: farms } = useList('Farm', {}, { limit: 20, sort: 'name' });
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 20, sort: 'name' });

  const [layers, setLayers] = useState({ palms: true, health: true, stress: true, rpw: true, waste: true, collection: true, facilities: true, burning: true });
  const [farmId, setFarmId] = useState('all');
  const [status, setStatus] = useState('all');
  const [risk, setRisk] = useState('all');
  const [period, setPeriod] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(
    () =>
      palms.filter((p) => {
        if (farmId !== 'all' && p.farm_id !== farmId) return false;
        if (status !== 'all' && p.status !== status) return false;
        if (risk !== 'all' && rpwLevel(p.rpw_risk) !== risk) return false;
        if (period !== 'all') {
          const d = daysLeft(p.predicted_date);
          if (d == null) return false;
          if (period === '7' && d > 7) return false;
          if (period === '14' && d > 14) return false;
          if (period === '30' && d > 30) return false;
        }
        return true;
      }),
    [palms, farmId, status, risk, period]
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('المشهد المكاني', 'SPATIAL VIEW')}
        title={L('الخريطة الذكية', 'Smart Map')}
        subtitle={L('طبقات النخيل والصحة والإجهاد وخطر السوسة والمخلفات المتوقعة والجمع ومنشآت التدوير وخطر الحرق.', 'Layers for palms, health, stress, RPW risk, predicted waste, collection, recycling facilities and burning risk.')}
        actions={<DemoTag />}
      />

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <span className="flex items-center gap-2 text-[11px] text-safa-ink/55">
          <Layers className="h-3.5 w-3.5" />
          {L('الطبقات', 'Layers')}
        </span>
        <div className="flex flex-wrap gap-2">
          {LAYERS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLayers((prev) => ({ ...prev, [l.key]: !prev[l.key] }))}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition',
                layers[l.key] ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/50'
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: layers[l.key] ? l.color : '#C9C3B4' }} />
              {L(l.ar, l.en)}
            </button>
          ))}
        </div>
      </div>

      <div className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={farmId} onValueChange={setFarmId}>
          <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل المناطق والمزارع', 'All regions and farms')}</SelectItem>
            {farms.map((f) => (
              <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل الحالات', 'All statuses')}</SelectItem>
            <SelectItem value="stable" className="text-xs">{L(HEALTH_BAND.stable.ar, HEALTH_BAND.stable.en)}</SelectItem>
            <SelectItem value="attention" className="text-xs">{L(HEALTH_BAND.attention.ar, HEALTH_BAND.attention.en)}</SelectItem>
            <SelectItem value="critical" className="text-xs">{L(HEALTH_BAND.critical.ar, HEALTH_BAND.critical.en)}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={risk} onValueChange={setRisk}>
          <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل مستويات الخطر', 'All risk levels')}</SelectItem>
            <SelectItem value="high" className="text-xs">{L(RPW_LEVEL.high.ar, RPW_LEVEL.high.en)}</SelectItem>
            <SelectItem value="medium" className="text-xs">{L(RPW_LEVEL.medium.ar, RPW_LEVEL.medium.en)}</SelectItem>
            <SelectItem value="low" className="text-xs">{L(RPW_LEVEL.low.ar, RPW_LEVEL.low.en)}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل الفترات', 'Any period')}</SelectItem>
            <SelectItem value="7" className="text-xs">{L('خلال 7 أيام', 'Within 7 days')}</SelectItem>
            <SelectItem value="14" className="text-xs">{L('خلال 14 يومًا', 'Within 14 days')}</SelectItem>
            <SelectItem value="30" className="text-xs">{L('خلال 30 يومًا', 'Within 30 days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <SmartMapCanvas palms={filtered} facilities={facilities} layers={layers} onSelect={setSelected} selectedId={selected?.id} />

        <div className="space-y-5">
          <Panel title={L('تفاصيل العنصر المحدد', 'Selected item')} icon={MapPin}>
            {!selected ? (
              <p className="text-xs leading-relaxed text-safa-ink/55">
                {L('اختر أي نقطة على الخريطة لعرض صحة النخلة ومؤشر السوسة والمخلفات المتوقعة.', 'Select any point on the map to view palm health, RPW indicator and predicted waste.')}
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-safa-palm">{L('نخلة', 'Palm')} #{selected.palm_identifier}</p>
                    <p className="mt-1 text-[11px] text-safa-ink/55">{selected.farm_name} · {selected.location}</p>
                  </div>
                  <StatusBadge tone={(HEALTH_BAND[selected.status] || HEALTH_BAND.stable).tone} label={L((HEALTH_BAND[selected.status] || HEALTH_BAND.stable).ar, (HEALTH_BAND[selected.status] || HEALTH_BAND.stable).en)} />
                </div>

                <dl className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                    <dt className="text-safa-ink/50">{L('الصحة', 'Health')}</dt>
                    <dd className="display-num mt-1 text-lg text-safa-palm">{num(selected.health_score)}/100</dd>
                  </div>
                  <div className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                    <dt className="text-safa-ink/50">RPW Risk</dt>
                    <dd className="display-num mt-1 text-lg text-safa-palm">{num(selected.rpw_risk, 2)}</dd>
                  </div>
                  <div className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                    <dt className="text-safa-ink/50">{L('مخلفات متوقعة', 'Predicted waste')}</dt>
                    <dd className="display-num mt-1 text-lg text-safa-palm">{num(selected.predicted_waste_tons, 1)} {L('طن', 't')}</dd>
                  </div>
                  <div className="rounded-xl border border-safa-line bg-safa-cream/60 p-3">
                    <dt className="text-safa-ink/50">{L('الفترة', 'Expected')}</dt>
                    <dd className="mt-1 text-sm font-semibold text-safa-palm">
                      {daysLeft(selected.predicted_date) != null ? L(`${num(daysLeft(selected.predicted_date))} يومًا`, `${num(daysLeft(selected.predicted_date))} days`) : '—'}
                    </dd>
                  </div>
                </dl>

                <p className="flex items-center gap-2 text-[11px] text-safa-earth">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {L(WASTE_TYPE[selected.predicted_classification === 'special' ? 'other' : 'fronds'].ar, WASTE_TYPE.fronds.en)} · {L('تصنيف', 'Classification')}:{' '}
                  {selected.predicted_classification === 'special' ? L('مسار معالجة خاص', 'Special pathway') : selected.predicted_classification === 'needs_verification' ? L('يحتاج تحقق', 'Needs verification') : L('قياسي', 'Standard')}
                </p>

                <Button asChild className="w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
                  <Link to={`/palms/${selected.id}`}>{L('فتح ملف النخلة', 'Open palm profile')}</Link>
                </Button>
              </div>
            )}
          </Panel>

          <Panel title={L('منشآت التدوير', 'Recycling facilities')} subtitle={L('مواقع الاستلام والطاقة التشغيلية', 'Receiving locations and capacity')}>
            <ul className="space-y-2.5">
              {facilities.map((f) => (
                <li key={f.id} className="rounded-xl border border-safa-line bg-white p-3">
                  <p className="text-[12px] font-medium text-safa-palm">{f.name}</p>
                  <p className="mt-0.5 text-[10px] text-safa-ink/50">{f.location} · {L('السعة', 'Capacity')} {num(f.capacity_tons)} {L('طن', 't')}</p>
                  <p className="mt-1 text-[10px] text-safa-earth">{L('المخلفات المتاحة', 'Available waste')}: {num(f.available_tons)} {L('طن', 't')} · {dateStr(f.created_date, lang)}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <p className="text-[10px] text-safa-ink/40">
        {L('بيانات تجريبية | Demo Data — تُعرض المواقع على أساس خريطة الأحساء.', 'Demo Data — positions are overlaid on the Al-Ahsa map image.')}
      </p>
    </div>
  );
}