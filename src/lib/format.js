/** Định dạng & tiện ích dùng chung */

// Cache Intl.NumberFormat instances để tránh tạo mới mỗi lần gọi
const vndFormatter = new Intl.NumberFormat('vi-VN')
const trieuFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })

export const formatVND = (value) =>
  `${vndFormatter.format(Math.round(Number(value) || 0))}đ`

/** 769000000 -> "769 triệu" */
export const formatTrieu = (value) => {
  const trieu = Number(value) / 1_000_000
  return `${trieuFormatter.format(trieu)} triệu`
}

/** Rút gọn số điện thoại để hiển thị/so sánh */
const onlyDigits = (value = '') => String(value).replace(/\D/g, '')

/** Kiểm tra SĐT Việt Nam (di động & cố định phổ biến) */
export const isValidVNPhone = (value) => {
  const digits = onlyDigits(value)
  return /^(0|\+?84)(\d{9,10})$/.test(digits) || /^0\d{9}$/.test(digits)
}

export const cx = (...classes) => classes.filter(Boolean).join(' ')
