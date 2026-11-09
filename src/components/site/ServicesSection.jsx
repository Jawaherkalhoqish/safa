import {
  BellRing,
  CalendarClock,
  Factory,
  Recycle,
  ScanLine,
  ShieldAlert,
  Sprout,
  Store,
  Truck,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Reveal from '@/components/motion/Reveal';

const SERVICES = [
  {
    icon: ScanLine,
    ar: { title: 'تحليل صور النخيل', body: 'التقاط صورة للنخلة أو السعف وقراءة المؤشرات الظاهرة والخطوات المقترحة، وحفظها في سجل النخلة.' },
    en: { title: 'Palm image analysis', body: 'Capture a palm or frond image, read visible indicators and suggested steps, and keep it in the palm record.' },
  },
  {
    icon: Sprout,
    ar: { title: 'صحة النخيل والإنذار المبكر', body: 'قراءات مستشعرات متعددة المصادر وبيانات الري والتربة في لوحة واحدة، مع تنبيهات عند الأنماط غير الطبيعية.' },
    en: { title: 'Palm health & early warning', body: 'Multimodal sensor readings with irrigation and soil data in one dashboard, with alerts on abnormal patterns.' },
  },
  {
    icon: ShieldAlert,
    ar: { title: 'تقييم خطر سوسة النخيل الحمراء', body: 'مؤشر خطر مبني على الإشارات المتاحة يدعم قرار الفحص الميداني دون أن يستبدله.' },
    en: { title: 'Red palm weevil risk', body: 'A risk indicator built on available signals that supports, and never replaces, a field inspection decision.' },
  },
  {
    icon: CalendarClock,
    ar: { title: 'التنبؤ بالمخلفات', body: 'تقدير كمية المخلفات وتوقيتها وتصنيفها قبل تولدها لربطها بمسار المعالجة الأنسب.' },
    en: { title: 'Waste prediction', body: 'Estimating waste quantity, timing and classification before it forms, then matching it to the right pathway.' },
  },
  {
    icon: Truck,
    ar: { title: 'الجمع الذكي', body: 'ربط المزرعة بمنشأة التدوير، وجدولة الاستلام حسب الكمية والموقع والتصنيف.' },
    en: { title: 'Smart collection', body: 'Connecting farms with recycling facilities and scheduling pickup by quantity, location and classification.' },
  },
  {
    icon: Factory,
    ar: { title: 'منشآت التدوير والمعالجة', body: 'لوحة تشغيل للمنشأة: الطلبات الواردة، السعة المتاحة، المواد المعالجة، ومخرجات الدورة.' },
    en: { title: 'Recycling & processing', body: 'A facility operations view: incoming requests, available capacity, processed material and cycle output.' },
  },
  {
    icon: Store,
    ar: { title: 'سوق المنتجات الدائرة', body: 'عرض منتجات مستمدة من مخلفات النخيل وقابلة للتسوق، بمسار واضح من المادة المصدر إلى المنتج.' },
    en: { title: 'Circular marketplace', body: 'Palm-waste-derived products available to buyers, with a clear pathway from source material to product.' },
  },
  {
    icon: Recycle,
    ar: { title: 'الأثر ولوحات الجهات', body: 'قياس الأثر والمؤشرات على مستوى المنطقة لدعم الجهات المختصة والمستثمرين بقرارات موثقة.' },
    en: { title: 'Impact & authority views', body: 'Regional impact and indicators that support authorities and investors with documented decisions.' },
  },
  {
    icon: BellRing,
    ar: { title: 'الاستشارة الزراعية المساندة', body: 'مساعد معرفة زراعية منفصل عن تحليل الصور، يجيب عن أسئلة الإدارة والري والتوقيت.' },
    en: { title: 'Agricultural knowledge assistant', body: 'A knowledge assistant separate from image analysis, answering management, irrigation and timing questions.' },
  },
];

export default function ServicesSection() {
  const { L, isAr } = useLang();

  return (
    <section id="services" className="scroll-mt-24 border-y border-safa-line bg-safa-mist/70 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">{L('خدماتنا', 'OUR SERVICES')}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-safa-palm md:text-5xl">
            {L('خدمات متصلة، لا أدوات منفصلة', 'Connected services, not isolated tools')}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-safa-ink/70">
            {L(
              'كل خدمة في سعفة تغذي الأخرى: إشارة الصحة تصبح تنبيهًا، والتنبيه يصبح فحصًا، والتنبؤ يصبح طلب جمع، والمخلفة تصبح منتجًا.',
              'Every SA’FA service feeds the next: a health signal becomes an alert, an alert becomes an inspection, a prediction becomes a collection request, and waste becomes a product.'
            )}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal
              as="article"
              key={s.en.title}
              delay={(i % 3) * 80}
              className="panel glow-card group p-6"
            >
              <span className="card-icon flex h-11 w-11 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-safa-palm">{isAr ? s.ar.title : s.en.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-safa-ink/65">{isAr ? s.ar.body : s.en.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}