import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { Car, Check, Phone, Users } from '../components/Icons'
import { LEAD_STATUSES } from '../lib/store'
import { PageHeader, StatusBadge, formatDateTime } from './AdminUI'

export default function Dashboard({ onNavigate, currentUser }) {
  const { leads, cars } = useApp()

  const todayCount = useMemo(() => {
    const today = new Date().toDateString()
    return leads.filter((lead) => new Date(lead.createdAt).toDateString() === today).length
  }, [leads])

  const newCount = leads.filter((lead) => (lead.status || 'moi') === 'moi').length
  const closedCount = leads.filter((lead) => lead.status === 'chot').length
  const statusStats = LEAD_STATUSES.map((status) => ({
    ...status,
    count: leads.filter((lead) => (lead.status || 'moi') === status.id).length,
  }))
  const maxStatus = Math.max(1, ...statusStats.map((item) => item.count))

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="Tổng quan kinh doanh"
        description="Theo dõi khách hàng tiềm năng và dữ liệu showroom lưu trên trình duyệt này."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng khách hàng" value={leads.length} icon={Users} />
        <StatCard label="Khách hôm nay" value={todayCount} icon={Phone} />
        <StatCard label="Chưa xử lý" value={newCount} icon={Users} accent />
        <StatCard label="Đã chốt" value={closedCount} icon={Check} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line p-5">
            <div>
              <h2 className="font-bold">Khách hàng mới nhất</h2>
              <p className="mt-1 text-xs text-ink-500">Tối đa 5 khách gần đây</p>
            </div>
            {currentUser.role !== 'editor' && (
              <button type="button" onClick={() => onNavigate('khach-hang')} className="text-sm font-bold text-kia-600 hover:underline">
                Xem tất cả
              </button>
            )}
          </div>
          {leads.length ? (
            <div className="divide-y divide-line">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5 sm:px-5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{lead.name}</div>
                    <a href={`tel:${lead.phone}`} className="mt-0.5 block text-xs text-ink-500 hover:text-ink-900">{lead.phone}</a>
                  </div>
                  <div className="text-xs text-ink-400">{formatDateTime(lead.createdAt)}</div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          ) : (
            <Empty text="Chưa có khách hàng nào." />
          )}
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <section className="border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Trạng thái lead</h2>
                <p className="mt-1 text-xs text-ink-500">Phân bổ hiện tại</p>
              </div>
              <Users size={21} className="text-ink-400" />
            </div>
            <div className="mt-5 space-y-4">
              {statusStats.map((item) => (
                <div key={item.id}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-semibold text-ink-600">{item.label}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                  <div className="h-2 bg-canvas">
                    <div className="h-full bg-ink-900" style={{ width: `${(item.count / maxStatus) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Danh mục xe</h2>
                <p className="mt-1 text-xs text-ink-500">Đang hiển thị trên website</p>
              </div>
              <Car size={21} className="text-ink-400" />
            </div>
            <div className="mt-5 text-4xl font-extrabold">{cars.length}</div>
            {currentUser.role !== 'sales' && (
              <button type="button" onClick={() => onNavigate('xe')} className="btn-ghost mt-5 w-full">
                Quản lý danh sách xe
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className={`border p-5 ${accent ? 'border-ink-900 bg-ink-900 text-white' : 'border-line bg-white'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-white/65' : 'text-ink-500'}`}>{label}</span>
        <Icon size={20} className={accent ? 'text-white/70' : 'text-ink-400'} />
      </div>
      <div className={`mt-4 text-3xl font-extrabold ${accent ? 'text-white' : 'text-ink-900'}`}>{value}</div>
    </div>
  )
}

function Empty({ text }) {
  return <div className="p-10 text-center text-sm text-ink-500">{text}</div>
}
