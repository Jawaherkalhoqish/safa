import { Link } from 'react-router-dom';
import { CalendarClock, Droplets, MapPin, ShieldAlert, Thermometer } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { HEALTH_BAND, RPW_LEVEL, daysLeft, num, pick, rpwLevel } from '@/lib/format';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function PalmCard({ palm, className }) {
  const { L, lang } = useLang();
  const band = HEALTH_BAND[palm.status] || HEALTH_BAND.stable;
  const risk = RPW_LEVEL[rpwLevel(palm.rpw_risk)];

  return (
    <Link
      to={`/palms/${palm.id}`}
      className={cn('panel group flex flex-col p-5 transition duration-500 hover:-translate-y-1 hover:border-safa-sand hover:shadow-lg', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-safa-palm">{L('نخلة', 'Palm')} #{palm.palm_identifier}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-safa-ink/55">
            <MapPin className="h-3 w-3" />
            {palm.farm_name} · {palm.location || palm.region}
          </p>
        </div>
        <span className="display-num text-2xl text-safa-palm">{num(palm.health_score)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge tone={band.tone} label={L(band.ar, band.en)} />
        <StatusBadge tone={risk.tone} label={`${L('خطر السوسة', 'RPW')} ${num(palm.rpw_risk, 2)}`} icon={ShieldAlert} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-safa-line pt-4 text-[11px]">
        <div>
          <dt className="text-safa-ink/45">{L('مخلفات متوقعة', 'Predicted waste')}</dt>
          <dd className="mt-1 font-semibold text-safa-palm">{num(palm.predicted_waste_tons, 1)} {L('طن', 't')}</dd>
        </div>
        <div>
          <dt className="text-safa-ink/45">{L('الفترة المتوقعة', 'Expected in')}</dt>
          <dd className="mt-1 flex items-center gap-1 font-semibold text-safa-palm">
            <CalendarClock className="h-3 w-3" />
            {daysLeft(palm.predicted_date) != null ? L(`${num(daysLeft(palm.predicted_date))} يومًا`, `${num(daysLeft(palm.predicted_date))} days`) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-safa-ink/45">{L('رطوبة التربة', 'Soil moisture')}</dt>
          <dd className="mt-1 flex items-center gap-1 font-semibold text-safa-palm">
            <Droplets className="h-3 w-3" />{num(palm.soil_moisture)}%
          </dd>
        </div>
        <div>
          <dt className="text-safa-ink/45">{L('الحرارة', 'Temperature')}</dt>
          <dd className="mt-1 flex items-center gap-1 font-semibold text-safa-palm">
            <Thermometer className="h-3 w-3" />{num(palm.temperature)}°C
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[10px] text-safa-earth/70">
        {L('آخر قراءة استشعار', 'Last sensor reading')}: {palm.last_sensor_at ? new Date(palm.last_sensor_at).toLocaleString(lang === 'ar' ? 'en-GB' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
      </p>
    </Link>
  );
}