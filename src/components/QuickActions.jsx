import { useApp } from '../context/AppContext'
import { Calculator, Calendar, Phone, Route } from './Icons'

const baseItems = [
  {
    key: 'quote',
    label: 'Nhận báo giá',
    desc: 'Giá lăn bánh & ưu đãi mới nhất',
    icon: Calculator,
    accent: 'text-ink-900 bg-kia-100',
  },
  {
    key: 'test-drive',
    label: 'Đăng ký lái thử',
    desc: 'Trải nghiệm xe tại showroom',
    icon: Calendar,
    accent: 'text-ink-900 bg-kia-100',
  },
  {
    key: 'estimate',
    label: 'Dự toán lăn bánh',
    desc: 'Chi phí theo tỉnh/thành',
    icon: Route,
    href: '#du-toan',
    accent: 'text-ink-900 bg-kia-100',
  },
  {
    key: 'call',
    label: 'Hotline tư vấn',
    icon: Phone,
    accent: 'text-ink-900 bg-kia-100',
  },
]

export default function QuickActions() {
  const { openLead, site } = useApp()
  const items = baseItems.map((item) =>
    item.key === 'call' ? { ...item, desc: site.hotline } : item,
  )

  const handle = (key) => {
    if (key === 'quote') openLead(null, 'bao-gia')
    else if (key === 'test-drive') openLead(null, 'lai-thu')
  }

  return (
    <section aria-label="Tiện ích nhanh" className="border-b border-line bg-white">
      <div className="container-page grid grid-cols-1 py-2 min-[400px]:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          const inner = (
            <>
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-none ${item.accent}`}
              >
                <Icon size={21} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink-900">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs text-ink-500">
                  {item.desc}
                </span>
              </span>
            </>
          )

          const className =
            'group flex min-h-20 items-center gap-3 border-b border-line px-2 py-4 text-left transition-colors hover:bg-canvas min-[400px]:px-3 lg:border-b-0'

          return item.href ? (
            <a key={item.key} href={item.href} className={className}>
              {inner}
            </a>
          ) : item.key === 'call' ? (
            <a key={item.key} href={site.hotlineHref} className={className}>
              {inner}
            </a>
          ) : (
            <button
              key={item.key}
              type="button"
              onClick={() => handle(item.key)}
              className={className}
            >
              {inner}
            </button>
          )
        })}
      </div>
    </section>
  )
}
