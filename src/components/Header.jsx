import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { cx } from '../lib/format'
import {
  Calendar,
  ChevronRight,
  Close,
  Facebook,
  Menu,
  Phone,
  Zalo,
} from './Icons'

function Logo({ dark = false }) {
  const { site } = useApp()
  return (
    <a href="#top" className="flex items-center" aria-label={site.name}>
      <span className="flex h-9 w-[76px] shrink-0 items-center justify-center">
        <img
          src={dark
            ? '/images/brand/kia-logo-footer.webp'
            : '/images/brand/kia-logo-dark.webp'}
          alt="Kia"
          width="115"
          height="27"
          className="h-auto w-full object-contain"
        />
      </span>
    </a>
  )
}

export default function Header() {
  const { openLead, site } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Theo dõi section đang ở giữa màn hình để đánh dấu trong menu
  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1))
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Khi mở menu: tính lại mục đang xem (phòng khi chưa có scroll nào xảy ra)
  useEffect(() => {
    if (!open) return
    const ids = site.nav.map((n) => n.href.slice(1))
    let current = ''
    for (const id of ids) {
      const el = document.getElementById(id)
      // Ngưỡng 200px: bao gồm offset nhảy section (scroll-padding 80 + scroll-mt 96 = 176px)
      if (el && el.getBoundingClientRect().top <= 200) current = id
    }
    if (current) setActiveId(current)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      {/* Thanh điều hướng chính */}
      <div
        className={cx(
          'border-b transition-all duration-300',
          scrolled
            ? 'border-line bg-white/85 backdrop-blur-md'
            : 'border-transparent bg-white',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-none px-3.5 py-2 text-sm font-semibold text-ink-700 transition hover:bg-canvas hover:text-ink-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.hotlineHref}
              className="hidden items-center gap-2 rounded-none border border-line-strong px-3.5 py-2 text-sm font-semibold text-ink-800 transition hover:border-ink-900 md:inline-flex"
            >
              <Phone size={16} />
              {site.hotline}
            </a>
            <button
              type="button"
              onClick={() => openLead(null, 'lai-thu')}
              className="btn-primary hidden shadow-none sm:inline-flex"
            >
              <Calendar size={16} />
              Đăng ký lái thử
            </button>
            <button
              type="button"
              aria-label="Mở menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-none text-ink-900 transition hover:bg-canvas lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu di động (off-canvas) */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-[var(--shadow-lift)] animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex min-w-0 items-center gap-2">
                <Logo />
                <span className="whitespace-nowrap text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-900">
                  Phú Mỹ Hưng
                </span>
              </div>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-none bg-canvas text-ink-600 transition hover:bg-line"
              >
                <Close size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3">
              {site.nav.map((item) => {
                const isActive = activeId === item.href.slice(1)
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cx(
                      'flex items-center justify-between rounded-none px-4 py-4 text-base transition',
                      isActive
                        ? 'bg-ink-900 font-bold text-white'
                        : 'font-semibold text-ink-800 hover:bg-canvas',
                    )}
                  >
                    {item.label}
                    <ChevronRight
                      size={18}
                      className={isActive ? 'text-white/60' : 'text-ink-300'}
                    />
                  </a>
                )
              })}

            </nav>

            {/* Khối cuối menu — Zalo/Facebook liền với 2 nút CTA */}
            <div className="space-y-2.5 border-t border-line bg-canvas p-4">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={site.zaloHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost h-11 bg-white"
                >
                  <Zalo size={18} className="text-[#0068ff]" /> Zalo
                </a>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost h-11 bg-white"
                >
                  <Facebook size={18} /> Facebook
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openLead(null, 'lai-thu')
                }}
                className="btn-primary w-full py-4 text-base"
              >
                <Calendar size={18} /> Đăng ký lái thử
              </button>
              <a href={site.hotlineHref} className="btn-ghost w-full bg-white py-4 text-base">
                <Phone size={18} /> Gọi {site.hotline}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
