import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Reveal from '@/components/motion/Reveal';

const GROUPS = [
  {
    key: 'farmer',
    ar: 'خطط المزارعين',
    en: 'Farmer plans',
    noteAr: 'للمزارع الفردي وإدارة النخيل والمخلفات.',
    noteEn: 'For individual farmers managing palms and waste.',
    plans: [
      {
        name: 'Farmer Basic',
        ar: 'مزارع أساسي',
        price: 299,
        arBody: 'بداية منظمة لمراقبة النخيل وتسجيل المخلفات.',
        enBody: 'An organized start for palm monitoring and waste records.',
        features: [
          { ar: 'حتى 500 نخلة', en: 'Up to 500 palms' },
          { ar: 'لوحة صحة النخيل', en: 'Palm health dashboard' },
          { ar: 'تنبيهات أساسية', en: 'Essential alerts' },
          { ar: 'سجل المخلفات', en: 'Waste register' },
        ],
      },
      {
        name: 'Farmer Smart',
        ar: 'مزارع ذكي',
        price: 599,
        featured: true,
        arBody: 'الإنذار المبكر والتنبؤ وتحليل الصور للنخيل.',
        enBody: 'Early warning, prediction and palm image analysis.',
        features: [
          { ar: 'حتى 2,500 نخلة', en: 'Up to 2,500 palms' },
          { ar: 'إنذار مبكر وخطر السوسة', en: 'Early warning & RPW risk' },
          { ar: 'تحليل صور النخيل', en: 'Palm image analysis' },
          { ar: 'التنبؤ بالمخلفات وطلبات الجمع', en: 'Waste prediction & collection requests' },
        ],
      },
      {
        name: 'Farmer Enterprise',
        ar: 'مزارع مؤسسي',
        price: 899,
        arBody: 'لإدارة عدة مزارع وفرق وتقارير متقدمة.',
        enBody: 'For multiple farms, teams and advanced reporting.',
        features: [
          { ar: 'نخيل غير محدود', en: 'Unlimited palms' },
          { ar: 'تحليلات وتقارير متقدمة', en: 'Advanced analytics & reports' },
          { ar: 'إدارة عدة مزارع وفرق', en: 'Multiple farms & team roles' },
          { ar: 'أولوية دعم وواجهات تكامل', en: 'Priority support & integrations' },
        ],
      },
    ],
  },
  {
    key: 'recycling',
    ar: 'خطط إعادة التدوير والأعمال',
    en: 'Recycling & business plans',
    noteAr: 'لمنشآت التدوير والشركات الزراعية وإدارة سلاسل المخلفات.',
    noteEn: 'For recycling facilities, agricultural companies and waste chains.',
    plans: [
      {
        name: 'Recycling Basic',
        ar: 'تدوير أساسي',
        price: 1499,
        arBody: 'استلام الطلبات وتتبع المخلفات داخل المنشأة.',
        enBody: 'Receive requests and track waste inside the facility.',
        features: [
          { ar: 'حتى 1,000 طن شهريًا', en: 'Up to 1,000 tons / month' },
          { ar: 'استلام طلبات الجمع', en: 'Collection request intake' },
          { ar: 'تتبع المخلفات', en: 'Waste tracking' },
          { ar: 'تقارير أساسية', en: 'Essential reports' },
        ],
      },
      {
        name: 'Recycling Business',
        ar: 'تدوير للأعمال',
        price: 2499,
        featured: true,
        arBody: 'تشغيل متقدم وجدولة وسوق للمنتجات الدائرة.',
        enBody: 'Advanced operations, scheduling and a circular marketplace.',
        features: [
          { ar: 'حتى 5,000 طن شهريًا', en: 'Up to 5,000 tons / month' },
          { ar: 'جدولة جمع متقدمة', en: 'Advanced collection scheduling' },
          { ar: 'سوق المنتجات الدائرة', en: 'Circular marketplace' },
          { ar: 'تحليلات تشغيلية ومستخدمون متعددون', en: 'Operational analytics & multi-user' },
        ],
      },
      {
        name: 'Recycling Enterprise',
        ar: 'تدوير للمؤسسات',
        price: 3999,
        arBody: 'سعات مخصصة وتكامل وتقارير امتثال متعددة المواقع.',
        enBody: 'Custom capacity, integrations and multi-site compliance reporting.',
        features: [
          { ar: 'سعة مخصصة', en: 'Custom capacity' },
          { ar: 'تكامل وواجهات API', en: 'Integrations & API access' },
          { ar: 'لوحات متعددة المواقع', en: 'Multi-site dashboards' },
          { ar: 'مدير حساب وتقارير امتثال', en: 'Account manager & compliance reports' },
        ],
      },
    ],
  },
];

