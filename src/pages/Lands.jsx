import { useMemo, useState } from 'react';
import { LandPlot, MapPin, Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import DemoTag from '@/components/DemoTag';
import LandCard from '@/components/lands/LandCard';
import LandDetailDialog from '@/components/lands/LandDetailDialog';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { LAND_OWNERSHIP, REGIONS, regionLabel } from '@/lib/community';
import { num } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function Lands() {
  const { L, isAr } = useLang();
  const { items: lands, loading } = useList('LandListing', {}, { limit: 120, sort: '-created_date' });
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('all');
  const [ownership, setOwnership] = useState('all');
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return lands.filter((land) => {
      if (region !== 'all' && land.region !== region) return false;
      if (ownership !== 'all' && land.ownership !== ownership) return false;
      if (!term) return true;
      return [land.title, land.title_en, land.location, land.location_en, land.description, land.description_en, land.listing_code, land.owner_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [lands, q, region, ownership]);

  const totalArea = filtered.reduce((sum, l) => sum + (l.area_ha || 0), 0);
  const available = filtered.filter((l) => l.status === 'available').length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('الأراضي الزراعية', 'AGRICULTURAL LANDS')}
        title={L('الأراضي الزراعية', 'Agricultural Lands')}
        subtitle={L(
          'أراضٍ وحيازات نخيل متاحة للبيع أو الإيجار أو الاستثمار، مع تفاصيل الموقع والمساحة والتجهيزات وبيانات التواصل.',
          'Palm land and holdings available for sale, lease or investment, with location, area, infrastructure and contact details.'
        )}
        actions={<DemoTag />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel glow-card p-5">
          <p className="text-[11px] text-safa-ink/50">{L('عروض مطابقة', 'Matching listings')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(filtered.length)}</p>
        </div>
        <div className="panel glow-card p-5">
          <p className="text-[11px] text-safa-ink/50">{L('إجمالي المساحة', 'Total area')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">
            {num(totalArea, 1)} <span className="text-sm text-safa-ink/50">{L('هكتار', 'ha')}</span>
          </p>
        </div>
        <div className="panel glow-card p-5">
          <p className="text-[11px] text-safa-ink/50">{L('متاحة الآن', 'Available now')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(available)}</p>
        </div>
      </div>

      <div className="panel space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-safa-ink/40 start-3" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={L('ابحث باسم الأرض أو الموقع…', 'Search by land or location…')}
              className="h-9 ps-9 text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOwnership('all')}
              className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', ownership === 'all' ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/60')}
            >
              {L('كل العروض', 'All offers')}
            </button>
            {Object.entries(LAND_OWNERSHIP).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setOwnership(k)}
                className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', ownership === k ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/60')}
              >
                {L(v.ar, v.en)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-safa-line/70 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-safa-ink/45">
            <MapPin className="h-3.5 w-3.5" />
            {L('المنطقة', 'Region')}
          </span>
          <button
            onClick={() => setRegion('all')}
            className={cn('rounded-full border px-3 py-1 text-[11px] transition', region === 'all' ? 'border-safa-oliveSoft bg-safa-oliveSoft/15 text-safa-palm' : 'border-safa-line bg-white text-safa-ink/55')}
          >
            {L('الكل', 'All')}
          </button>
          {REGIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={cn('rounded-full border px-3 py-1 text-[11px] transition', region === r.value ? 'border-safa-oliveSoft bg-safa-oliveSoft/15 text-safa-palm' : 'border-safa-line bg-white text-safa-ink/55')}
            >
              {isAr ? r.ar : r.en}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingState /> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          icon={LandPlot}
          title={L('لا توجد أراضٍ مطابقة', 'No matching lands')}
          body={L('غيّر المنطقة أو نوع العرض للحصول على نتائج أخرى.', 'Change the region or offer type to see other results.')}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((land) => (
          <LandCard key={land.id} land={land} onOpen={setActive} />
        ))}
      </div>

      <p className="text-[10px] text-safa-ink/40">
        {L(
          'بيانات العروض تجريبية للعرض، وتُدار من لوحة الإدارة. تعرض الأسعار بالريال السعودي.',
          'Listings are demo data shown for illustration and are managed from the admin dashboard. Prices are in SAR.'
        )}
        {region !== 'all' ? ` · ${regionLabel(region, isAr)}` : ''}
      </p>

      <LandDetailDialog land={active} onClose={() => setActive(null)} />
    </div>
  );
}