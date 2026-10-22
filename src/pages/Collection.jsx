import { useMemo, useState } from 'react';
import { CalendarClock, Factory, MapPin, Recycle, Truck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import CollectionDialog from '@/components/CollectionDialog';
import Timeline, { COLLECTION_FLOW } from '@/components/Timeline';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { COLLECTION_STATUS, dateStr, num } from '@/lib/format';

export default function Collection() {
  const { L, lang } = useLang();
  const { items: waste, loading: wasteLoading, reload: reloadWaste } = useList('WasteRecord', {}, { limit: 300, sort: '-created_date' }, true);
  const { items: requests, loading } = useList('CollectionRequest', {}, { limit: 60, sort: '-created_date' }, true);
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 20, sort: 'name' });

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);

  const spotlight = useMemo(
    () => waste.find((w) => w.palm_identifier === '104' && w.status === 'predicted') || waste.find((w) => w.status === 'ready') || waste[0],
    [waste]
  );

  const activeRequests = requests.filter((r) => r.status !== 'rejected');
  const nextThursday = useMemo(() => {
    const d = new Date();
    const diff = (4 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d;
  }, []);

  if (loading || wasteLoading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('الجمع الذكي', 'SMART COLLECTION')}
        title={L('مسار الجمع', 'Smart Collection')}
        subtitle={L('تخطيط الجمع حسب الكمية والموقع والتصنيف، وربط كل طلب بمنشأة تدوير مناسبة.', 'Planning collection by quantity, location and classification, linking every request to a suitable facility.')}
        actions={<DemoTag />}
      />

      {spotlight ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
          <Panel title={L('طلب جمع مقترح', 'Suggested collection')} icon={Truck} subtitle={spotlight.waste_code}>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-[11px] text-safa-ink/50">{L('الكمية', 'Quantity')}</p>
                <p className="display-num mt-1 text-5xl text-safa-palm">{num(spotlight.quantity_tons, 1)}</p>
                <p className="text-xs text-safa-ink/50">{L('طن', 'tons')}</p>
              </div>
              <dl className="grid flex-1 grid-cols-2 gap-4 text-[11px]">
                <div>
                  <dt className="flex items-center gap-1.5 text-safa-ink/50"><MapPin className="h-3 w-3" />{L('الموقع', 'Location')}</dt>
                  <dd className="mt-1 font-medium text-safa-palm">{spotlight.farm_name}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-safa-ink/50"><Truck className="h-3 w-3" />{L('المسافة', 'Distance')}</dt>
                  <dd className="mt-1 font-medium text-safa-palm">{L('12 كم', '12 km')}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-safa-ink/50"><Factory className="h-3 w-3" />{L('الجهة المقترحة', 'Suggested facility')}</dt>
                  <dd className="mt-1 font-medium text-safa-palm">{facilities[0]?.name || '—'}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-safa-ink/50"><CalendarClock className="h-3 w-3" />{L('الموعد المقترح', 'Suggested date')}</dt>
                  <dd className="mt-1 font-medium text-safa-palm">{dateStr(nextThursday, lang)} — {L('الخميس', 'Thursday')}</dd>
                </div>
              </dl>
            </div>
            <Button
              onClick={() => {
                setTarget(spotlight);
                setOpen(true);
              }}
              className="mt-6 w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid"
            >
              {L('جدولة الجمع', 'Schedule collection')}
            </Button>
          </Panel>

          <Panel title={L('مسارات الجمع الجارية', 'Active collection journeys')} icon={Recycle} subtitle={L('تتبع لكل طلب من الإنشاء حتى التدوير', 'Track every request from creation to recycling')}>
            {!activeRequests.length ? (
              <EmptyState title={L('لا توجد طلبات جمع بعد', 'No collection requests yet')} />
            ) : (
              <div className="space-y-4">
                {activeRequests.slice(0, 2).map((r) => {
                  const st = COLLECTION_STATUS[r.status] || COLLECTION_STATUS.requested;
                  return (
                    <div key={r.id} className="rounded-2xl border border-safa-line bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[12px] font-semibold text-safa-palm">{r.request_code}</p>
                          <p className="mt-0.5 text-[10px] text-safa-ink/50">
                            {r.facility_name} · {num(r.quantity_tons, 1)} {L('طن', 't')} · {num(r.distance_km)} {L('كم', 'km')}
                          </p>
                        </div>
                        <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
                      </div>
                      <div className="mt-4">
                        <Timeline
                          compact
                          steps={COLLECTION_FLOW.map((s) => {
                            const idx = COLLECTION_FLOW.findIndex((f) => f.key === r.status);
                            const myIdx = COLLECTION_FLOW.findIndex((f) => f.key === s.key);
                            const entry = (r.timeline || []).find((t) => t.key === s.key);
                            return { ...s, done: myIdx <= idx, at: entry?.at };
                          })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={L('كل طلبات الجمع', 'All collection requests')} subtitle={`${requests.length} ${L('طلب', 'requests')}`}>
          {!requests.length ? (
            <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-[11px]">
                <thead>
                  <tr className="text-safa-ink/45">
                    <th className="pb-3 text-start font-normal">{L('الطلب', 'Request')}</th>
                    <th className="pb-3 text-start font-normal">{L('المزرعة', 'Farm')}</th>
                    <th className="pb-3 text-start font-normal">{L('المنشأة', 'Facility')}</th>
                    <th className="pb-3 text-start font-normal">{L('الكمية', 'Quantity')}</th>
                    <th className="pb-3 text-start font-normal">{L('الموعد', 'Date')}</th>
                    <th className="pb-3 text-start font-normal">{L('الحالة', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => {
                    const st = COLLECTION_STATUS[r.status] || COLLECTION_STATUS.requested;
                    return (
                      <tr key={r.id} className="border-t border-safa-line/60">
                        <td className="py-3 font-medium text-safa-palm">{r.request_code}</td>
                        <td className="py-3 text-safa-ink/70">{r.farm_name}</td>
                        <td className="py-3 text-safa-ink/70">{r.facility_name}</td>
                        <td className="py-3 tabular-nums">{num(r.quantity_tons, 1)} {L('طن', 't')}</td>
                        <td className="py-3 text-safa-ink/70">{dateStr(r.scheduled_date || r.requested_date, lang)}</td>
                        <td className="py-3"><StatusBadge tone={st.tone} label={L(st.ar, st.en)} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title={L('منشآت التدوير الشريكة', 'Partner recycling facilities')} subtitle={L('المواد المقبولة والطاقة التشغيلية', 'Accepted materials and capacity')}>
          <ul className="space-y-3">
            {facilities.map((f) => (
              <li key={f.id} className="rounded-2xl border border-safa-line bg-white p-4">
                <p className="text-[12px] font-semibold text-safa-palm">{f.name}</p>
                <p className="mt-1 text-[10px] text-safa-ink/50">{f.location}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(f.accepted_materials || []).map((m) => (
                    <span key={m} className="rounded-full border border-safa-line bg-safa-cream px-2 py-0.5 text-[10px] text-safa-earth">{m}</span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-safa-ink/55">
                  {L('السعة', 'Capacity')} {num(f.capacity_tons)} {L('طن', 't')} · {L('معالج', 'Processed')} {num(f.processed_tons)} {L('طن', 't')}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <CollectionDialog waste={target} open={open} onOpenChange={setOpen} onDone={reloadWaste} />
    </div>
  );
}