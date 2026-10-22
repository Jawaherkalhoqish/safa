import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Droplets, Radio, ShieldAlert, Thermometer } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import HealthCharts from '@/components/HealthCharts';
import AiAnalysisCard from '@/components/AiAnalysisCard';
import InspectionDialog from '@/components/InspectionDialog';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { HEALTH_BAND, RPW_LEVEL, num, rpwLevel } from '@/lib/format';

export default function PalmHealth() {
  const { L } = useLang();
  const { items: palms, loading } = useList('Palm', {}, { limit: 200, sort: '-rpw_risk' }, true);
  const [palmId, setPalmId] = useState('');
  const [inspectionOpen, setInspectionOpen] = useState(false);

  const palm = useMemo(
    () => palms.find((p) => p.id === palmId) || palms.find((p) => p.palm_identifier === '104') || palms[0],
    [palms, palmId]
  );

  useEffect(() => {
    if (palm && !palmId) setPalmId(palm.id);
  }, [palm, palmId]);

  const readings = useList('SensorReading', palm ? { palm_id: palm.id } : { palm_id: 'none' }, { limit: 400, sort: '-recorded_at' });

  if (loading) return <LoadingState />;
  if (!palm) return <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} />;

  const band = HEALTH_BAND[palm.status] || HEALTH_BAND.stable;
  const risk = RPW_LEVEL[rpwLevel(palm.rpw_risk)];

  const cards = [
    { icon: Radio, ar: 'النشاط الكهربائي', en: 'Electrical activity', value: num(palm.electrical_activity, 2) },
    { icon: Activity, ar: 'النشاط الصوتي / الاهتزازي', en: 'Acoustic / vibration', value: num(palm.acoustic_activity, 2) },
    { icon: Droplets, ar: 'رطوبة التربة', en: 'Soil moisture', value: `${num(palm.soil_moisture)}%` },
    { icon: Thermometer, ar: 'درجة الحرارة', en: 'Temperature', value: `${num(palm.temperature)}°C` },
    { icon: Droplets, ar: 'حالة الري', en: 'Irrigation status', value: palm.irrigation_status || '—' },
    { icon: ShieldAlert, ar: 'خطر السوسة', en: 'RPW risk', value: num(palm.rpw_risk, 2) },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('مؤشرات صحة النخيل', 'PALM HEALTH INTELLIGENCE')}
        title={L('صحة النخيل', 'Palm Health')}
        subtitle={L('مؤشرات مدمجة من الاستشعار والبيئة وسجل الفحص لدعم قرارك في الميدان.', 'Indicators fused from sensing, environment and inspection history to support your field decisions.')}
        actions={
          <>
            <DemoTag />
            <Select value={palm.id} onValueChange={setPalmId}>
              <SelectTrigger className="h-10 w-[230px] bg-white text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {palms.slice(0, 40).map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {L('نخلة', 'Palm')} #{p.palm_identifier} · {p.farm_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="panel p-6">
          <p className="eyebrow">{palm.farm_name} · {palm.location}</p>
          <p className="mt-3 font-display text-xl font-semibold text-safa-palm">{L('نخلة', 'Palm')} #{palm.palm_identifier}</p>
          <div className="mt-5 flex flex-wrap items-end gap-4">
            <p className="display-num text-6xl leading-none text-safa-palm">{num(palm.health_score)}</p>
            <p className="pb-1 text-sm text-safa-ink/45">/ 100</p>
            <div className="pb-1.5">
              <StatusBadge tone={band.tone} label={L(band.ar, band.en)} />
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-safa-mist">
            <div className="h-full rounded-full bg-gradient-to-r from-safa-olive to-safa-palm" style={{ width: `${palm.health_score}%` }} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-safa-ink/55">
            {L(
              'تُحسب الدرجة من دمج عدة إشارات، وتُعرض كمؤشر للمتابعة لا كتشخيص نهائي.',
              'The score is fused from multiple signals and shown as a monitoring indicator, not a diagnosis.'
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setInspectionOpen(true)} className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
              {L('طلب فحص', 'Request inspection')}
            </Button>
            <Button asChild variant="outline" className="border-safa-line text-safa-palm">
              <Link to={`/palms/${palm.id}`}>{L('ملف النخلة الكامل', 'Full palm profile')}</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.en} className="panel p-4">
              <div className="flex items-center gap-2 text-[11px] text-safa-ink/55">
                <c.icon className="h-3.5 w-3.5 text-safa-olive" />
                {L(c.ar, c.en)}
              </div>
              <p className="display-num mt-3 text-xl text-safa-palm">{c.value}</p>
            </div>
          ))}
        </div>
      </div>

      <AiAnalysisCard
        tone={risk.tone}
        riskLevel={rpwLevel(palm.rpw_risk)}
        confidence={palm.rpw_risk >= 0.6 ? 'high' : 'medium'}
        indicator={num(palm.rpw_risk, 2)}
        title={L('تحليل سعفة', 'SA’FA analysis')}
        body={
          palm.rpw_risk >= 0.6
            ? L('تم رصد نمط غير معتاد يستدعي المتابعة والفحص الميداني.', 'An abnormal signal pattern has been detected and field inspection is recommended.')
            : L('تشير البيانات الحالية إلى استقرار عام في مؤشرات النخلة، مع عدم وجود ارتفاع ملحوظ في مؤشر خطر السوسة.', 'Current data indicates generally stable palm conditions, with no significant elevation in the Red Palm Weevil risk indicator.')
        }
        reason={L('دمج قراءات النشاط الكهربائي والصوتي مع رطوبة التربة وسجل الفحص.', 'Fusion of electrical and acoustic readings with soil moisture and inspection history.')}
        recommendation={L('متابعة القراءات، وفحص ميداني عند تجاوز المؤشر 0.60.', 'Continue monitoring; field inspection when the indicator exceeds 0.60.')}
      />

      <Panel title={L('السلاسل الزمنية', 'Time series')} subtitle={L('24 ساعة | 7 أيام | 30 يومًا', '24 hours | 7 days | 30 days')} icon={Activity} action={<DemoTag />}>
        <HealthCharts readings={readings.items} />
      </Panel>

      <InspectionDialog palm={palm} open={inspectionOpen} onOpenChange={setInspectionOpen} />
    </div>
  );
}