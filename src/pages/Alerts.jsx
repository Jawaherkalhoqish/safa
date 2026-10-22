import { useState } from 'react';
import { Bell, Check, Filter } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import AlertRow from '@/components/AlertRow';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { useSession } from '@/lib/useSession';
import { base44 } from '@/api/base44Client';

const TYPES = ['all', 'rpw_suspicion', 'waste_prediction', 'collection', 'recycling', 'product'];

export default function Alerts() {
  const { L } = useLang();
  const { toast } = useToast();
  const { isVisitor } = useSession();
  const [type, setType] = useState('all');
  const { items: alerts, loading, reload } = useList('Alert', {}, { limit: 60, sort: '-created_date' }, true);

  const filtered = alerts.filter((a) => (type === 'all' ? true : a.type === type));
  const unread = alerts.filter((a) => a.status === 'new');

  const acknowledge = async (alert) => {
    if (isVisitor) {
      toast({ title: L('وضع تجريبي', 'Demo Mode'), description: L('الزائر يستعرض التنبيهات دون تعديل السجلات.', 'Visitors browse alerts without modifying records.') });
      return;
    }
    await base44.entities.Alert.update(alert.id, { status: 'acknowledged' });
    toast({ title: L('تم تحديث البيانات بنجاح', 'Data updated successfully') });
    reload();
  };

  const typeLabels = {
    all: { ar: 'الكل', en: 'All' },
    rpw_suspicion: { ar: 'اشتباه بالسوسة', en: 'RPW suspicion' },
    waste_prediction: { ar: 'مخلفات متوقعة', en: 'Waste prediction' },
    collection: { ar: 'الجمع', en: 'Collection' },
    recycling: { ar: 'التدوير', en: 'Recycling' },
    product: { ar: 'منتج جديد', en: 'New product' },
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('مركز التنبيهات', 'NOTIFICATION CENTER')}
        title={L('التنبيهات', 'Alerts')}
        subtitle={L('اشتباه بالسوسة، مخلفات متوقعة، مواعيد جمع، استلام، إكمال تدوير، ومنتجات دائرية جديدة.', 'RPW suspicion, predicted waste, collection dates, receiving, recycling completion and new circular products.')}
        actions={
          <>
            <span className="flex items-center gap-2 rounded-full border border-safa-line bg-white px-3 py-1.5 text-[11px] text-safa-ink/60">
              <Bell className="h-3.5 w-3.5 text-safa-gold" />
              {unread.length} {L('غير مقروء', 'unread')}
            </span>
            <Button variant="outline" className="border-safa-line text-xs text-safa-palm" onClick={reload}>
              <Filter className="me-2 h-3.5 w-3.5" />
              {L('تحديث', 'Refresh')}
            </Button>
          </>
        }
      />

      <Tabs value={type} onValueChange={setType}>
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-safa-mist p-1">
          {TYPES.map((t) => (
            <TabsTrigger key={t} value={t} className="text-xs">
              {L(typeLabels[t].ar, typeLabels[t].en)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? <LoadingState /> : null}

      <Panel>
        {!loading && !filtered.length ? (
          <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} body={L('ستظهر التنبيهات هنا عند رصد أنماط جديدة.', 'Alerts will appear here when new patterns are detected.')} />
        ) : null}
        <div className="space-y-3">
          {filtered.map((a) => (
            <AlertRow
              key={a.id}
              alert={a}
              action={
                a.status === 'new' ? (
                  <Button size="sm" variant="outline" className="border-safa-line text-[11px] text-safa-palm" onClick={() => acknowledge(a)}>
                    <Check className="me-1.5 h-3 w-3" />
                    {L('تم الاطلاع', 'Acknowledge')}
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      </Panel>

      <p className="text-[10px] text-safa-ink/40">{L('بيانات تجريبية | Demo Data', 'Demo Data')}</p>
    </div>
  );
}