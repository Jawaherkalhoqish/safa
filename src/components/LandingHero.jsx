import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, Radio, ShieldAlert, Recycle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useLang } from '@/lib/i18n';
import { ASSETS } from '@/lib/assets';
import BrandLogo from '@/components/BrandLogo';

export default function LandingHero() {
  const { L, isAr } = useLang();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const chips = [
    { icon: Radio, ar: 'إشارات النخلة', en: 'Palm signals', value: '0.72' },
    { icon: ShieldAlert, ar: 'مؤشر خطر السوسة', en: 'RPW indicator', value: '0.25' },
    { icon: Recycle, ar: 'مخلفات موجهة للتدوير', en: 'Waste routed', value: '18 طن' },
  ];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-safa-palmDeep">
      <Image src={ASSETS.hero} alt={L('واحة نخيل الأحساء عند الشروق', 'Al-Ahsa palm oasis at sunrise')} fittingType="fill" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-safa-palmDeep via-safa-palmDeep/70 to-safa-palmDeep/30" />
      <div className="absolute inset-0 bg-gradient-to-e from-safa-palmDeep/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-32 md:px-8 md:pb-28 md:pt-40">
        <div className="max-w-3xl">
          <div className="animate-rise flex flex-wrap items-center gap-4">
            <BrandLogo tone="onDark" className="h-12 md:h-14" />
            <span className="font-display text-lg font-semibold tracking-[0.18em] text-safa-cream/80 md:text-xl">SA’FA</span>
          </div>

          <h1 className="animate-rise mt-8 max-w-2xl font-display text-3xl font-semibold leading-[1.25] text-safa-cream md:text-5xl md:leading-[1.2]">
            {L(
              'من إرث الأحساء، نبني منظومة زراعية مستدامة.',
              'From Al-Ahsa’s Heritage, We Build a Sustainable Agricultural Ecosystem.'
            )}
          </h1>
          <p className="mt-4 text-sm text-safa-sand md:text-base">
            {L(
              'From Al-Ahsa’s Heritage, We Build a Sustainable Agricultural Ecosystem.',
              'من إرث الأحساء، نبني منظومة زراعية مستدامة.'
            )}
          </p>

          <p className="animate-rise mt-6 max-w-2xl text-base leading-relaxed text-safa-cream/85 md:text-lg">
            {L(
              'منصة زراعية رقمية متكاملة تجمع المزارعين والمنشآت والمستثمرين في منظومة واحدة.',
              'An integrated agricultural digital ecosystem connecting farmers, companies, and investors.'
            )}
          </p>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/access"
              className="group inline-flex items-center gap-2 rounded-full bg-safa-bone px-6 py-3.5 text-sm font-semibold text-safa-palmDeep shadow-lg shadow-black/20 transition hover:bg-white"
            >
              {L('اكتشف سعفة', 'Discover SA’FA')}
              <Arrow className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-safa-cream transition hover:bg-white/10"
            >
              {L('استكشف خدماتنا', 'Explore Our Services')}
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {chips.map((c) => (
              <div key={c.en} className="glass animate-rise px-4 py-3">
                <c.icon className="h-4 w-4 text-safa-gold" />
                <p className="mt-2 text-[11px] text-safa-cream/70">{L(c.ar, c.en)}</p>
                <p className="font-display text-lg font-semibold text-safa-cream">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a href="#how" className="absolute bottom-6 start-1/2 -translate-x-1/2 text-safa-cream/60 transition hover:text-safa-cream rtl:translate-x-1/2" aria-label={L('تابع للأسفل', 'Scroll down')}>
        <ChevronDown className="h-6 w-6 animate-drift" />
      </a>
    </section>
  );
}