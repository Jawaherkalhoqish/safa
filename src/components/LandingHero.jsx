import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, Radio, ShieldAlert, Recycle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useLang } from '@/lib/i18n';
import { ASSETS } from '@/lib/assets';

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
          <div className="animate-rise flex items-center gap-3">
            <img src={ASSETS.logo} alt="SA’FA" className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/25 md:h-16 md:w-16" />
            <div className="text-start">
              <p className="font-display text-2xl font-semibold text-safa-cream md:text-3xl">SA’FA</p>
              <p className="text-xs tracking-[0.35em] text-safa-sand">سعفة</p>
            </div>
          </div>

          <h1 className="animate-rise mt-8 font-display text-4xl font-semibold leading-[1.15] text-safa-cream md:text-6xl">
            {L('من نخل الأحساء.. لمستقبلها', 'From Al-Ahsa’s Palms… to Their Future')}
          </h1>
          <p className="mt-4 text-sm text-safa-sand md:text-base">
            {L('From Al-Ahsa’s Palms… to Their Future', 'من نخل الأحساء.. لمستقبلها')}
          </p>

          <p className="animate-rise mt-6 max-w-2xl text-base leading-relaxed text-safa-cream/85 md:text-lg">
            {L(
              'نستشعر حالة النخلة، نكتشف المؤشرات مبكرًا، ونتنبأ بمصير مخلفاتها.',
              'We sense the palm, identify early warning signals, and predict the future of its waste.'
            )}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-safa-cream/65">
            {L(
              'منصة ذكية لصحة النخيل، الإنذار المبكر، إدارة المخلفات والاقتصاد الدائري.',
              'An intelligent platform for palm health, early warning, waste management and the circular economy.'
            )}
          </p>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/access"
              className="group inline-flex items-center gap-2 rounded-full bg-safa-cream px-6 py-3.5 text-sm font-semibold text-safa-palm shadow-lg shadow-black/20 transition hover:bg-white"
            >
              {L('ابدأ مع سعفة', 'Explore SA’FA')}
              <Arrow className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-safa-cream transition hover:bg-white/10"
            >
              {L('كيف تعمل سعفة؟', 'How SA’FA Works')}
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