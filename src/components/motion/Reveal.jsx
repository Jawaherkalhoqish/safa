import useReveal from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

/**
 * Fades + lifts its children into view on scroll, with optional stagger delay.
 * Use `glow-card` in className for the premium emerald hover treatment.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const ref = useReveal({ delay });

  return (
    <Tag ref={ref} className={cn('reveal', className)} {...rest}>
      {children}
    </Tag>
  );
}