import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Light / Dark switch. `tone="onDark"` for palm-green or image surfaces,
 * `tone="onLight"` for cream and card surfaces.
 */
export default function ThemeToggle({ tone = 'onLight', className }) {
  const { isDark, toggle } = useTheme();
  const { L, dir } = useLang();
  const onDark = tone === 'onDark';
  const shift = isDark ? (dir === 'rtl' ? -30 : 30) : 0;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={L('تبديل الوضع الفاتح والداكن', 'Toggle light and dark mode')}
      title={isDark ? L('الوضع الفاتح', 'Light mode') : L('الوضع الداكن', 'Dark mode')}
      className={cn(
        'group relative flex h-8 w-[62px] shrink-0 items-center rounded-full border transition-colors duration-300',
        onDark ? 'border-white/25 bg-white/10 hover:bg-white/15' : 'border-safa-line bg-safa-mist hover:border-safa-sand',
        className
      )}
    >
      <span
        className={cn(
          'absolute top-1 start-1 flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 ease-out',
          onDark ? 'bg-safa-gold text-safa-palmDeep' : 'bg-safa-palm text-safa-bone'
        )}
        style={{ transform: `translateX(${shift}px)` }}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-12" />
        ) : (
          <Sun className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
        )}
      </span>
      <span className={cn('mx-2 flex flex-1 items-center justify-between', onDark ? 'text-safa-bone/40' : 'text-safa-earth/60')}>
        <Sun className={cn('h-3 w-3 transition-opacity', isDark ? 'opacity-100' : 'opacity-0')} />
        <Moon className={cn('h-3 w-3 transition-opacity', isDark ? 'opacity-0' : 'opacity-100')} />
      </span>
    </button>
  );
}