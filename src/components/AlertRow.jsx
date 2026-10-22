import { Link } from 'react-router-dom';
import { BellRing, Boxes, Recycle, ShieldAlert, ShoppingBag, TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/i18n';
import { ALERT_STATUS, SEVERITY, dateStr, num, pick } from '@/lib/format';

const ICONS = {
  rpw_suspicion: ShieldAlert,
  sensor_anomaly: TrendingUp,
  waste_prediction: Boxes,
  collection: Recycle,
  recycling: Recycle,
  product: ShoppingBag,
};

export default function AlertRow({ alert, action }) {
  const { L, lang } = useLang();
  const Icon = ICONS[alert.type] || BellRing;
  const severity = SEVERITY[alert.severity] || SEVERITY.low;
  const status = ALERT_STATUS[alert.status] || ALERT_STATUS.new;

  return (
    <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-safa-line bg-white p-4 transition hover:border-safa-sand">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-safa-palm">{alert.title}</p>
          <StatusBadge tone={severity.tone} label={L(severity.ar, severity.en)} />
          <StatusBadge tone={status.tone} label={L(status.ar, status.en)} />
          {alert.alert_code ? <span className="text-[10px] text-safa-ink/40">{alert.alert_code}</span> : null}
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-safa-ink/65">{alert.reason}</p>
        {alert.recommendation ? (
          <p className="mt-1.5 text-[11px] text-safa-earth">{L('الإجراء المقترح', 'Recommended')}: {alert.recommendation}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-safa-ink/45">
          {alert.palm_identifier ? (
            <Link to={`/palms`} className="rounded-full border border-safa-line px-2 py-0.5">
              {L('نخلة', 'Palm')} #{alert.palm_identifier}
            </Link>
          ) : null}
          {alert.farm_name ? <span>{alert.farm_name}</span> : null}
          {alert.indicator != null ? <span>{L('المؤشر', 'Indicator')} {num(alert.indicator, 2)}</span> : null}
          <span>{dateStr(alert.created_date, lang, true)}</span>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}