import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft, ChevronRight, ClipboardList, MapPin, ShieldAlert, Sprout } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard from '@/components/StatCard';
import SmartMapCanvas, { LAYERS } from '@/components/SmartMapCanvas';
import DemoTag from '@/components/DemoTag';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { useAggregate, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { HEALTH_BAND, INSPECTION_STATUS, WASTE_STATUS, WASTE_TYPE, num, rpwLevel } from '@/lib/format';

export default function Authority() {
  const { L, isAr } = useLang();
  const { items: palms, loading } = useList('Palm', {}, { limit: 300, sort: 'palm_identifier' });
  const { items: farms } = useList('Farm', {}, { limit: 30, sort: 'name' });
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 20, sort: 'name' });
  const { items: alerts } = useList('Alert', { type: 'rpw_suspicion' }, { limit: 40, sort: '-created_date' });
  const { items: inspections } = useList('Inspection', {}, { limit: 60, sort: '-created_date' });
  const { items: waste } = useList('WasteRecord', {}, { limit: 300, sort: '-created_date' });
  const { rows } = useAggregate('WasteRecord', {}, 'status', ['quantity_tons']);

  const [level, setLevel] = useState('region');
  const [farmId, setFarmId] = useState(null);
  const [layers] = useState({ palms: true, health: true, rpw: true, stress: true, waste: true, facilities: true, burning: true, collection: true });

  const tons = useMemo(() => {
    const map = {};
    rows.forEach((r) => { map[r.status] = r.sum_quantity_tons || 0; });
    return map;
  }, [rows]);

  const highRisk = palms.filter((p) => rpwLevel(p.rpw_risk) === 'high');
  const pending = inspections.filter((i) => ['new', 'under_review', 'scheduled'].includes(i.status));
  const predictedTons = tons.predicted || 0;
  const awaiting = (tons.ready || 0) + (tons.scheduled || 0);
  const recycling = (tons.recycled || 0) + (tons.processing || 0);

  const farmStats = (farm) => {
    const fPalms = palms.filter((p) => p.farm_id === farm.id);
    const fWaste = waste.filter((w) => w.farm_id === farm.id && w.status !== 'predicted');
    return {
      palms: fPalms.length,
      high: fPalms.filter((p) => rpwLevel(p.rpw_risk) === 'high').length,
      wasteTons: fWaste.reduce((a, w) => a + (w.quantity_tons || 0), 0),
      predicted: fPalms.reduce((a, p) => a + (p.predicted_waste_tons || 0), 0),
    };
  };

  const currentFarm = farms.find((f) => f.id === farmId);
  const currentPalms = farmId ? palms.filter((p) => p.farm_id === farmId) : [];
  const currentWaste = farmId ? waste.filter((w) => w.farm_id === farmId) : [];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('لوحة الجهات المختصة', 'AUTHORITY DASHBOARD')}
        title={L('لوحة الجهات المختصة', 'Authority Dashboard')}
        subtitle={L('مراقبة المشهد الزراعي والبيئي في الأحساء مع التنقل من المنطقة إلى المزرعة إلى النخلة إلى المخلفات.', 'Monitoring the agricultural and environmental landscape in Al-Ahsa with drill-down from region to farm to palm to waste.')}
        actions={<DemoTag />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={L('نخيل تحت المراقبة', 'Monitored palms')} value={palms.length} icon={Sprout} demo />
        <StatCard label={L('نخيل بمؤشر خطر مرتفع', 'High-risk palms')} value={highRisk.length} icon={ShieldAlert} tone="danger" demo />
        <StatCard label={L('اشتباه بسوسة النخيل', 'Suspected RPW')} value={alerts.length} icon={ShieldAlert} tone="gold" demo />
        <StatCard label={L('مخلفات متوقعة', 'Predicted waste')} value={predictedTons} decimals={1} suffix={L(' طن', ' t')} icon={MapPin} tone="gold" demo />
        <StatCard label={L('مخلفات بانتظار الجمع', 'Waste awaiting collection')} value={awaiting} decimals={1} suffix={L(' طن', ' t')} icon={MapPin} demo />
        <StatCard label={L('نشاط التدوير والمعالجة', 'Recycling & processing')} value={recycling} decimals={1} suffix={L(' طن', ' t')} icon={Building2} tone="olive" demo />
        <StatCard label={L('خطر الحرق / التخلص غير المناسب', 'Burning / disposal risk')} value={tons.burning_risk || 0} decimals={1} suffix={L(' طن', ' t')} icon={ShieldAlert} tone="danger" demo />
        <StatCard label={L('طلبات فحص قيد الانتظار', 'Pending inspection requests')} value={pending.length} icon={ClipboardList} demo />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel title={L('الخريطة الذكية — الأحساء', 'Smart map — Al-Ahsa')} subtitle={L('النخيل، الصحة، الإجهاد، خطر السوسة، المخلفات المتوقعة، الجمع، ومنشآت التدوير', 'Palms, health, stress, RPW risk, predicted waste, collection and facilities')} action={<DemoTag />}>
          <SmartMapCanvas palms={palms} facilities={facilities} layers={layers} compact />
          <div className="mt-4 flex flex-wrap gap-2">
            {LAYERS.map((l) => (
              <span key={l.key} className="flex items-center gap-1.5 rounded-full border border-safa-line bg-white px-2.5 py-1 text-[10px] text-safa-ink/60">
                <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                {L(l.ar, l.en)}
              </span>
            ))}
          </div>
        </Panel>

        <Panel
          title={L('التنقل من المنطقة إلى المخلفات', 'Region → farm → palm → waste')}
          icon={MapPin}
          action={
            level !== 'region' ? (
              <Button
                variant="outline"
                size="sm"
                className="border-safa-line text-[11px] text-safa-palm"
                onClick={() => {
                  setLevel(level === 'palm' ? 'farm' : 'region');
                  if (level === 'palm') setFarmId(null);
                }}
              >
                {isAr ? <ChevronRight className="me-1 h-3 w-3" /> : <ChevronLeft className="me-1 h-3 w-3" />}
                {L('رجوع', 'Back')}
              </Button>
            ) : null
          }
        >
          <div className="mb-4 flex items-center gap-2 text-[11px] text-safa-ink/50">
            <button onClick={() => { setLevel('region'); setFarmId(null); }} className={level === 'region' ? 'font-semibold text-safa-palm' : ''}>
              {L('الأحساء', 'Al-Ahsa')}
            </button>
            {currentFarm ? (
              <>
                <span>/</span>
                <button onClick={() => setLevel('farm')} className={level === 'farm' ? 'font-semibold text-safa-palm' : ''}>
                  {currentFarm.name}
                </button>
              </>
            ) : null}
            {level === 'palm' && currentFarm ? (
              <>
                <span>/</span>
                <span className="font-semibold text-safa-palm">{L('النخيل', 'Palms')}</span>
              </>
            ) : null}
          </div>

          {level === 'region' ? (
            <button onClick={() => setLevel('farm')} className="w-full rounded-2xl border border-safa-line bg-safa-cream/60 p-5 text-start transition hover:border-safa-sand hover:shadow-md">
              <p className="font-display text-xl font-semibold text-safa-palm">{L('الأحساء', 'Al-Ahsa')}</p>
              <p className="mt-1 text-[11px] text-safa-ink/55">{L('واحة النخيل — المنطقة الرئيسية للمراقبة', 'The palm oasis — primary monitoring region')}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <dt className="text-safa-ink/45">{L('كثافة النخيل', 'Palm density')}</dt>
                  <dd className="display-num mt-1 text-lg text-safa-palm">{num(palms.length)}</dd>
                </div>
                <div>
                  <dt className="text-safa-ink/45">{L('كثافة الخطر', 'Risk density')}</dt>
                  <dd className="display-num mt-1 text-lg text-safa-dangerFg">{num(highRisk.length)}</dd>
                </div>
                <div>
                  <dt className="text-safa-ink/45">{L('كثافة المخلفات', 'Waste density')}</dt>
                  <dd className="display-num mt-1 text-lg text-safa-palm">{num(Object.values(tons).reduce((a, b) => a + b, 0), 1)} {L('طن', 't')}</dd>
                </div>
                <div>
                  <dt className="text-safa-ink/45">{L('نشاط الجمع والتدوير', 'Collection & recycling')}</dt>
                  <dd className="display-num mt-1 text-lg text-safa-olive">{num(recycling + awaiting, 1)} {L('طن', 't')}</dd>
                </div>
              </dl>
            </button>
          ) : null}

          {level === 'farm' ? (
            <ul className="space-y-2.5">
              {farms.map((f) => {
                const s = farmStats(f);
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => {
                        setFarmId(f.id);
                        setLevel('palm');
                      }}
                      className="w-full rounded-2xl border border-safa-line bg-white p-4 text-start transition hover:border-safa-sand hover:shadow-md"
                    >
                      <p className="text-[12px] font-semibold text-safa-palm">{f.name}</p>
                      <p className="mt-0.5 text-[10px] text-safa-ink/50">{f.location} · {f.region}</p>
                      <p className="mt-2 flex flex-wrap gap-3 text-[10px] text-safa-ink/60">
                        <span>{L('نخيل', 'Palms')}: {s.palms}</span>
                        <span>{L('خطر مرتفع', 'High risk')}: {s.high}</span>
                        <span>{L('مخلفات', 'Waste')}: {num(s.wasteTons, 1)} {L('طن', 't')}</span>
                        <span>{L('متوقع', 'Predicted')}: {num(s.predicted, 1)} {L('طن', 't')}</span>
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {level === 'palm' && currentFarm ? (
            <div className="space-y-4">
              <ul className="max-h-72 space-y-2 overflow-y-auto pe-1">
                {currentPalms.map((p) => {
                  const band = HEALTH_BAND[p.status] || HEALTH_BAND.stable;
                  return (
                    <li key={p.id}>
                      <Link to={`/palms/${p.id}`} className="flex items-center justify-between rounded-xl border border-safa-line bg-white p-3 transition hover:border-safa-sand">
                        <span className="text-[11px] font-medium text-safa-palm">{L('نخلة', 'Palm')} #{p.palm_identifier}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] text-safa-ink/55">{num(p.health_score)}/100</span>
                          <StatusBadge tone={band.tone} label={L(band.ar, band.en)} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div>
                <p className="mb-2 text-[11px] font-semibold text-safa-palm">{L('مخلفات المزرعة', 'Farm waste')}</p>
                {!currentWaste.length ? (
                  <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} />
                ) : (
                  <ul className="space-y-1.5">
                    {currentWaste.slice(0, 5).map((w) => {
                      const st = WASTE_STATUS[w.status] || WASTE_STATUS.predicted;
                      return (
                        <li key={w.id} className="flex items-center justify-between rounded-xl border border-safa-line bg-safa-cream/60 px-3 py-2">
                          <span className="text-[10px] text-safa-ink/70">
                            {w.waste_code} · {L(WASTE_TYPE[w.waste_type]?.ar, WASTE_TYPE[w.waste_type]?.en)}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] tabular-nums text-safa-palm">{num(w.quantity_tons, 1)} {L('طن', 't')}</span>
                            <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </Panel>
      </div>

      <Panel title={L('طلبات الفحص على مستوى المنطقة', 'Regional inspection requests')} icon={ClipboardList}>
        {!inspections.length ? (
          <EmptyState title={L('لا توجد طلبات فحص بعد', 'No inspection requests yet')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[11px]">
              <thead>
                <tr className="text-safa-ink/45">
                  <th className="pb-3 text-start font-normal">{L('الطلب', 'Request')}</th>
                  <th className="pb-3 text-start font-normal">{L('النخلة', 'Palm')}</th>
                  <th className="pb-3 text-start font-normal">{L('المزرعة', 'Farm')}</th>
                  <th className="pb-3 text-start font-normal">{L('الأولوية', 'Priority')}</th>
                  <th className="pb-3 text-start font-normal">{L('المسؤول', 'Assigned to')}</th>
                  <th className="pb-3 text-start font-normal">{L('الحالة', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {inspections.slice(0, 10).map((i) => {
                  const st = INSPECTION_STATUS[i.status] || INSPECTION_STATUS.new;
                  return (
                    <tr key={i.id} className="border-t border-safa-line/60">
                      <td className="py-3 font-medium text-safa-palm">{i.inspection_code}</td>
                      <td className="py-3 text-safa-ink/70">#{i.palm_identifier}</td>
                      <td className="py-3 text-safa-ink/70">{i.farm_name}</td>
                      <td className="py-3 text-safa-ink/70">{i.priority}</td>
                      <td className="py-3 text-safa-ink/70">{i.assigned_to}</td>
                      <td className="py-3"><StatusBadge tone={st.tone} label={L(st.ar, st.en)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}