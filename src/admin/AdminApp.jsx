import { lazy, useEffect, useMemo, useState, Suspense } from 'react'
import { useApp } from '../context/AppContext'
import {
  Car,
  Chart,
  Lock,
  LogOut,
  Settings,
  Shield,
  Sparkle,
  Tag,
  Users,
} from '../components/Icons'
import {
  endAdminSession,
  getAdminSession,
  startAdminSession,
  USER_ROLES,
  verifyUser,
} from '../lib/store'

// Lazy load admin pages - only load when user navigates to them
const Dashboard = lazy(() => import('./Dashboard'))
const LeadManager = lazy(() => import('./LeadManager'))
const CarManager = lazy(() => import('./CarManager'))
const SettingsManager = lazy(() => import('./SettingsManager'))
const SliderManager = lazy(() => import('./SliderManager'))
const UserManager = lazy(() => import('./UserManager'))
const GoogleTagManager = lazy(() => import('./GoogleTagManager'))

const tabs = [
  { id: 'tong-quan', label: 'Tổng quan', icon: Chart, roles: ['admin', 'sales', 'editor'] },
  { id: 'khach-hang', label: 'Khách hàng', icon: Users, roles: ['admin', 'sales'] },
  { id: 'slider', label: 'Slider Home', icon: Sparkle, roles: ['admin', 'editor'] },
  { id: 'xe', label: 'Quản lý xe', icon: Car, roles: ['admin', 'editor'] },
  { id: 'users', label: 'Quản lý user', icon: Shield, roles: ['admin'] },
  { id: 'google-tag', label: 'Google Tag', icon: Tag, roles: ['admin'] },
  { id: 'cai-dat', label: 'Cài đặt', icon: Settings, roles: ['admin', 'sales', 'editor'] },
]

const pages = {
  'tong-quan': Dashboard,
  'khach-hang': LeadManager,
  xe: CarManager,
  slider: SliderManager,
  users: UserManager,
  'google-tag': GoogleTagManager,
  'cai-dat': SettingsManager,
}

function AdminPageSuspense({ children }) {
  return (
    <Suspense fallback={<AdminPageLoading />}>
      {children}
    </Suspense>
  )
}

