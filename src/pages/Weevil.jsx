import { useMemo, useState } from 'react';
import { Activity, ClipboardList, ShieldAlert, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import AiAnalysisCard from '@/components/AiAnalysisCard';
import InspectionDialog from '@/components/InspectionDialog';
import AlertRow from '@/components/AlertRow';
import SensorArchitecture from '@/components/SensorArchitecture';
import { Button } from '@/components/ui/button';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { useCount, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { INSPECTION_STATUS, PRIORITY, RPW_LEVEL, dateStr, num, pick, rpwLevel } from '@/lib/format';

export default function Weevil() {
  const { L, lang } = useLang();
  const { items: palms, loading } = useList('Palm', {}, { limit: 300, sort: '-rpw_risk' }, true);
  const { items: inspections, reload: reloadInspections } = useList('Inspection', {}, { limit: 50, sort: '-created_date' });
  const { items: alerts } = useList('Alert', { type: 'rpw_suspicion' }, { limit: 8, sort: '-created_date' });

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const high = useCount('Palm', { rpw_risk: { $gte: 0.6 } });
  const medium = useCount('Palm', { $and: [{ rpw_risk: { $gte: 0.35 } }, { rpw_risk: { $lt: 0.6 } }] });
  const low = useCount('Palm', { rpw_risk: { $lt: 0.35 } });
  const pending = inspections.filter((i) => ['new', 'under_review', 'scheduled'].includes(i.status)).length;

  const trend = useMemo(
    () => [
      { band: L('مرتفع', 'High'), count: high, color: '#B03A2E' },
      { band: L('متوسط', 'Medium'), count: medium, color: '#C8A15A' },
      { band: L('منخفض', 'Low'), count: low, color: '#4A7C59' },
    ],
    [high, medium, low, L]
  );

  const suspected = palms.filter((p) => rpwLevel(p.rpw_risk) === 'high').slice(0, 6);
  const focus = suspected[0] || palms[0];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('الإنذار المبكر', 'EARLY WARNING')}
        title={L('السوسة الحمراء', 'Red Palm Weevil')}
        subtitle={L('مؤشر خطر مبني على دمج الإشارات، يوجّه الفحص الميداني ولا يستبدله.', 'A risk indicator built on fused signals that guides field inspection rather than replacing it.')}
        actions={<DemoTag />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label={L('خطر مرتفع', 'High risk')} value={high} icon={ShieldAlert} tone="danger" demo />
        <StatCard label={L('خطر متوسط', 'Medium risk')} value={medium} icon={Activity} tone="gold" demo />
        <StatCard label={L('خطر منخفض', 'Low risk')} value={low} icon={TrendingUp} tone="olive" demo />
        <StatCard label={L('فحوصات قيد الانتظار', 'Inspections pending')} value={pending} icon={ClipboardList} demo />
        <StatCard label={L('تنبيهات سوسة حديثة', 'Recent RPW alerts')} value={alerts.length} icon={ShieldAlert} tone="gold" demo />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.3fr]">
        <Panel title={L('اتجاه مؤشر الخطر', 'Risk trend')} subtitle={L('توزيع النخيل المراقب على مستويات الخطر', 'Monitored palms by risk band')} icon={TrendingUp} action={<DemoTag />}>
          <div className="h-64" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--safa-line))" vertical={false} />
                <XAxis dataKey="band" tick={{ fontSize: 11, fill: 'hsl(var(--safa-earth))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--safa-earth))' }} width={30} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--safa-line))', backgroundColor: 'hsl(var(--safa-card))', color: 'hsl(var(--safa-ink))', fontSize: 11 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name={L('عدد النخيل', 'Palms')}>
                  {trend.map((t) => (
                    <Cell key={t.band} fill={t.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(RPW_LEVEL).map(([k, v]) => (
              <StatusBadge key={k} tone={v.tone} label={L(v.ar, v.en)} />
            ))}
          </div>
        </Panel>

        <Panel title={L('نخيل يستدعي الفحص', 'Palms needing inspection')} subtitle={L('مرتبة حسب مؤشر الخطر', 'Sorted by risk indicator')} icon={ShieldAlert}>
          {!suspected.length ? (
            <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} />
          ) : (
            <ul className="space-y-2.5">
              {suspected.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-safa-line bg-white p-3.5">
                  <div>
                    <p className="text-[13px] font-semibold text-safa-palm">
                      {L('نخلة', 'Palm')} #{p.palm_identifier}
                      <span className="ms-2 text-[11px] font-normal text-safa-ink/55">{p.farm_name}</span>
                    </p>
                    <p className="mt-1 text-[11px] text-safa-ink/60">
                      {L('الخطر', 'Risk')}: <span className="font-semibold text-safa-dangerFg">{num(p.rpw_risk, 2)}</span> · {L('الإجراء المقترح', 'Suggested')}: {L('فحص ميداني', 'Field inspection')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected(p);
                      setOpen(true);
                    }}
                    className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid"
                  >
                    {L('طلب فحص', 'Request inspection')}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {focus ? (
        <AiAnalysisCard
          tone="red"
          riskLevel="high"
          confidence="high"
          indicator={num(focus.rpw_risk, 2)}
          title={`${L('تحليل سعفة', 'SA’FA analysis')} — ${L('نخلة', 'Palm')} #${focus.palm_identifier}`}
          body={L('تم رصد نمط غير معتاد يستدعي المتابعة والفحص الميداني.', 'An abnormal signal pattern has been detected and field inspection is recommended.')}
          reason={L('ارتفاع مؤشر النشاط الصوتي مع تغير في النشاط الكهربائي خلال الساعات الأخيرة.', 'Elevated acoustic activity indicator with a shift in electrical activity over recent hours.')}
          recommendation={L('طلب فحص ميداني بأولوية عالية خلال 48 ساعة.', 'Request a high-priority field inspection within 48 hours.')}
        />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title={L('طلبات الفحص', 'Inspection requests')} icon={ClipboardList}>
          {!inspections.length ? (
            <EmptyState title={L('لا توجد طلبات فحص بعد', 'No inspection requests yet')} />
          ) : (
            <ul className="space-y-2.5">
              {inspections.slice(0, 6).map((i) => {
                const st = INSPECTION_STATUS[i.status] || INSPECTION_STATUS.new;
                const pr = PRIORITY[i.priority] || PRIORITY.medium;
                return (
                  <li key={i.id} className="rounded-2xl border border-safa-line bg-white p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[12px] font-semibold text-safa-palm">
                        {i.inspection_code} · {L('نخلة', 'Palm')} #{i.palm_identifier}
                      </p>
                      <span className="flex gap-2">
                        <StatusBadge tone={pr.tone} label={L(pr.ar, pr.en)} />
                        <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-safa-ink/60">{i.reason}</p>
                    <p className="mt-1 text-[10px] text-safa-earth">
                      {i.assigned_to} · {dateStr(i.requested_at, lang, true)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title={L('تنبيهات السوسة', 'RPW alerts')} icon={ShieldAlert}>
          <div className="space-y-3">
            {alerts.slice(0, 4).map((a) => (
              <AlertRow key={a.id} alert={a} />
            ))}
            {!alerts.length ? <p className="text-xs text-safa-ink/50">{L('لا توجد تنبيهات سوسة.', 'No RPW alerts.')}</p> : null}
          </div>
        </Panel>
      </div>

      <Panel title={L('بنية الاستشعار في سعفة', 'SA’FA sensing architecture')} subtitle={L('كيف تتحول الإشارات إلى مؤشر قرار', 'How signals become a decision indicator')}>
        <SensorArchitecture />
      </Panel>

      <InspectionDialog palm={selected} open={open} onOpenChange={setOpen} onDone={reloadInspections} />
    </div>
  );
}