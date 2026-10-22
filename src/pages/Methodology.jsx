import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import HowItWorks from '@/components/HowItWorks';
import SensorArchitecture from '@/components/SensorArchitecture';
import DemoTag from '@/components/DemoTag';
import { PATHWAYS } from '@/lib/platform';
import { useLang } from '@/lib/i18n';
import { METHODOLOGY } from '@/lib/platform';

export default function Methodology() {
  const { L } = useLang();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('الشفافية العلمية', 'SCIENTIFIC TRANSPARENCY')}
        title={L('منهجية سعفة', 'SA’FA Methodology')}
        subtitle={L('كيف تتحول الإشارات إلى مؤشرات، وكيف تُحوَّل المؤشرات إلى قرارات ميدانية ومسارات دائرية.', 'How signals become indicators, and how indicators become field decisions and circular pathways.')}
        actions={<DemoTag text={L('نموذج أولي', 'Prototype')} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METHODOLOGY.map((m, i) => (
          <div key={m.en.title} className="panel p-6">
            <span className="font-display text-2xl text-safa-sand">{String(i + 1).padStart(2, '0')}</span>
            <p className="mt-4 text-[14px] font-semibold text-safa-palm">{L(m.ar.title, m.en.title)}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-safa-ink/60">{L(m.ar.body, m.en.body)}</p>
          </div>
        ))}
      </div>

      <Panel title={L('بنية الاستشعار والتحليل', 'Sensing and analysis architecture')} subtitle={L('من المستشعرات إلى دعم القرار', 'From sensors to decision support')}>
        <SensorArchitecture />
      </Panel>

      <HowItWorks compact />

      <Panel title={L('مسارات المعالجة', 'Treatment pathways')}>
        <div className="grid gap-4 lg:grid-cols-3">
          {PATHWAYS.map((p) => (
            <div
              key={p.key}
              className={`rounded-2xl border p-5 ${
                p.tone === 'green' ? 'border-safa-okLine bg-safa-okBg/60' : p.tone === 'amber' ? 'border-safa-warnLine bg-safa-warnBg/70' : 'border-safa-dangerLine bg-safa-dangerBg/60'
              }`}
            >
              <p className="text-[13px] font-semibold text-safa-palm">{L(p.ar.title, p.en.title)}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-safa-ink/65">{L(p.ar.body, p.en.body)}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="rounded-2xl border border-safa-sand bg-safa-sandSoft/40 p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-safa-palm">
          <Info className="h-4 w-4" />
          {L('تنويه علمي', 'Scientific disclaimer')}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-safa-ink/70">
          {L(
            'قراءات سعفة والمؤشرات الناتجة عنها في هذه النسخة تمثل نموذجًا أوليًا لدعم القرار والإنذار المبكر، ولا تُعد تشخيصًا ميدانيًا نهائيًا.',
            'SA’FA indicators in this prototype are intended for early-warning and decision support and do not constitute a definitive field diagnosis.'
          )}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-safa-ink/70">
          {L(
            'لا يدّعي أي مستشعر بمفرده القدرة على تشخيص كل الحالات؛ الناتج مؤشر مركب يحتاج تحققًا ميدانيًا عند اللزوم.',
            'No single sensor claims to diagnose every condition; the output is a composite indicator that requires field verification when needed.'
          )}
        </p>
        <Link to="/tour" className="mt-4 inline-flex text-[11px] font-medium text-safa-palm underline-offset-2 hover:underline">
          {L('جرّب الجولة التعريفية على البيانات', 'Try the guided tour on live data')}
        </Link>
      </div>
    </div>
  );
}