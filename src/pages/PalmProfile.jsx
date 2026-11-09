import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, ScanLine } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PalmDetail from '@/components/PalmDetail';
import StatusBadge from '@/components/StatusBadge';
import DemoTag from '@/components/DemoTag';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { HEALTH_BAND, RPW_LEVEL, num, rpwLevel } from '@/lib/format';

export default function PalmProfile() {
  const { id } = useParams();
  const { L, isAr } = useLang();
  const [palm, setPalm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const record = await base44.entities.Palm.get(id);
        if (alive) setPalm(record);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !palm) return <ErrorState label={L('تعذر تحميل ملف النخلة', 'Could not load the palm profile')} />;

  const band = HEALTH_BAND[palm.status] || HEALTH_BAND.stable;
  const risk = RPW_LEVEL[rpwLevel(palm.rpw_risk)];

  return (
    <div className="space-y-5">
      <Link to="/palms" className="inline-flex items-center gap-1.5 text-[11px] text-safa-earth underline-offset-2 hover:underline">
        {isAr ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
        {L('عودة إلى نخيلي', 'Back to My Palms')}
      </Link>

      <PageHeader
        eyebrow={`${L('ملف النخلة', 'PALM PROFILE')} · ${palm.region}`}
        title={`${L('نخلة', 'Palm')} #${palm.palm_identifier}`}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {palm.location} — {palm.farm_name}
            </span>
            <StatusBadge tone={band.tone} label={L(band.ar, band.en)} />
            <StatusBadge tone={risk.tone} label={`${L('خطر السوسة', 'RPW risk')} ${num(palm.rpw_risk, 2)}`} />
            <DemoTag />
          </span>
        }
        actions={
          <Link
            to={`/analysis?palm=${palm.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-safa-palm px-4 py-2 text-[12px] font-semibold text-safa-bone transition hover:bg-safa-palmMid"
          >
            <ScanLine className="h-3.5 w-3.5" />
            {L('تحليل صورة النخلة', 'Analyse a photo')}
          </Link>
        }
      />

      <PalmDetail palm={palm} />
    </div>
  );
}