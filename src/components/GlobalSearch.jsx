import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Building2, Factory, Loader2, Search, ShieldAlert, ShoppingBag, Sprout } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';

const ENTITIES = [
  { key: 'Palm', entity: 'Palm', group: { ar: 'النخيل', en: 'Palms' }, icon: Sprout, to: (r) => `/palms/${r.id}`, label: (r) => `نخلة #${r.palm_identifier}`, sub: (r) => r.farm_name, query: (q) => ({ $or: [{ palm_identifier: { $regex: q } }, { farm_name: { $regex: q } }] }) },
  { key: 'WasteRecord', entity: 'WasteRecord', group: { ar: 'المخلفات', en: 'Waste' }, icon: Boxes, to: () => '/waste', label: (r) => `مخلفات ${r.waste_code}`, sub: (r) => `${r.farm_name} · ${r.quantity_tons?.toFixed(1)} طن`, query: (q) => ({ $or: [{ waste_code: { $regex: q } }, { palm_identifier: { $regex: q } }] }) },
  { key: 'Alert', entity: 'Alert', group: { ar: 'التنبيهات', en: 'Alerts' }, icon: ShieldAlert, to: () => '/alerts', label: (r) => `تنبيه ${r.alert_code || ''}`, sub: (r) => r.title, query: (q) => ({ $or: [{ alert_code: { $regex: q } }, { palm_identifier: { $regex: q } }] }) },
  { key: 'RecyclingFacility', entity: 'RecyclingFacility', group: { ar: 'المنشآت', en: 'Facilities' }, icon: Factory, to: () => '/facility', label: (r) => r.name, sub: (r) => r.region, query: (q) => ({ name: { $regex: q } }) },
  { key: 'Product', entity: 'Product', group: { ar: 'المتجر', en: 'Store' }, icon: ShoppingBag, to: () => '/store', label: (r) => r.name_ar, sub: (r) => r.facility_name, query: (q) => ({ $or: [{ name_ar: { $regex: q } }, { name_en: { $regex: q } }] }) },
];

export default function GlobalSearch({ open, onOpenChange }) {
  const { L } = useLang();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = q.trim();
    if (!open || term.length < 1) {
      setResults([]);
      return undefined;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const groups = await Promise.all(
          ENTITIES.map(async (e) => {
            try {
              const page = await base44.entities[e.entity].filter(e.query(term), { limit: 4 });
              return { ...e, rows: page?.items ?? [] };
            } catch (err) {
              return { ...e, rows: [] };
            }
          })
        );
        setResults(groups.filter((g) => g.rows.length));
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => clearTimeout(t);
  }, [q, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-safa-line px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-safa-palm">
            <Search className="h-4 w-4" />
            {L('البحث الشامل في سعفة', 'Global SA’FA search')}
          </DialogTitle>
        </DialogHeader>
        <div className="border-b border-safa-line px-5 py-3">
          <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('جرّب: 104 · الواحة · W-104-02', 'Try: 104 · Al-Ahsa · W-104-02')} className="border-0 bg-transparent px-0 text-sm focus-visible:ring-0" />
        </div>
        <div className="max-h-[52vh] overflow-y-auto px-3 py-3">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-6 text-xs text-safa-ink/50">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {L('جاري البحث…', 'Searching…')}
            </div>
          ) : null}
          {!loading && !results.length ? (
            <p className="px-3 py-6 text-xs text-safa-ink/50">
              {q ? L('لا نتائج مطابقة.', 'No matching results.') : L('اكتب معرّف نخلة، مزرعة، مخلفات، تنبيه، منشأة أو منتج.', 'Type a palm ID, farm, waste code, alert, facility or product.')}
            </p>
          ) : null}
          {results.map((g) => (
            <div key={g.key} className="mb-3">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-safa-earth">{L(g.group.ar, g.group.en)}</p>
              {g.rows.map((r) => (
                <Link
                  key={r.id}
                  to={g.to(r)}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-safa-mist"
                >
                  <g.icon className="h-4 w-4 text-safa-palm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-safa-ink">{g.label(r)}</span>
                    <span className="block truncate text-[11px] text-safa-ink/50">{g.sub(r)}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-safa-line bg-safa-mist/60 px-5 py-3 text-[10px] text-safa-ink/50">
          <Building2 className="h-3 w-3" />
          {L('يشمل البحث نخيل سعفة، المخلفات، التنبيهات، المنشآت ومنتجات المتجر.', 'Search covers SA’FA palms, waste, alerts, facilities and store products.')}
        </div>
      </DialogContent>
    </Dialog>
  );
}