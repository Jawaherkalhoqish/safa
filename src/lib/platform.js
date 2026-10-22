import {
  Radio,
  LineChart,
  BellRing,
  ShieldAlert,
  CalendarClock,
  Truck,
  Recycle,
  Cpu,
  Database,
  Waves,
  Brain,
  Gauge,
  Route,
  Sprout,
  Factory,
  Package,
} from 'lucide-react';

export const STAGES = [
  {
    n: '01',
    icon: Radio,
    ar: { title: 'الاستشعار', body: 'جمع إشارات متعددة من النخلة وبيئتها المحيطة.' },
    en: { title: 'Sensing', body: 'Collect multimodal signals from the palm and its environment.' },
  },
  {
    n: '02',
    icon: LineChart,
    ar: { title: 'تحليل البيانات', body: 'دمج بيانات الاستشعار والتربة والبيئة والري.' },
    en: { title: 'Data analysis', body: 'Combine sensor, soil, environmental and irrigation information.' },
  },
  {
    n: '03',
    icon: BellRing,
    ar: { title: 'الإنذار المبكر', body: 'رصد الأنماط غير الطبيعية مبكرًا.' },
    en: { title: 'Early warning', body: 'Identify abnormal patterns early.' },
  },
  {
    n: '04',
    icon: ShieldAlert,
    ar: { title: 'تقييم خطر السوسة', body: 'توليد مؤشر لخطر سوسة النخيل الحمراء.' },
    en: { title: 'Red palm weevil risk', body: 'Generate a Red Palm Weevil risk indicator.' },
  },
  {
    n: '05',
    icon: CalendarClock,
    ar: { title: 'التنبؤ بالمخلفات', body: 'تقدير الكمية المحتملة والتوقيت والموقع.' },
    en: { title: 'Waste prediction', body: 'Estimate potential quantity, timing and location.' },
  },
  {
    n: '06',
    icon: Truck,
    ar: { title: 'الجمع الذكي', body: 'تخطيط الجمع حسب الكمية والموقع والتصنيف.' },
    en: { title: 'Smart collection', body: 'Plan collection by quantity, location and classification.' },
  },
  {
    n: '07',
    icon: Recycle,
    ar: { title: 'التدوير والاستفادة', body: 'توجيه المادة إلى مسار دائري مناسب.' },
    en: { title: 'Circular recovery', body: 'Route material toward an appropriate circular pathway.' },
  },
];

export const LIFECYCLE = [
  { ar: 'النخلة', en: 'Palm', icon: Sprout },
  { ar: 'الاستشعار', en: 'Sensing', icon: Radio },
  { ar: 'البيانات', en: 'Data', icon: Database },
  { ar: 'الإنذار المبكر', en: 'Early warning', icon: BellRing },
  { ar: 'خطر السوسة', en: 'RPW risk', icon: ShieldAlert },
  { ar: 'التنبؤ بالمخلفات', en: 'Waste prediction', icon: CalendarClock },
  { ar: 'تصنيف المخلفات', en: 'Classification', icon: Gauge },
  { ar: 'الجمع الذكي', en: 'Smart collection', icon: Truck },
  { ar: 'المعالجة', en: 'Processing', icon: Factory },
  { ar: 'منتج دائري', en: 'Circular product', icon: Package },
];

export const ARCHITECTURE = [
  { ar: 'المستشعرات', en: 'Sensors', icon: Radio },
  { ar: 'جمع البيانات', en: 'Data collection', icon: Database },
  { ar: 'دمج الإشارات متعددة المصادر', en: 'Multimodal data fusion', icon: Waves },
  { ar: 'التحليل بالذكاء الاصطناعي', en: 'AI analysis', icon: Brain },
  { ar: 'مؤشرات المخاطر', en: 'Risk indicators', icon: Gauge },
  { ar: 'الإنذار المبكر', en: 'Early warning', icon: BellRing },
  { ar: 'دعم القرار', en: 'Decision support', icon: Route },
];

export const SENSOR_TYPES = [
  { ar: 'الإشارات الكهروفسيولوجية للنخلة', en: 'Palm electrophysiological signals', icon: Cpu },
  { ar: 'الإشارات الصوتية والاهتزازية', en: 'Acoustic and vibration signals', icon: Waves },
  { ar: 'قياسات التربة', en: 'Soil measurements', icon: Database },
  { ar: 'الظروف البيئية', en: 'Environmental conditions', icon: Gauge },
  { ar: 'معلومات الري', en: 'Irrigation information', icon: Sprout },
];

