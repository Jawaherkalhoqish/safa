import { useState } from 'react';
import { Activity, AlertTriangle, ClipboardList, Droplets, Flag, Gauge, History, Radio, Recycle, Sprout, Thermometer, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import Panel from '@/components/Panel';
import StatusBadge from '@/components/StatusBadge';
import HealthCharts from '@/components/HealthCharts';
import AiAnalysisCard from '@/components/AiAnalysisCard';
import InspectionDialog from '@/components/InspectionDialog';
import CollectionDialog from '@/components/CollectionDialog';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import {
  HEALTH_BAND, RISK_CLASS, RPW_LEVEL, WASTE_STATUS, WASTE_TYPE, daysLeft, money, num, pick, rpwLevel,
} from '@/lib/format';
import { base44 } from '@/api/base44Client';

const Signal = ({ icon: Icon, label, value, unit }) => (
  <div className="rounded-2xl border border-safa-line bg-white p-4">
    <div className="flex items-center gap-2 text-[11px] text-safa-ink/55">
      <Icon className="h-3.5 w-3.5 text-safa-olive" />
      {label}
    </div>
    <p className="display-num mt-2 text-2xl text-safa-palm">
      {value}
      {unit ? <span className="ms-1 text-sm font-normal text-safa-ink/50">{unit}</span> : null}
    </p>
  </div>
);

export default function PalmDetail({ palm }) {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const { items: readings } = useList('SensorReading', { palm_id: palm.id }, { limit: 400, sort: '-recorded_at' });
  const { items: waste } = useList('WasteRecord', { palm_id: palm.id }, { limit: 50, sort: '-created_date' });
  const { items: alerts } = useList('Alert', { palm_id: palm.id }, { limit: 20, sort: '-created_date' });
  const { items: inspections, reload: reloadInspections } = useList('Inspection', { palm_id: palm.id }, { limit: 20 });

  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [note, setNote] = useState('');

  const band = HEALTH_BAND[palm.status] || HEALTH_BAND.stable;
  const risk = RPW_LEVEL[rpwLevel(palm.rpw_risk)];
  const predictedRecord = waste.find((w) => w.status === 'predicted');
  const predictedDays = daysLeft(palm.predicted_date);

  const reportIssue = async () => {
    if (!note.trim()) return;
    await base44.entities.Alert.create({
      alert_code: `A-${palm.palm_identifier}-R${Math.floor(10 + Math.random() * 89)}`,
      palm_id: palm.id,
      palm_identifier: palm.palm_identifier,
      farm_name: palm.farm_name,
      region: palm.region,
      type: 'sensor_anomaly',
      severity: 'medium',
      title: L('ملاحظة من الميدان', 'Field note reported'),
      reason: note,
      indicator: palm.rpw_risk,
      recommendation: L('مراجعة الملاحظة وربطها بقراءات الاستشعار.', 'Review the note against sensor readings.'),
      status: 'new',
    });
    setNote('');
    setReportOpen(false);
    toast({ title: L('تم تسجيل الملاحظة في التنبيهات', 'Note saved to alerts') });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="panel flex flex-col justify-between p-6">
          <div>
            <p className="eyebrow">{palm.farm_name} · {palm.region}</p>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <p className="display-num text-6xl leading-none text-safa-palm">{num(palm.health_score)}</p>
              <p className="pb-1 text-sm text-safa-ink/50">/ 100</p>
              <div className="pb-1.5">
                <StatusBadge tone={band.tone} label={L(band.ar, band.en)} />
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-safa-ink/60">
              {L(
                'درجة صحة النخلة مبنية على دمج إشارات الاستشعار والبيئة وسجل الفحص، وتُعرض كمؤشر لدعم القرار.',
                'The palm health score fuses sensor, environmental and inspection history signals and is presented as a decision-support indicator.'
              )}
            </p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-safa-line pt-4 text-[11px] sm:grid-cols-4">
            <div>
              <dt className="text-safa-ink/45">{L('الصنف', 'Variety')}</dt>
              <dd className="mt-1 font-medium text-safa-palm">{palm.variety}</dd>
            </div>
            <div>
              <dt className="text-safa-ink/45">{L('العمر', 'Age')}</dt>
              <dd className="mt-1 font-medium text-safa-palm">{num(palm.age_years)} {L('سنة', 'years')}</dd>
            </div>
            <div>
              <dt className="text-safa-ink/45">{L('الري', 'Irrigation')}</dt>
              <dd className="mt-1 font-medium text-safa-palm">{palm.irrigation_status || palm.irrigation_type}</dd>
            </div>
            <div>
              <dt className="text-safa-ink/45">{L('وحدة الاستشعار', 'Sensor unit')}</dt>
              <dd className="mt-1 font-medium text-safa-palm">{palm.sensor_unit || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Signal icon={Radio} label={L('النشاط الكهربائي', 'Electrical activity')} value={num(palm.electrical_activity, 2)} />
            <Signal icon={Activity} label={L('النشاط الصوتي / الاهتزازي', 'Acoustic / vibration')} value={num(palm.acoustic_activity, 2)} />
            <Signal icon={Droplets} label={L('رطوبة التربة', 'Soil moisture')} value={num(palm.soil_moisture)} unit="%" />
            <Signal icon={Thermometer} label={L('درجة الحرارة', 'Temperature')} value={num(palm.temperature)} unit="°C" />
          </div>
          <AiAnalysisCard
            tone={risk.tone}
            riskLevel={rpwLevel(palm.rpw_risk)}
            confidence={palm.rpw_risk >= 0.6 ? 'high' : 'medium'}
            indicator={num(palm.rpw_risk, 2)}
            title={L('تحليل سعفة الآلي', 'SA’FA automated analysis')}
            body={
              palm.rpw_risk >= 0.6
                ? L('تم رصد نمط غير معتاد يستدعي المتابعة والفحص الميداني.', 'An abnormal signal pattern has been detected and field inspection is recommended.')
                : L('تشير البيانات الحالية إلى استقرار عام في مؤشرات النخلة، مع عدم وجود ارتفاع ملحوظ في مؤشر خطر السوسة.', 'Current data indicates generally stable palm conditions, with no significant elevation in the Red Palm Weevil risk indicator.')
            }
            reason={
              palm.rpw_risk >= 0.6
                ? L('ارتفاع نسبي في النشاط الصوتي مع انخفاض رطوبة التربة.', 'Relative rise in acoustic activity alongside lower soil moisture.')
                : L('دمج قراءات النشاط الكهربائي والصوتي مع رطوبة التربة وسجل الفحص.', 'Fusion of electrical and acoustic readings with soil moisture and inspection history.')
            }
            recommendation={L('فحص ميداني عند تجاوز المؤشر 0.60.', 'Field inspection when the indicator exceeds 0.60.')}
          />
        </div>
      </div>

      <Tabs defaultValue="sensors" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-safa-mist p-1">
          <TabsTrigger value="overview" className="text-xs">{L('نظرة عامة', 'Overview')}</TabsTrigger>
          <TabsTrigger value="sensors" className="text-xs">{L('إشارات الاستشعار', 'Sensor signals')}</TabsTrigger>
          <TabsTrigger value="environment" className="text-xs">{L('البيئة', 'Environment')}</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs">{L('الخطر', 'Risk')}</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">{L('السجل', 'History')}</TabsTrigger>
          <TabsTrigger value="waste" className="text-xs">{L('المخلفات', 'Waste')}</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">{L('الإجراءات', 'Actions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title={L('ملخص الملف', 'Profile summary')} icon={Sprout}>
              <dl className="space-y-3 text-[12px]">
                {[
                  [L('المزرعة', 'Farm'), palm.farm_name],
                  [L('الموقع', 'Location'), palm.location],
                  [L('منطقة الزراعة', 'Planting area'), palm.planting_area || '—'],
                  [L('نوع الري', 'Irrigation type'), palm.irrigation_type],
                  [L('آخر قراءة', 'Last reading'), palm.last_sensor_at ? new Date(palm.last_sensor_at).toLocaleString('en-GB') : '—'],
                  [L('آخر فحص', 'Last inspection'), palm.last_inspection_at ? new Date(palm.last_inspection_at).toLocaleDateString('en-GB') : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-safa-ink/50">{k}</dt>
                    <dd className="text-end font-medium text-safa-palm">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel title={L('المؤشرات الحالية', 'Current indicators')} icon={Gauge}>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-safa-ink/55">{L('خطر السوسة الحمراء', 'Red Palm Weevil risk')}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-safa-mist">
                    <div className="h-full rounded-full bg-safa-palm" style={{ width: `${Math.min(100, palm.rpw_risk * 100)}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-safa-ink/50">{num(palm.rpw_risk, 2)} · {L(risk.ar, risk.en)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-safa-ink/55">{L('صحة النخلة', 'Palm health')}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-safa-mist">
                    <div className="h-full rounded-full bg-safa-olive" style={{ width: `${palm.health_score}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-safa-ink/50">{num(palm.health_score)} / 100</p>
                </div>
              </div>
            </Panel>
            <Panel title={L('المخلفات المتوقعة', 'Predicted waste')} icon={Recycle}>
              {predictedRecord || palm.predicted_waste_tons ? (
                <div>
                  <p className="display-num text-4xl text-safa-palm">{num(palm.predicted_waste_tons, 1)} <span className="text-base font-normal text-safa-ink/50">{L('طن', 'tons')}</span></p>
                  <p className="mt-2 text-[12px] text-safa-ink/60">
                    {L('متوقع خلال', 'Expected within')} {num(predictedDays)} {L('يومًا', 'days')} · {L(WASTE_TYPE[predictedRecord?.waste_type || 'fronds'].ar, WASTE_TYPE[predictedRecord?.waste_type || 'fronds'].en)}
                  </p>
                  <p className="mt-3">
                    <StatusBadge tone={RISK_CLASS[palm.predicted_classification]?.tone || 'sand'} label={L(RISK_CLASS[palm.predicted_classification]?.ar, RISK_CLASS[palm.predicted_classification]?.en)} />
                  </p>
                </div>
              ) : (
                <p className="text-xs text-safa-ink/50">{L('لا توجد بيانات كافية بعد', 'Not enough data yet')}</p>
              )}
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="sensors" className="mt-5">
          <Panel title={L('سلاسل الإشارات الزمنية', 'Signal time series')} subtitle={L('بيانات تجريبية | Demo Data', 'Demo Data')}>
            <HealthCharts readings={readings} />
          </Panel>
        </TabsContent>

        <TabsContent value="environment" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Signal icon={Droplets} label={L('رطوبة التربة', 'Soil moisture')} value={num(palm.soil_moisture)} unit="%" />
            <Signal icon={Thermometer} label={L('درجة الحرارة', 'Temperature')} value={num(palm.temperature)} unit="°C" />
            <Signal icon={Activity} label={L('حالة الري', 'Irrigation status')} value={palm.irrigation_status || '—'} />
            <Signal icon={Radio} label={L('نوع الري', 'Irrigation type')} value={palm.irrigation_type || '—'} />
          </div>
        </TabsContent>

        <TabsContent value="risk" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <Panel title={L('مؤشر خطر السوسة الحمراء', 'Red Palm Weevil indicator')} icon={AlertTriangle}>
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#F1EEE4" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={palm.rpw_risk >= 0.6 ? '#B03A2E' : palm.rpw_risk >= 0.35 ? '#C8A15A' : '#4A7C59'}
                    strokeWidth="12"
                    strokeDasharray={`${Math.min(1, palm.rpw_risk) * 327} 327`}
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="display-num text-4xl text-safa-palm">{num(palm.rpw_risk, 2)}</p>
                  <p className="mt-1"><StatusBadge tone={risk.tone} label={L(risk.ar, risk.en)} /></p>
                  <p className="mt-3 text-[11px] leading-relaxed text-safa-ink/55">
                    {L('القيمة من 0 إلى 1 — مؤشر أولي لا يُعد تشخيصًا.', 'Value 0–1 — a preliminary indicator, not a diagnosis.')}
                  </p>
                </div>
              </div>
              <Button onClick={() => setInspectionOpen(true)} className="mt-5 w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
                <ClipboardList className="me-2 h-4 w-4" />
                {L('طلب فحص', 'Request inspection')}
              </Button>
            </Panel>

            <Panel title={L('طلبات الفحص لهذه النخلة', 'Inspection requests')} icon={ClipboardList}>
              {!inspections.length ? (
                <p className="text-xs text-safa-ink/50">{L('لا توجد طلبات فحص بعد.', 'No inspection requests yet.')}</p>
              ) : (
                <ul className="space-y-3">
                  {inspections.slice(0, 4).map((i) => (
                    <li key={i.id} className="rounded-xl border border-safa-line bg-safa-cream/60 p-3 text-[11px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-safa-palm">{i.inspection_code}</span>
                        <StatusBadge tone={(i.priority === 'high' ? 'red' : i.priority === 'medium' ? 'amber' : 'neutral')} label={L(`أولوية ${i.priority === 'high' ? 'عالية' : i.priority === 'medium' ? 'متوسطة' : 'منخفضة'}`, `${i.priority} priority`)} />
                      </div>
                      <p className="mt-1.5 text-safa-ink/60">{i.reason}</p>
                      <p className="mt-1 text-safa-earth">{i.assigned_to}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title={L('أحدث قراءات الاستشعار', 'Latest sensor readings')} icon={History}>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-safa-ink/45">
                      <th className="pb-2 text-start font-normal">{L('الوقت', 'Time')}</th>
                      <th className="pb-2 text-start font-normal">{L('كهربائي', 'Electrical')}</th>
                      <th className="pb-2 text-start font-normal">{L('صوتي', 'Acoustic')}</th>
                      <th className="pb-2 text-start font-normal">{L('رطوبة', 'Soil')}</th>
                      <th className="pb-2 text-start font-normal">{L('حرارة', 'Temp')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.slice(0, 8).map((r) => (
                      <tr key={r.id} className="border-t border-safa-line/60">
                        <td className="py-2 text-safa-ink/60">{new Date(r.recorded_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td className="py-2 tabular-nums">{num(r.electrical_activity, 2)}</td>
                        <td className="py-2 tabular-nums">{num(r.acoustic_activity, 2)}</td>
                        <td className="py-2 tabular-nums">{num(r.soil_moisture)}%</td>
                        <td className="py-2 tabular-nums">{num(r.temperature)}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel title={L('تنبيهات هذه النخلة', 'Alerts for this palm')} icon={AlertTriangle}>
              {!alerts.length ? (
                <p className="text-xs text-safa-ink/50">{L('لا توجد تنبيهات.', 'No alerts.')}</p>
              ) : (
                <ul className="space-y-2.5">
                  {alerts.slice(0, 5).map((a) => (
                    <li key={a.id} className="rounded-xl border border-safa-line bg-white p-3">
                      <p className="text-[12px] font-medium text-safa-palm">{a.title}</p>
                      <p className="mt-1 text-[11px] text-safa-ink/60">{a.reason}</p>
                      <p className="mt-1 text-[10px] text-safa-earth">{new Date(a.created_date).toLocaleDateString('en-GB')}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="waste" className="mt-5">
          <Panel title={L('مخلفات النخلة — متوقعة وتولّدت', 'Palm waste — predicted and generated')}>
            {!waste.length ? (
              <p className="text-xs text-safa-ink/50">{L('لا توجد سجلات مخلفات لهذه النخلة.', 'No waste records for this palm.')}</p>
            ) : (
              <ul className="space-y-2.5">
                {waste.map((w) => {
                  const st = WASTE_STATUS[w.status] || WASTE_STATUS.predicted;
                  return (
                    <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-safa-line bg-white p-3">
                      <div>
                        <p className="text-[12px] font-medium text-safa-palm">{w.waste_code} · {L(WASTE_TYPE[w.waste_type]?.ar, WASTE_TYPE[w.waste_type]?.en)}</p>
                        <p className="mt-0.5 text-[10px] text-safa-ink/50">{w.notes || w.destination}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="display-num text-lg text-safa-palm">{num(w.quantity_tons, 1)} {L('طن', 't')}</span>
                        <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
                        <span className="text-[11px] text-safa-earth">{money(w.estimated_value, lang)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="actions" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Button onClick={() => setInspectionOpen(true)} className="h-auto flex-col items-start gap-2 bg-safa-palm p-5 text-safa-cream hover:bg-safa-palmMid">
              <ClipboardList className="h-5 w-5" />
              <span className="text-sm font-semibold">{L('طلب فحص', 'Request inspection')}</span>
              <span className="text-[11px] font-normal text-safa-cream/70">{L('إرسال طلب فحص ميداني مع الأولوية.', 'Send a field inspection request with priority.')}</span>
            </Button>
            <Button
              onClick={() => setCollectionOpen(true)}
              variant="outline"
              className="h-auto flex-col items-start gap-2 border-safa-line p-5 text-safa-palm"
            >
              <Truck className="h-5 w-5" />
              <span className="text-sm font-semibold">{L('جدولة جمع', 'Schedule collection')}</span>
              <span className="text-[11px] font-normal text-safa-ink/55">{L('تخطيط جمع المخلفات المتوقعة.', 'Plan collection of predicted waste.')}</span>
            </Button>
            <Button onClick={() => setReportOpen(true)} variant="outline" className="h-auto flex-col items-start gap-2 border-safa-line p-5 text-safa-palm">
              <Flag className="h-5 w-5" />
              <span className="text-sm font-semibold">{L('الإبلاغ عن ملاحظة', 'Report an issue')}</span>
              <span className="text-[11px] font-normal text-safa-ink/55">{L('تسجيل ملاحظة ميدانية في التنبيهات.', 'Record a field note in alerts.')}</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <InspectionDialog palm={palm} open={inspectionOpen} onOpenChange={setInspectionOpen} onDone={reloadInspections} />
      <CollectionDialog
        waste={predictedRecord || waste[0]}
        open={collectionOpen}
        onOpenChange={setCollectionOpen}
      />
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-safa-palm">{L('الإبلاغ عن ملاحظة ميدانية', 'Report a field note')}</DialogTitle>
          </DialogHeader>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="text-xs" placeholder={L('اكتب ما لاحظته على النخلة…', 'Describe what you observed on the palm…')} />
          <Button onClick={reportIssue} className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            {L('تسجيل الملاحظة', 'Save note')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}