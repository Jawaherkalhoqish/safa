import { MapPin, Ruler, Sprout } from 'lucide-react';
import { Image } from '@/components/ui/image';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/i18n';
import { LAND_OWNERSHIP, LAND_STATUS, PRICE_UNIT, regionLabel } from '@/lib/community';
import { money, num } from '@/lib/format';

export const priceText = (land, lang) => {
  if (!land.price) return lang === 'ar' ? 'حسب الطلب' : 'On request';
  const unit = PRICE_UNIT[land.price_unit] || PRICE_UNIT.total;
  return `${money(land.price, lang)} / ${lang === 'ar' ? unit.ar : unit.en}`;
};

export default function LandCard({ land, onOpen }) {
  const { L, isAr, lang } = useLang();
  const ownership = LAND_OWNERSHIP[land.ownership] || LAND_OWNERSHIP.sale;
  const status = LAND_STATUS[land.status] || LAND_STATUS.available;

  return (
    <button type="button" onClick={() => onOpen(land)} className="panel glow-card group flex h-full flex-col overflow-hidden p-0 text-start">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={land.image_url}
          alt={isAr ? land.title : land.title_en || land.title}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          fittingType="fill"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <StatusBadge tone={ownership.tone} label={L(ownership.ar, ownership.en)} className="bg-white/90 backdrop-blur" />
          <StatusBadge tone={status.tone} label={L(status.ar, status.en)} className="bg-white/90 backdrop-blur" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[14.5px] font-semibold leading-snug text-safa-palm">{isAr ? land.title : land.title_en || land.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-safa-ink/55">
          <MapPin className="h-3.5 w-3.5 text-safa-oliveSoft" />
          {isAr ? land.location : land.location_en || land.location}
          <span className="text-safa-ink/35">· {regionLabel(land.region, isAr)}</span>
        </p>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-safa-ink/65">
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5 text-safa-oliveSoft" />
            {L(`${num(land.area_ha, 1)} هكتار`, `${num(land.area_ha, 1)} ha`)}
          </span>
          {land.palm_count ? (
            <span className="inline-flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-safa-oliveSoft" />
              {L(`${num(land.palm_count)} نخلة`, `${num(land.palm_count)} palms`)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-safa-line/70 pt-3.5">
          <p className="display-num text-base text-safa-palm">{priceText(land, lang)}</p>
          <span className="text-[11px] font-medium text-safa-earth transition group-hover:text-safa-palm">{land.listing_code}</span>
        </div>
      </div>
    </button>
  );
}