import { Building2, Link2, PiggyBank, Sprout } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Reveal from '@/components/motion/Reveal';

const ACTORS = [
  {
    icon: Sprout,
    ar: { title: 'المزارعون', body: 'مراقبة صحة النخيل، الإنذار المبكر، وتقدير المخلفات قبل أن تتكوّن وتحويلها إلى قيمة.' },
    en: { title: 'Farmers', body: 'Palm health monitoring, early warning, and waste estimation before it forms, turning it into value.' },
  },
  {
    icon: Building2,
    ar: { title: 'الشركات والمنشآت الزراعية', body: 'استلام المخلفات وإدارتها وتشغيل خطوط التدوير، وتحويل المادة إلى منتجات دائرة قابلة للتسويق.' },
    en: { title: 'Agricultural companies & facilities', body: 'Receiving and managing waste, running recycling lines, and turning material into marketable circular products.' },
  },
  {
    icon: PiggyBank,
    ar: { title: 'المستثمرون', body: 'رؤية قابلة للقياس لحجم الموارد المتاحة، وسلاسل الإمداد، وفرص النمو في الاقتصاد الدائري الزراعي.' },
    en: { title: 'Investors', body: 'A measurable view of available resources, supply chains, and growth opportunities in the agricultural circular economy.' },
  },
];

export default function AboutSection() {
  const { L, isAr } = useLang();

  return (
    <section id="about" className="scroll-mt-24 border-b border-safa-line bg-safa-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">{L('عن سعفة', 'ABOUT SA’FA')}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-safa-palm md:text-5xl">
              {L('منظومة واحدة تربط صحة النخلة بمستقبلها', 'One ecosystem connecting palm health to its future')}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-safa-ink/70">
              <p>
                {L(
                  'سعفة منصة سعودية عميقة التقنية تعمل على سلسلة النخلة كاملة: من إشارات الصحة والإنذار المبكر، إلى التنبؤ بالمخلفات وتوجيهها، إلى معالجتها وتحويلها إلى منتجات دائرية في سوق واحد.',
                  'SA’FA is a Saudi deep-tech platform that works across the entire palm chain: from health signals and early warning, to waste prediction and routing, to treatment and conversion into circular products in one marketplace.'
                )}
              </p>
              <p>
                {L(
                  'لا نبيع أدوات منفصلة. الاشتراك يمنح الدخول إلى المنظومة المتكاملة، وتختلف الخطط في السعة وحدود الاستخدام والقدرات المتقدمة، لا في الوصول إلى ميزة واحدة مقابل رسم إضافي.',
                  'We do not sell disconnected tools. A subscription gives access to the integrated ecosystem, and plans differ in capacity, usage limits and advanced capabilities, not by charging separately for individual features.'
                )}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] text-safa-earth">
              <span className="rounded-full border border-safa-line bg-white px-3 py-1.5">{L('صحة النخيل', 'Palm health')}</span>
              <Link2 className="h-3.5 w-3.5 rotate-90 opacity-50" aria-hidden />
              <span className="rounded-full border border-safa-line bg-white px-3 py-1.5">{L('تقدير المخلفات', 'Waste prediction')}</span>
              <Link2 className="h-3.5 w-3.5 rotate-90 opacity-50" aria-hidden />
              <span className="rounded-full border border-safa-line bg-white px-3 py-1.5">{L('الاقتصاد الدائري', 'Circular economy')}</span>
            </div>
          </div>

          <div className="space-y-3">
            {ACTORS.map((a, i) => (
              <Reveal
                as="article"
                key={a.en.title}
                delay={i * 110}
                className="panel glow-card flex gap-4 p-5 md:p-6"
              >
                <span className="card-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
                  <a.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-safa-palm">{isAr ? a.ar.title : a.en.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-safa-ink/65">{isAr ? a.ar.body : a.en.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}