export default function PricingSection() {
  const { L, isAr } = useLang();
  const [selected, setSelected] = useState(null);

  return (
    <section id="subscriptions" className="scroll-mt-24 bg-safa-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{L('الاشتراكات', 'SUBSCRIPTIONS')}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-safa-palm md:text-5xl">
            {L('اشتراك واحد.. لمنظومة كاملة', 'One subscription, the whole ecosystem')}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-safa-ink/70">
            {L(
              'جميع الخطط تمنح الوصول إلى منظومة سعفة المتكاملة. تختلف الخطط في السعة وحدود الاستخدام والقدرات المتقدمة، ولا تُحتسب رسوم منفصلة لكل ميزة.',
              'All plans give access to the integrated SA’FA ecosystem. Plans differ in capacity, usage limits and advanced capabilities, with no separate fee per individual feature.'
            )}
          </p>
          <p className="mt-2 text-[12px] text-safa-earth">
            {L('الأسعار شهرية بالريال السعودي، غير شاملة ضريبة القيمة المضافة.', 'Prices are monthly in SAR, excluding VAT.')}
          </p>
        </div>

        {GROUPS.map((group) => (
          <div key={group.key} className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-safa-line pb-4">
              <h3 className="font-display text-xl font-semibold text-safa-palm md:text-2xl">{isAr ? group.ar : group.en}</h3>
              <p className="text-[12px] text-safa-ink/55">{isAr ? group.noteAr : group.noteEn}</p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {group.plans.map((p, i) => (
                <Reveal
                  as="article"
                  key={p.name}
                  delay={i * 90}
                  className={cn(
                    'panel glow-card relative flex flex-col p-6',
                    p.featured && 'border-safa-gold/60 ring-glow'
                  )}
                >
                  {p.featured ? (
                    <span className="absolute end-5 top-5 inline-flex items-center gap-1 rounded-full bg-safa-gold/15 px-2.5 py-1 text-[10px] font-semibold text-safa-warnFg">
                      <Sparkles className="h-3 w-3" />
                      {L('الأكثر اختيارًا', 'Most chosen')}
                    </span>
                  ) : null}
                  <h4 className="text-sm font-semibold tracking-wide text-safa-forest">{isAr ? p.ar : p.name}</h4>
                  <p className="mt-4 flex items-end gap-1.5">
                    <span className="display-num text-4xl text-safa-palm">{p.price.toLocaleString('en-US')}</span>
                    <span className="pb-1.5 text-xs text-safa-ink/55">{L('ريال / شهر', 'SAR / month')}</span>
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-safa-ink/65">{isAr ? p.arBody : p.enBody}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f.en} className="flex gap-2 text-[13px] text-safa-ink/70">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safa-oliveSoft" />
                        {isAr ? f.ar : f.en}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setSelected(p)}
                    variant={p.featured ? 'default' : 'outline'}
                    className={cn(
                      'mt-6 w-full rounded-full',
                      p.featured ? 'bg-safa-palm text-safa-bone hover:bg-safa-palmMid' : 'border-safa-line text-safa-palm hover:bg-safa-mist'
                    )}
                  >
                    {L('اشترك تجريبيًا', 'Start demo subscription')}
                  </Button>
                </Reveal>
              ))}
            </div>

          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selected ? `${isAr ? selected.ar : selected.name} · ${selected.price.toLocaleString('en-US')} ${L('ريال / شهر', 'SAR / month')}` : ''}
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed">
              {L(
                'هذه النسخة تجريبية. لن تتم أي عملية دفع، وتمثل هذه الخطوة شكل الاشتراك في المنظومة فقط.',
                'This is a prototype. No payment is processed; this step only shows how subscribing to the ecosystem will work.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)} className="rounded-full">
              {L('إغلاق', 'Close')}
            </Button>
            <Button onClick={() => setSelected(null)} className="rounded-full bg-safa-palm text-safa-bone hover:bg-safa-palmMid">
              {L('تفعيل الدخول التجريبي', 'Enter the demo')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}