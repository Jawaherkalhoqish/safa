export const POST_CATEGORY = {
  knowledge: { ar: 'معرفة وخبرة', en: 'Knowledge & experience', tone: 'palm' },
  need: { ar: 'احتياج زراعي', en: 'Agricultural need', tone: 'amber' },
  service: { ar: 'خدمة متاحة', en: 'Service offered', tone: 'sand' },
  opportunity: { ar: 'فرصة عمل', en: 'Opportunity', tone: 'green' },
  partnership: { ar: 'شراكة B2B', en: 'B2B partnership', tone: 'palm' },
};

export const AUTHOR_ROLE = {
  farmer: { ar: 'مزارع', en: 'Farmer' },
  facility: { ar: 'منشأة تدوير', en: 'Recycling facility' },
  company: { ar: 'شركة زراعية', en: 'Agricultural company' },
  investor: { ar: 'مستثمر', en: 'Investor' },
  specialist: { ar: 'مختص زراعي', en: 'Agricultural specialist' },
};

export const POST_STATUS = {
  open: { ar: 'مفتوح', en: 'Open', tone: 'green' },
  in_discussion: { ar: 'قيد النقاش', en: 'In discussion', tone: 'amber' },
  closed: { ar: 'مغلق', en: 'Closed', tone: 'neutral' },
};

export const LAND_OWNERSHIP = {
  sale: { ar: 'للبيع', en: 'For sale', tone: 'green' },
  lease: { ar: 'للإيجار', en: 'For lease', tone: 'palm' },
  investment: { ar: 'فرصة استثمارية', en: 'Investment', tone: 'sand' },
};

export const LAND_STATUS = {
  available: { ar: 'متاحة', en: 'Available', tone: 'green' },
  reserved: { ar: 'محجوزة', en: 'Reserved', tone: 'amber' },
  under_negotiation: { ar: 'تحت التفاوض', en: 'Under negotiation', tone: 'amber' },
  leased: { ar: 'مؤجرة', en: 'Leased', tone: 'neutral' },
};

export const PRICE_UNIT = {
  total: { ar: 'الإجمالي', en: 'total' },
  per_ha: { ar: 'للهكتار', en: 'per hectare' },
  per_year: { ar: 'سنويًا', en: 'per year' },
};

export const LISTING_OWNER_TYPE = {
  farmer: { ar: 'مالك مزرعة', en: 'Farm owner' },
  company: { ar: 'شركة زراعية', en: 'Agricultural company' },
  investor: { ar: 'مستثمر', en: 'Investor' },
};

export const REGIONS = [
  { value: 'ahsa', ar: 'الأحساء', en: 'Al-Ahsa' },
  { value: 'qassim', ar: 'القصيم', en: 'Qassim' },
  { value: 'riyadh', ar: 'الرياض', en: 'Riyadh' },
  { value: 'madinah', ar: 'المدينة المنورة', en: 'Al-Madinah' },
  { value: 'eastern', ar: 'المنطقة الشرقية', en: 'Eastern Province' },
];

export const regionLabel = (value, isAr) => {
  const found = REGIONS.find((r) => r.value === value);
  if (found) return isAr ? found.ar : found.en;
  return value || (isAr ? 'غير محدد' : 'Not specified');
};