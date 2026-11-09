import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const DEMO = {
  source: 'demo',
  health_score: 74,
  risk_level: 'medium',
  summary_ar:
    'تحليل تجريبي (بيانات عرض): تظهر الصورة مظهرًا عامًا مستقرًا مع مؤشرات تستدعي المتابعة. هذه النتيجة محاكاة وليست تحليلًا فعليًا للصورة.',
  summary_en:
    'Demo analysis (sample data): the image shows a generally stable appearance with indicators worth following up. This result is simulated and is not a real analysis of the image.',
  indicators: [
    { ar: 'لون السعف العام مائل للأخضر الداكن', en: 'Overall frond colour leans dark green' },
    { ar: 'وجود جفاف طرفي محدود على بعض السعف', en: 'Limited marginal drying on some fronds' },
    { ar: 'لا تظهر علامات نخر واضحة في الصورة', en: 'No clear necrosis visible in the image' },
  ],
  concerns: [
    { ar: 'احتمال إجهاد مائي محدود يحتاج تأكيدًا ميدانيًا', en: 'Possible mild water stress that needs field confirmation' },
  ],
  next_steps: [
    { ar: 'فحص الري في موقع النخلة ومقارنة القراءات', en: 'Check irrigation at the palm and compare readings' },
    { ar: 'إعادة تصوير السعف بعد ٧ أيام للمقارنة', en: 'Re-capture the fronds in 7 days for comparison' },
    { ar: 'طلب فحص ميداني عند استمرار المؤشرات', en: 'Request a field inspection if indicators persist' },
  ],
  model_note: 'Demo data — no vision model was used for this result.',
};

const SCHEMA = {
  type: 'object',
  properties: {
    health_score: { type: 'number' },
    risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
    summary_ar: { type: 'string' },
    summary_en: { type: 'string' },
    indicators_ar: { type: 'array', items: { type: 'string' } },
    indicators_en: { type: 'array', items: { type: 'string' } },
    concerns_ar: { type: 'array', items: { type: 'string' } },
    concerns_en: { type: 'array', items: { type: 'string' } },
    next_steps_ar: { type: 'array', items: { type: 'string' } },
    next_steps_en: { type: 'array', items: { type: 'string' } },
  },
  required: ['health_score', 'risk_level', 'summary_ar', 'summary_en', 'indicators_ar', 'indicators_en'],
};

const toPairs = (ar = [], en = []) => {
  const n = Math.max(ar.length, en.length);
  return Array.from({ length: n }, (_, i) => ({ ar: String(ar[i] || en[i] || ''), en: String(en[i] || ar[i] || '') })).filter((x) => x.ar);
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const fileUri = typeof body.file_uri === 'string' ? body.file_uri : '';
    if (!fileUri) return Response.json({ error: 'file_uri is required' }, { status: 400 });

    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));

    // Guests in the demo cannot trigger a paid vision call: they get the clearly labelled demo result.
    if (!user) return Response.json(DEMO);

    try {
      const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 600 });
      const prompt = `You are an agricultural vision assistant for date palms in Al-Ahsa, Saudi Arabia.
Analyse the attached photo of a palm tree or palm frond and report only what is visually observable.
Rules:
- Do not give a definitive diagnosis and do not name pesticides or doses.
- Be concise: 3-5 visible indicators, 0-3 possible health concerns, 2-4 suggested next steps.
- health_score is 0-100 visual condition; risk_level is low, medium or high for follow-up urgency.
- Write every text field in both Arabic and English (Arabic first-class, natural Arabic, no Latin inside the Arabic strings).
- If the image does not clearly show a palm, say so in the summaries and keep the score moderate.`;

      const answer = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [signed.signed_url],
        response_json_schema: SCHEMA,
      });

      const data = typeof answer === 'string' ? JSON.parse(answer) : answer;
      const score = Math.max(0, Math.min(100, Math.round(Number(data?.health_score) || 0)));
      const risk = ['low', 'medium', 'high'].includes(data?.risk_level) ? data.risk_level : 'medium';

      return Response.json({
        source: 'ai',
        health_score: score,
        risk_level: risk,
        summary_ar: String(data?.summary_ar || ''),
        summary_en: String(data?.summary_en || ''),
        indicators: toPairs(data?.indicators_ar, data?.indicators_en),
        concerns: toPairs(data?.concerns_ar, data?.concerns_en),
        next_steps: toPairs(data?.next_steps_ar, data?.next_steps_en),
        model_note: 'Vision model output — visual indicators only, not a definitive field diagnosis.',
      });
    } catch (e) {
      return Response.json({ ...DEMO, model_note: `Vision service unavailable (${e.message}). Demo data shown instead.` });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}