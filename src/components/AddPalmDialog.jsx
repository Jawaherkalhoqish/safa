import { useEffect, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { useList } from '@/lib/data';

const VARIETIES = [
  { ar: 'خلاص', en: 'Khalas' },
  { ar: 'شيشي', en: 'Shishi' },
  { ar: 'رزيز', en: 'Raziz' },
  { ar: 'هلالي', en: 'Helali' },
];

const IRRIGATION = [
  { ar: 'ري بالتنقيط', en: 'Drip irrigation' },
  { ar: 'ري بالغمر', en: 'Flood irrigation' },
  { ar: 'ري محوري', en: 'Pivot irrigation' },
];

export default function AddPalmDialog({ trigger, onCreated, defaultFarmId }) {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const { items: farms } = useList('Farm', {}, { limit: 50, sort: 'name' });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    palm_identifier: '',
    farm_id: defaultFarmId || '',
    location: '',
    age_years: '',
    variety: VARIETIES[0].en,
    planting_area: '',
    irrigation_type: IRRIGATION[0].en,
    sensor_unit: '',
    photo_url: '',
    notes: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (defaultFarmId) setForm((f) => ({ ...f, farm_id: defaultFarmId }));
  }, [defaultFarmId]);

  const farm = farms.find((f) => f.id === form.farm_id);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setForm((f) => ({ ...f, photo_url: file_url }));
    } catch (e) {
      toast({ title: L('تعذر رفع الصورة', 'Could not upload the photo'), variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.palm_identifier || !farm) {
      toast({ title: L('أدخل معرّف النخلة واختر المزرعة', 'Enter a palm ID and select a farm'), variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const predicted = new Date();
      predicted.setDate(predicted.getDate() + 14);
      await base44.entities.Palm.create({
        palm_identifier: form.palm_identifier,
        farm_id: farm.id,
        farm_name: farm.name,
        region: farm.region,
        location: form.location || farm.location,
        age_years: Number(form.age_years) || 12,
        variety: form.variety,
        planting_area: form.planting_area,
        irrigation_type: form.irrigation_type,
        sensor_unit: form.sensor_unit,
        photo_url: form.photo_url,
        notes: form.notes,
        latitude: Number(form.latitude) || farm.latitude,
        longitude: Number(form.longitude) || farm.longitude,
        health_score: 72,
        status: 'stable',
        rpw_risk: 0.18,
        electrical_activity: 0.66,
        acoustic_activity: 0.31,
        soil_moisture: 27,
        temperature: 31,
        irrigation_status: L('جيدة', 'Good'),
        predicted_waste_tons: 2.1,
        predicted_date: predicted.toISOString(),
        predicted_classification: 'standard',
        last_sensor_at: new Date().toISOString(),
      });
      toast({ title: L('تمت إضافة النخلة', 'Palm added'), description: `${L('نخلة', 'Palm')} #${form.palm_identifier} · ${farm.name}` });
      setOpen(false);
      setForm({ ...form, palm_identifier: '', location: '', age_years: '', planting_area: '', sensor_unit: '', photo_url: '', notes: '' });
      onCreated?.();
    } catch (e) {
      toast({ title: L('تعذرت إضافة النخلة', 'Could not add the palm'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            <Plus className="me-2 h-4 w-4" />
            {L('إضافة نخلة', 'Add palm')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[86vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-safa-palm">{L('إضافة نخلة', 'Add a palm')}</DialogTitle>
          <DialogDescription className="text-xs text-safa-ink/60">
            {L('سيتم إنشاء ملف النخلة وربطها بالمزرعة وبدء المراقبة.', 'A palm profile is created, linked to the farm, and monitoring starts.')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs">{L('معرّف النخلة', 'Palm ID')}</Label>
            <Input value={form.palm_identifier} onChange={(e) => setForm({ ...form, palm_identifier: e.target.value })} placeholder="126" className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('المزرعة', 'Farm')}</Label>
            <Select value={form.farm_id} onValueChange={(v) => setForm({ ...form, farm_id: v })}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder={L('اختر المزرعة', 'Select farm')} /></SelectTrigger>
              <SelectContent>
                {farms.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{L('الموقع', 'Location')}</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={L('القطاع الشمالي — الصف 4', 'North sector — row 4')} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('عمر النخلة (سنة)', 'Palm age (years)')}</Label>
            <Input type="number" value={form.age_years} onChange={(e) => setForm({ ...form, age_years: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('الصنف', 'Variety')}</Label>
            <Select value={form.variety} onValueChange={(v) => setForm({ ...form, variety: v })}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {VARIETIES.map((v) => (
                  <SelectItem key={v.en} value={v.en} className="text-xs">{lang === 'ar' ? v.ar : v.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{L('نوع الري', 'Irrigation type')}</Label>
            <Select value={form.irrigation_type} onValueChange={(v) => setForm({ ...form, irrigation_type: v })}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {IRRIGATION.map((v) => (
                  <SelectItem key={v.en} value={v.en} className="text-xs">{lang === 'ar' ? v.ar : v.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{L('منطقة الزراعة', 'Planting area')}</Label>
            <Input value={form.planting_area} onChange={(e) => setForm({ ...form, planting_area: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('وحدة الاستشعار (اختياري)', 'Sensor unit (optional)')}</Label>
            <Input value={form.sensor_unit} onChange={(e) => setForm({ ...form, sensor_unit: e.target.value })} placeholder="SAFA-S-126" className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('إحداثيات GPS (اختياري)', 'GPS coordinates (optional)')}</Label>
            <div className="mt-1.5 flex gap-2">
              <Input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="lat" className="text-xs" />
              <Input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="lng" className="text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-xs">{L('صورة النخلة (اختياري)', 'Palm photo (optional)')}</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-safa-line bg-white px-3 py-2 text-xs text-safa-palm">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? L('جاري الرفع…', 'Uploading…') : form.photo_url ? L('تم الرفع', 'Uploaded') : L('اختر صورة', 'Choose photo')}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
              </label>
              {form.photo_url ? <img src={form.photo_url} alt="" className="h-9 w-9 rounded-lg object-cover" /> : null}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{L('ملاحظات', 'Notes')}</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1.5 text-xs" />
          </div>
        </div>

        <Button onClick={submit} disabled={saving} className="mt-2 w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
          {saving ? L('جاري الحفظ…', 'Saving…') : L('إنشاء ملف النخلة', 'Create palm profile')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}