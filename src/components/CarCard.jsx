import { memo } from 'react'
import { useApp } from '../context/AppContext'
import { cx, formatTrieu, formatVND } from '../lib/format'
import { ArrowRight, Fuel, Gear, Users } from './Icons'
import CarImage from './CarImage'

const badgeStyles = {
  Hot: 'bg-kia-600 text-white',
  Mới: 'bg-ink-900 text-white',
  'Bán chạy': 'bg-ink-700 text-white',
}

const CarCard = memo(function CarCard({ car }) {
  const { openLead, openDetail } = useApp()

  const specs = [
    { icon: Fuel, text: car.engine },
    { icon: Gear, text: car.transmission },
    { icon: Users, text: `${car.seats} chỗ` },
  ]

  return (
    <article className="group flex flex-col overflow-hidden border border-line bg-white transition-colors duration-300 hover:border-line-strong">
      <div className="relative">
        <button
          type="button"
          onClick={() => openDetail(car.id)}
          className="block w-full text-left"
          aria-label={`Xem chi tiết ${car.name} · ${car.category}`}
        >
          <CarImage
            car={car}
            rounded="rounded-none"
            className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>

        {car.badge && (
          <span
            className={cx(
              'absolute right-3 top-3 z-20 rounded-none px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm',
              badgeStyles[car.badge] || 'bg-ink-900 text-white',
            )}
          >
            {car.badge}
          </span>
        )}

        {car.offer > 0 && (
          <span className="absolute bottom-3 left-3 z-20 rounded-none bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-kia-700 backdrop-blur">
            Ưu đãi đến {formatTrieu(car.offer)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug">{car.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500">{car.tagline}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-line py-3">
          {specs.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-1.5 text-center">
              <Icon size={17} className="text-ink-400" />
              <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-ink-600">
                {text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Giá từ
            </div>
            <div className="text-xl font-extrabold text-kia-600">
              {formatVND(car.price)}
            </div>
          </div>
          <div className="text-right text-[11px] leading-tight text-ink-400">
            {car.versions.length} phiên bản
            <br />
            5–7 năm bảo hành
          </div>
        </div>

        <div className="mt-5 grid gap-2 min-[400px]:grid-cols-2">
          <button
            type="button"
            onClick={() => openLead(car.id, 'bao-gia')}
            className="btn-primary px-3"
          >
            Nhận báo giá
          </button>
          <button
            type="button"
            onClick={() => openDetail(car.id)}
            className="btn-ghost px-3"
            aria-label={`Tìm hiểu thêm ${car.name}`}
          >
            Tìm hiểu thêm
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  )
})

export default CarCard
