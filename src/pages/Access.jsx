import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, Factory, Globe, Leaf, LogIn, Sprout, UserRound } from 'lucide-react';
import { ASSETS } from '@/lib/assets';
import { useLang } from '@/lib/i18n';
import { ROLES, setRole } from '@/lib/session';
import { ROLE } from '@/lib/format';

const CARDS = [
  {
    role: 'farmer',
    icon: Sprout,
    ar: { title: 'مزارع', body: 'إدارة نخيلك ومخلفاتك' },
    en: { title: 'Farmer', body: 'Manage your palms and waste' },
  },
  {
    role: 'facility',
    icon: Factory,
    ar: { title: 'منشأة تدوير', body: 'إدارة المخلفات وطلبات الاستلام' },
    en: { title: 'Recycling facility', body: 'Manage waste and pickup requests' },
  },
  {
    role: 'authority',
    icon: Building2,
    ar: { title: 'جهة مختصة', body: 'مراقبة المشهد الزراعي والبيئي' },
    en: { title: 'Authority', body: 'Monitor the agricultural and environmental landscape' },
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
            <img src={ASSETS.logo} alt="SA’FA" className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/20" />
            <span className="text-start">
              <span className="block font-display text-lg font-semibold text-safa-cream">SA’FA</span>
              <span className="block text-[10px] tracking-[0.3em] text-safa-sand">سعفة</span>
            </span>
          </button>
          <button onClick={toggle} className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-safa-cream/90 transition hover:bg-white/10">
            <Globe className="h-3.5 w-3.5" />
            {isAr ? 'EN' : 'ع'}
          </button>
        </div>

        <div className="mt-14 max-w-2xl">
          <p className="eyebrow text-safa-gold">{L('الدخول إلى المنصة', 'PLATFORM ACCESS')}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-safa-cream md:text-5xl">{L('مرحبًا بك في سعفة', 'Welcome to SA’FA')}</h1>
          <p className="mt-4 text-sm leading-relaxed text-safa-cream/70 md:text-base">
            {L('اختر طريقة الدخول لاستكشاف المنصة', 'Choose how you enter to explore the platform')}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => enter('visitor', '/dashboard')}
            className="group rounded-3xl border border-white/12 bg-white/5 p-6 text-start backdrop-blur-sm transition hover:-translate-y-1 hover:border-safa-gold/40 hover:bg-white/10"
          >
            <UserRound className="h-5 w-5 text-safa-gold" />
            <p className="mt-5 text-base font-semibold text-safa-cream">{L(ROLE.visitor.ar, ROLE.visitor.en)}</p>
            <p className="mt-1 text-xs leading-relaxed text-safa-cream/60">{L('استكشف سعفة', 'Explore SA’FA')}</p>
            <p className="mt-4 text-[11px] leading-relaxed text-safa-cream/45">{L('بيئة عرض محدودة للتعرف على المنصة.', 'A controlled demo environment to explore the platform.')}</p>
          </button>

          {CARDS.map((c) => (
            <button
              key={c.role}
              onClick={() => enter(c.role, c.role === 'facility' ? '/facility' : c.role === 'authority' ? '/authority' : '/dashboard')}
              className="group rounded-3xl border border-white/12 bg-white/5 p-6 text-start backdrop-blur-sm transition hover:-translate-y-1 hover:border-safa-gold/40 hover:bg-white/10"
            >
              <c.icon className="h-5 w-5 text-safa-gold" />
              <p className="mt-5 text-base font-semibold text-safa-cream">{L(c.ar.title, c.en.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-safa-cream/60">{L(c.ar.body, c.en.body)}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => enter('visitor', '/dashboard')}
            className="inline-flex items-center gap-2 rounded-full bg-safa-cream px-6 py-3.5 text-sm font-semibold text-safa-palm transition hover:bg-white"
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
              'في نسخة الهاكاثون، الوصول التجريبي متاح دون تسجيل حقيقي. الزائر يستعرض البيانات ولا يعدّل السجلات.',
              'In the hackathon build, demo access is available without real authentication. Visitors explore the data without editing records.'
            )}
          </p>
          <p className="mt-2 text-[10px] text-safa-cream/30">{ROLES.join(' · ')}</p>
        </div>
      </div>
    </div>
  );
}