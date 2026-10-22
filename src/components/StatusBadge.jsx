import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TONES = {
  green: 'bg-safa-okBg text-safa-okFg border-safa-okLine',
  amber: 'bg-safa-warnBg text-safa-warnFg border-safa-warnLine',
  red: 'bg-safa-dangerBg text-safa-dangerFg border-safa-dangerLine',
  palm: 'bg-safa-palm/10 text-safa-palm border-safa-palm/20',
  sand: 'bg-safa-sandSoft text-safa-earth border-safa-sand',
  neutral: 'bg-safa-mist text-safa-ink/70 border-safa-line',
};

export default function StatusBadge({ tone = 'neutral', label, icon: Icon, className }) {
  return (
    <Badge
      variant="outline"
      className={cn('gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium', TONES[tone] || TONES.neutral, className)}
    >
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {label}
    </Badge>
  );
}