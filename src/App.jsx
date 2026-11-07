import { lazy, Suspense } from 'react'
import { ADMIN_PATH, usePath } from './lib/router'
import Site from './Site'

// Trang quản trị chỉ tải khi truy cập /quan-tri, không làm nặng website công khai.
const AdminApp = lazy(() => import('./admin/AdminApp'))

/** Đường dẫn gốc: website bán hàng. `/quan-tri`: trang quản trị. */
export default function App() {
  const path = usePath()
  return path.startsWith(ADMIN_PATH) ? (
    <Suspense fallback={<AdminLoading />}>
      <AdminApp />
    </Suspense>
  ) : <Site />
}

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 text-white">
      <div className="text-center">
        <img src="/images/brand/kia-logo-footer.webp" alt="Kia" className="mx-auto h-7 w-auto" />
        <p className="mt-5 text-sm font-semibold text-white/70">Đang tải trang quản trị…</p>
      </div>
    </div>
  )
}
