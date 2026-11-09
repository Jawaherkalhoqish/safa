import { useLocation } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import DemoTag from '@/components/DemoTag';
import { useLang } from '@/lib/i18n';

export default function Legal() {
  const { pathname } = useLocation();
  const { L } = useLang();
  const isPrivacy = pathname.includes('privacy');

  const privacy = [
    {
      ar: { t: 'ما نجمعه', b: 'بيانات المزرعة والنخيل وقراءات الاستشعار وسجلات المخلفات والطلبات المرتبطة بالمنصة.' },
      en: { t: 'What we collect', b: 'Farm, palm, sensor reading, waste and request records associated with the platform.' },
    },
    {
      ar: { t: 'كيف نستخدمها', b: 'لتوليد مؤشرات الإنذار المبكر، وتقدير المخلفات، وتخطيط الجمع، وتوجيه المواد إلى المسارات الدائرية.' },
      en: { t: 'How we use it', b: 'To produce early-warning indicators, estimate waste, plan collection and route material into circular pathways.' },
    },
    {
      ar: { t: 'صلاحيات الوصول', b: 'المزارع يدير مزرعته ونخيله، ومنشأة التدوير تدير عملياتها، والجهات المختصة ترى المعلومات الإقليمية المصرح بها، والزائر يستعرض بيئة العرض فقط.' },
      en: { t: 'Access rights', b: 'Farmers manage their own farm and palms, facilities manage their operations, authorities view authorised regional information, and visitors explore the demo environment only.' },
    },
    {
      ar: { t: 'بيانات النسخة التجريبية', b: 'البيانات المعروضة في هذه النسخة بيانات تجريبية لأغراض العرض، ولا تُنشر بيانات مستخدمين خاصة.' },
      en: { t: 'Prototype data', b: 'Data shown in this prototype is demo data for presentation purposes; no private user data is published.' },
    },
  ];

  const terms = [
    { ar: { t: 'طبيعة النسخة', b: 'منصة سعفة في هذه النسخة نموذج أولي للعرض والتقييم، وقد تتغير الميزات والبيانات.' }, en: { t: 'Nature of the build', b: 'This version of SA’FA is a prototype for presentation and evaluation; features and data may change.' } },
    { ar: { t: 'لا تشخيص نهائي', b: 'المؤشرات المعروضة لدعم القرار والإنذار المبكر ولا تُعد تشخيصًا ميدانيًا نهائيًا.' }, en: { t: 'No definitive diagnosis', b: 'Indicators support decision making and early warning and do not constitute a definitive field diagnosis.' } },
    { ar: { t: 'القيم التقديرية', b: 'قيم المخلفات والمنتجات تقديرية لأغراض النموذج، ولا تمثل عرضًا تجاريًا ملزمًا.' }, en: { t: 'Estimated values', b: 'Waste and product values are estimates for prototype purposes and are not a binding commercial offer.' } },
    { ar: { t: 'الاستخدام المسؤول', b: 'يجب استخدام المنصة بما يتوافق مع الأنظمة الزراعية والبيئية المعمول بها.' }, en: { t: 'Responsible use', b: 'The platform must be used in line with applicable agricultural and environmental regulations.' } },
  ];

  const sections = isPrivacy ? privacy : terms;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('معلومات', 'INFORMATION')}
        title={isPrivacy ? L('سياسة الخصوصية', 'Privacy Policy') : L('الشروط', 'Terms')}
        subtitle={L('نموذج أولي — الشروط والنصوص المقترحة قابلة للتحديث.', 'Prototype — the proposed terms and text are subject to change.')}
        actions={<DemoTag text={L('نسخة تجريبية', 'Prototype')} />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Panel key={s.en.t} title={L(s.ar.t, s.en.t)}>
            <p className="text-[12px] leading-relaxed text-safa-ink/65">{L(s.ar.b, s.en.b)}</p>
          </Panel>
        ))}
      </div>

      <p className="text-[10px] text-safa-ink/40">
        {L(
          'SA’FA | سعفة — من إرث الأحساء، نبني منظومة زراعية مستدامة. نموذج أولي في بيئة عرض.',
          'SA’FA — From Al-Ahsa’s Heritage, We Build a Sustainable Agricultural Ecosystem. Prototype in a demo environment.'
        )}
      </p>
    </div>
  );
}