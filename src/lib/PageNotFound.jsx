import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function PageNotFound() {
  const { L } = useLang();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-safa-cream px-6 text-center">
      <Compass className="h-10 w-10 text-safa-gold" />
      <h1 className="mt-6 font-display text-4xl font-semibold text-safa-palm">404</h1>
      <p className="mt-3 text-sm text-safa-ink/65">
        {L('الصفحة غير موجودة في منصة سعفة.', 'This page could not be found in SA’FA.')}
      </p>
      <Link to="/" className="mt-8 rounded-full bg-safa-palm px-6 py-3 text-sm font-semibold text-safa-cream transition hover:bg-safa-palmMid">
        {L('العودة إلى الرئيسية', 'Back to home')}
      </Link>
    </div>
  );
}