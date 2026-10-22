import { useMemo, useState } from 'react';
import { Building2, Boxes, Check, Coins, Factory, Package, Recycle, Truck, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard from '@/components/StatCard';
import DemoTag from '@/components/DemoTag';
import StatusBadge from '@/components/StatusBadge';
import Timeline, { COLLECTION_FLOW } from '@/components/Timeline';
import AddProductDialog from '@/components/AddProductDialog';
import SmartMapCanvas from '@/components/SmartMapCanvas';
import ProductCard from '@/components/ProductCard';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAggregate, useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { COLLECTION_STATUS, dateStr, money, num } from '@/lib/format';
import { base44 } from '@/api/base44Client';

const NEXT_STATUS = {
  requested: 'accepted',
  accepted: 'scheduled',
  scheduled: 'in_transit',
  in_transit: 'received',
  received: 'at_facility',
  at_facility: 'processing',
  processing: 'recycled',
};

export default function Facility() {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 20, sort: '-created_date' });
  const { items: requests, loading, reload } = useList('CollectionRequest', {}, { limit: 60, sort: '-created_date' }, true);
  const { items: waste } = useList('WasteRecord', {}, { limit: 300, sort: '-created_date' }, true);
  const { items: products, reload: reloadProducts } = useList('Product', {}, { limit: 60, sort: '-created_date' });
  const { rows } = useAggregate('WasteRecord', {}, 'status', ['quantity_tons', 'estimated_value']);

  const [facilityId, setFacilityId] = useState('');
  const facility = facilities.find((f) => f.id === facilityId) || facilities[0];

  const tons = useMemo(() => {
    const map = {};
    rows.forEach((r) => { map[r.status] = r; });
    return map;
  }, [rows]);

  const available = (tons.predicted?.sum_quantity_tons || 0) + (tons.ready?.sum_quantity_tons || 0) + (tons.scheduled?.sum_quantity_tons || 0);
  const processing = tons.processing?.sum_quantity_tons || 0;
  const recycled = tons.recycled?.sum_quantity_tons || 0;
  const newRequests = requests.filter((r) => r.status === 'requested');
  const outputValue = products.reduce((a, p) => a + p.price * p.inventory, 0);

  const advance = async (request, next) => {
    try {
      const entry = COLLECTION_FLOW.find((f) => f.key === next);
      await base44.entities.CollectionRequest.update(request.id, {
        status: next,
        received_quantity_tons: next === 'received' ? request.quantity_tons : request.received_quantity_tons,
        timeline: [...(request.timeline || []), { key: next, ar: entry?.ar, en: entry?.en, at: new Date().toISOString(), done: true }],
      });
      toast({ title: L('تم تحديث حالة الطلب', 'Request status updated'), description: `${request.request_code} → ${L(entry?.ar || next, entry?.en || next)}` });
      reload();
    } catch (e) {
      toast({ title: L('تعذر تحديث الطلب', 'Could not update the request'), variant: 'destructive' });
    }
  };

  const reject = async (request) => {
    try {
      await base44.entities.CollectionRequest.update(request.id, {
        status: 'rejected',
        timeline: [...(request.timeline || []), { key: 'rejected', ar: 'تم رفض الطلب', en: 'Request rejected', at: new Date().toISOString(), done: true }],
      });
      toast({ title: L('تم رفض الطلب', 'Request rejected'), description: request.request_code });
      reload();
    } catch (e) {
      toast({ title: L('تعذر تحديث الطلب', 'Could not update the request'), variant: 'destructive' });
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('واجهة منشأة التدوير', 'RECYCLING FACILITY')}
        title={facility?.name || L('منشأة التدوير', 'Recycling facility')}
        subtitle={L('إدارة المخلفات المتاحة، وقبول طلبات الاستلام، وتحديث مراحل المعالجة والمنتجات الدائرية.', 'Manage available waste, accept pickup requests, update processing stages and circular products.')}
        actions={
          <>
            <DemoTag />
            <AddProductDialog onCreated={reloadProducts} defaultFacilityId={facility?.id} />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label={L('المخلفات المتاحة', 'Available waste')} value={available} decimals={1} suffix={L(' طن', ' t')} icon={Boxes} demo />
        <StatCard label={L('الطلبات الجديدة', 'New requests')} value={newRequests.length} icon={Truck} tone="gold" demo />
        <StatCard label={L('قيد المعالجة', 'In processing')} value={processing} decimals={1} suffix={L(' طن', ' t')} icon={Factory} demo />
        <StatCard label={L('تم تدويره', 'Recycled')} value={recycled} decimals={1} suffix={L(' طن', ' t')} icon={Recycle} tone="olive" demo />
        <StatCard label={L('القيمة الناتجة', 'Output value')} value={outputValue} suffix={L(' ر.س', ' SAR')} icon={Coins} tone="gold" demo />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={L('طلبات الجمع الواردة', 'Incoming collection requests')} icon={Truck} subtitle={L('قبول، رفض، جدولة، استلام، معالجة، وتدوير', 'Accept, reject, schedule, receive, process and recycle')}>
          {!requests.length ? (
            <EmptyState title={L('لا توجد طلبات بعد', 'No requests yet')} />
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => {
                const st = COLLECTION_STATUS[r.status] || COLLECTION_STATUS.requested;
                const next = NEXT_STATUS[r.status];
                const nextLabel = next ? COLLECTION_STATUS[next] : null;
                return (
                  <li key={r.id} className="rounded-2xl border border-safa-line bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[12px] font-semibold text-safa-palm">{r.request_code} · {r.farm_name}</p>
                        <p className="mt-0.5 text-[10px] text-safa-ink/50">
                          {num(r.quantity_tons, 1)} {L('طن', 't')} · {num(r.distance_km)} {L('كم', 'km')} · {dateStr(r.scheduled_date || r.requested_date, lang)}
                          {r.received_quantity_tons ? ` · ${L('تم استلام', 'Received')} ${num(r.received_quantity_tons, 1)} ${L('طن', 't')}` : ''}
                        </p>
                      </div>
                      <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {next && nextLabel ? (
                        <Button size="sm" onClick={() => advance(r, next)} className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
                          <Check className="me-1.5 h-3 w-3" />
                          {L(nextLabel.ar, nextLabel.en)}
                        </Button>
                      ) : null}
                      {['requested', 'accepted'].includes(r.status) ? (
                        <Button size="sm" variant="outline" className="border-safa-dangerLine text-safa-dangerFg" onClick={() => reject(r)}>
                          <X className="me-1.5 h-3 w-3" />
                          {L('رفض الطلب', 'Reject request')}
                        </Button>
                      ) : null}
                    </div>

                    <div className="mt-4 border-t border-safa-line pt-3">
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
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title={L('خريطة المخلفات المتاحة', 'Available waste map')} icon={Building2}>
            <SmartMapCanvas palms={waste.filter((w) => ['predicted', 'ready', 'scheduled'].includes(w.status))} facilities={facilities} compact layers={{ palms: true, waste: true, facilities: true }} />
          </Panel>

          <Panel title={L('بيانات المنشأة', 'Facility details')} icon={Factory}>
            <dl className="space-y-3 text-[11px]">
              {[
                [L('الموقع', 'Location'), facility?.location],
                [L('المنطقة', 'Region'), facility?.region],
                [L('السعة', 'Capacity'), `${num(facility?.capacity_tons)} ${L('طن', 't')}`],
                [L('المعالج', 'Processed'), `${num(facility?.processed_tons)} ${L('طن', 't')}`],
                [L('القيمة الناتجة', 'Output value'), money(facility?.output_value || 0, lang)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-safa-ink/50">{k}</dt>
                  <dd className="text-end font-medium text-safa-palm">{v || '—'}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(facility?.accepted_materials || []).map((m) => (
                <span key={m} className="rounded-full border border-safa-line bg-safa-cream px-2 py-0.5 text-[10px] text-safa-earth">{m}</span>
              ))}
            </div>
            {!facilityId && facilities.length > 1 ? (
              <div className="mt-4 space-y-2">
                {facilities.map((f) => (
                  <button key={f.id} onClick={() => setFacilityId(f.id)} className="block w-full rounded-xl border border-safa-line px-3 py-2 text-start text-[11px] text-safa-palm transition hover:border-safa-sand">
                    {f.name}
                  </button>
                ))}
              </div>
            ) : null}
          </Panel>
        </div>
      </div>

      <Panel
        title={L('منتجات دائرية من المخلفات المعالجة', 'Circular products from processed waste')}
        icon={Package}
        subtitle={`${products.length} ${L('منتج', 'products')}`}
        action={<AddProductDialog onCreated={reloadProducts} defaultFacilityId={facility?.id} trigger={<Button variant="outline" className="border-safa-line text-xs text-safa-palm">{L('تصنيف الناتج وإضافة منتج', 'Classify output & add product')}</Button>} />}
      >
        {!products.length ? (
          <EmptyState title={L('لا توجد منتجات بعد', 'No products yet')} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}