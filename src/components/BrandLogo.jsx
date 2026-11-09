import { ASSETS } from '@/lib/assets';
import { cn } from '@/lib/utils';

/**
 * Renders the official SA'FA logo at its original proportions and transparency.
 * tone="onDark"  → white logo, for palm-green / charcoal surfaces
 * tone="onLight" → deep-green logo, for cream and white surfaces
 */
export default function BrandLogo({ tone = 'onDark', className, alt = 'SA’FA | سعفة' }) {
  const src = tone === 'onLight' ? ASSETS.logoLight : ASSETS.logoDark;
  return <img src={src} alt={alt} className={cn('w-auto object-contain', className)} draggable={false} />;
}