import { useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ASSETS } from '@/lib/assets';
import { useLang } from '@/lib/i18n';
import { rpwLevel } from '@/lib/format';
import { cn } from '@/lib/utils';

export const LAYERS = [
  { key: 'palms', ar: 'النخيل', en: 'Palms', color: '#1E3A2F' },
  { key: 'health', ar: 'الصحة', en: 'Health', color: '#4A7C59' },
  { key: 'stress', ar: 'الإجهاد', en: 'Stress', color: '#C8A15A' },
  { key: 'rpw', ar: 'السوسة الحمراء', en: 'Red Palm Weevil', color: '#B03A2E' },
  { key: 'waste', ar: 'المخلفات المتوقعة', en: 'Predicted waste', color: '#8B7355' },
  { key: 'collection', ar: 'الجمع', en: 'Collection', color: '#4B533E' },
  { key: 'facilities', ar: 'منشآت التدوير', en: 'Recycling facilities', color: '#2C4A3B' },
  { key: 'burning', ar: 'خطر الحرق', en: 'Disposal / burning risk', color: '#8B2F24' },
];

const colorFor = (palm, layers) => {
  if (layers.rpw && palm.rpw_risk >= 0.6) return '#B03A2E';
  if (layers.stress && palm.status === 'attention') return '#C8A15A';
  if (layers.burning && palm.status === 'critical') return '#8B2F24';
  if (layers.health) return '#4A7C59';
  return '#1E3A2F';
};

export default function SmartMapCanvas({ palms = [], facilities = [], layers, onSelect, selectedId, compact = false }) {
  const { L } = useLang();
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);

  const active = layers || { palms: true, health: true, rpw: true, waste: true, facilities: true };
  const points = [...palms, ...(active.facilities ? facilities : [])].filter((p) => p.latitude && p.longitude);
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats, 25.2);
  const maxLat = Math.max(...lats, 25.5);
  const minLng = Math.min(...lngs, 49.5);
  const maxLng = Math.max(...lngs, 49.8);

  const pos = (p) => ({
    x: 6 + ((p.longitude - minLng) / (maxLng - minLng || 1)) * 88,
    y: 8 + (1 - (p.latitude - minLat) / (maxLat - minLat || 1)) * 84,
  });

  const zoom = (delta) => setView((v) => ({ ...v, scale: Math.min(3, Math.max(1, +(v.scale + delta).toFixed(2))) }));

  const down = (e) => {
    drag.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
    setDragging(true);
  };
  const move = (e) => {
    if (!drag.current) return;
    setView((v) => ({ ...v, x: drag.current.ox + (e.clientX - drag.current.sx), y: drag.current.oy + (e.clientY - drag.current.sy) }));
  };
  const up = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-safa-line bg-safa-palmDeep', compact ? 'h-[380px]' : 'h-[560px]')}>
      <div
        className={cn('absolute inset-0 cursor-grab active:cursor-grabbing', dragging && 'select-none')}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onWheel={(e) => {
          e.preventDefault();
          zoom(e.deltaY > 0 ? -0.12 : 0.12);
        }}
      >
        <div
          className="absolute inset-0 origin-center"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transition: dragging ? 'none' : 'transform 260ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          <img src={ASSETS.map} alt={L('خريطة واحة الأحساء', 'Al-Ahsa oasis map')} className="h-full w-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-safa-palmDeep/70 via-transparent to-safa-palmDeep/20" />

          {active.waste
            ? palms
                .filter((p) => p.predicted_waste_tons > 2)
                .map((p) => {
                  const { x, y } = pos(p);
                  return (
                    <span
                      key={`w-${p.id}`}
                      className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-safa-gold/50 bg-safa-gold/15"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    />
                  );
                })
            : null}

          {palms.map((p) => {
            const { x, y } = pos(p);
            const color = colorFor(p, active);
            const isSelected = selectedId === p.id;
            return (
              <button
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(p);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`${L('نخلة', 'Palm')} ${p.palm_identifier}`}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  {(p.rpw_risk >= 0.6 || isSelected) && <span className="absolute h-4 w-4 animate-ring-out rounded-full" style={{ background: color, opacity: 0.4 }} />}
                  <span
                    className={cn('relative rounded-full border border-white/70 transition', isSelected ? 'h-4 w-4' : 'h-2.5 w-2.5')}
                    style={{ background: color }}
                  />
                </span>
              </button>
            );
          })}

          {active.facilities
            ? facilities
                .filter((f) => f.latitude && f.longitude)
                .map((f) => {
                  const { x, y } = pos(f);
                  return (
                    <span
                      key={f.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/50 bg-safa-palmMid/90 px-2 py-1 text-[9px] text-safa-cream shadow-lg"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {f.name}
                    </span>
                  );
                })
            : null}
        </div>
      </div>

      <div className="absolute bottom-4 end-4 flex flex-col gap-1.5">
        <button onClick={() => zoom(0.25)} className="rounded-lg border border-white/20 bg-safa-palmDeep/80 p-2 text-safa-cream backdrop-blur" aria-label={L('تكبير', 'Zoom in')}>
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => zoom(-0.25)} className="rounded-lg border border-white/20 bg-safa-palmDeep/80 p-2 text-safa-cream backdrop-blur" aria-label={L('تصغير', 'Zoom out')}>
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="absolute bottom-4 start-4 rounded-xl border border-white/15 bg-safa-palmDeep/80 px-3 py-2 text-[10px] text-safa-cream/70 backdrop-blur">
        {L('النخيل المعروض', 'Palms shown')}: <span className="font-semibold text-safa-cream">{palms.length}</span> ·{' '}
        {L('الأحساء', 'Al-Ahsa')} ·{' '}
        <span className="opacity-70">{layers ? Object.values(layers).filter(Boolean).length : LAYERS.length} {L('طبقات', 'layers')}</span>
      </div>

      <div className="absolute top-4 start-4 flex items-center gap-2">
        {[
          { color: '#4A7C59', ar: 'مستقر', en: 'Stable' },
          { color: '#C8A15A', ar: 'تحت المتابعة', en: 'Under observation' },
          { color: '#B03A2E', ar: 'خطر مرتفع', en: 'High risk' },
        ].map((l) => (
          <span key={l.en} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-safa-palmDeep/80 px-2.5 py-1 text-[10px] text-safa-cream/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
            {L(l.ar, l.en)}
          </span>
        ))}
      </div>
    </div>
  );
}