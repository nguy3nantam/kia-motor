import { memo } from 'react'
import { cx } from '../lib/format'

/**
 * Ảnh xe trên nền xám sáng trung tính theo phong cách Kia Việt Nam.
 * Khi có ảnh thật, truyền `src` để thay thế.
 */

const THEME = { bg: 'from-[#f8f8f8] via-white to-[#eef0f1]', ink: '#05141f' }

const CarGlyph = memo(function CarGlyph({ color = '#334155', className }) {
  return (
    <svg
      viewBox="0 0 320 130"
      className={className}
      aria-hidden="true"
      style={{ color }}
    >
      <path
        fill="currentColor"
        opacity="0.92"
        d="M34 96c-8 0-14-6-14-14 0-3 .4-5.4 2-8 3.6-6 11-8.6 22-11.4 9-2.3 16-3.6 24-5.6 6-1.5 9-5 14-9 6-5 11-8 18-9.6 9-2 24-2.6 38-2.6 16 0 29 2 40 7 7.4 3.4 12.6 8 20 15 4 4 7 6 15 8 14 3.4 22 7 25 15 .8 2 .8 3.6.8 5 0 8-6 14-14 14h-18a26 26 0 0 0-52 0H108a26 26 0 0 0-52 0H34Z"
      />
      <circle cx="82" cy="96" r="17" fill="#0b1220" opacity="0.12" />
      <circle cx="212" cy="96" r="17" fill="#0b1220" opacity="0.12" />
      <circle cx="82" cy="96" r="15" fill="currentColor" opacity="0.35" />
      <circle cx="212" cy="96" r="15" fill="currentColor" opacity="0.35" />
      <circle cx="82" cy="96" r="7" fill="#fff" opacity="0.75" />
      <circle cx="212" cy="96" r="7" fill="#fff" opacity="0.75" />
      <path
        fill="#ffffff"
        opacity="0.35"
        d="M104 55c4-4 8-6 13-7 8-1.6 22-2 34-2 13 0 24 1.4 33 5 3 1.2 5 2.4 8 5H100c1-1 3-2 4-2Z"
      />
    </svg>
  )
})

const CarImage = memo(function CarImage({
  car,
  src,
  className,
  rounded = 'rounded-none',
  showBadge = true,
  priority = false,
}) {
  const imageSrc = src || car?.image

  return (
    <div
      className={cx(
        'relative isolate flex items-center justify-center overflow-hidden bg-gradient-to-br',
        THEME.bg,
        rounded,
        className,
      )}
    >
      {/* Vệt sáng rất nhẹ, giữ tổng thể đơn sắc */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/70 blur-2xl" />

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={car?.name}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="relative z-10 h-full w-full object-contain px-4 py-5 transition-transform duration-500 group-hover:scale-[1.035] sm:px-6"
        />
      ) : (
        <CarGlyph
          color={THEME.ink}
          className="relative z-10 w-[78%] max-w-[340px] drop-shadow-sm"
        />
      )}

      {showBadge && car?.category && (
        <span className="absolute left-3 top-3 z-20 rounded-none bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-700 backdrop-blur">
          {car.category}
        </span>
      )}
    </div>
  )
})

export default CarImage
