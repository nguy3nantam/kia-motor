import { useApp } from '../context/AppContext'
import { Facebook, Instagram, Mail, MapPin, Phone, YouTube } from './Icons'

export default function Footer() {
  const { site } = useApp()
  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_.7fr_.8fr]">
        <div>
          <img
            src="/images/brand/kia-logo-footer.webp"
            alt="Kia"
            width="154"
            height="37"
            className="h-auto w-28 object-contain"
          />
          <h2 className="mt-4 text-lg font-bold text-white">{site.name}</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">{site.about}</p>
          <div className="mt-5 flex gap-2">
            {[[site.social.facebook, Facebook, 'Facebook'], [site.social.youtube, YouTube, 'YouTube'], [site.social.instagram, Instagram, 'Instagram']].map(([href, Icon, label]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-none bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Liên kết nhanh</h3>
          <nav aria-label="Liên kết cuối trang" className="mt-2 grid">
            {site.nav.slice(0, 5).map((item) => <a key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-sm text-white/55 hover:text-white">{item.label}</a>)}
          </nav>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Liên hệ showroom</h3>
          <div className="mt-2 text-sm text-white/55">
            <a href={site.hotlineHref} className="flex min-h-11 items-center gap-2.5 hover:text-white"><Phone size={17} className="shrink-0" /> {site.hotline}</a>
            <a href={`mailto:${site.email}`} className="flex min-h-11 items-center gap-2.5 hover:text-white"><Mail size={17} className="shrink-0" /> {site.email}</a>
            <p className="flex gap-2.5"><MapPin size={17} className="mt-0.5 shrink-0" /> {site.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span>Website đại lý mẫu — dữ liệu giá và ưu đãi mang tính tham khảo.</span>
            <a href="/quan-tri" className="inline-flex min-h-11 items-center hover:text-white">Quản trị</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
