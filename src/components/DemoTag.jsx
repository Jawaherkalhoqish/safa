import { FlaskConical } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function DemoTag({ className, text }) {
  const { L } = useLang();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-safa-sand bg-safa-sandSoft/60 px-2.5 py-1 text-[10px] font-medium text-safa-earth',
        className
      )}
    >
      <FlaskConical className="h-3 w-3" />
      {text || L('بيانات تجريبية | Demo Data', 'Demo Data')}
    </span>
  );
}