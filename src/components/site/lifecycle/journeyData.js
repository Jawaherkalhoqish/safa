import { LIFECYCLE } from '@/lib/platform';

/**
 * Compact descriptions for each lifecycle stage.
 * Titles, icons and order come from LIFECYCLE, so the journey content stays
 * exactly as it is on the platform page.
 */
const DETAIL = {
  Palm: {
    ar: 'نقطة البداية: نخلة مسجّلة بهوية وموقع، وسجلّها هو الأساس لكل قراءة لاحقة.',
    en: 'The starting point: a registered palm with an identity and location, whose record underpins every reading that follows.',
  },
  Sensing: {
    ar: 'تُلتقط إشارات كهروفسيولوجية وصوتية وتربة وبيئة وري من وحدة الاستشعار المثبّتة على النخلة.',
    en: 'Electrophysiological, acoustic, soil, environmental and irrigation signals are captured from the sensor unit installed on the palm.',
  },
  Data: {
    ar: 'تُدمج الإشارات متعددة المصادر في تدفّق واحد منظم قابل للتحليل والمقارنة الزمنية.',
    en: 'Signals from several sources are fused into one organized stream that can be analyzed and compared over time.',
  },
  'Early warning': {
    ar: 'تُرصد الأنماط غير الطبيعية مبكرًا وتُحوَّل إلى تنبيه واضح بدل انتظار ظهور الأثر.',
    en: 'Abnormal patterns are caught early and turned into a clear alert, instead of waiting for visible damage.',
  },
  'RPW risk': {
    ar: 'مؤشر احتمالي لسوسة النخيل الحمراء يدعم قرار الفحص الميداني بدلًا من التشخيص النهائي.',
    en: 'A probable Red Palm Weevil indicator that supports the field-inspection decision rather than a final diagnosis.',
  },
  'Waste prediction': {
    ar: 'تُقدَّر الكمية المحتملة وتوقيتها وموقعها قبل تولّد المخلفة فعليًا.',
    en: 'The expected quantity, timing and location of waste are estimated before it is actually generated.',
  },
  Classification: {
    ar: 'يُصنَّف كل مسار إلى قياسي أو يتطلب تحققًا أو معالجة خاصة، وهو ما يحدد طريقة التوجيه.',
    en: 'Each pathway is classified as standard, verification-required or special, which determines how it is routed.',
  },
  'Smart collection': {
    ar: 'يُخطَّط الجمع حسب الكمية والموقع والتصنيف، ثم تُجدول الرحلة إلى المنشأة.',
    en: 'Collection is planned by quantity, location and classification, then scheduled as a trip to the facility.',
  },
  Processing: {
    ar: 'تُعالَج المادة في منشأة التدوير وتُحوَّل إلى ألياف أو سماد أو مواد قابلة لإعادة الاستخدام.',
    en: 'Material is treated at the recycling facility and converted into fiber, compost or reusable material.',
  },
  'Circular product': {
    ar: 'يصل المنتج إلى متجر سعفة مرتبطًا بكمية المادة المصدر، فيُقاس الأثر ويُغلق المسار.',
    en: 'The product reaches the SA’FA store tied to the quantity of its source material, so impact is measured and the loop closes.',
  },
};

export const JOURNEY = LIFECYCLE.map((step, i) => ({
  key: step.en,
  n: String(i + 1).padStart(2, '0'),
  icon: step.icon,
  ar: step.ar,
  en: step.en,
  bodyAr: DETAIL[step.en]?.ar || '',
  bodyEn: DETAIL[step.en]?.en || '',
}));