function AdminPageLoading() {
  return (
    <div className="flex h-64 items-center justify-center text-ink-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-kia-600 border-t-transparent mx-auto" />
        <p className="mt-3 text-sm font-semibold">Đang tải trang…</p>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const { site, users, setUsers } = useApp()
  const [sessionUserId, setSessionUserId] = useState(() => getAdminSession()?.userId || null)
  const [active, setActive] = useState('tong-quan')
  const currentUser = users.find((user) => user.id === sessionUserId && user.active)
  const availableTabs = useMemo(
    () => currentUser ? tabs.filter((tab) => tab.roles.includes(currentUser.role)) : [],
    [currentUser],
  )

  useEffect(() => {
    const oldTitle = document.title
    document.title = `Quản trị — ${site.name}`
    let robots = document.querySelector('meta[name="robots"]')
    const created = !robots
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    const previous = robots.content
    robots.content = 'noindex,nofollow'
    return () => {
      document.title = oldTitle
      if (created) robots.remove()
      else robots.content = previous
    }
  }, [site.name])

  useEffect(() => {
    if (currentUser && !availableTabs.some((tab) => tab.id === active)) {
      setActive(availableTabs[0]?.id || 'tong-quan')
    }
  }, [active, availableTabs, currentUser])

  if (!currentUser) {
    return (
      <AdminLogin
        users={users}
        setUsers={setUsers}
        onSuccess={setSessionUserId}
        siteName={site.name}
      />
    )
  }

  const ActivePage = pages[active] || Dashboard
  const roleLabel = USER_ROLES.find((role) => role.id === currentUser.role)?.label
  const logout = () => {
    endAdminSession()
    setActive('tong-quan')
    setSessionUserId(null)
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-900">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/" aria-label="Về website">
              <img src="/images/brand/kia-logo-dark.webp" alt="Kia" className="h-6 w-auto" />
            </a>
            <span className="h-7 w-px bg-line" />
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold uppercase tracking-wide">Quản trị</div>
              <div className="hidden truncate text-xs text-ink-500 sm:block">{site.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-right md:block">
              <div className="text-xs font-bold">{currentUser.name}</div>
              <div className="text-[10px] text-ink-400">{roleLabel}</div>
            </div>
            <a href="/" className="btn-ghost hidden px-4 sm:inline-flex">Xem website</a>
            <button type="button" onClick={logout} className="grid h-11 w-11 place-items-center border border-line-strong text-ink-700 transition hover:border-ink-900 hover:text-ink-900 sm:flex sm:w-auto sm:gap-2 sm:px-4" aria-label="Đăng xuất">
              <LogOut size={18} /><span className="hidden text-sm font-semibold sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-line bg-white p-5 lg:block">
          <nav className="space-y-1" aria-label="Menu quản trị">
            {availableTabs.map((tab) => <AdminNavButton key={tab.id} tab={tab} active={active === tab.id} onClick={() => setActive(tab.id)} />)}
          </nav>
          <div className="absolute bottom-5 left-5 right-5 border border-line bg-canvas p-4 text-xs leading-relaxed text-ink-500">
            Đăng nhập: <strong className="text-ink-800">{currentUser.username}</strong><br />
            Dữ liệu lưu trên trình duyệt này.
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav className="no-scrollbar sticky top-16 z-30 flex overflow-x-auto border-b border-line bg-white px-3 lg:hidden">
            {availableTabs.map((tab) => <AdminNavButton key={tab.id} tab={tab} active={active === tab.id} compact onClick={() => setActive(tab.id)} />)}
          </nav>
          <main className="p-4 sm:p-6 lg:p-8">
            <AdminPageSuspense>
              <ActivePage onNavigate={setActive} currentUser={currentUser} />
            </AdminPageSuspense>
          </main>
        </div>
      </div>
    </div>
  )
}

function AdminNavButton({ tab, active, compact = false, onClick }) {
  const Icon = tab.icon
  return (
    <button type="button" onClick={onClick} className={compact
      ? `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${active ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500'}`
      : `flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition ${active ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-canvas hover:text-ink-900'}`
    }>
      <Icon size={19} /> {tab.label}
    </button>
  )
}

function AdminLogin({ users, setUsers, onSuccess, siteName }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const username = form.username.trim().toLowerCase()
    const user = users.find((item) => item.username.toLowerCase() === username)
    if (!user || !verifyUser(user, form.password)) {
      setError(user && !user.active ? 'Tài khoản đã bị khoá.' : 'Tên đăng nhập hoặc mật khẩu không đúng.')
      return
    }
    const now = new Date().toISOString()
    setUsers(users.map((item) => item.id === user.id ? { ...item, lastLogin: now } : item))
    startAdminSession(user.id)
    onSuccess(user.id)
  }

  const change = (event) => {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }))
    setError('')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink-900 p-5">
      <div className="w-full max-w-md bg-white p-7 shadow-[var(--shadow-lift)] sm:p-9">
        <img src="/images/brand/kia-logo-dark.webp" alt="Kia" className="h-7 w-auto" />
        <div className="mt-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center bg-canvas text-ink-900"><Lock size={21} /></span>
          <div><h1 className="text-xl font-extrabold">Đăng nhập quản trị</h1><p className="mt-0.5 text-xs text-ink-500">{siteName}</p></div>
        </div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label><span className="label">Tên đăng nhập</span><input name="username" value={form.username} onChange={change} className="field" autoComplete="username" autoFocus /></label>
          <label><span className="label">Mật khẩu</span><input name="password" type="password" value={form.password} onChange={change} className="field" autoComplete="current-password" /></label>
          {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full py-3.5">Đăng nhập</button>
        </form>
        <a href="/" className="mt-5 block text-center text-sm font-semibold text-ink-500 hover:text-ink-900">← Quay lại website</a>
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-ink-400">Tài khoản được lưu trên trình duyệt, không thay thế xác thực bằng máy chủ.</p>
      </div>
    </main>
  )
}
