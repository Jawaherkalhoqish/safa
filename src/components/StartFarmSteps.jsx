import { ArrowDown, MapPin, Radio, ShieldAlert, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n';

const STEPS = [
  { icon: MapPin, ar: 'أضف المزرعة', en: 'Add the farm' },
  { icon: Sprout, ar: 'أضف النخيل', en: 'Add palms' },
  { icon: Radio, ar: 'اربط بيانات الاستشعار', en: 'Connect sensor data' },
  { icon: ShieldAlert, ar: 'ابدأ المراقبة', en: 'Start monitoring' },
  { icon: ArrowDown, ar: 'استقبل أول تنبيه', en: 'Receive the first alert' },
  { icon: ArrowDown, ar: 'توقع مخلفاتك', en: 'Predict your waste' },
];

export default function StartFarmSteps({ onAddPalm }) {
  const { L } = useLang();
  return (
    <div className="panel p-6">
      <p className="eyebrow">{L('ابدأ من هنا', 'START HERE')}</p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-safa-palm">{L('لنبدأ ببناء مزرعتك', 'Let’s build your farm')}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-safa-ink/60">
        {L(
          'لا توجد بيانات بعد لهذه المزرعة. أكمل الخطوات التالية لتفعيل المراقبة والتنبؤ بالمخلفات.',
          'No data yet for this farm. Complete the steps below to activate monitoring and waste prediction.'
        )}
      </p>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.en} className="rounded-2xl border border-safa-line bg-safa-cream/60 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-safa-line bg-white text-safa-palm">
                <s.icon className="h-3.5 w-3.5" />
              </span>
              <span className="font-display text-xs text-safa-earth">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <p className="mt-3 text-[13px] font-medium text-safa-palm">{L(s.ar, s.en)}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onAddPalm} className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
          {L('إضافة نخلة', 'Add a palm')}
        </Button>
        <Button asChild variant="outline" className="border-safa-line text-safa-palm">
          <Link to="/methodology">{L('كيف تعمل سعفة؟', 'How SA’FA works')}</Link>
        </Button>
      </div>
    </div>
  );
}