import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { isValidVNPhone } from '../lib/format'
import { Check, Shield } from './Icons'
import Modal from './Modal'

const initial = {
  name: '',
  phone: '',
  carId: '',
  province: 'TP. Hồ Chí Minh',
  note: '',
}

export default function LeadModal() {
  const { lead, closeLead, cars, addLead, site } = useApp()
  const [form, setForm] = useState(initial)
  const [intent, setIntent] = useState('bao-gia')
  const [error, setError] = useState({})
  const [done, setDone] = useState(false)
  const nameInputRef = useRef(null)

  // Focus management when modal opens
  useEffect(() => {
    if (lead.open && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [lead.open])

  useEffect(() => {
    if (!lead.open) return
    setIntent(lead.intent || 'bao-gia')
    setForm((old) => {
      const requested = cars.some((car) => car.id === lead.carId)
        ? lead.carId
        : null
      const current = cars.some((car) => car.id === old.carId)
        ? old.carId
        : null
      return { ...old, carId: requested || current || cars[0]?.id || '' }
    })
    setError({})
    setDone(false)
  }, [lead, cars])

  const change = (e) => {
    const { name, value } = e.target
    setForm((old) => ({ ...old, [name]: value }))
    setError((old) => ({ ...old, [name]: '' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Vui lòng nhập họ và tên.'
    if (!isValidVNPhone(form.phone)) next.phone = 'Số điện thoại chưa hợp lệ.'
    if (!form.carId) next.carId = 'Vui lòng chọn dòng xe.'
    if (Object.keys(next).length) return setError(next)

    const entry = { ...form, intent, createdAt: new Date().toISOString() }
    if (!addLead(entry)) {
      setError({ submit: 'Không thể lưu thông tin trên trình duyệt. Vui lòng liên hệ trực tiếp với showroom.' })
      return
    }
    setDone(true)
  }

  return (
    <Modal
      open={lead.open}
      onClose={closeLead}
      size="md"
      centered
      square
      title={done ? 'Đã lưu thông tin' : `Nhận tư vấn từ ${site.name}`}
      subtitle={done ? 'Thông tin chỉ được lưu trên trình duyệt này.' : undefined}
    >
      {done ? (
        <div className="py-5 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">
            <Check size={30} />
          </span>
          <h4 className="mt-5 text-xl">Cảm ơn {form.name}!</h4>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
            Thông tin chưa được gửi tới showroom. Vui lòng gọi <a className="font-bold text-kia-600 underline" href={site.hotlineHref}>{site.hotline}</a> để được tư vấn.
          </p>
          <button type="button" onClick={closeLead} className="btn-dark mt-6 px-8">Hoàn tất</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Họ và tên *" id="lead-name" error={error.name}>
              <input
                ref={nameInputRef}
                id="lead-name"
                name="name"
                value={form.name}
                onChange={change}
                className="field"
                placeholder="Nguyễn Văn An"
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!error.name}
                aria-describedby={error.name ? 'lead-name-error' : undefined}
              />
            </Field>
            <Field label="Số điện thoại *" id="lead-phone" error={error.phone}>
              <input
                id="lead-phone"
                name="phone"
                value={form.phone}
                onChange={change}
                className="field"
                placeholder="09xx xxx xxx"
                inputMode="tel"
                autoComplete="tel"
                aria-required="true"
                aria-invalid={!!error.phone}
                aria-describedby={error.phone ? 'lead-phone-error' : undefined}
              />
            </Field>
            <Field label="Dòng xe quan tâm *" id="lead-car" error={error.carId} className="sm:col-span-2">
              <select
                id="lead-car"
                name="carId"
                value={form.carId}
                onChange={change}
                className="field"
                disabled={!cars.length}
                aria-required="true"
                aria-invalid={!!error.carId}
                aria-describedby={error.carId ? 'lead-car-error' : undefined}
              >
                {!cars.length && <option value="">Chưa có xe</option>}
                {cars.map((car) => <option key={car.id} value={car.id}>{car.name}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="lead-note">Lời nhắn (không bắt buộc)</label>
              <textarea
                id="lead-note"
                name="note"
                value={form.note}
                onChange={change}
                className="field min-h-20 resize-none"
                placeholder="Ví dụ: Cần tư vấn trả góp 70%..."
              />
            </div>
          </div>

          {error.submit && <p role="alert" className="mt-4 text-sm text-red-600">{error.submit}</p>}
          <button type="submit" disabled={!cars.length} className="btn-primary mt-5 w-full py-3.5">Lưu thông tin tư vấn</button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-400">
            <Shield size={14} aria-hidden="true" /> Thông tin chỉ lưu trên trình duyệt này, chưa gửi tới showroom.
          </p>
        </form>
      )}
    </Modal>
  )
}

function Field({ label, id, error, className = '', children }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-kia-600" role="alert">{error}</p>}
    </div>
  )
}
