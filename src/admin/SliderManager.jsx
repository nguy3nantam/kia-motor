import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Edit, Plus, Sparkle, Trash } from '../components/Icons'
import CarImage from '../components/CarImage'
import Modal from '../components/Modal'
import { formatTrieu } from '../lib/format'
import { PageHeader } from './AdminUI'

const newId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export default function SliderManager() {
  const { slides, setSlides, resetSlides, cars } = useApp()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const save = (slide, originalId) => {
    const next = originalId
      ? slides.map((item) => (item.id === originalId ? slide : item))
      : [...slides, { ...slide, id: newId() }]
    setSlides(next)
    setEditing(null)
    setAdding(false)
  }

  const remove = (slide) => {
    if (slides.length <= 1) {
      window.alert('Slider cần ít nhất một slide.')
      return
    }
    if (window.confirm(`Xoá slide “${slide.title}”?`)) {
      setSlides(slides.filter((item) => item.id !== slide.id))
    }
  }

  const move = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= slides.length) return
    const next = [...slides]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSlides(next)
  }

  const toggle = (slide) => {
    const activeCount = slides.filter((item) => item.active !== false).length
    if (slide.active !== false && activeCount <= 1) {
      window.alert('Cần ít nhất một slide đang hiển thị.')
      return
    }
    setSlides(slides.map((item) =>
      item.id === slide.id ? { ...item, active: item.active === false } : item,
    ))
  }

  const reset = () => {
    if (window.confirm('Khôi phục 3 slide mặc định?')) resetSlides()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Trang chủ"
        title="Tùy chỉnh Slider Home"
        description="Quản lý nội dung, ảnh, xe liên kết và thứ tự hiển thị ở đầu trang chủ."
        actions={(
          <>
            <button type="button" onClick={reset} className="btn-ghost px-4">Khôi phục mặc định</button>
            <button type="button" onClick={() => setAdding(true)} className="btn-primary px-4"><Plus size={17} /> Thêm slide</button>
          </>
        )}
      />

      <div className="mt-7 space-y-4">
        {slides.map((slide, index) => {
          const car = cars.find((item) => item.id === slide.carId) || cars[0]
          return (
            <article key={slide.id} className={`grid overflow-hidden border bg-white lg:grid-cols-[320px_1fr_auto] ${slide.active === false ? 'border-line opacity-65' : 'border-line-strong'}`}>
              <CarImage car={car} src={slide.image || undefined} showBadge={false} className="aspect-[16/8] lg:h-full lg:min-h-44" />
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-kia-600">{slide.eyebrow}</span>
                  <span className={`px-2 py-1 text-[10px] font-bold ${slide.active === false ? 'bg-ink-100 text-ink-500' : 'bg-emerald-50 text-emerald-700'}`}>
                    {slide.active === false ? 'Đang ẩn' : 'Đang hiển thị'}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-extrabold">{slide.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{slide.desc}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-500">
                  <span>Xe: <strong className="text-ink-800">{car?.name || 'Không tồn tại'}</strong></span>
                  <span>{slide.highlight}</span>
                </div>
              </div>
              <div className="flex border-t border-line lg:w-36 lg:flex-col lg:border-l lg:border-t-0">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="h-12 flex-1 border-r border-line text-sm font-bold disabled:opacity-25 lg:border-b lg:border-r-0" aria-label="Đưa slide lên">↑ Lên</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === slides.length - 1} className="h-12 flex-1 border-r border-line text-sm font-bold disabled:opacity-25 lg:border-b lg:border-r-0" aria-label="Đưa slide xuống">↓ Xuống</button>
                <button type="button" onClick={() => toggle(slide)} className="h-12 flex-1 border-r border-line text-xs font-bold lg:border-b lg:border-r-0">{slide.active === false ? 'Hiện' : 'Ẩn'}</button>
                <button type="button" onClick={() => setEditing(slide)} className="grid h-12 flex-1 place-items-center border-r border-line lg:border-b lg:border-r-0" aria-label={`Sửa ${slide.title}`}><Edit size={17} /></button>
                <button type="button" onClick={() => remove(slide)} className="grid h-12 flex-1 place-items-center text-ink-400 hover:text-red-600" aria-label={`Xoá ${slide.title}`}><Trash size={17} /></button>
              </div>
            </article>
          )
        })}
      </div>

      <SlideEditor
        open={adding || Boolean(editing)}
        slide={editing}
        cars={cars}
        onClose={() => { setAdding(false); setEditing(null) }}
        onSave={save}
      />
    </div>
  )
}

