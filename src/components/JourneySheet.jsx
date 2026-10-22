import { ArrowLeft, ArrowRight, Factory, Package, Recycle, Sprout } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n';
import { num } from '@/lib/format';

export default function JourneySheet({ product, trigger }) {
  const { L, isAr } = useLang();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const steps = [
    { icon: Sprout, ar: 'نخلة في الأحساء', en: 'Palm in Al-Ahsa', note: L('مراقبة مستمرة لحالة النخلة ومؤشراتها.', 'Continuous monitoring of palm condition and indicators.') },
    { icon: Recycle, ar: 'مخلفات نخيل مصنّفة', en: 'Classified palm waste', note: product?.source_material },
    { icon: Factory, ar: 'معالجة وتدوير', en: 'Processing & recycling', note: product?.facility_name },
    { icon: Package, ar: 'منتج دائري', en: 'Circular product', note: product?.pathway || L('إعادة استخدام / تدوير', 'Reuse / recycling') },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full border-safa-line text-xs text-safa-palm">
            {L('تعرف على رحلة المادة', 'See the material journey')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-safa-palm">{L('رحلة المادة', 'Material journey')}</DialogTitle>
          <DialogDescription className="text-xs text-safa-ink/60">
            {L('من النخلة.. إلى المنتج', 'Palm → Waste → Processing → Product')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {steps.map((s, i) => (
            <div key={s.en} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
                <s.icon className="h-4 w-4" />
              </span>
              <div className="flex-1 border-b border-dashed border-safa-line pb-3">
                <p className="text-[13px] font-medium text-safa-palm">{L(s.ar, s.en)}</p>
                {s.note ? <p className="mt-0.5 text-[11px] text-safa-ink/55">{s.note}</p> : null}
              </div>
              {i < steps.length - 1 ? <Arrow className="mt-2.5 h-3.5 w-3.5 text-safa-sand" /> : null}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-safa-line bg-safa-cream/70 p-4 text-xs">
          <div>
            <p className="text-safa-ink/50">{L('مصدر المادة', 'Material source')}</p>
            <p className="mt-1 font-medium text-safa-palm">{product?.source_material}</p>
          </div>
          <div>
            <p className="text-safa-ink/50">{L('الكمية المستخدمة', 'Material used')}</p>
            <p className="mt-1 font-medium text-safa-palm">{num(product?.material_quantity_kg)} {L('كجم', 'kg')}</p>
          </div>
          <div>
            <p className="text-safa-ink/50">{L('المسار', 'Pathway')}</p>
            <p className="mt-1 font-medium text-safa-palm">{product?.pathway}</p>
          </div>
          <div>
            <p className="text-safa-ink/50">{L('الجهة المنتجة', 'Producer')}</p>
            <p className="mt-1 font-medium text-safa-palm">{product?.facility_name}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}