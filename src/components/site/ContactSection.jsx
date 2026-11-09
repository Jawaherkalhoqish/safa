import { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Send } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactSection() {
  const { L, isAr } = useLang();
  const [form, setForm] = useState({ name: '', email: '', role: 'farmer', message: '' });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
  const roles = [
    { value: 'farmer', ar: 'مزارع أو مالك مزرعة', en: 'Farmer or farm owner' },
    { value: 'facility', ar: 'شركة أو منشأة زراعية', en: 'Agricultural company or facility' },
    { value: 'investor', ar: 'مستثمر', en: 'Investor' },
    { value: 'authority', ar: 'جهة مختصة', en: 'Authority' },
  ];

  if (sent) {
    return (
      <section id="contact" className="scroll-mt-24 bg-safa-cream py-20 md:py-28">
        <div className="mx-auto max-w-xl px-5 text-center md:px-8">
          <CheckCircle2 className="mx-auto h-10 w-10 text-safa-oliveSoft" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-safa-palm md:text-3xl">
            {L('تم استلام رسالتك', 'Your message was received')}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-safa-ink/65">
            {L(
              'هذه نسخة تجريبية، ولا يتم إرسال رسائل فعلية من هذا النموذج. تعرض هذه الشاشة شكل تجربة التواصل فقط.',
              'This is a prototype: the form does not send real messages. This screen only shows how the contact experience will behave.'
            )}
          </p>
          <Button onClick={() => setSent(false)} variant="outline" className="mt-6 rounded-full">
            {L('العودة إلى النموذج', 'Back to the form')}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-safa-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">{L('تواصل معنا', 'CONTACT')}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-safa-palm md:text-4xl">
              {L('لنتحدث عن مزرعتك أو منشأتك', 'Let’s talk about your farm or facility')}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-safa-ink/70">
              {L(
                'أخبرنا بنوع العمل وحجمه، وسنوضح لك كيف تدخل منظومة سعفة وما الذي تغطيه كل خطة.',
                'Tell us the type and scale of your operation, and we will explain how you fit into the SA’FA ecosystem and what each plan covers.'
              )}
            </p>
            <div className="mt-8 space-y-4 text-[13px] text-safa-ink/70">
              <p className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-safa-line bg-white text-safa-palm">
                  <MapPin className="h-4 w-4" />
                </span>
                {L('الأحساء، المملكة العربية السعودية', 'Al-Ahsa, Saudi Arabia')}
              </p>
              <p className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-safa-line bg-white text-safa-palm">
                  <Mail className="h-4 w-4" />
                </span>
                {L('نموذج تجريبي — تفاصيل التواصل تُضاف لاحقًا', 'Prototype — contact details to be added')}
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="panel palm-glow space-y-4 p-6 md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">{L('الاسم', 'Name')}</Label>
                <Input id="c-name" required value={form.name} onChange={set('name')} placeholder={L('اسمك الكامل', 'Your full name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">{L('البريد الإلكتروني', 'Email')}</Label>
                <Input id="c-email" type="email" required value={form.email} onChange={set('email')} placeholder="name@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{L('طبيعة العمل', 'Role')}</Label>
              <Select value={form.role} onValueChange={set('role')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {isAr ? r.ar : r.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-msg">{L('الرسالة', 'Message')}</Label>
              <Textarea
                id="c-msg"
                required
                rows={4}
                value={form.message}
                onChange={set('message')}
                placeholder={L('عدد النخيل أو السعة الشهرية، والمحافظة، وما تحتاجه', 'Palm count or monthly capacity, governorate, and what you need')}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-safa-earth">{L('نموذج تجريبي — لا يتم إرسال بيانات حقيقية.', 'Prototype form — no real data is sent.')}</p>
              <Button type="submit" className="rounded-full bg-safa-palm text-safa-bone hover:bg-safa-palmMid">
                <Send className="h-4 w-4" />
                {L('إرسال', 'Send')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}