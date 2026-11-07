import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { cx, formatTrieu } from '../lib/format'
import { ChevronLeft, ChevronRight, Sparkle } from './Icons'
import CarImage from './CarImage'

export default function Hero() {
  const { openLead, openDetail, cars, slides: homeSlides } = useApp()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const slides = useMemo(() => {
    const configured = homeSlides.filter((slide) => slide.active !== false).map((slide) => ({
      ...slide,
      car: cars.find((car) => car.id === slide.carId),
    })).filter((slide) => slide.car)

    if (configured.length) return configured
    return cars.slice(0, 3).map((car) => ({
      carId: car.id,
      car,
      eyebrow: 'Xe Kia nổi bật',
      title: car.name,
      desc: car.tagline,
      highlight: car.offer > 0
        ? `Ưu đãi lên đến ${formatTrieu(car.offer)}`
        : 'Liên hệ nhận ưu đãi',
    }))
  }, [cars, homeSlides])

  useEffect(() => {
    if (
      slides.length <= 1 ||
      paused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return undefined
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(t)
  }, [slides.length, paused])

  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [index, slides.length])

  const go = (dir) =>
    setIndex((i) => (i + dir + slides.length) % slides.length)

  const slide = slides[index] || slides[0]
  const car = slide?.car

  if (!car) return null

  return (
    <section
      id="top"
      aria-label="Xe Kia nổi bật"
      className="relative overflow-hidden bg-canvas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="container-page">
        <div className="relative">
          <div className="grid items-center gap-2 pb-4 pt-5 sm:gap-6 sm:py-10 lg:min-h-[480px] lg:grid-cols-[.8fr_1.2fr] lg:py-12">
            <div key={index} className="order-2 animate-fade-up lg:order-1">
              <span className="chip bg-ink-900 text-white">
                <Sparkle size={14} /> {slide.eyebrow}
              </span>

              <h1 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-[3.5rem]">
                {slide.title}
              </h1>

              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-500 sm:text-base">
                {slide.desc}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Giá từ
                  </div>
                  <div className="text-2xl font-extrabold text-ink-900">
                    {formatTrieu(car.price)}
                    <span className="ml-1 text-sm font-semibold text-ink-400">
                      VNĐ
                    </span>
                  </div>
                </div>
                <span className="chip bg-kia-50 text-kia-700">
                  {slide.highlight}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openLead(car.id, 'bao-gia')}
                  className="btn-primary rounded-none px-6"
                >
                  Nhận báo giá ngay
                </button>
                <button
                  type="button"
                  onClick={() => openDetail(car.id)}
                  className="btn-ghost rounded-none px-6"
                >
                  Khám phá xe
                </button>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <CarImage
                car={car}
                src={slide.image || undefined}
                rounded="rounded-none"
                className="aspect-[16/9] w-full lg:aspect-[4/3]"
                showBadge={false}
                priority
              />
            </div>
          </div>

          {/* Điều hướng slider */}
          <div className="relative flex items-center justify-between border-t border-line py-4">
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id || s.carId}
                  type="button"
                  aria-label={`Chuyển tới ${s.title}`}
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? 'true' : undefined}
                  className="grid h-11 w-11 place-items-center rounded-none"
                >
                  <span
                    className={cx(
                      'block h-1.5 rounded-none transition-all',
                      i === index
                        ? 'w-5 bg-ink-900'
                        : 'w-2.5 bg-line-strong hover:bg-ink-300',
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Trước"
                onClick={() => go(-1)}
                className="grid h-11 w-11 place-items-center rounded-none border border-line-strong bg-white/70 text-ink-700 backdrop-blur transition hover:border-ink-900 hover:text-ink-900"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Sau"
                onClick={() => go(1)}
                className="grid h-11 w-11 place-items-center rounded-none border border-line-strong bg-white/70 text-ink-700 backdrop-blur transition hover:border-ink-900 hover:text-ink-900"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
