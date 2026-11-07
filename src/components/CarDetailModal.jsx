import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatVND } from '../lib/format'
import { Calculator, Fuel, Gear, Users } from './Icons'
import CarImage from './CarImage'
import Modal from './Modal'

export default function CarDetailModal() {
  const { detailId, closeDetail, openLead, cars } = useApp()
  const car = cars.find((c) => c.id === detailId)
  const [versionIndex, setVersionIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)

  if (!car) return null

  const versions = car.versions?.length ? car.versions : [{ name: 'Tiêu chuẩn', price: car.price }]
  const colors = car.colors?.length ? car.colors : [{ name: 'Trắng', hex: '#f1f3f5' }]
  const version = versions[Math.min(versionIndex, versions.length - 1)]
  const color = colors[Math.min(colorIndex, colors.length - 1)]

  const specs = Object.entries(car.specs || {})

  return (
    <Modal open={Boolean(detailId)} onClose={closeDetail} size="xl" title={car.name} subtitle={car.tagline}>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <CarImage car={car} className="aspect-[16/10] w-full" showBadge={false} />
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-500">Màu: {color.name}</span>
            <div className="flex gap-2">
              {colors.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setColorIndex(index)}
                  aria-label={`Màu ${item.name}`}
                  title={item.name}
                  className={`h-7 w-7 rounded-none border-2 p-0.5 ${index === colorIndex ? 'border-ink-900' : 'border-transparent'}`}
                >
                  <span className="block h-full w-full rounded-none border border-black/10" style={{ background: item.hex }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-2">
            {[
              [Fuel, car.engine],
              [Gear, car.transmission],
              [Users, `${car.seats} chỗ`],
            ].map(([Icon, text]) => (
              <div key={text} className="rounded-none bg-canvas p-3 text-center">
                <Icon size={19} className="mx-auto text-ink-400" />
                <div className="mt-1.5 text-[11px] font-semibold leading-tight text-ink-600">{text}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label className="label">Phiên bản</label>
            <div className="grid gap-2">
              {versions.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setVersionIndex(index)}
                  className={`flex items-center justify-between rounded-none border px-4 py-3 text-left transition ${index === versionIndex ? 'border-ink-900 bg-ink-900 text-white' : 'border-line-strong hover:border-ink-900'}`}
                >
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-sm font-bold">{formatVND(item.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-xs text-ink-400">Giá phiên bản đã chọn</div>
              <div className="mt-1 text-2xl font-extrabold text-kia-600">{formatVND(version.price)}</div>
            </div>
            {car.offer > 0 && <span className="chip bg-kia-50 text-kia-700">Ưu đãi {formatVND(car.offer)}</span>}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => { closeDetail(); openLead(car.id, 'bao-gia') }}
              className="btn-primary w-full"
            >
              <Calculator size={17} /> Nhận báo giá
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-base">Thông số chính</h4>
        <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
          {specs.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
              <span className="text-ink-500">{label}</span>
              <span className="text-right font-semibold text-ink-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
