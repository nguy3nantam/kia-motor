import { cx } from '../lib/format'

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'left',
  action,
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
      )}
    >
      <div className={cx('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <div className="mb-2.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-kia-600">
            <span className="h-px w-6 bg-kia-600" />
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-[2rem] sm:leading-tight">
          {title}
        </h2>
        {desc && (
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{desc}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function Section({ id, className, children, muted = false }) {
  return (
    <section
      id={id}
      className={cx(
        'scroll-mt-24 py-14 sm:py-20',
        muted && 'bg-canvas',
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}
