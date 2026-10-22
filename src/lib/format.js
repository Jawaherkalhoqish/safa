export const num = (v, d = 0) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(Number(v || 0));

export const money = (v, lang) =>
  lang === 'ar' ? `${num(v)} ر.س` : `SAR ${num(v)}`;

const MONTHS = {
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const dateStr = (v, lang = 'ar', withYear = false) => {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  const parts = [`${d.getDate()} ${MONTHS[lang][d.getMonth()]}`];
  if (withYear) parts.push(String(d.getFullYear()));
  return parts.join(' ');
};

export const timeStr = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const daysLeft = (v) => {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(0, Math.round((d.getTime() - Date.now()) / 86400000));
};

export const WASTE_TYPE = {
  fronds: { ar: 'سعف', en: 'Fronds', color: '#1E3A2F' },
  trunks: { ar: 'جذوع', en: 'Trunks', color: '#4B533E' },
  fiber: { ar: 'ليف', en: 'Fiber', color: '#C8A15A' },
  other: { ar: 'مخلفات أخرى', en: 'Other residues', color: '#D2B48C' },
};

export const WASTE_STATUS = {
  predicted: { ar: 'متوقع', en: 'Predicted', tone: 'sand', color: '#D2B48C' },
  ready: { ar: 'جاهز للجمع', en: 'Ready for collection', tone: 'amber', color: '#C8A15A' },
  scheduled: { ar: 'تم جدولة الجمع', en: 'Collection scheduled', tone: 'amber', color: '#B98A3C' },
  collected: { ar: 'تم الجمع', en: 'Collected', tone: 'palm', color: '#4B533E' },
  processing: { ar: 'قيد المعالجة', en: 'In processing', tone: 'palm', color: '#2C4A3B' },
  recycled: { ar: 'تم التدوير', en: 'Recycled', tone: 'green', color: '#2F5D3F' },
  routed: { ar: 'تم التوجيه', en: 'Routed', tone: 'green', color: '#4A7C59' },
  needs_verification: { ar: 'يحتاج تحقق', en: 'Needs verification', tone: 'amber', color: '#C8A15A' },
  special_pathway: { ar: 'مسار معالجة خاص', en: 'Special pathway', tone: 'red', color: '#8B2F24' },
  burning_risk: { ar: 'معرض للحرق / التخلص غير المناسب', en: 'Burning / improper disposal risk', tone: 'red', color: '#B03A2E' },
};

export const RISK_CLASS = {
  standard: { ar: 'مسار تدوير قياسي', en: 'Standard recycling path', tone: 'green' },
  needs_verification: { ar: 'يتطلب تحقق', en: 'Verification required', tone: 'amber' },
  special: { ar: 'مسار معالجة خاص', en: 'Special treatment pathway', tone: 'red' },
};

export const INSPECTION_STATUS = {
  new: { ar: 'جديد', en: 'New', tone: 'amber' },
  under_review: { ar: 'قيد المراجعة', en: 'Under review', tone: 'amber' },
  scheduled: { ar: 'تم جدولة الفحص', en: 'Inspection scheduled', tone: 'palm' },
  inspected: { ar: 'تم الفحص', en: 'Inspected', tone: 'green' },
  follow_up: { ar: 'يتطلب متابعة', en: 'Follow-up required', tone: 'amber' },
  closed: { ar: 'مغلق', en: 'Closed', tone: 'neutral' },
};

export const COLLECTION_STATUS = {
  requested: { ar: 'تم إنشاء الطلب', en: 'Request created', tone: 'amber' },
  accepted: { ar: 'تم قبول الطلب', en: 'Request accepted', tone: 'amber' },
  scheduled: { ar: 'تم تحديد الموعد', en: 'Pickup scheduled', tone: 'palm' },
  in_transit: { ar: 'في الطريق', en: 'In transit', tone: 'palm' },
  received: { ar: 'تم الاستلام', en: 'Received', tone: 'green' },
  at_facility: { ar: 'تم الوصول للمنشأة', en: 'Arrived at facility', tone: 'green' },
  processing: { ar: 'قيد المعالجة', en: 'In processing', tone: 'palm' },
  recycled: { ar: 'تم التدوير', en: 'Recycled', tone: 'green' },
  rejected: { ar: 'مرفوض', en: 'Rejected', tone: 'red' },
};

export const SEVERITY = {
  low: { ar: 'منخفضة', en: 'Low', tone: 'green' },
  medium: { ar: 'متوسطة', en: 'Medium', tone: 'amber' },
  high: { ar: 'مرتفعة', en: 'High', tone: 'red' },
};

export const ALERT_STATUS = {
  new: { ar: 'جديد', en: 'New', tone: 'amber' },
  acknowledged: { ar: 'تم الاطلاع', en: 'Acknowledged', tone: 'neutral' },
  actioned: { ar: 'تم اتخاذ إجراء', en: 'Actioned', tone: 'green' },
  closed: { ar: 'مغلق', en: 'Closed', tone: 'neutral' },
};

export const PRODUCT_CATEGORY = {
  fiber: { ar: 'ألياف النخيل', en: 'Palm fiber' },
  agricultural: { ar: 'منتجات زراعية', en: 'Agricultural products' },
  compost: { ar: 'سماد', en: 'Compost' },
  crafts: { ar: 'منتجات حرفية', en: 'Artisan products' },
  reused: { ar: 'مواد معاد استخدامها', en: 'Reused materials' },
  sustainable: { ar: 'منتجات مستدامة', en: 'Sustainable products' },
};

export const ORDER_STATUS = {
  placed: { ar: 'تم الطلب', en: 'Placed', tone: 'amber' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed', tone: 'palm' },
  fulfilled: { ar: 'تم التسليم', en: 'Fulfilled', tone: 'green' },
  cancelled: { ar: 'ملغي', en: 'Cancelled', tone: 'red' },
};

export const ROLE = {
  visitor: { ar: 'زائر', en: 'Visitor' },
  farmer: { ar: 'مزارع', en: 'Farmer' },
  facility: { ar: 'منشأة تدوير', en: 'Recycling facility' },
  authority: { ar: 'جهة مختصة', en: 'Authority' },
  admin: { ar: 'مدير المنصة', en: 'Administrator' },
};

export const PRIORITY = {
  low: { ar: 'منخفضة', en: 'Low', tone: 'neutral' },
  medium: { ar: 'متوسطة', en: 'Medium', tone: 'amber' },
  high: { ar: 'عالية', en: 'High', tone: 'red' },
};

export const pick = (map, key, lang, fallback = '—') => {
  const entry = map[key];
  if (!entry) return fallback;
  return lang === 'ar' ? entry.ar : entry.en;
};

export const rpwLevel = (risk) => (risk >= 0.6 ? 'high' : risk >= 0.35 ? 'medium' : 'low');

export const RPW_LEVEL = {
  low: { ar: 'منخفض', en: 'Low', tone: 'green' },
  medium: { ar: 'متوسط', en: 'Medium', tone: 'amber' },
  high: { ar: 'مرتفع', en: 'High', tone: 'red' },
};

export const healthBand = (score) => (score >= 75 ? 'stable' : score >= 55 ? 'attention' : 'critical');

export const HEALTH_BAND = {
  stable: { ar: 'مستقرة', en: 'Stable', tone: 'green' },
  attention: { ar: 'تحت المتابعة', en: 'Under observation', tone: 'amber' },
  critical: { ar: 'تحتاج تدخلاً', en: 'Needs intervention', tone: 'red' },
};