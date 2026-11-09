import { Banknote, Building2, Compass, Leaf, ScrollText, Sparkles, Sprout, Target } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import BrandLogo from '@/components/BrandLogo';
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
    icon: Banknote,
    ar: { title: 'المستثمرون', body: 'رؤية قابلة للقياس لحجم الموارد المتاحة، وسلاسل الإمداد، وفرص النمو في الاقتصاد الدائري الزراعي.' },
    en: { title: 'Investors', body: 'A measurable view of available resources, supply chains, and growth opportunities in the agricultural circular economy.' },
  },
];

const PILLARS = [
  {
    icon: ScrollText,
    ar: { title: 'الإرث', body: 'الأحساء موطن النخيل في المملكة، ومنها تستمد سعفة اسمَها وروحها قبل تقنيتها.' },
    en: { title: 'Heritage', body: 'Al-Ahsa is the home of the palm in the Kingdom, and SA’FA draws its name and spirit from there before its technology.' },
  },
  {
    icon: Leaf,
    ar: { title: 'الاستدامة', body: 'كل جزء من النخلة يحمل قيمة، والمنظومة تعمل على إعادة ما كان يُهمل إلى دورة الإنتاج.' },
    en: { title: 'Sustainability', body: 'Every part of the palm carries value, and the ecosystem returns what was discarded to the production cycle.' },
  },
  {
    icon: Sparkles,
    ar: { title: 'المستقبل', body: 'الفلسفة التي نعمل بها تجمع الإرث والابتكار: تقنية تُقرأ بها النخلة، وسوق تعيد قيمة ما كان يُهمل.' },
    en: { title: 'Future', body: 'Our working philosophy joins heritage with innovation: technology that reads the palm, and a market that restores value to what was discarded.' },
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
              {L('من واحة الأحساء.. منظومة تربط صحة النخلة بمستقبلها', 'From the Al-Ahsa oasis: one ecosystem linking palm health to its future')}
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

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="panel glow-card p-5">
                <span className="card-icon flex h-10 w-10 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
                  <Target className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-safa-earth">{L('رسالتنا', 'Our mission')}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-safa-ink/70">
                  {L(
                    'أن تصبح كل نخلة في المملكة قابلة للقراءة والقرار: صحتها معروفة، ومخلفاتها محسوبة، وقيمتها مستعادة داخل المنظومة.',
                    'To make every palm in the Kingdom readable and decidable: its health known, its waste accounted for, and its value recovered inside the ecosystem.'
                  )}
                </p>
              </div>
              <div className="panel glow-card p-5">
                <span className="card-icon flex h-10 w-10 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
                  <Compass className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-safa-earth">{L('رؤيتنا', 'Our vision')}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-safa-ink/70">
                  {L(
                    'أن تُقاس المنظومة الزراعية بأثرها: مزارع أكثر استدامة، وسلاسل تدوير تعمل فعليًا، واقتصاد دائري يبدأ من واحة الأحساء.',
                    'To measure the agricultural ecosystem by its impact: more sustainable farms, recycling chains that actually operate, and a circular economy beginning at the Al-Ahsa oasis.'
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-safa-earth">
              <span className="rounded-full border border-safa-line bg-white px-3 py-1.5">{L('صحة النخيل', 'Palm health')}</span>
              <span className="rounded-full border border-safa-line bg-white px-3 py-1.5">{L('تقدير المخلفات', 'Waste prediction')}</span>
              <span className="rounded-full border border-safa-line bg-white px-3 py-1.5">{L('الاقتصاد الدائري', 'Circular economy')}</span>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-6 -z-10 rounded-[40%] bg-safa-oliveSoft/15 blur-3xl" aria-hidden />
              <div className="panel glow-card flex flex-col items-center justify-center gap-5 p-10 md:p-14">
                <BrandLogo className="h-24 md:h-32" />
                <p className="max-w-xs text-center text-[11px] leading-relaxed tracking-[0.16em] text-safa-earth">
                  {L('سعفة | منظومة النخيل الذكية', 'SA’FA | THE INTELLIGENT PALM ECOSYSTEM')}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {ACTORS.map((a, i) => (
                <Reveal as="article" key={a.en.title} delay={i * 110} className="panel glow-card flex gap-4 p-5">
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

        <div className="mt-16 border-t border-safa-line pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">{L('فلسفة العلامة', 'BRAND PHILOSOPHY')}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-safa-palm md:text-3xl">
                {L('سعفة.. اسم من النخلة نفسها', 'SA’FA: a name born from the palm itself')}
              </h3>
              <p className="mt-4 text-[14.5px] leading-relaxed text-safa-ink/70">
                {L(
                  'نقرأ الهوية كفلسفة علامة، لا كتفسير رسمي لمكونات الشعار: سعفة النخلة هي الوحدة الأولى في الشجرة، وهي التي تلتقي بالشمس وتبدأ منها الحياة. منها جاء الاسم، وبه نصل بين ما ورثناه وما نبنيه.',
                  'We read the identity as a brand philosophy rather than an official explanation of the mark’s elements: the palm frond is the tree’s first unit, the part that meets the sun and from which life begins. That is where the name comes from, and through it we connect what we inherited with what we are building.'
                )}
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-safa-ink/70">
                {L(
                  'من هذا المعنى تتصل العلامة بالإرث الزراعي للأحساء، وبالاستدامة التي لا تبدأ من الصفر بل من إعادة تدوير ما أنتجته الأرض، وبالابتكار الذي يترجم هذا الإرث إلى منظومة عمل قابلة للقياس.',
                  'From that reading the identity connects to Al-Ahsa’s agricultural heritage, to a sustainability that begins not from zero but from recycling what the land produced, and to innovation that turns that heritage into a measurable operating ecosystem.'
                )}
              </p>
              <blockquote className="mt-6 border-s-2 border-safa-gold ps-5">
                <p className="font-display text-lg leading-relaxed text-safa-palm md:text-xl">
                  {L('من إرث الأحساء، نبني منظومة زراعية مستدامة.', 'From Al-Ahsa’s Heritage, We Build a Sustainable Agricultural Ecosystem.')}
                </p>
              </blockquote>
              <p className="mt-3 text-[11px] leading-relaxed text-safa-earth">
                {L(
                  'تُستخدم هوية سعفة الأصلية كما هي دون إعادة تصميم أو تلوين، ولا تُفسَّر عناصرها إلا في حدود ما أُعلن رسميًا.',
                  'SA’FA’s original identity is used unchanged, never redesigned or recoloured, and its elements are not interpreted beyond what has been officially confirmed.'
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal key={p.en.title} delay={i * 90} className="panel glow-card group p-5">
                  <p.icon className="h-5 w-5 text-safa-gold transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <h4 className="mt-3 text-sm font-semibold text-safa-palm">{isAr ? p.ar.title : p.en.title}</h4>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-safa-ink/65">{isAr ? p.ar.body : p.en.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}