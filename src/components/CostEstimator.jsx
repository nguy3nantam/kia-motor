import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { provinces } from '../data/site'
import { useApp } from '../context/AppContext'
import { cx, formatVND } from '../lib/format'
import { ArrowRight, Check, Calculator } from './Icons'
import { Section, SectionHeading } from './Section'

const FEE_ITEM_LABELS = {
  registration: 'Lệ phí trước bạ',
  plate: 'Phí đăng ký biển số',
  inspection: 'Phí đăng kiểm',
  roadUse: 'Phí bảo trì đường bộ (1 năm)',
  liability: 'Bảo hiểm TNDS bắt buộc',
  material: 'Bảo hiểm vật chất (tự nguyện)',
  service: 'Phí dịch vụ đăng ký',
}

const FIXED = {
  inspection: 340_000,
  roadUse: 1_560_000,
  liability: 480_700,
  service: 2_000_000,
}

const Row = memo(function Row({ label, value, strong, muted, checked }) {
  return (
    <div
      className={cx(
        'flex items-center justify-between gap-4 py-2.5',
        strong && 'border-t border-line pt-4',
      )}
    >
      <span
        className={cx(
          'flex items-center gap-2 text-sm',
          strong ? 'font-bold text-ink-900' : 'text-ink-600',
          muted && 'text-ink-400',
        )}
      >
        {checked && <Check size={15} className="text-ink-900" />}
        {label}
      </span>
      <span
        className={cx(
          'shrink-0 tabular-nums',
          strong
            ? 'text-lg font-extrabold text-kia-600'
            : 'text-sm font-semibold text-ink-900',
          muted && 'text-ink-400 line-through',
        )}
      >
        {value}
      </span>
    </div>
  )
})

