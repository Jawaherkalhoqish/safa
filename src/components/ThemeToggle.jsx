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
  const { L } = useLang();
  const onDark = tone === 'onDark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={L('تبديل الوضع الفاتح والداكن', 'Toggle light and dark mode')}
      title={isDark ? L('الوضع الفاتح', 'Light mode') : L('الوضع الداكن', 'Dark mode')}
      className={cn(
        'group relative flex h-8 w-[62px] items-center rounded-full border px-1 transition-colors duration-300',
        onDark
          ? 'border-white/25 bg-white/10 hover:bg-white/15'
          : 'border-safa-line bg-safa-mist hover:border-safa-sand',
        className
      )}
    >
      <span
        className={cn(
          'absolute flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 ease-out',
          isDark ? 'translate-x-[30px] rtl:-translate-x-[30px]' : 'translate-x-0',
          onDark ? 'bg-safa-gold text-safa-palmDeep' : 'bg-safa-palm text-safa-bone'
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <span className={cn('mx-1 flex flex-1 justify-between', onDark ? 'text-safa-bone/45' : 'text-safa-earth/70')}>
        <Sun className={cn('h-3 w-3', !isDark && 'opacity-0')} />
        <Moon className={cn('h-3 w-3', isDark && 'opacity-0')} />
      </span>
    </button>
  );
}