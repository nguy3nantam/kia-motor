import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Download, Phone, Plus, Search, Trash } from '../components/Icons'
import Modal from '../components/Modal'
import { isValidVNPhone } from '../lib/format'
import {
  downloadFile,
  LEAD_INTENTS,
  LEAD_STATUSES,
  leadsToCSV,
} from '../lib/store'
import { formatDateTime, intentLabel, PageHeader } from './AdminUI'

export default function LeadManager() {
  const { leads, cars, addLead, updateLead, removeLead, clearLeads } = useApp()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [intent, setIntent] = useState('all')
  const [carId, setCarId] = useState('all')
  const [adding, setAdding] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesSearch = !term || [lead.name, lead.phone, lead.note, lead.province]
        .some((value) => String(value || '').toLowerCase().includes(term))
      return matchesSearch &&
        (status === 'all' || (lead.status || 'moi') === status) &&
        (intent === 'all' || lead.intent === intent) &&
        (carId === 'all' || lead.carId === carId)
    })
  }, [leads, search, status, intent, carId])

  const exportCSV = () => {
    const date = new Date().toISOString().slice(0, 10)
    downloadFile(`kia-leads-${date}.csv`, leadsToCSV(filtered, cars), 'text/csv;charset=utf-8')
  }

  const remove = (lead) => {
    if (window.confirm(`Xoá khách hàng “${lead.name}”?`)) removeLead(lead.id)
  }

  const clear = () => {
    if (leads.length && window.confirm('Xoá toàn bộ khách hàng? Thao tác này không thể hoàn tác.')) {
      clearLeads()
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Bán hàng"
        title="Quản lý khách hàng"
        description={`${leads.length} khách được lưu trên trình duyệt này.`}
        actions={(
          <>
            <button type="button" onClick={exportCSV} disabled={!filtered.length} className="btn-ghost px-4">
              <Download size={17} /> Xuất CSV
            </button>
            <button type="button" onClick={() => setAdding(true)} className="btn-primary px-4">
              <Plus size={17} /> Thêm khách
            </button>
          </>
        )}
      />

      <section className="mt-7 border border-line bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <label className="relative">
            <span className="sr-only">Tìm khách hàng</span>
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field pl-10"
              placeholder="Tìm tên, SĐT, tỉnh thành..."
            />
          </label>
          <FilterSelect value={status} onChange={setStatus} label="Trạng thái">
            <option value="all">Tất cả trạng thái</option>
            {LEAD_STATUSES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </FilterSelect>
          <FilterSelect value={intent} onChange={setIntent} label="Nhu cầu">
            <option value="all">Tất cả nhu cầu</option>
            {LEAD_INTENTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </FilterSelect>
          <FilterSelect value={carId} onChange={setCarId} label="Dòng xe">
            <option value="all">Tất cả dòng xe</option>
            {cars.map((car) => <option key={car.id} value={car.id}>{car.name}</option>)}
          </FilterSelect>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
          <span>Hiển thị {filtered.length}/{leads.length} khách hàng</span>
          {leads.length > 0 && (
            <button type="button" onClick={clear} className="font-semibold text-red-600 hover:underline">Xoá tất cả</button>
          )}
        </div>
      </section>

      <div className="mt-5 space-y-3">
        {filtered.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            carName={cars.find((car) => car.id === lead.carId)?.name || lead.carId || '—'}
            onUpdate={(patch) => updateLead(lead.id, patch)}
            onRemove={() => remove(lead)}
          />
        ))}
        {!filtered.length && (
          <div className="border border-line bg-white p-12 text-center text-sm text-ink-500">
            {leads.length ? 'Không tìm thấy khách hàng phù hợp.' : 'Chưa có khách hàng. Lead từ website sẽ xuất hiện tại đây.'}
          </div>
        )}
      </div>

      <AddLeadModal
        open={adding}
        onClose={() => setAdding(false)}
        cars={cars}
        onAdd={addLead}
      />
    </div>
  )
}

