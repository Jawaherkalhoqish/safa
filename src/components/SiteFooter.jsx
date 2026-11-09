import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import BrandLogo from '@/components/BrandLogo';

export default function SiteFooter() {
  const { L } = useLang();

  const groups = [
    {
      title: L('المنصة', 'Platform'),
      links: [
        { to: '/#how', label: L('كيف تعمل سعفة', 'How SA’FA works') },
        { to: '/methodology', label: L('منهجية سعفة', 'Methodology') },
        { to: '/access', label: L('دخول المنصة', 'Enter platform') },
      ],
    },
    {
      title: L('الأنظمة', 'Systems'),
      links: [
        { to: '/dashboard', label: L('صحة النخيل', 'Palm health') },
        { to: '/map', label: L('الخريطة الذكية', 'Smart map') },
        { to: '/store', label: L('متجر سعفة', 'SA’FA store') },
      ],
    },
    {
      title: L('المعلومات', 'Information'),
      links: [
        { to: '/methodology', label: L('عن سعفة', 'About SA’FA') },
        { to: '/privacy', label: L('الخصوصية', 'Privacy') },
        { to: '/terms', label: L('الشروط', 'Terms') },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-safa-palmDeep pb-24 pt-16 text-safa-cream md:pb-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo tone="onDark" className="h-10" />
              <div>
                <p className="font-display text-base font-semibold tracking-[0.16em]">SA’FA</p>
                <p className="text-[11px] tracking-[0.2em] text-safa-sand">{L('من إرث الأحساء، نبني منظومة زراعية مستدامة.', 'FROM AL-AHSA’S HERITAGE, WE BUILD A SUSTAINABLE AGRICULTURAL ECOSYSTEM.')}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-xs leading-relaxed text-safa-cream/55">
              {L(
                'قراءات سعفة والمؤشرات الناتجة عنها في هذه النسخة تمثل نموذجًا أوليًا لدعم القرار والإنذار المبكر، ولا تُعد تشخيصًا ميدانيًا نهائيًا.',
                'SA’FA indicators in this prototype are intended for early-warning and decision support and do not constitute a definitive field diagnosis.'
              )}
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-safa-sand">{g.title}</p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-sm text-safa-cream/70 transition hover:text-safa-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="h-px w-10 bg-safa-sand/40" />
            <p className="max-w-2xl font-display text-base leading-relaxed text-safa-cream/90 md:text-lg">
              {L('«من واحة الأحساء، يمتد الأثر إلى العالم.»', '“From Al-Ahsa Oasis, Our Impact Reaches the World.”')}
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-3 text-[11px] text-safa-cream/45 sm:flex-row">
            <span>SA’FA 2026 ©</span>
            <span className="rounded-full border border-white/15 px-3 py-1">{L('نسخة تجريبية | بيئة عرض', 'Prototype | Demo Environment')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}