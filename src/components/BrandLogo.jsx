import { ASSETS } from '@/lib/assets';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * Renders the official SA'FA logo at its original proportions and transparency.
 * tone="auto"    → white logo in dark mode, deep-green logo in light mode
 * tone="onDark"  → white logo, for palm-green / charcoal surfaces
 * tone="onLight" → deep-green logo, for cream and white surfaces
 */
export default function BrandLogo({ tone = 'auto', className, alt = 'SA’FA | سعفة' }) {
  const { isDark } = useTheme();
  const resolved = tone === 'auto' ? (isDark ? 'onDark' : 'onLight') : tone;
  const src = resolved === 'onLight' ? ASSETS.logoLight : ASSETS.logoDark;
  return <img src={src} alt={alt} className={cn('w-auto object-contain', className)} draggable={false} />;
}