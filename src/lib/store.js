/** Tầng lưu trữ dùng chung cho website và trang quản trị. */

export const STORAGE_KEYS = {
  cars: 'kia-cars',
  site: 'kia-site',
  leads: 'kia-leads',
  slides: 'kia-slides',
  password: 'kia-admin-password',
  session: 'kia-admin-session',
  users: 'kia-admin-users',
}

export const USER_ROLES = [
  { id: 'admin', label: 'Quản trị viên' },
  { id: 'sales', label: 'Nhân viên bán hàng' },
  { id: 'editor', label: 'Biên tập nội dung' },
]

export const LEAD_STATUSES = [
  { id: 'moi', label: 'Mới' },
  { id: 'da-goi', label: 'Đã gọi' },
  { id: 'dang-tu-van', label: 'Đang tư vấn' },
  { id: 'chot', label: 'Đã chốt' },
  { id: 'huy', label: 'Huỷ' },
]

export const LEAD_INTENTS = [
  { id: 'bao-gia', label: 'Nhận báo giá' },
  { id: 'lai-thu', label: 'Đăng ký lái thử' },
  { id: 'tu-van', label: 'Cần tư vấn' },
]

export function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStored(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Trình duyệt chặn localStorage không làm sập ứng dụng.
  }
}

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export function normalizeLead(lead, index = 0) {
  const createdAt = lead.createdAt || new Date().toISOString()
  return {
    status: 'moi',
    adminNote: '',
    ...lead,
    id: lead.id || `${createdAt}-${index}`,
    createdAt,
  }
}

export function loadLeads() {
  const leads = readJSON(STORAGE_KEYS.leads, [])
  return Array.isArray(leads) ? leads.map(normalizeLead) : []
}

export function createLead(entry) {
  return normalizeLead({ ...entry, id: makeId() })
}

export function saveLead(entry) {
  const leads = [createLead(entry), ...loadLeads()].slice(0, 500)
  return writeJSON(STORAGE_KEYS.leads, leads) ? leads : null
}

export function loadCars(fallback) {
  const cars = readJSON(STORAGE_KEYS.cars, null)
  return Array.isArray(cars) && cars.length ? cars : fallback
}

export function loadSite(fallback) {
  const saved = readJSON(STORAGE_KEYS.site, null)
  if (!saved || typeof saved !== 'object') return fallback
  return {
    ...fallback,
    ...saved,
    social: { ...fallback.social, ...saved.social },
    nav: fallback.nav,
  }
}

export function loadSlides(fallback) {
  const slides = readJSON(STORAGE_KEYS.slides, null)
  return Array.isArray(slides) && slides.length ? slides : fallback
}

export function slugify(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function uniqueCarId(name, cars) {
  const root = slugify(name) || 'xe-moi'
  let id = root
  let suffix = 2
  while (cars.some((car) => car.id === id)) id = `${root}-${suffix++}`
  return id
}

/** Hash nhẹ cho lớp khoá giao diện; đây không phải cơ chế bảo mật phía server. */
export function hashPassword(value = '') {
  let hash = 5381
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(16)
}

export function loadUsers(defaultPassword) {
  const saved = readJSON(STORAGE_KEYS.users, null)
  if (Array.isArray(saved) && saved.length) return saved
  const legacyHash = readJSON(STORAGE_KEYS.password, null)
  return [{
    id: 'admin-default',
    username: 'admin',
    name: 'Quản trị viên',
    role: 'admin',
    active: true,
    passwordHash: legacyHash || hashPassword(defaultPassword),
    createdAt: new Date().toISOString(),
    lastLogin: null,
  }]
}

export function verifyUser(user, password) {
  return Boolean(user?.active && user.passwordHash === hashPassword(password))
}

export function startAdminSession(userId) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId }))
  } catch {
    // Bỏ qua nếu sessionStorage bị chặn.
  }
}

export function getAdminSession() {
  try {
    const value = sessionStorage.getItem(STORAGE_KEYS.session)
    if (!value || value === 'active') return null
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function endAdminSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.session)
  } catch {
    // Bỏ qua nếu sessionStorage bị chặn.
  }
}

export function downloadFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const csvCell = (value = '') => `"${String(value).replace(/"/g, '""')}"`

export function leadsToCSV(leads, cars) {
  const carName = (id) => cars.find((car) => car.id === id)?.name || id || ''
  const intentName = (id) =>
    LEAD_INTENTS.find((intent) => intent.id === id)?.label || id || ''
  const statusName = (id) =>
    LEAD_STATUSES.find((status) => status.id === id)?.label || 'Mới'
  const rows = leads.map((lead) => [
    new Date(lead.createdAt).toLocaleString('vi-VN'),
    lead.name,
    lead.phone,
    carName(lead.carId),
    intentName(lead.intent),
    lead.province,
    statusName(lead.status),
    lead.note,
    lead.adminNote,
  ])
  const header = [
    'Thời gian',
    'Họ tên',
    'Số điện thoại',
    'Dòng xe',
    'Nhu cầu',
    'Tỉnh/Thành',
    'Trạng thái',
    'Lời nhắn',
    'Ghi chú nội bộ',
  ]
  return `\uFEFF${[header, ...rows]
    .map((row) => row.map(csvCell).join(','))
    .join('\r\n')}`
}
