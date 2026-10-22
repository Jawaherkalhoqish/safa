import { useMemo, useState } from 'react';
import { Boxes, Coins, Recycle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import CollectionDialog from '@/components/CollectionDialog';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { RISK_CLASS, WASTE_STATUS, WASTE_TYPE, dateStr, money, num } from '@/lib/format';

const GROUPS = {
  predicted: ['predicted'],
  current: ['ready', 'scheduled', 'burning_risk', 'needs_verification', 'special_pathway'],
  processed: ['collected', 'processing', 'recycled', 'routed'],
};

export default function Waste() {
  const { L, lang } = useLang();
  const { items: farms } = useList('Farm', {}, { limit: 20, sort: 'name' });
  const [farmId, setFarmId] = useState('all');
  const [type, setType] = useState('all');
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('current');
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { items, loading, reload } = useList(
    'WasteRecord',
    farmId === 'all' ? {} : { farm_id: farmId },
    { limit: 300, sort: '-created_date' },
    true
  );

  const grouped = useMemo(() => {
    const term = q.trim();
    const rows = items.filter((w) => {
      if (type !== 'all' && w.waste_type !== type) return false;
      if (term && ![w.waste_code, w.palm_identifier, w.farm_name, w.destination].filter(Boolean).join(' ').includes(term)) return false;
      return true;
    });
    return {
      predicted: rows.filter((w) => GROUPS.predicted.includes(w.status)),
      current: rows.filter((w) => GROUPS.current.includes(w.status)),
      processed: rows.filter((w) => GROUPS.processed.includes(w.status)),
    };
  }, [items, type, q]);

  const active = grouped[tab] || [];
  const totalTons = active.reduce((a, w) => a + (w.quantity_tons || 0), 0);
  const totalValue = active.reduce((a, w) => a + (w.estimated_value || 0), 0);

  const tabs = [
    { key: 'current', ar: 'المخلفات الحالية', en: 'Current waste', icon: Boxes },
    { key: 'predicted', ar: 'المخلفات المتوقعة', en: 'Predicted waste', icon: Recycle },
    { key: 'processed', ar: 'المخلفات المعالجة', en: 'Processed waste', icon: Coins },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('إدارة المخلفات', 'WASTE MANAGEMENT')}
        title={L('المخلفات', 'Waste')}
        subtitle={L('ما تولّد بالفعل، وما يُتوقع تولّده، وما تم جمعه أو معالجته أو تدويره.', 'What has already been generated, what is predicted, and what has been collected, processed or recycled.')}
        actions={<DemoTag />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('السجلات في هذا القسم', 'Records in this view')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(active.length)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('إجمالي الكمية', 'Total quantity')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(totalTons, 1)} <span className="text-base font-normal text-safa-ink/50">{L('طن', 't')}</span></p>
        </div>
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('القيمة التقديرية', 'Estimated value')}</p>
          <p className="display-num mt-2 text-3xl text-safa-gold">{money(totalValue, lang)}</p>
        </div>
      </div>

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('ابحث بمعرّف المخلفات أو النخلة…', 'Search waste or palm ID…')} className="h-9 w-full text-xs sm:w-56" />
        <Select value={farmId} onValueChange={setFarmId}>
          <SelectTrigger className="h-9 w-full text-xs sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل المزارع', 'All farms')}</SelectItem>
            {farms.map((f) => (
              <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-9 w-full text-xs sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل الأنواع', 'All types')}</SelectItem>
            {Object.entries(WASTE_TYPE).map(([k, v]) => (
              <SelectItem key={k} value={k} className="text-xs">{L(v.ar, v.en)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="ms-auto border-safa-line text-xs text-safa-palm" onClick={reload}>
          {L('تحديث', 'Refresh')}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-safa-mist p-1">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key} className="gap-2 text-xs">
              <t.icon className="h-3.5 w-3.5" />
              {L(t.ar, t.en)}
              <span className="rounded-full bg-white/70 px-1.5 text-[10px] tabular-nums">{grouped[t.key].length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? <LoadingState /> : null}

      {!loading && !active.length ? (
        <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} body={L('جرّب تغيير الفلاتر أو الفترة الزمنية.', 'Try changing the filters or time period.')} />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {active.map((w) => {
          const st = WASTE_STATUS[w.status] || WASTE_STATUS.predicted;
          const rc = RISK_CLASS[w.risk_classification] || RISK_CLASS.standard;
          const canCollect = ['ready', 'burning_risk', 'needs_verification', 'special_pathway', 'predicted'].includes(w.status);
          return (
            <article key={w.id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-safa-palm">{w.waste_code}</p>
                  <p className="mt-1 text-[11px] text-safa-ink/55">
                    {w.farm_name} · {L('النخلة', 'Palm')} #{w.palm_identifier} · {L(WASTE_TYPE[w.waste_type]?.ar, WASTE_TYPE[w.waste_type]?.en)}
                  </p>
                </div>
                <StatusBadge tone={st.tone} label={L(st.ar, st.en)} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
                <div>
                  <p className="text-safa-ink/45">{L('الكمية', 'Quantity')}</p>
                  <p className="display-num mt-1 text-lg text-safa-palm">{num(w.quantity_tons, 1)}</p>
                </div>
                <div>
                  <p className="text-safa-ink/45">{L('التاريخ', 'Date')}</p>
                  <p className="mt-1 font-medium text-safa-palm">{dateStr(w.generated_date || w.predicted_date, lang)}</p>
                </div>
                <div>
                  <p className="text-safa-ink/45">{L('القيمة', 'Value')}</p>
                  <p className="mt-1 font-medium text-safa-gold">{money(w.estimated_value, lang)}</p>
                </div>
                <div>
                  <p className="text-safa-ink/45">{L('الوجهة', 'Destination')}</p>
                  <p className="mt-1 font-medium text-safa-palm">{w.destination || '—'}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-safa-line pt-4">
                <StatusBadge tone={rc.tone} label={L(rc.ar, rc.en)} />
                {canCollect ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected(w);
                      setDialogOpen(true);
                    }}
                    className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid"
                  >
                    {L('جدولة الجمع', 'Schedule collection')}
                  </Button>
                ) : (
                  <span className="text-[10px] text-safa-ink/45">{L('ضمن المسار الدائري', 'In the circular pathway')}</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <CollectionDialog waste={selected} open={dialogOpen} onOpenChange={setDialogOpen} onDone={reload} />
    </div>
  );
}