function LeadRow({ lead, carName, onUpdate, onRemove }) {
  return (
    <article className="border border-line bg-white p-4 sm:p-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.8fr_.75fr_1.2fr_auto] xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold">{lead.name}</h2>
            <span className="bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-500">{intentLabel(lead.intent)}</span>
          </div>
          <a href={`tel:${lead.phone}`} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-kia-600 hover:underline">
            <Phone size={15} /> {lead.phone}
          </a>
          <div className="mt-2 text-xs text-ink-400">{formatDateTime(lead.createdAt)}</div>
        </div>

        <div className="text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Xe quan tâm</div>
          <div className="mt-1 font-semibold">{carName}</div>
          <div className="mt-1 text-xs text-ink-500">{lead.province || '—'}</div>
        </div>

        <label>
          <span className="label">Trạng thái</span>
          <select value={lead.status || 'moi'} onChange={(event) => onUpdate({ status: event.target.value })} className="field py-2.5">
            {LEAD_STATUSES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>

        <div>
          {lead.note && <p className="mb-2 text-xs leading-relaxed text-ink-500">Khách: {lead.note}</p>}
          <label className="label" htmlFor={`note-${lead.id}`}>Ghi chú nội bộ</label>
          <textarea
            id={`note-${lead.id}`}
            defaultValue={lead.adminNote || ''}
            onBlur={(event) => onUpdate({ adminNote: event.target.value })}
            className="field min-h-20 resize-y py-2.5"
            placeholder="Kết quả gọi, lịch hẹn..."
          />
        </div>

        <button type="button" onClick={onRemove} className="grid h-11 w-11 place-items-center border border-line text-ink-400 transition hover:border-red-500 hover:text-red-600" aria-label={`Xoá ${lead.name}`}>
          <Trash size={17} />
        </button>
      </div>
    </article>
  )
}

function FilterSelect({ value, onChange, label, children }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="field">
        {children}
      </select>
    </label>
  )
}

function AddLeadModal({ open, onClose, cars, onAdd }) {
  const initial = {
    name: '',
    phone: '',
    carId: cars[0]?.id || '',
    intent: 'bao-gia',
    province: 'TP. Hồ Chí Minh',
    note: '',
    status: 'moi',
  }
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  const change = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }))
  const close = () => {
    setForm(initial)
    setError('')
    onClose()
  }
  const submit = (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) return setError('Vui lòng nhập họ tên.')
    if (!isValidVNPhone(form.phone)) return setError('Số điện thoại chưa hợp lệ.')
    if (!form.carId) return setError('Vui lòng chọn dòng xe.')
    if (!onAdd({ ...form, createdAt: new Date().toISOString() })) {
      return setError('Không thể lưu khách hàng trên trình duyệt. Vui lòng kiểm tra dung lượng hoặc quyền lưu trữ.')
    }
    close()
  }

  return (
    <Modal open={open} onClose={close} title="Thêm khách hàng" size="lg">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Họ và tên *"><input name="name" value={form.name} onChange={change} className="field" autoFocus /></AdminField>
        <AdminField label="Số điện thoại *"><input name="phone" value={form.phone} onChange={change} className="field" inputMode="tel" /></AdminField>
        <AdminField label="Dòng xe *"><select name="carId" value={form.carId} onChange={change} className="field">{cars.map((car) => <option key={car.id} value={car.id}>{car.name}</option>)}</select></AdminField>
        <AdminField label="Nhu cầu"><select name="intent" value={form.intent} onChange={change} className="field">{LEAD_INTENTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></AdminField>
        <AdminField label="Tỉnh / Thành"><input name="province" value={form.province} onChange={change} className="field" /></AdminField>
        <AdminField label="Trạng thái"><select name="status" value={form.status} onChange={change} className="field">{LEAD_STATUSES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></AdminField>
        <AdminField label="Lời nhắn" className="sm:col-span-2"><textarea name="note" value={form.note} onChange={change} className="field min-h-24 resize-y" /></AdminField>
        {error && <p role="alert" className="text-sm font-semibold text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={close} className="btn-ghost px-5">Huỷ</button>
          <button type="submit" className="btn-primary px-5">Lưu khách hàng</button>
        </div>
      </form>
    </Modal>
  )
}

function AdminField({ label, className = '', children }) {
  return <label className={className}><span className="label">{label}</span>{children}</label>
}
