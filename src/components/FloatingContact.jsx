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
          <div className="animate-fade-up flex flex-col items-end gap-3">
            <a
              href={site.hotlineHref}
              onClick={close}
              className="grid h-12 w-12 place-items-center rounded-lg bg-ink-900 text-white shadow-[0_10px_24px_-8px_rgba(5,20,31,0.55)] transition hover:-translate-y-0.5"
              aria-label={`Gọi hotline ${site.hotline}`}
            >
              <Phone size={20} />
            </a>
            <a
              href={site.zaloHref}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="grid h-12 w-12 place-items-center rounded-lg bg-ink-900 text-white shadow-[0_10px_24px_-8px_rgba(5,20,31,0.55)] transition hover:-translate-y-0.5"
              aria-label="Chat Zalo"
            >
              <Zalo size={20} />
            </a>
            <button
              type="button"
              onClick={() => {
                close()
                openLead(null, 'tu-van')
              }}
              className="grid h-12 w-12 place-items-center rounded-lg bg-ink-900 text-white shadow-[0_10px_24px_-8px_rgba(5,20,31,0.55)] transition hover:-translate-y-0.5"
              aria-label="Nhận tư vấn ngay"
            >
              <Chat size={20} />
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