function makeEmpty(cars) {
  const car = cars[0]
  return {
    carId: car?.id || '',
    eyebrow: 'Ưu đãi tháng này',
    title: car?.name || 'Xe Kia nổi bật',
    desc: car?.tagline || '',
    highlight: car?.offer > 0 ? `Ưu đãi lên đến ${formatTrieu(car.offer)}` : 'Liên hệ nhận ưu đãi',
    image: '',
    active: true,
  }
}

function SlideEditor({ open, slide, cars, onClose, onSave }) {
  const [form, setForm] = useState(() => makeEmpty(cars))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setForm(slide ? { ...slide } : makeEmpty(cars))
    setError('')
  }, [open, slide, cars])

  const car = cars.find((item) => item.id === form.carId) || cars[0]
  const change = (event) => {
    const { name, value, type, checked } = event.target
    setForm((old) => ({ ...old, [name]: type === 'checkbox' ? checked : value }))
  }
  const changeCar = (event) => {
    const next = cars.find((item) => item.id === event.target.value)
    setForm((old) => ({
      ...old,
      carId: event.target.value,
      ...(!slide && next ? {
        title: next.name,
        desc: next.tagline,
        highlight: next.offer > 0 ? `Ưu đãi lên đến ${formatTrieu(next.offer)}` : 'Liên hệ nhận ưu đãi',
      } : {}),
    }))
  }
  const submit = (event) => {
    event.preventDefault()
    if (!form.carId) return setError('Vui lòng chọn xe liên kết.')
    if (form.title.trim().length < 2) return setError('Vui lòng nhập tiêu đề slide.')
    if (form.desc.trim().length < 5) return setError('Vui lòng nhập mô tả slide.')
    onSave({ ...form, title: form.title.trim(), desc: form.desc.trim() }, slide?.id)
  }

  return (
    <Modal open={open} onClose={onClose} title={slide ? `Chỉnh sửa ${slide.title}` : 'Thêm slide trang chủ'} size="xl">
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <div className="grid gap-4">
          <Field label="Xe liên kết *"><select name="carId" value={form.carId} onChange={changeCar} className="field">{cars.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
          <Field label="Dòng nhãn nhỏ"><input name="eyebrow" value={form.eyebrow} onChange={change} className="field" placeholder="Ưu đãi tháng này" /></Field>
          <Field label="Tiêu đề *"><input name="title" value={form.title} onChange={change} className="field" /></Field>
          <Field label="Mô tả *"><textarea name="desc" value={form.desc} onChange={change} className="field min-h-24 resize-y" /></Field>
          <Field label="Thông tin nổi bật"><input name="highlight" value={form.highlight} onChange={change} className="field" placeholder="Ưu đãi lên đến 20 triệu" /></Field>
          <Field label="Ảnh riêng (không bắt buộc)"><input name="image" value={form.image || ''} onChange={change} className="field" placeholder="/images/cars/ten-xe.webp" /><span className="mt-1 block text-xs text-ink-400">Để trống sẽ dùng ảnh của xe đã chọn.</span></Field>
          <label className="flex items-center gap-3 text-sm font-semibold text-ink-700"><input name="active" type="checkbox" checked={form.active !== false} onChange={change} className="h-5 w-5 accent-kia-600" /> Hiển thị slide trên trang chủ</label>
        </div>

        <div>
          <div className="border border-line bg-canvas p-3">
            <CarImage car={car} src={form.image || undefined} showBadge={false} className="aspect-[4/3]" />
          </div>
          <div className="border-x border-b border-line bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-kia-600">{form.eyebrow || 'Nhãn slide'}</div>
            <div className="mt-2 text-2xl font-extrabold">{form.title || 'Tiêu đề slide'}</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{form.desc || 'Mô tả slide sẽ hiển thị tại đây.'}</p>
            <div className="mt-3 text-xs font-bold text-ink-700">{form.highlight}</div>
          </div>
        </div>

        {error && <p role="alert" className="text-sm font-semibold text-red-600 lg:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-line pt-5 lg:col-span-2">
          <button type="button" onClick={onClose} className="btn-ghost px-5">Huỷ</button>
          <button type="submit" className="btn-primary px-5"><Sparkle size={16} /> Lưu slide</button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, children }) {
  return <label><span className="label">{label}</span>{children}</label>
}
