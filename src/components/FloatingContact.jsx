import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Chat, Close, Phone, Zalo } from './Icons'

/** Nút sticky liên hệ duy nhất — logo KIA, bấm xổ menu 3 kênh: Gọi / Zalo / Nhận tư vấn */
export default function FloatingContact() {
  const { openLead, site } = useApp()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      {/* Lớp nền trong suốt — bấm ra ngoài để đóng menu */}
      {open && <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />}

      <div
        className="fixed right-4 z-50 flex flex-col items-end gap-3"
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {open && (
          <div className="animate-fade-up overflow-hidden rounded-none border border-line bg-white shadow-[var(--shadow-lift)]">
            <a
              href={site.hotlineHref}
              onClick={close}
              className="flex items-center justify-center gap-3 border-b border-line px-4 py-3 transition hover:bg-canvas"
              aria-label={`Gọi hotline ${site.hotline}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center text-ink-900">
                <Phone size={20} />
              </span>
            </a>
            <a
              href={site.zaloHref}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="flex items-center justify-center gap-3 border-b border-line px-4 py-3 transition hover:bg-canvas"
              aria-label="Chat Zalo"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center text-ink-900">
                <Zalo size={20} />
              </span>
            </a>
            <button
              type="button"
              onClick={() => {
                close()
                openLead(null, 'tu-van')
              }}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 transition hover:bg-canvas"
              aria-label="Nhận tư vấn ngay"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center text-ink-900">
                <Chat size={20} />
              </span>
            </button>
          </div>
        )}

        <button
          type="button"
          aria-label={open ? 'Đóng liên hệ' : 'Liên hệ Kia Phú Mỹ Hưng'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid h-12 w-12 place-items-center rounded-lg bg-ink-900 text-white shadow-[0_10px_24px_-8px_rgba(5,20,31,0.55)] transition hover:-translate-y-0.5"
        >
          {open ? (
            <Close size={22} />
          ) : (
            <img
              src="/images/brand/kia-logo-footer.webp"
              alt="Kia"
              className="h-full w-full object-contain p-2"
            />
          )}
        </button>
      </div>
    </>
  )
}
