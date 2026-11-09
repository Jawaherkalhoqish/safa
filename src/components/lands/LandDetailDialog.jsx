import { CalendarDays, Droplets, Mail, MapPin, Phone, Ruler, Sprout, UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/i18n';
import { LAND_OWNERSHIP, LAND_STATUS, LISTING_OWNER_TYPE, regionLabel } from '@/lib/community';
import { dateStr, num } from '@/lib/format';
import { priceText } from '@/components/lands/LandCard';

export default function LandDetailDialog({ land, onClose }) {
  const { L, isAr, lang } = useLang();
  if (!land) return null;

  const ownership = LAND_OWNERSHIP[land.ownership] || LAND_OWNERSHIP.sale;
  const status = LAND_STATUS[land.status] || LAND_STATUS.available;
  const ownerType = LISTING_OWNER_TYPE[land.owner_type] || LISTING_OWNER_TYPE.farmer;

  const specs = [
    { label: L('المساحة', 'Area'), value: L(`${num(land.area_ha, 1)} هكتار`, `${num(land.area_ha, 1)} hectares`), icon: Ruler },
    { label: L('عدد النخيل', 'Palms'), value: land.palm_count ? num(land.palm_count) : '—', icon: Sprout },
    { label: L('نوع التربة', 'Soil'), value: isAr ? land.soil_type : land.soil_type_en || land.soil_type, icon: Sprout },
    { label: L('مصدر المياه', 'Water source'), value: isAr ? land.water_source : land.water_source_en || land.water_source, icon: Droplets },
    { label: L('نظام الري', 'Irrigation'), value: isAr ? land.irrigation_type : land.irrigation_type_en || land.irrigation_type, icon: Droplets },
    { label: L('تاريخ الإدراج', 'Listed'), value: dateStr(land.listed_date || land.created_date, lang, true), icon: CalendarDays },
  ];

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <div className="relative h-56 w-full overflow-hidden sm:h-64">
          <Image src={land.image_url} alt={isAr ? land.title : land.title_en || land.title} className="h-full w-full" fittingType="fill" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
            <StatusBadge tone={ownership.tone} label={L(ownership.ar, ownership.en)} className="bg-white/90 backdrop-blur" />
            <StatusBadge tone={status.tone} label={L(status.ar, status.en)} className="bg-white/90 backdrop-blur" />
          </div>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          <DialogHeader className="text-start">
            <DialogTitle className="text-lg leading-snug">{isAr ? land.title : land.title_en || land.title}</DialogTitle>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-safa-ink/60">
              <MapPin className="h-3.5 w-3.5 text-safa-oliveSoft" />
              {isAr ? land.location : land.location_en || land.location}
              <span className="text-safa-ink/35">· {regionLabel(land.region, isAr)}</span>
              <span className="text-safa-ink/35">· {land.listing_code}</span>
            </p>
          </DialogHeader>

          <p className="whitespace-pre-line text-[13px] leading-relaxed text-safa-ink/75">
            {isAr ? land.description : land.description_en || land.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((s) => (
              <div key={s.label} className="rounded-xl border border-safa-line bg-safa-cream/70 p-3.5">
                <p className="flex items-center gap-1.5 text-[10.5px] text-safa-ink/50">
                  <s.icon className="h-3.5 w-3.5 text-safa-oliveSoft" />
                  {s.label}
                </p>
                <p className="mt-1.5 text-[12.5px] font-medium text-safa-palm">{s.value || '—'}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-safa-line bg-safa-mist/50 p-4">
            <div>
              <p className="text-[10.5px] text-safa-ink/50">{L('القيمة المطلوبة', 'Asking value')}</p>
              <p className="display-num mt-1 text-xl text-safa-palm">{priceText(land, lang)}</p>
            </div>
            <div className="text-[12px] text-safa-ink/70">
              <p className="flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5 text-safa-oliveSoft" />
                {isAr ? land.owner_name : land.owner_name_en || land.owner_name}
                <span className="text-safa-ink/40">· {L(ownerType.ar, ownerType.en)}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-safa-line pt-4">
            {land.contact_phone ? (
              <a
                href={`tel:${land.contact_phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-safa-palm px-5 py-2.5 text-xs font-semibold text-safa-bone transition hover:bg-safa-palmMid"
              >
                <Phone className="h-3.5 w-3.5" />
                {L('تواصل مع المالك', 'Contact owner')}
              </a>
            ) : null}
            {land.contact_email ? (
              <a
                href={`mailto:${land.contact_email}`}
                className="inline-flex items-center gap-2 rounded-full border border-safa-line px-5 py-2.5 text-xs font-medium text-safa-palm transition hover:bg-safa-mist"
              >
                <Mail className="h-3.5 w-3.5" />
                {L('راسل المالك', 'Email owner')}
              </a>
            ) : null}
            <button onClick={onClose} className="rounded-full px-4 py-2.5 text-xs text-safa-ink/55 transition hover:text-safa-palm">
              {L('إغلاق', 'Close')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}