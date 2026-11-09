import { useState } from 'react';
import { Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLang } from '@/lib/i18n';
import { AUTHOR_ROLE, POST_CATEGORY, REGIONS } from '@/lib/community';

const EMPTY = {
  category: 'need',
  title: '',
  body: '',
  author_name: '',
  author_role: 'farmer',
  organization: '',
  region: 'ahsa',
  contact: '',
  tags: '',
};

export default function NewPostDialog({ open, onOpenChange, onCreated }) {
  const { L, isAr } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (!form.title.trim() || !form.body.trim() || !form.author_name.trim()) {
      setError(L('أكمل العنوان والنص والاسم قبل النشر.', 'Add a title, body and your name before publishing.'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      await base44.entities.CommunityPost.create({
        post_code: `SAF-C${Date.now().toString().slice(-6)}`,
        category: form.category,
        title: form.title.trim(),
        body: form.body.trim(),
        author_name: form.author_name.trim(),
        author_role: form.author_role,
        organization: form.organization.trim() || undefined,
        region: form.region,
        contact: form.contact.trim() || undefined,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 6),
        status: 'open',
        interest_count: 0,
      });
      setForm(EMPTY);
      onCreated?.();
      onOpenChange(false);
    } catch (e) {
      setError(L('تعذر نشر المشاركة، حاول مرة أخرى.', 'The post could not be published, please try again.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{L('مشاركة في المجتمع الزراعي', 'Post to the agricultural community')}</DialogTitle>
          <DialogDescription className="text-[12.5px] leading-relaxed">
            {L(
              'شارك معرفة أو احتياجًا أو خدمة أو فرصة شراكة مع المزارعين والشركات والمنشآت.',
              'Share knowledge, a need, a service or a partnership opportunity with farmers, companies and facilities.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-[11px] text-safa-ink/60">{L('نوع المشاركة', 'Post type')}</Label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(POST_CATEGORY).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{L(v.ar, v.en)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-safa-ink/60">{L('المنطقة', 'Region')}</Label>
              <Select value={form.region} onValueChange={(v) => set('region', v)}>
                <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="text-xs">{isAr ? r.ar : r.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[11px] text-safa-ink/60">{L('العنوان', 'Title')}</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} className="mt-1 h-9 text-xs" placeholder={L('مثال: مطلوب استلام 12 طن سعف', 'e.g. 12 tons of fronds ready for pickup')} />
          </div>

          <div>
            <Label className="text-[11px] text-safa-ink/60">{L('التفاصيل', 'Details')}</Label>
            <Textarea value={form.body} onChange={(e) => set('body', e.target.value)} rows={4} className="mt-1 text-xs" placeholder={L('اشرح الاحتياج أو الخبرة أو الفرصة…', 'Describe the need, experience or opportunity…')} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-[11px] text-safa-ink/60">{L('الاسم', 'Your name')}</Label>
              <Input value={form.author_name} onChange={(e) => set('author_name', e.target.value)} className="mt-1 h-9 text-xs" />
            </div>
            <div>
              <Label className="text-[11px] text-safa-ink/60">{L('الصفة', 'Role')}</Label>
              <Select value={form.author_role} onValueChange={(v) => set('author_role', v)}>
                <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(AUTHOR_ROLE).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{L(v.ar, v.en)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-[11px] text-safa-ink/60">{L('الجهة', 'Organization')}</Label>
              <Input value={form.organization} onChange={(e) => set('organization', e.target.value)} className="mt-1 h-9 text-xs" />
            </div>
            <div>
              <Label className="text-[11px] text-safa-ink/60">{L('وسيلة التواصل', 'Contact')}</Label>
              <Input value={form.contact} onChange={(e) => set('contact', e.target.value)} className="mt-1 h-9 text-xs" placeholder={L('بريد أو جوال', 'Email or mobile')} />
            </div>
          </div>

          <div>
            <Label className="text-[11px] text-safa-ink/60">{L('وسوم مفصولة بفاصلة', 'Tags, comma separated')}</Label>
            <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} className="mt-1 h-9 text-xs" placeholder={L('سعف، تدوير، جمع', 'fronds, recycling, collection')} />
          </div>

          {error ? <p className="text-[11.5px] text-safa-dangerFg">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            {L('إلغاء', 'Cancel')}
          </Button>
          <Button onClick={submit} disabled={saving} className="rounded-full bg-safa-palm text-safa-bone hover:bg-safa-palmMid">
            <Send className="h-3.5 w-3.5" />
            {saving ? L('جارٍ النشر…', 'Publishing…') : L('نشر المشاركة', 'Publish')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}