export default function CostEstimator() {
  const { openLead, cars } = useApp()
  const preferredCar = useMemo(
    () => cars.find((item) => item.id === 'new-sportage') || cars[0],
    [cars]
  )
  const [carId, setCarId] = useState(preferredCar?.id || '')
  const car = useMemo(() => cars.find((c) => c.id === carId) ?? cars[0], [cars, carId])
  const [price, setPrice] = useState(car?.price || 0)
  const [provinceName, setProvinceName] = useState('TP. Hồ Chí Minh')
  const [opts, setOpts] = useState({ material: true, service: true })

  // Memoize province lookup
  const province = useMemo(
    () => provinces.find((p) => p.name === provinceName) ?? provinces[1],
    [provinceName]
  )

  useEffect(() => {
    if (!cars.some((item) => item.id === carId)) {
      setCarId(cars[0]?.id || '')
    }
  }, [cars, carId])

  useEffect(() => {
    if (car) setPrice(car.price)
  }, [carId, car?.price])

  const handleCar = useCallback((id) => {
    const next = cars.find((c) => c.id === id)
    setCarId(id)
    if (next) setPrice(next.price)
  }, [cars])

  const handleProvinceChange = useCallback((e) => {
    setProvinceName(e.target.value)
  }, [])

  const handlePriceChange = useCallback((e) => {
    setPrice(Number(e.target.value) || 0)
  }, [])

  const handleOptChange = useCallback((key) => (e) => {
    setOpts((s) => ({ ...s, [key]: e.target.checked }))
  }, [])

  // Memoize calculation - only recalculates when price, province, or opts change
  const calc = useMemo(() => {
    const registration = price * province.registrationRate
    const material = opts.material ? price * 0.015 : 0
    const service = opts.service ? FIXED.service : 0

    const items = [
      { key: 'registration', value: registration },
      { key: 'plate', value: province.plateFree },
      { key: 'inspection', value: FIXED.inspection },
      { key: 'roadUse', value: FIXED.roadUse },
      { key: 'liability', value: FIXED.liability },
    ]
    if (opts.material) items.push({ key: 'material', value: material })
    if (opts.service) items.push({ key: 'service', value: service })

    const fees = items.reduce((sum, i) => sum + i.value, 0)
    return { items, fees, total: price + fees }
  }, [price, province, opts])

  // Trả góp tham khảo: vay 70%, 8%/năm, 5 năm (dư nợ giảm dần - ước tính)
  const installment = useMemo(() => {
    const loan = calc.total * 0.7
    const months = 60
    const r = 0.08 / 12
    const monthly = (loan * r) / (1 - Math.pow(1 + r, -months))
    return { loan, monthly, down: calc.total * 0.3 }
  }, [calc.total])

  if (!car) {
    return (
      <Section id="du-toan" muted>
        <SectionHeading
          eyebrow="Công cụ bán hàng"
          title="Dự toán chi phí lăn bánh"
          desc="Vui lòng thêm ít nhất một dòng xe trong trang quản trị để sử dụng công cụ."
        />
      </Section>
    )
  }

  return (
    <Section id="du-toan" muted>
      <SectionHeading
        eyebrow="Công cụ bán hàng"
        title="Dự toán chi phí lăn bánh"
        desc="Chọn xe, phiên bản và tỉnh/thành để biết chính xác số tiền cần chuẩn bị khi nhận xe."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        {/* Bộ chọn */}
        <div className="card p-6 sm:p-7">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/images/brand/kia-logo-dark.webp"
              alt="Kia"
              className="h-7 w-auto object-contain"
            />
            <span className="text-lg font-extrabold text-ink-900">KIA Phú Mỹ Hưng</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ce-car">
                Dòng xe
              </label>
              <select
                id="ce-car"
                value={carId}
                onChange={(e) => handleCar(e.target.value)}
                className="field"
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="ce-province">
                Tỉnh / thành đăng ký
              </label>
              <select
                id="ce-province"
                value={provinceName}
                onChange={handleProvinceChange}
                className="field"
              >
                {provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="ce-price">
                Giá xe (đã gồm VAT)
              </label>
              <div className="relative">
                <input
                  id="ce-price"
                  type="number"
                  min={0}
                  step={10_000_000}
                  value={price}
                  onChange={handlePriceChange}
                  className="field pr-10 font-semibold tabular-nums"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">
                  đ
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-none bg-canvas p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Lệ phí trước bạ {province.name}
            </div>
            <div className="mt-1 text-sm text-ink-600">
              Áp dụng{' '}
              <span className="font-bold text-ink-900">
                {Math.round(province.registrationRate * 100)}%
              </span>{' '}
              — xe mới đăng ký lần đầu.
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {[
              { key: 'material', label: 'Bảo hiểm vật chất (~1,5% giá xe)' },
              { key: 'service', label: 'Phí dịch vụ đăng ký trọn gói' },
            ].map((o) => (
              <label
                key={o.key}
                className="flex cursor-pointer items-center gap-3 text-sm text-ink-700"
              >
                <input
                  type="checkbox"
                  checked={opts[o.key]}
                  onChange={handleOptChange(o.key)}
                  className="h-4.5 w-4.5 accent-kia-600"
                />
                {o.label}
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-none border border-line bg-white p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-none bg-kia-50 text-kia-600">
              <Calculator size={20} />
            </span>
            <p className="text-xs leading-relaxed text-ink-500">
              Kết quả mang tính tham khảo. Số tiền thực tế có thể thay đổi theo
              chính sách từng thời điểm. Liên hệ để nhận báo giá chính xác.
            </p>
          </div>
        </div>

        {/* Kết quả */}
        <div className="card flex flex-col overflow-hidden">
          <div className="border-b border-line bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white sm:p-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Tổng chi phí lăn bánh (ước tính)
            </div>
            <div className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {formatVND(calc.total)}
            </div>
            <div className="mt-2 text-sm text-white/70">
              {car.name} · {province.name}
            </div>
          </div>

          <div className="flex-1 p-6 sm:p-7">
            <Row label="Giá xe niêm yết" value={formatVND(price)} />
            <div className="mt-1 border-t border-dashed border-line pt-1">
              {calc.items.map((item) => (
                <Row
                  key={item.key}
                  label={FEE_ITEM_LABELS[item.key]}
                  value={formatVND(item.value)}
                />
              ))}
            </div>
            <Row
              label="Tổng phí lăn bánh"
              value={formatVND(calc.fees)}
            />
            <Row
              label="Tổng cộng"
              value={formatVND(calc.total)}
              strong
            />

            {/* Trả góp tham khảo */}
            <div className="mt-6 rounded-none bg-canvas p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Trả góp tham khảo (vay 70% · 8%/năm · 60 tháng)
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-ink-500">Trả trước (~30%)</div>
                  <div className="text-sm font-bold text-ink-900">
                    {formatVND(installment.down)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-500">Mỗi tháng từ</div>
                  <div className="text-sm font-bold text-kia-600">
                    {formatVND(installment.monthly)}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openLead(car.id, 'bao-gia')}
              className="btn-primary mt-5 w-full"
            >
              Nhận báo giá chi tiết <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </Section>
  )
}
