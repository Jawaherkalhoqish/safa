import { useEffect, useState } from 'react';
import { Factory, Package, Plus, Recycle, Upload } from 'lucide-react';
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
import { PRODUCT_CATEGORY } from '@/lib/format';

export default function AddProductDialog({ trigger, onCreated, defaultFacilityId }) {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 20, sort: 'name' });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name_ar: '',
    name_en: '',
    category: 'fiber',
    description_ar: '',
    price: '',
    inventory: '',
    source_material: L('مخلفات نخيل — الأحساء', 'Palm waste — Al-Ahsa'),
    material_quantity_kg: '',
    pathway: L('إعادة استخدام / تدوير', 'Reuse / recycling'),
    facility_id: defaultFacilityId || '',
    image_url: '',
  });

  useEffect(() => {
    if (defaultFacilityId) setForm((f) => ({ ...f, facility_id: defaultFacilityId }));
  }, [defaultFacilityId]);

  const facility = facilities.find((f) => f.id === form.facility_id) || facilities[0];

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setForm((f) => ({ ...f, image_url: file_url }));
    } catch (e) {
      toast({ title: L('تعذر رفع الصورة', 'Could not upload the image'), variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.name_ar) {
      toast({ title: L('أدخل اسم المنتج', 'Enter the product name'), variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Product.create({
        facility_id: facility?.id,
        facility_name: facility?.name,
        name_ar: form.name_ar,
        name_en: form.name_en || form.name_ar,
        category: form.category,
        description_ar: form.description_ar,
        description_en: form.description_ar,
        source_material: form.source_material,
        material_quantity_kg: Number(form.material_quantity_kg) || 10,
        pathway: form.pathway,
        price: Number(form.price) || 0,
        inventory: Number(form.inventory) || 0,
        image_url: form.image_url,
        sustainability_ar: L('منتج مصنوع من مخلفات نخيل معاد توجيهها في الأحساء.', 'Made from redirected palm waste in Al-Ahsa.'),
        sustainability_en: 'Made from redirected palm waste in Al-Ahsa.',
        region: facility?.region,
      });
      await base44.entities.Alert.create({
        alert_code: `A-P${Math.floor(100 + Math.random() * 899)}`,
        type: 'product',
        severity: 'low',
        title: L('منتج جديد', 'New product'),
        reason: L('أصبحت إحدى المواد متاحة كمنتج دائري في متجر سعفة.', 'A material has become available as a circular product in the SA’FA store.'),
        recommendation: L(`المنتج: ${form.name_ar}`, `Product: ${form.name_ar}`),
        status: 'new',
      });
      toast({ title: L('تمت إضافة منتج دائري', 'Circular product added'), description: form.name_ar });
      setOpen(false);
      setForm({ ...form, name_ar: '', name_en: '', description_ar: '', price: '', inventory: '', material_quantity_kg: '', image_url: '' });
      onCreated?.();
    } catch (e) {
      toast({ title: L('تعذرت إضافة المنتج', 'Could not add the product'), variant: 'destructive' });
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
            {L('إضافة منتج دائري', 'Add circular product')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[86vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-safa-palm">
            <Package className="h-4 w-4" />
            {L('إضافة منتج دائري إلى متجر سعفة', 'Add a circular product to the SA’FA store')}
          </DialogTitle>
          <DialogDescription className="text-xs text-safa-ink/60">
            {L('اربط المنتج بمصدر المادة والكمية المستخدمة والمسار.', 'Link the product to its material source, quantity used and pathway.')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs">{L('اسم المنتج (عربي)', 'Product name (Arabic)')}</Label>
            <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('اسم المنتج (إنجليزي)', 'Product name (English)')}</Label>
            <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('الفئة', 'Category')}</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRODUCT_CATEGORY).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-xs">{lang === 'ar' ? v.ar : v.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{L('المنشأة المنتجة', 'Producing facility')}</Label>
            <Select value={facility?.id || ''} onValueChange={(v) => setForm({ ...form, facility_id: v })}>
              <SelectTrigger className="mt-1.5 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{L('السعر (ريال)', 'Price (SAR)')}</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('المخزون', 'Inventory')}</Label>
            <Input type="number" value={form.inventory} onChange={(e) => setForm({ ...form, inventory: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('الكمية المستخدمة (كجم)', 'Material used (kg)')}</Label>
            <Input type="number" value={form.material_quantity_kg} onChange={(e) => setForm({ ...form, material_quantity_kg: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div>
            <Label className="text-xs">{L('المسار', 'Pathway')}</Label>
            <Input value={form.pathway} onChange={(e) => setForm({ ...form, pathway: e.target.value })} className="mt-1.5 text-xs" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{L('الوصف', 'Description')}</Label>
            <Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={2} className="mt-1.5 text-xs" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">{L('صورة المنتج', 'Product image')}</Label>
            <div className="mt-1.5 flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-safa-line bg-white px-3 py-2 text-xs text-safa-palm">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? L('جاري الرفع…', 'Uploading…') : form.image_url ? L('تم الرفع', 'Uploaded') : L('اختر صورة', 'Choose image')}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
              </label>
              {form.image_url ? <img src={form.image_url} alt="" className="h-12 w-12 rounded-xl object-cover" /> : null}
            </div>
          </div>
        </div>

        <Button onClick={submit} disabled={saving} className="mt-2 w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
          {saving ? L('جاري الحفظ…', 'Saving…') : L('إضافة المنتج', 'Add product')}
        </Button>

        <p className="flex items-center gap-1.5 text-[10px] text-safa-ink/50">
          <Recycle className="h-3 w-3" />
          {L('سيتم إنشاء تنبيه «منتج جديد» لمتابعة الإضافة.', 'A “New product” alert is created for the addition.')}
        </p>
        <p className="flex items-center gap-1.5 text-[10px] text-safa-ink/50">
          <Factory className="h-3 w-3" />
          {L('المنتج مرتبط بالمنشأة ومصدر المادة في الأحساء.', 'The product is linked to the facility and material source in Al-Ahsa.')}
        </p>
      </DialogContent>
    </Dialog>
  );
}