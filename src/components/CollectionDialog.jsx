import { useState } from 'react';
import { Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { useList } from '@/lib/data';
import { num } from '@/lib/format';

const nextThursday = () => {
  const d = new Date();
  const diff = (4 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
};

export default function CollectionDialog({ waste, open, onOpenChange, onDone }) {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 20, sort: 'name' });
  const [facilityId, setFacilityId] = useState('');
  const [date, setDate] = useState(nextThursday().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const facility = facilities.find((f) => f.id === facilityId) || facilities[0];
  const quantity = waste?.quantity_tons || 0;

  const submit = async () => {
    setSaving(true);
    try {
      const requestCode = `REQ-${waste?.waste_code || Math.floor(100 + Math.random() * 899)}`;
      await base44.entities.CollectionRequest.create({
        request_code: requestCode,
        waste_id: waste?.id,
        waste_code: waste?.waste_code,
        farm_name: waste?.farm_name,
        region: waste?.region,
        facility_id: facility?.id,
        facility_name: facility?.name,
        quantity_tons: quantity,
        distance_km: 12,
        requested_date: new Date().toISOString(),
        scheduled_date: date,
        status: 'requested',
        timeline: [{ key: 'requested', ar: 'تم إنشاء الطلب', en: 'Request created', at: new Date().toISOString(), done: true }],
      });
      if (waste?.id) {
        await base44.entities.WasteRecord.update(waste.id, { status: 'scheduled' });
      }
      await base44.entities.Alert.create({
        alert_code: `A-${waste?.palm_identifier || 'W'}-C${Math.floor(10 + Math.random() * 89)}`,
        palm_id: waste?.palm_id,
        palm_identifier: waste?.palm_identifier,
        farm_name: waste?.farm_name,
        region: waste?.region,
        type: 'collection',
        severity: 'low',
        title: L('موعد جمع', 'Collection scheduled'),
        reason: L(
          `تم تحديد موعد جمع المخلفات يوم ${date}.`,
          `Waste collection has been scheduled for ${date}.`
        ),
        recommendation: L('الجهة المقترحة: ' + (facility?.name || ''), 'Suggested facility: ' + (facility?.name || '')),
        status: 'new',
      });
      toast({ title: L('تم إنشاء طلب الجمع', 'Collection request created'), description: `${requestCode} · ${num(quantity, 1)} ${L('طن', 't')}` });
      onOpenChange(false);
      onDone?.();
    } catch (e) {
      toast({ title: L('تعذر إنشاء طلب الجمع', 'Could not create the collection request'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-safa-palm">
            <Truck className="h-4 w-4" />
            {L('جدولة الجمع', 'Schedule collection')}
          </DialogTitle>
          <DialogDescription className="text-xs text-safa-ink/60">
            {waste?.waste_code} · {waste?.farm_name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-safa-line bg-safa-cream/70 p-4 text-xs">
          <div>
            <p className="text-safa-ink/50">{L('الكمية', 'Quantity')}</p>
            <p className="display-num mt-1 text-xl text-safa-palm">{num(quantity, 1)} {L('طن', 't')}</p>
          </div>
          <div>
            <p className="text-safa-ink/50">{L('الموقع', 'Location')}</p>
            <p className="mt-1 font-medium text-safa-palm">{waste?.farm_name}</p>
          </div>
          <div>
            <p className="text-safa-ink/50">{L('المسافة', 'Distance')}</p>
            <p className="mt-1 font-medium text-safa-palm">{L('12 كم', '12 km')}</p>
          </div>
          <div>
            <p className="text-safa-ink/50">{L('التصنيف', 'Classification')}</p>
            <p className="mt-1 font-medium text-safa-palm">{waste?.risk_classification === 'special' ? L('مسار معالجة خاص', 'Special pathway') : waste?.risk_classification === 'needs_verification' ? L('يحتاج تحقق', 'Needs verification') : L('مسار قياسي', 'Standard')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs">{L('الجهة المقترحة', 'Suggested facility')}</Label>
            <Select value={facility?.id || ''} onValueChange={setFacilityId}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder={L('اختر منشأة', 'Select facility')} /></SelectTrigger>
              <SelectContent>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{L('الموعد المقترح', 'Suggested date')}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 text-xs" />
          </div>
          <Button onClick={submit} disabled={saving} className="w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            {saving ? L('جاري الجدولة…', 'Scheduling…') : L('جدولة الجمع', 'Schedule collection')}
          </Button>
          <p className="text-[10px] text-safa-ink/50">
            {L('سيتم تحديث حالة المخلفات إلى «تم جدولة الجمع» وربط الطلب بالمنشأة.', 'The waste status will move to “Collection scheduled” and the request will be linked to the facility.')}
            {lang === 'ar' ? '' : ''}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}