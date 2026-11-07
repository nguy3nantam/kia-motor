import { useEffect, useRef } from 'react'
import { Close } from './Icons'
import { cx } from '../lib/format'

/** Modal cơ bản: khoá cuộn, đóng bằng Esc / click nền */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  footer,
  centered = false,
  square = false,
}) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const dialog = dialogRef.current
    const focusable = () => Array.from(dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getClientRects().length > 0)
    if (!dialog.contains(document.activeElement)) {
      ;(dialog.querySelector('[autofocus]') || focusable()[0] || dialog).focus()
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
      } else if (event.key === 'Tab') {
        const elements = focusable()
        if (!elements.length) {
          event.preventDefault()
          dialog.focus()
        } else if (event.shiftKey && (document.activeElement === elements[0] || !dialog.contains(document.activeElement))) {
          event.preventDefault()
          elements[elements.length - 1].focus()
        } else if (!event.shiftKey && (document.activeElement === elements[elements.length - 1] || !dialog.contains(document.activeElement))) {
          event.preventDefault()
          elements[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-ink-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
    >
      <div
        className={cx(
          'relative w-full animate-pop-in bg-white shadow-[var(--shadow-lift)] rounded-none',
          sizes[size],
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-none bg-canvas text-ink-600 transition hover:bg-line hover:text-ink-900"
        >
          <Close size={18} />
        </button>

        {(title || subtitle) && (
          <div
            className={cx(
              'border-b border-line px-6 pb-4 pt-6 sm:px-8',
              centered && 'text-center',
            )}
          >
            {centered && (
              <img
                src="/images/brand/kia-logo-dark.webp"
                alt="Kia"
                className="mx-auto h-5 w-auto object-contain"
              />
            )}
            {title && (
              <h3 className={cx('text-xl font-bold', centered && 'pt-3')}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={cx(
                  'mt-1 text-sm text-ink-500',
                  centered && 'mx-auto max-w-sm',
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="px-6 py-6 sm:px-8">{children}</div>

        {footer && (
          <div className="border-t border-line px-6 py-4 sm:px-8">{footer}</div>
        )}
      </div>
    </div>
  )
}
