import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PalmCard from '@/components/PalmCard';
import AddPalmDialog from '@/components/AddPalmDialog';
import StartFarmSteps from '@/components/StartFarmSteps';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { HEALTH_BAND, num, rpwLevel } from '@/lib/format';

export default function MyPalms() {
  const { L } = useLang();
  const { items: farms } = useList('Farm', {}, { limit: 20, sort: 'name' });
  const [farmId, setFarmId] = useState('all');
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');

  const query = useMemo(() => {
    const query = {};
    if (farmId !== 'all') query.farm_id = farmId;
    if (status !== 'all') query.status = status;
    return query;
  }, [farmId, status]);

  const { items: palms, loading } = useList('Palm', query, { limit: 200, sort: '-health_score' }, true);

  const filtered = palms.filter((p) => {
    const term = q.trim();
    if (!term) return true;
    return [p.palm_identifier, p.farm_name, p.location, p.variety].filter(Boolean).join(' ').includes(term);
  });

  const counts = {
    total: palms.length,
    high: palms.filter((p) => rpwLevel(p.rpw_risk) === 'high').length,
    attention: palms.filter((p) => p.status !== 'stable').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('سجل النخيل', 'PALM REGISTRY')}
        title={L('نخيلي', 'My Palms')}
        subtitle={L('كل نخلة لها ملف كامل: إشارات، بيئة، خطر، سجل، ومخلفات متوقعة.', 'Every palm has a full profile: signals, environment, risk, history and predicted waste.')}
        actions={<AddPalmDialog />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('نخيل مسجل', 'Registered palms')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(counts.total)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('مؤشر خطر سوسة مرتفع', 'Elevated RPW indicators')}</p>
          <p className="display-num mt-2 text-3xl text-safa-dangerFg">{num(counts.high)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-[11px] text-safa-ink/50">{L('تحت المتابعة', 'Under observation')}</p>
          <p className="display-num mt-2 text-3xl text-safa-warnFg">{num(counts.attention)}</p>
        </div>
      </div>

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('ابحث بمعرّف النخلة أو الموقع…', 'Search by palm ID or location…')} className="h-10 w-full text-xs sm:w-64" />
        <Select value={farmId} onValueChange={setFarmId}>
          <SelectTrigger className="h-10 w-full text-xs sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل المزارع', 'All farms')}</SelectItem>
            {farms.map((f) => (
              <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-full text-xs sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{L('كل الحالات', 'All statuses')}</SelectItem>
            <SelectItem value="stable" className="text-xs">{L(HEALTH_BAND.stable.ar, HEALTH_BAND.stable.en)}</SelectItem>
            <SelectItem value="attention" className="text-xs">{L(HEALTH_BAND.attention.ar, HEALTH_BAND.attention.en)}</SelectItem>
            <SelectItem value="critical" className="text-xs">{L(HEALTH_BAND.critical.ar, HEALTH_BAND.critical.en)}</SelectItem>
          </SelectContent>
        </Select>
        <span className="ms-auto flex items-center gap-2 text-[11px] text-safa-ink/45">
          <Sparkles className="h-3.5 w-3.5 text-safa-gold" />
          {L('يتم تحديث الحالة تلقائيًا', 'Status updates automatically')}
        </span>
      </div>

      {loading ? <LoadingState /> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')}
          body={L('لم يتم العثور على نخيل مطابق للفلاتر الحالية.', 'No palms match the current filters.')}
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <PalmCard key={p.id} palm={p} />
        ))}
      </div>

      {!palms.length && !loading ? <StartFarmSteps /> : null}

      <p className="text-[10px] text-safa-ink/40">{L('بيانات تجريبية | Demo Data', 'Demo Data')}</p>
    </div>
  );
}