import { Leaf, ScrollText, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import BrandLogo from '@/components/BrandLogo';
import Reveal from '@/components/motion/Reveal';

const PILLARS = [
  {
    icon: ScrollText,
    ar: { title: 'الإرث', body: 'الأحساء موطن النخيل في المملكة، ومنها تستمد سعفة اسمَها وروحها قبل تقنيتها.' },
    en: { title: 'Heritage', body: 'Al-Ahsa is the home of the palm in the Kingdom, and SA’FA draws its name and spirit from there before its technology.' },
  },
  {
    icon: Leaf,
    ar: { title: 'الرمز', body: 'النخلة في الثقافة الزراعية السعودية كيان حياة كامل: جذر وسعف وثمر، لكل جزء قيمة لا تُهمل.' },
    en: { title: 'Symbol', body: 'In Saudi agricultural culture the palm is a complete living entity: root, frond and fruit, and every part carries value.' },
  },
  {
    icon: Sparkles,
    ar: { title: 'المستقبل', body: 'الفلسفة التي نعمل بها تجمع الإرث والابتكار: تقنية تُقرأ بها النخلة، وسوق تعيد قيمة ما كان يُهمل.' },
    en: { title: 'Future', body: 'Our working philosophy joins heritage with innovation: technology that reads the palm, and a market that restores value to what was discarded.' },
  },
];

export default function PhilosophySection() {
  const { L, isAr } = useLang();

  return (
    <section className="border-y border-safa-line bg-safa-mist/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative">
            <div className="absolute inset-6 -z-10 rounded-[40%] bg-safa-oliveSoft/15 blur-3xl" aria-hidden />
            <div className="panel glow-card flex items-center justify-center p-10 md:p-14">
              <BrandLogo className="h-24 md:h-32" />
            </div>
          </div>

          <div>
            <p className="eyebrow">{L('فلسفة العلامة', 'BRAND PHILOSOPHY')}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-safa-palm md:text-4xl">
              {L('سعفة.. اسم من النخلة نفسها', 'SA’FA: a name born from the palm itself')}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-safa-ink/70">
              {L(
                'نقرأ الهوية كفلسفة علامة، لا كتفسير رسمي لمكونات الشعار: سعفة النخلة هي الوحدة الأولى في الشجرة، وهي التي تلتقي بالشمس وتبدأ منها الحياة. منها جاء الاسم، وبه نصل بين ما ورثناه وما نبنيه.',
                'We read the identity as a brand philosophy rather than an official explanation of the mark’s elements: the palm frond is the tree’s first unit, the part that meets the sun and from which life begins. That is where the name comes from, and through it we connect what we inherited with what we are building.'
              )}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal key={p.en.title} delay={i * 90} className="panel glow-card group p-5">
                  <p.icon className="h-5 w-5 text-safa-gold transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <h3 className="mt-3 text-sm font-semibold text-safa-palm">{isAr ? p.ar.title : p.en.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-safa-ink/65">{isAr ? p.ar.body : p.en.body}</p>
                </Reveal>
              ))}
            </div>

            <blockquote className="mt-8 border-s-2 border-safa-gold ps-5">
              <p className="font-display text-lg leading-relaxed text-safa-palm md:text-xl">
                من إرث الأحساء، نبني منظومة زراعية مستدامة.
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-safa-ink/60">
                From Al-Ahsa’s Heritage, We Build a Sustainable Agricultural Ecosystem.
              </p>
            </blockquote>
            <p className="mt-4 text-[11px] text-safa-earth">
              {L('تُستخدم هوية سعفة الأصلية كما هي دون إعادة تصميم أو تلوين.', 'SA’FA’s original identity is used unchanged, never redesigned or recoloured.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}