export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-3xl font-semibold text-safa-palm md:text-4xl">{title}</h1>
        {subtitle ? <div className="mt-2 max-w-2xl text-sm leading-relaxed text-safa-ink/60">{subtitle}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}