export const PATHWAYS = [
  {
    key: 'standard',
    tone: 'green',
    ar: { title: 'مسار تدوير قياسي', body: 'للمواد المناسبة للمسار القياسي بناءً على المعلومات المتاحة.' },
    en: { title: 'Standard recycling path', body: 'For material appropriate to the standard pathway based on available information.' },
  },
  {
    key: 'needs_verification',
    tone: 'amber',
    ar: { title: 'يتطلب تحقق', en: '', body: 'المادة تحتاج إلى تحقق قبل توجيهها.' },
    en: { title: 'Verification required', body: 'Material requires verification before routing.' },
  },
  {
    key: 'special',
    tone: 'red',
    ar: { title: 'مسار معالجة خاص', body: 'المادة تحتاج إلى مسار معالجة خاص ومناسب.' },
    en: { title: 'Special treatment pathway', body: 'Material requires an appropriate treatment pathway.' },
  },
];

export const CIRCULAR_PATHS = [
  { ar: 'سماد عضوي', en: 'Compost', icon: Sprout, from: 'fronds' },
  { ar: 'أعلاف', en: 'Animal feed', icon: Package, from: 'fronds' },
  { ar: 'منتجات ألياف النخيل', en: 'Palm fiber products', icon: Recycle, from: 'fiber' },
  { ar: 'مواد قابلة لإعادة الاستخدام', en: 'Reusable materials', icon: Factory, from: 'trunks' },
  { ar: 'منتجات حرفية', en: 'Artisan products', icon: Package, from: 'trunks' },
  { ar: 'تطبيقات زراعية', en: 'Agricultural applications', icon: Sprout, from: 'other' },
];

export const BEFORE_ITEMS = [
  { ar: 'تُكتشف مشكلات صحة النخيل متأخرًا.', en: 'Palm health problems are detected late.' },
  { ar: 'تتولد المخلفات دون وجهة واضحة.', en: 'Waste is generated without a clear destination.' },
  { ar: 'قد لا يعرف المزارع قيمتها المحتملة.', en: 'Farmers may not know its potential value.' },
  { ar: 'قد يكون الجمع منفصلًا عن واقع تولد المخلفات.', en: 'Collection can be disconnected from actual waste generation.' },
];

export const SAFA_ITEMS = [
  { ar: 'تتم مراقبة النخلة باستمرار.', en: 'The palm is monitored.' },
  { ar: 'تُحلَّل الإشارات وتحوَّل إلى مؤشرات.', en: 'Signals are analyzed into indicators.' },
  { ar: 'الأنماط غير الطبيعية تُنتج إنذارًا مبكرًا.', en: 'Abnormal patterns create early-warning indicators.' },
  { ar: 'يُعرض خطر السوسة المحتمل للفحص الميداني.', en: 'Potential Red Palm Weevil risk is surfaced for field inspection.' },
  { ar: 'يُتنبأ بالمخلفات المستقبلية وتُصنَّف.', en: 'Future waste is predicted and classified.' },
  { ar: 'يُخطَّط الجمع وتُوجَّه المادة.', en: 'Collection is planned and material is routed.' },
  { ar: 'تتحول المخلفات إلى مورد.', en: 'Waste becomes a resource.' },
];

export const AFTER_ITEMS = [
  { ar: 'صحة النخيل', en: 'Palm health' },
  { ar: 'قرارات أفضل', en: 'Better decisions' },
  { ar: 'إدارة مخلفات أفضل', en: 'Better waste management' },
  { ar: 'قيمة دائرية', en: 'Circular value' },
];

export const METHODOLOGY = [
  { ar: { title: 'الاستشعار متعدد المصادر', body: 'دمج عدة تدفقات بيانات في صورة واحدة عن حالة النخلة.' }, en: { title: 'Multimodal sensing', body: 'Combining multiple data streams into one view of palm condition.' } },
  { ar: { title: 'التحليل بالذكاء الاصطناعي', body: 'تحليل الأنماط عبر بيانات الاستشعار والبيئة.' }, en: { title: 'AI analysis', body: 'Analyzing patterns across sensor and environmental information.' } },
  { ar: { title: 'الإنذار المبكر', body: 'توليد مؤشرات لدعم القرار بدلًا من تشخيص نهائي.' }, en: { title: 'Early warning', body: 'Generating indicators rather than definitive diagnoses.' } },
  { ar: { title: 'تقييم المخاطر', body: 'دعم قرار الفحص الميداني لسوسة النخيل الحمراء.' }, en: { title: 'Risk assessment', body: 'Supporting Red Palm Weevil field inspection decisions.' } },
  { ar: { title: 'التنبؤ بالمخلفات', body: 'تقدير التولد المحتمل للمخلفات وكميتها وتوقيتها.' }, en: { title: 'Waste prediction', body: 'Estimating potential waste generation, quantity and timing.' } },
  { ar: { title: 'التوجيه الدائري', body: 'ربط المخلفات بمسارات الجمع والمعالجة والتدوير.' }, en: { title: 'Circular routing', body: 'Connecting waste with collection, treatment and recycling pathways.' } },
];