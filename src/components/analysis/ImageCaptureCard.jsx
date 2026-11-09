import { useRef } from 'react';
import { Camera, ImagePlus, Loader2, ScanLine, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { useLang } from '@/lib/i18n';

export default function ImageCaptureCard({ previewUrl, onPick, onClear, palms, palmId, setPalmId, onSubmit, loading, error }) {
  const { L, isAr } = useLang();
  const cameraRef = useRef(null);
  const uploadRef = useRef(null);

  return (
    <section className="panel palm-glow p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{L('الخطوة الأولى', 'STEP ONE')}</p>
          <h2 className="mt-2 text-base font-semibold text-safa-palm">{L('التقط صورة النخلة أو ارفعها', 'Capture or upload a palm photo')}</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-safa-ink/60">
            {L(
              'صورة واضحة للسعف أو الجذع في إضاءة طبيعية تعطي أفضل مؤشرات بصرية.',
              'A clear photo of the fronds or trunk in natural light gives the best visual indicators.'
            )}
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
          <ScanLine className="h-5 w-5" />
        </span>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />

      {previewUrl ? (
        <div className="mt-5">
          <div className="relative overflow-hidden rounded-2xl border border-safa-line bg-safa-mist">
            <Image src={previewUrl} alt={L('الصورة المختارة', 'Selected image')} className="h-64 w-full md:h-80" fittingType="fill" />
            <button
              type="button"
              onClick={onClear}
              className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-safa-palmDeep/70 text-safa-bone backdrop-blur transition hover:bg-safa-palmDeep"
              aria-label={L('إزالة الصورة', 'Remove image')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-safa-line bg-safa-mist/60 px-4 py-10 transition hover:border-safa-sand hover:bg-safa-mist"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-safa-palm text-safa-gold transition group-hover:scale-105">
              <Camera className="h-5 w-5" />
            </span>
            <span className="text-[13px] font-medium text-safa-palm">{L('التقاط صورة بالكاميرا', 'Take a photo')}</span>
            <span className="text-[11px] text-safa-ink/50">{L('على الأجهزة المدعومة', 'On supported devices')}</span>
          </button>
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-safa-line bg-safa-mist/60 px-4 py-10 transition hover:border-safa-sand hover:bg-safa-mist"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-safa-line bg-white text-safa-palm transition group-hover:scale-105">
              <ImagePlus className="h-5 w-5" />
            </span>
            <span className="text-[13px] font-medium text-safa-palm">{L('رفع صورة موجودة', 'Upload an image')}</span>
            <span className="text-[11px] text-safa-ink/50">JPG · PNG · HEIC</span>
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{L('ربط التحليل بنخلة (اختياري)', 'Link to a palm (optional)')}</Label>
          <Select value={palmId} onValueChange={setPalmId}>
            <SelectTrigger>
              <SelectValue placeholder={L('بدون ربط', 'Not linked')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{L('بدون ربط', 'Not linked')}</SelectItem>
              {palms.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.palm_identifier} · {isAr ? p.farm_name : p.farm_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            onClick={onSubmit}
            disabled={!previewUrl || loading}
            className="w-full rounded-full bg-safa-palm text-safa-bone hover:bg-safa-palmMid"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? L('جارٍ التحليل...', 'Analysing...') : L('تحليل الصورة', 'Analyse image')}
          </Button>
        </div>
      </div>

      {error ? <p className="mt-3 rounded-xl bg-safa-dangerBg px-3 py-2 text-[12px] text-safa-dangerFg">{error}</p> : null}

      <p className="mt-4 text-[11px] leading-relaxed text-safa-ink/45">
        {L(
          'الصورة تُحفظ في مساحة خاصة، ولا تُعرض إلا لك. النتيجة مؤشرات بصرية لدعم القرار ولا تُعد تشخيصًا ميدانيًا نهائيًا.',
          'The image is stored privately and is only visible to you. Results are visual indicators for decision support, not a definitive field diagnosis.'
        )}
      </p>
    </section>
  );
}