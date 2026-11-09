import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Factory, Globe, Leaf, LogIn, Sprout, UserRound } from 'lucide-react';
import { ASSETS } from '@/lib/assets';
import BrandLogo from '@/components/BrandLogo';
import { useLang } from '@/lib/i18n';
import { ROLES, setRole } from '@/lib/session';

const CARDS = [
  {
    role: 'visitor',
    icon: UserRound,
    to: '/dashboard',
    ar: { title: 'زائر', body: 'استكشف سعفة وتعرّف على المنظومة الزراعية.' },
    en: { title: 'Visitor', body: 'Explore SA’FA and discover the agricultural ecosystem.' },
  },
  {
    role: 'farmer',
    icon: Sprout,
    to: '/dashboard',
    ar: { title: 'مزارع', body: 'إدارة المزارع والنخيل والمخلفات الزراعية.' },
    en: { title: 'Farmer', body: 'Manage farms, palm trees, and agricultural waste.' },
  },
  {
    role: 'facility',
    icon: Factory,
    to: '/facility',
    ar: { title: 'منشأة تدوير', body: 'إدارة المخلفات الزراعية وطلبات الجمع وعمليات التدوير.' },
    en: { title: 'Recycling Facility', body: 'Manage agricultural waste, collection requests, and recycling operations.' },
  },
];

export default function Access() {
  const { L, isAr, toggle } = useLang();
  const navigate = useNavigate();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const enter = (role, to) => {
    setRole(role);
    navigate(to);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-safa-palmDeep">
      <img src={ASSETS.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-safa-palmDeep via-safa-palmDeep/95 to-safa-palmDeep" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-10 md:px-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <BrandLogo tone="onDark" className="h-9" />
            <span className="font-display text-sm font-semibold tracking-[0.16em] text-safa-cream/85">SA’FA</span>
          </button>
          <button onClick={toggle} className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-safa-cream/90 transition hover:bg-white/10">
            <Globe className="h-3.5 w-3.5" />
            {isAr ? 'EN' : 'ع'}
          </button>
        </div>

        <div className="mt-14 max-w-2xl">
          <p className="eyebrow text-safa-gold">{L('اكتشف سعفة', 'DISCOVER SA’FA')}</p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-safa-cream md:text-5xl">{L('اكتشف سعفة من منظورك', 'Explore SA’FA from Your Perspective')}</h1>
          <p className="mt-4 text-sm leading-relaxed text-safa-cream/70 md:text-base">
            {L('اختر دورك للدخول كزائر واستكشاف المنظومة دون تسجيل', 'Pick your role, enter as a guest and explore the ecosystem without signing up')}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {CARDS.map((c) => (
            <button
              key={c.role}
              onClick={() => enter(c.role, c.to)}
              className="group flex h-full flex-col rounded-3xl border border-white/12 bg-white/5 p-6 text-start backdrop-blur-sm transition hover:-translate-y-1 hover:border-safa-gold/40 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-safa-gold transition group-hover:border-safa-gold/40">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-base font-semibold text-safa-cream">{L(c.ar.title, c.en.title)}</p>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-safa-cream/60">{L(c.ar.body, c.en.body)}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-safa-cream/45 transition group-hover:gap-2.5 group-hover:text-safa-gold">
                {L('الدخول كزائر', 'Enter as guest')}
                <Arrow className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => enter('visitor', '/dashboard')}
            className="inline-flex items-center gap-2 rounded-full bg-safa-bone px-6 py-3.5 text-sm font-semibold text-safa-palmDeep transition hover:bg-white"
          >
            {L('الدخول كزائر', 'Continue as visitor')}
            <Arrow className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm text-safa-cream transition hover:bg-white/10"
          >
            <LogIn className="h-4 w-4" />
            {L('تسجيل الدخول', 'Sign in')}
          </button>
        </div>

        <div className="mt-auto pt-12">
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-safa-cream/45">
            <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safa-gold" />
            {L(
              'الوصول التجريبي متاح دون بريد أو كلمة مرور أو دفع. الزائر يستعرض البيانات ولا يعدّل السجلات.',
              'Guest access needs no email, password or payment. Visitors explore the data without editing records.'
            )}
          </p>
          <p className="mt-2 text-[10px] text-safa-cream/30">{ROLES.join(' · ')}</p>
        </div>
      </div>
    </div>
  );
}