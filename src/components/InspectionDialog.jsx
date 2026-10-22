import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';

const INSPECTORS = ['فريق الفحص الميداني — الأحساء', 'م. سعد الحربي', 'م. نورة العبدالله', 'وحدة المكافحة المتكاملة'];

export default function InspectionDialog({ palm, open, onOpenChange, onDone }) {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    risk_level: 'medium',
    priority: 'medium',
    reason: L('مؤشر خطر سوسة يستدعي فحصاً ميدانياً.', 'RPW risk indicator requires field inspection.'),
    assigned_to: INSPECTORS[0],
    scheduled_for: '',
  });

  const submit = async () => {
    setSaving(true);
    try {
      const code = `INS-${palm?.palm_identifier}-${Math.floor(10 + Math.random() * 89)}`;
      await base44.entities.Inspection.create({
        inspection_code: code,
        palm_id: palm?.id,
        palm_identifier: palm?.palm_identifier,
        farm_name: palm?.farm_name,
        region: palm?.region,
        risk_level: form.risk_level,
        priority: form.priority,
        reason: form.reason,
        requested_by: L('المزارع — منصة سعفة', 'Farmer — SA’FA platform'),
        assigned_to: form.assigned_to,
        requested_at: new Date().toISOString(),
        scheduled_for: form.scheduled_for || null,
        status: form.scheduled_for ? 'scheduled' : 'new',
      });
      toast({ title: L('تم إرسال طلب الفحص', 'Inspection request sent'), description: `${code} · ${L('نخلة', 'Palm')} #${palm?.palm_identifier}` });
      onOpenChange(false);
      onDone?.();
    } catch (e) {
      toast({ title: L('تعذر إرسال طلب الفحص', 'Could not send the inspection request'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-safa-palm">
            <ClipboardList className="h-4 w-4" />
            {L('طلب فحص ميداني', 'Request field inspection')}
          </DialogTitle>
          <DialogDescription className="text-xs text-safa-ink/60">
            {L('النخلة', 'Palm')} #{palm?.palm_identifier} · {palm?.farm_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">{L('مستوى الخطر', 'Risk level')}</Label>
              <Select value={form.risk_level} onValueChange={(v) => setForm({ ...form, risk_level: v })}>
                <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{L('منخفض', 'Low')}</SelectItem>
                  <SelectItem value="medium">{L('متوسط', 'Medium')}</SelectItem>
                  <SelectItem value="high">{L('مرتفع', 'High')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{L('الأولوية', 'Priority')}</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{L('منخفضة', 'Low')}</SelectItem>
                  <SelectItem value="medium">{L('متوسطة', 'Medium')}</SelectItem>
                  <SelectItem value="high">{L('عالية', 'High')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">{L('السبب', 'Reason')}</Label>
            <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="mt-1.5 text-xs" rows={3} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">{L('تاريخ الطلب', 'Date requested')}</Label>
              <Input value={new Date().toISOString().slice(0, 10)} readOnly className="mt-1.5 bg-safa-mist text-xs" />
            </div>
            <div>
              <Label className="text-xs">{L('الموعد المقترح (اختياري)', 'Suggested date (optional)')}</Label>
              <Input type="date" value={form.scheduled_for} onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })} className="mt-1.5 text-xs" />
            </div>
          </div>

          <div>
            <Label className="text-xs">{L('الفاحص المسؤول', 'Assigned inspector')}</Label>
            <Select value={form.assigned_to} onValueChange={(v) => setForm({ ...form, assigned_to: v })}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {INSPECTORS.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={submit} disabled={saving} className="w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            {saving ? L('جاري الإرسال…', 'Sending…') : L('إرسال طلب الفحص', 'Send inspection request')}
          </Button>
          <p className="text-[10px] leading-relaxed text-safa-ink/50">
            {L(
              'حالة الطلب تبدأ بـ «جديد» ثم تمر بمراجعة وجدولة وفحص ومتابعة حتى الإغلاق.',
              'The request starts as “New”, then moves through review, scheduling, inspection and follow-up until closure.'
            )}
            {lang === 'ar' ? '' : ''}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}