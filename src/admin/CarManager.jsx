import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/site'
import { Edit, Plus, Search, Trash } from '../components/Icons'
import CarImage from '../components/CarImage'
import Modal from '../components/Modal'
import { formatVND } from '../lib/format'
import { uniqueCarId } from '../lib/store'
import { PageHeader } from './AdminUI'

export default function CarManager() {
  const { cars, setCars, resetCars } = useApp()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return cars.filter((car) =>
      !term || [car.name, car.category, car.tagline]
        .some((value) => String(value || '').toLowerCase().includes(term)),
    )
  }, [cars, search])

  const save = (car, originalId) => {
    const next = originalId
      ? cars.map((item) => (item.id === originalId ? car : item))
      : [...cars, { ...car, id: uniqueCarId(car.name, cars) }]
    setCars(next)
    setEditing(null)
    setAdding(false)
  }

  const remove = (car) => {
    if (cars.length <= 1) {
      window.alert('Website cần ít nhất một dòng xe.')
      return
    }
    if (window.confirm(`Xoá “${car.name}” khỏi website?`)) {
      setCars(cars.filter((item) => item.id !== car.id))
    }
  }

  const reset = () => {
    if (window.confirm('Khôi phục toàn bộ 18 xe mặc định? Các chỉnh sửa hiện tại sẽ mất.')) {
      resetCars()
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Sản phẩm"
        title="Quản lý xe"
        description={`${cars.length} dòng xe đang hiển thị trên website.`}
        actions={(
          <>
            <button type="button" onClick={reset} className="btn-ghost px-4">Khôi phục mặc định</button>
            <button type="button" onClick={() => setAdding(true)} className="btn-primary px-4"><Plus size={17} /> Thêm xe</button>
          </>
        )}
      />

      <div className="relative mt-7 max-w-xl">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="field bg-white pl-10" placeholder="Tìm tên xe, phân khúc..." />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((car) => (
          <article key={car.id} className="overflow-hidden border border-line bg-white">
            <CarImage car={car} className="aspect-[16/9]" showBadge={false} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{car.category}</span>
                  <h2 className="mt-1 truncate text-lg font-extrabold">{car.name}</h2>
                </div>
                {car.badge && <span className="shrink-0 bg-ink-900 px-2 py-1 text-[10px] font-bold text-white">{car.badge}</span>}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-ink-400">Giá từ</div>
                  <div className="mt-0.5 font-extrabold text-kia-600">{formatVND(car.price)}</div>
                </div>
                <div className="text-right text-xs text-ink-500">{car.versions?.length || 0} phiên bản</div>
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                <button type="button" onClick={() => setEditing(car)} className="btn-ghost w-full"><Edit size={16} /> Chỉnh sửa</button>
                <button type="button" onClick={() => remove(car)} className="grid h-11 w-11 place-items-center border border-line text-ink-400 transition hover:border-red-500 hover:text-red-600" aria-label={`Xoá ${car.name}`}><Trash size={17} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!visible.length && <div className="mt-5 border border-line bg-white p-12 text-center text-sm text-ink-500">Không tìm thấy dòng xe phù hợp.</div>}

      <CarEditor
        open={adding || Boolean(editing)}
        car={editing}
        cars={cars}
        onClose={() => { setAdding(false); setEditing(null) }}
        onSave={save}
      />
    </div>
  )
}

const emptyCar = {
  image: '/images/cars/morning.webp',
  name: '',
  category: 'SUV',
  tagline: '',
  badge: 'Mới',
  price: 0,
  offer: 0,
  seats: 5,
  engine: 'Xăng',
  transmission: 'Tự động',
  versions: [],
  colors: [],
  specs: {},
}

const lines = {
  versions: (items = []) => items.map((item) => `${item.name} | ${item.price}`).join('\n'),
  colors: (items = []) => items.map((item) => `${item.name} | ${item.hex}`).join('\n'),
  specs: (items = {}) => Object.entries(items).map(([name, value]) => `${name} | ${value}`).join('\n'),
}

const parseLines = (value, mapper) => value
  .split('\n')
  .map((row) => row.trim())
  .filter(Boolean)
  .map((row) => mapper(row.split('|').map((part) => part.trim())))
  .filter(Boolean)

function CarEditor({ open, car, onClose, onSave }) {
  const [form, setForm] = useState(emptyCar)
  const [versionsText, setVersionsText] = useState('')
  const [colorsText, setColorsText] = useState('')
  const [specsText, setSpecsText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const next = car ? { ...emptyCar, ...car } : emptyCar
    setForm(next)
    setVersionsText(lines.versions(next.versions))
    setColorsText(lines.colors(next.colors))
    setSpecsText(lines.specs(next.specs))
    setError('')
  }, [open, car])

  const change = (event) => {
    const { name, value, type } = event.target
    setForm((old) => ({ ...old, [name]: type === 'number' ? Number(value) : value }))
  }

  const submit = (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) return setError('Vui lòng nhập tên xe.')
    if (!form.image.trim()) return setError('Vui lòng nhập đường dẫn ảnh.')
    if (Number(form.price) <= 0) return setError('Giá xe phải lớn hơn 0.')

    const versions = parseLines(versionsText, ([name, price]) =>
      name && Number(price) > 0 ? { name, price: Number(price) } : null,
    )
    const colors = parseLines(colorsText, ([name, hex]) =>
      name && hex ? { name, hex } : null,
    )
    const specs = Object.fromEntries(parseLines(specsText, ([name, value]) =>
      name && value ? [name, value] : null,
    ))

    onSave({
      ...form,
      name: form.name.trim(),
      image: form.image.trim(),
      versions: versions.length ? versions : [{ name: 'Tiêu chuẩn', price: Number(form.price) }],
      colors: colors.length ? colors : [{ name: 'Trắng', hex: '#f1f3f5' }],
      specs,
    }, car?.id)
  }

  return (
    <Modal open={open} onClose={onClose} title={car ? `Chỉnh sửa ${car.name}` : 'Thêm dòng xe'} size="xl">
      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên xe *" className="sm:col-span-2"><input name="name" value={form.name} onChange={change} className="field" autoFocus /></Field>
          <Field label="Phân khúc"><select name="category" value={form.category} onChange={change} className="field">{categories.filter((item) => item.id !== 'all').map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></Field>
          <Field label="Nhãn"><input name="badge" value={form.badge || ''} onChange={change} className="field" placeholder="Mới / Hot / Bán chạy" /></Field>
          <Field label="Giá niêm yết *"><input name="price" type="number" min="0" step="1000000" value={form.price} onChange={change} className="field" /></Field>
          <Field label="Ưu đãi"><input name="offer" type="number" min="0" step="1000000" value={form.offer} onChange={change} className="field" /></Field>
          <Field label="Số chỗ"><input name="seats" type="number" min="1" value={form.seats} onChange={change} className="field" /></Field>
          <Field label="Động cơ"><input name="engine" value={form.engine} onChange={change} className="field" /></Field>
          <Field label="Hộp số" className="sm:col-span-2"><input name="transmission" value={form.transmission} onChange={change} className="field" /></Field>
          <Field label="Mô tả ngắn" className="sm:col-span-2"><textarea name="tagline" value={form.tagline} onChange={change} className="field min-h-20 resize-y" /></Field>
          <Field label="Đường dẫn ảnh *" className="sm:col-span-2"><input name="image" value={form.image} onChange={change} className="field" placeholder="/images/cars/ten-xe.webp" /></Field>
        </div>

        <div className="space-y-4">
          <div className="border border-line bg-canvas p-3"><CarImage car={form} showBadge={false} className="aspect-[16/9]" /></div>
          <Field label="Phiên bản — mỗi dòng: Tên | Giá"><textarea value={versionsText} onChange={(event) => setVersionsText(event.target.value)} className="field min-h-24 resize-y font-mono text-xs" placeholder="Tiêu chuẩn | 500000000" /></Field>
          <Field label="Màu xe — mỗi dòng: Tên | Mã màu"><textarea value={colorsText} onChange={(event) => setColorsText(event.target.value)} className="field min-h-20 resize-y font-mono text-xs" placeholder="Trắng | #f1f3f5" /></Field>
          <Field label="Thông số — mỗi dòng: Tên | Giá trị"><textarea value={specsText} onChange={(event) => setSpecsText(event.target.value)} className="field min-h-28 resize-y font-mono text-xs" placeholder="Kích thước | 4500 × 1800 × 1650 mm" /></Field>
        </div>

        {error && <p role="alert" className="text-sm font-semibold text-red-600 lg:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-line pt-5 lg:col-span-2">
          <button type="button" onClick={onClose} className="btn-ghost px-5">Huỷ</button>
          <button type="submit" className="btn-primary px-5">Lưu dòng xe</button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, className = '', children }) {
  return <label className={className}><span className="label">{label}</span>{children}</label>
}
