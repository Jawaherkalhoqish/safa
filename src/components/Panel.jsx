import { cn } from '@/lib/utils';

export default function Panel({ title, subtitle, action, children, className, bodyClassName, icon: Icon }) {
  return (
    <section
      className={cn(
        'panel overflow-hidden transition-shadow duration-300 hover:border-safa-sand/70 hover:shadow-[0_22px_42px_-30px_rgba(30,58,47,0.55)]',
        className
      )}
    >
      {title || action ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-safa-line/70 px-5 py-4">
          <div className="flex items-start gap-3">
            {Icon ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-safa-line bg-safa-mist text-safa-palm">
                <Icon className="h-4 w-4" />
              </span>
            ) : null}
            <div>
              {title ? <h2 className="text-base font-semibold text-safa-palm">{title}</h2> : null}
              {subtitle ? <p className="mt-0.5 text-xs text-safa-ink/55">{subtitle}</p> : null}
            </div>
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}