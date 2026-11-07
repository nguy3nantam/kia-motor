import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { categories } from '../data/site'
import { cx, formatVND } from '../lib/format'
import { ArrowRight, Sparkle } from './Icons'
import CarCard from './CarCard'
import { Section, SectionHeading } from './Section'

export default function CarCatalog() {
  const { cars, site } = useApp()
  const [active, setActive] = useState('all')
  const [sort, setSort] = useState('default')

  // Memoize catalog categories - only recompute when cars array reference changes
  const catalogCategories = useMemo(() => {
    const known = new Set(categories.map((category) => category.id))
    const extra = [...new Set(cars.map((car) => car.category))]
      .filter((category) => category && !known.has(category))
      .map((category) => ({ id: category, label: category }))
    return [...categories, ...extra]
  }, [cars])

  // Memoize category counts to avoid recalculating on every render
  const categoryCounts = useMemo(() => {
    const counts = new Map()
    cars.forEach((car) => {
      const cat = car.category
      counts.set(cat, (counts.get(cat) || 0) + 1)
    })
    return counts
  }, [cars])

  useEffect(() => {
    if (!catalogCategories.some((category) => category.id === active)) {
      setActive('all')
    }
  }, [active, catalogCategories])

  // Memoize visible cars with stable sorting
  const visible = useMemo(() => {
    let list = active === 'all' ? cars : cars.filter((c) => c.category === active)

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    }
    return list
  }, [active, sort, cars])

  return (
    <Section id="san-pham">
      <SectionHeading
        eyebrow="Sản phẩm"
        title="Chọn dòng xe Kia phù hợp với bạn"
        desc="Đầy đủ các phân khúc từ xe đô thị đến SUV, MPV và Hybrid. Nhận báo giá minh bạch, không phí ẩn."
        action={
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-500">
              Sắp xếp
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="min-h-11 rounded-none border border-line-strong bg-white px-3.5 py-2 text-sm font-semibold text-ink-800 focus:border-ink-900 focus:outline-none"
              >
                <option value="default">Nổi bật</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
              </select>
            </label>
          </div>
        }
      />

      {/* Bộ lọc phân khúc */}
      <div aria-label="Lọc dòng xe theo phân khúc" className="no-scrollbar mt-8 flex gap-5 overflow-x-auto border-b border-line">
        {catalogCategories.map((cat) => {
          const count = cat.id === 'all' ? cars.length : (categoryCounts.get(cat.id) || 0)
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              aria-pressed={isActive}
              className={cx(
                'inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold transition',
                isActive
                  ? 'border-ink-900 text-ink-900'
                  : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-900',
              )}
            >
              {cat.label}
              <span
                className={cx(
                  'text-xs font-semibold',
                  isActive ? 'text-ink-900' : 'text-ink-400',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Lưới xe */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-500">
          Chưa có xe phù hợp với bộ lọc này.
        </p>
      )}

      {/* CTA cuối danh mục */}
      <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-none bg-ink-900 p-7 text-white sm:flex-row sm:p-9">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-none bg-white/10">
            <Sparkle size={22} />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">
              Chưa biết chọn xe nào?
            </h3>
            <p className="mt-1 max-w-md text-sm text-white/70">
              Đội ngũ tư vấn của {''}
              <span className="font-semibold text-white">{site.name}</span>{' '}
              sẽ giúp bạn chọn đúng nhu cầu và ngân sách — miễn phí.
            </p>
          </div>
        </div>
        <GiveMeQuoteButton />
      </div>

      {cars.length > 0 && (
        <p className="mt-6 text-center text-xs text-ink-400">
          Giá từ {formatVND(Math.min(...cars.map((c) => c.price)))} — đã gồm VAT,
          chưa gồm phí lăn bánh.
        </p>
      )}
    </Section>
  )
}

function GiveMeQuoteButton() {
  return (
    <a
      href="#du-toan"
      className="btn inline-flex shrink-0 bg-white px-6 text-ink-900 hover:bg-white/90"
    >
      Dự toán chi phí lăn bánh <ArrowRight size={17} />
    </a>
  )
}
