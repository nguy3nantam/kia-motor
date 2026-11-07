import { LEAD_STATUSES } from '../lib/store'

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-kia-600">
          {eyebrow}
        </div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function StatusBadge({ status = 'moi' }) {
  const item = LEAD_STATUSES.find((entry) => entry.id === status) || LEAD_STATUSES[0]
  const colors = {
    moi: 'bg-kia-50 text-kia-700',
    'da-goi': 'bg-blue-50 text-blue-700',
    'dang-tu-van': 'bg-amber-50 text-amber-700',
    chot: 'bg-emerald-50 text-emerald-700',
    huy: 'bg-ink-100 text-ink-500',
  }
  return (
    <span className={`inline-flex px-2.5 py-1 text-[11px] font-bold ${colors[item.id]}`}>
      {item.label}
    </span>
  )
}

export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('vi-VN')
}

export const intentLabel = (value) => ({
  'bao-gia': 'Nhận báo giá',
  'lai-thu': 'Đăng ký lái thử',
  'tu-van': 'Cần tư vấn',
}[value] || value || '—')
