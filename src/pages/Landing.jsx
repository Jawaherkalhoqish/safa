import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BellRing, Leaf, Recycle, ShieldAlert } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LandingHero from '@/components/LandingHero';
import HowItWorks from '@/components/HowItWorks';
import PlatformFlow from '@/components/PlatformFlow';
import LandingStory from '@/components/LandingStory';
import AboutSection from '@/components/site/AboutSection';
import EcosystemJourney from '@/components/site/EcosystemJourney';
import ServicesSection from '@/components/site/ServicesSection';
import PricingSection from '@/components/site/PricingSection';
import PhilosophySection from '@/components/site/PhilosophySection';
import ContactSection from '@/components/site/ContactSection';
import { useLang } from '@/lib/i18n';

const STATS = [
  { ar: 'نخلة تحت المراقبة', en: 'Monitored palms', value: '1,240', icon: Leaf },
  { ar: 'إنذار مبكر هذا الأسبوع', en: 'Early warnings this week', value: '86', icon: BellRing },
  { ar: 'مؤشرات خطر سوسة مرتفعة', en: 'Elevated RPW indicators', value: '14', icon: ShieldAlert },
  { ar: 'مخلفات موجهة للتدوير', en: 'Waste routed to recycling', value: '3.2K', icon: Recycle },
];

export default function Landing() {
  const { L, isAr } = useLang();
  const { hash } = useLocation();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const id = hash.replace('#', '');
    if (!id) return undefined;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <div className="min-h-screen bg-safa-cream">
      <SiteHeader />
      <LandingHero />

      <section className="border-b border-safa-line bg-white py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 md:grid-cols-4 md:px-8">
          {STATS.map((s) => (
            <div key={s.en} className="text-start">
              <s.icon className="h-5 w-5 text-safa-gold" />
              <p className="display-num mt-3 text-3xl text-safa-palm md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-safa-ink/60">{L(s.ar, s.en)}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-7xl px-5 text-[11px] text-safa-ink/40 md:px-8">
          {L('بيانات تجريبية | Demo Data', 'Demo Data')}
        </p>
      </section>

      <AboutSection />
      <HowItWorks />
      <EcosystemJourney />
      <PlatformFlow />
      <ServicesSection />
      <PricingSection />
      <PhilosophySection />
      <LandingStory />
      <ContactSection />

      <section className="bg-safa-cream py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <p className="eyebrow">{L('ابدأ الآن', 'GET STARTED')}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-safa-palm md:text-4xl">
            {L('اختر طريقتك لاستكشاف سعفة', 'Choose how you explore SA’FA')}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-safa-ink/65">
            {L(
              'الموقع العام يشرح المنظومة والخدمات والاشتراكات. أما المنصة التفاعلية فتفتح لك تجربة كاملة لكل دور دون تسجيل.',
              'The public site explains the ecosystem, services and subscriptions. The interactive platform opens a complete experience per role, with no sign-up.'
            )}
          </p>
          <Link
            to="/access"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-safa-palm px-7 py-3.5 text-sm font-semibold text-safa-bone transition hover:bg-safa-palmMid"
          >
            {L('اكتشف سعفة', 'Explore SA’FA')}
            <Arrow className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[11px] text-safa-ink/45">
            {L('وضع تجريبي — لا يتطلب تسجيلًا حقيقيًا', 'Demo mode — no real account required')}
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}