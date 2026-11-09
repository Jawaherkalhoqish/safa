import { useEffect, useRef, useState } from 'react';
import { Info, Leaf, ScanLine } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ImageCaptureCard from '@/components/analysis/ImageCaptureCard';
import AnalysisResultCard from '@/components/analysis/AnalysisResultCard';
import AnalysisHistory from '@/components/analysis/AnalysisHistory';
import { base44 } from '@/api/base44Client';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';

export default function PalmAnalysis() {
  const { L } = useLang();
  const { items: palms } = useList('Palm', {}, { limit: 100, sort: 'palm_identifier' });
  const [palmId, setPalmId] = useState(() => new URLSearchParams(window.location.search).get('palm') || 'none');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [saved, setSaved] = useState(false);
  const objectUrl = useRef('');

  const linkedPalm = palms.find((p) => p.id === palmId) || null;
  const { items: history, loading: historyLoading, reload: reloadHistory } = useList(
    'PalmAnalysis',
    linkedPalm ? { palm_id: linkedPalm.id } : {},
    { limit: 12, sort: '-created_date' }
  );

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    []
  );

  const pick = (picked) => {
    if (!picked) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(picked);
    setFile(picked);
    setPreviewUrl(objectUrl.current);
    setResult(null);
    setPrevious(null);
    setSaved(false);
    setError('');
  };

  const clear = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = '';
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setPrevious(null);
    setSaved(false);
    setError('');
  };

  const analyse = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      const res = await base44.functions.invoke('analyzePalmImage', { file_uri });
      const data = res.data || {};
      if (data.error) throw new Error(data.error);

      setPrevious(history[0] || null);
      setResult(data);
      try {
        await persist(data, file_uri);
        await reloadHistory();
      } catch (saveError) {
        setSaved(false);
      }
    } catch (e) {
      setError(e?.message || L('تعذر إكمال التحليل. حاول مرة أخرى.', 'The analysis could not be completed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const persist = async (data, fileUri) => {
    const palm = palms.find((p) => p.id === palmId) || null;
    await base44.entities.PalmAnalysis.create({
      analysis_code: `AN-${Date.now().toString().slice(-6)}`,
      palm_id: palm?.id || '',
      palm_identifier: palm?.palm_identifier || '',
      farm_name: palm?.farm_name || '',
      image_uri: fileUri,
      health_score: data.health_score,
      risk_level: data.risk_level,
      indicators: data.indicators || [],
      concerns: data.concerns || [],
      next_steps: data.next_steps || [],
      summary_ar: data.summary_ar,
      summary_en: data.summary_en,
      source: data.source === 'ai' ? 'ai' : 'demo',
      notes: data.model_note,
    });
    setSaved(true);
  };

  const saveAgain = async () => {
    if (!result || saved) return;
    await reloadHistory();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={L('الذكاء الزراعي', 'AGRICULTURAL INTELLIGENCE')}
        title={L('تحليل صور النخيل', 'Palm image analysis')}
        subtitle={L(
          'صوّر النخلة أو السعف، واحصل على مؤشرات بصرية وخطر متابعة وخطوات مقترحة، محفوظة في سجل النخلة للمقارنة.',
          'Photograph the palm or its fronds to get visual indicators, follow-up risk and suggested steps, saved to the palm record for comparison.'
        )}
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-5">
          {result ? (
            <AnalysisResultCard
              result={result}
              previous={previous}
              saved={saved}
              onSave={saveAgain}
              onNew={clear}
            />
          ) : (
            <ImageCaptureCard
              previewUrl={previewUrl}
              onPick={pick}
              onClear={clear}
              palms={palms}
              palmId={palmId}
              setPalmId={setPalmId}
              onSubmit={analyse}
              loading={loading}
              error={error}
            />
          )}

          <div className="panel flex gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-safa-mist text-safa-palm">
              <Info className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-safa-palm">{L('كيف تُقرأ النتيجة؟', 'How to read the result')}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-safa-ink/60">
                {L(
                  'المؤشرات وصف لما يظهر في الصورة فقط. وجود شارة «تحليل تجريبي» يعني أن النتيجة محاكاة ولم يحللها نموذج بصري، وتُحفظ كذلك في السجل.',
                  'Indicators describe only what appears in the image. A “Demo analysis” badge means the result is simulated and was not produced by a vision model, and it is saved that way in the record.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <AnalysisHistory
            items={history}
            loading={historyLoading}
            palmLabel={linkedPalm ? linkedPalm.palm_identifier : ''}
          />

          <div className="panel p-5">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-safa-palm">
              <ScanLine className="h-4 w-4 text-safa-oliveSoft" />
              {L('أفضل نتيجة تصوير', 'Best capture practice')}
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-safa-ink/60">
              <li className="flex gap-2">
                <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safa-oliveSoft" />
                {L('صوّر السعف من الجهة المشمسة دون فلاش.', 'Photograph fronds from the sunlit side without flash.')}
              </li>
              <li className="flex gap-2">
                <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safa-oliveSoft" />
                {L('أدرج صورة قريبة لأي تغيّر في اللون أو الشكل.', 'Include a close-up of any change in colour or shape.')}
              </li>
              <li className="flex gap-2">
                <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safa-oliveSoft" />
                {L('أعد التصوير من الزاوية نفسها عند المقارنة.', 'Re-capture from the same angle when comparing.')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}