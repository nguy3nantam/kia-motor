import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Download, Lock } from '../components/Icons'
import {
  downloadFile,
  hashPassword,
} from '../lib/store'
import { PageHeader } from './AdminUI'

export default function SettingsManager({ currentUser }) {
  const {
    site,
    setSite,
    resetSite,
    cars,
    setCars,
    leads,
    replaceLeads,
    slides,
    setSlides,
    users,
    setUsers,
  } = useApp()
  const isAdmin = currentUser.role === 'admin'
  const [form, setForm] = useState(site)
  const [message, setMessage] = useState('')

  useEffect(() => setForm(site), [site])

  const change = (event) => {
    const { name, value } = event.target
    if (name.startsWith('social.')) {
      const key = name.split('.')[1]
      setForm((old) => ({ ...old, social: { ...old.social, [key]: value } }))
    } else {
      setForm((old) => ({ ...old, [name]: value }))
    }
  }

  const save = (event) => {
    event.preventDefault()
    const digits = String(form.hotline || '').replace(/\D/g, '')
    setSite({ ...form, hotlineHref: digits ? `tel:${digits}` : '' })
    setMessage('Đã lưu thông tin showroom.')
  }

  const reset = () => {
    if (window.confirm('Khôi phục thông tin showroom mặc định?')) {
      resetSite()
      setMessage('Đã khôi phục thông tin mặc định.')
    }
  }

  const exportBackup = () => {
    const data = { version: 3, exportedAt: new Date().toISOString(), site, cars, slides, leads, users }
    const date = new Date().toISOString().slice(0, 10)
    downloadFile(`kia-backup-${date}.json`, JSON.stringify(data, null, 2), 'application/json')
  }

  const importBackup = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!data.site || !Array.isArray(data.cars) || !data.cars.length || !Array.isArray(data.leads)) {
        throw new Error('invalid')
      }
      if (!window.confirm(`Nhập bản sao lưu gồm ${data.cars.length} xe và ${data.leads.length} khách hàng?`)) return
      setSite(data.site)
      setCars(data.cars)
      if (Array.isArray(data.slides) && data.slides.length) setSlides(data.slides)
      replaceLeads(data.leads)
      if (Array.isArray(data.users) && data.users.length && !setUsers(data.users)) {
        throw new Error('users-invalid')
      }
      setMessage('Đã nhập bản sao lưu thành công.')
    } catch {
      setMessage('File sao lưu không hợp lệ.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Hệ thống"
        title={isAdmin ? 'Cài đặt showroom' : 'Cài đặt tài khoản'}
        description={isAdmin ? 'Thông tin lưu tại đây sẽ cập nhật ngay trên website công khai của trình duyệt này.' : 'Đổi mật khẩu cho tài khoản đang đăng nhập.'}
      />

      {message && (
        <div role="status" className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        {isAdmin ? <form onSubmit={save} className="border border-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">Thông tin liên hệ</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Tên showroom" className="sm:col-span-2"><input name="name" value={form.name || ''} onChange={change} className="field" required /></Field>
            <Field label="Hotline"><input name="hotline" value={form.hotline || ''} onChange={change} className="field" /></Field>
            <Field label="Email"><input name="email" type="email" value={form.email || ''} onChange={change} className="field" /></Field>
            <Field label="Đường dẫn Zalo"><input name="zaloHref" value={form.zaloHref || ''} onChange={change} className="field" /></Field>
            <Field label="Giờ mở cửa"><input name="hours" value={form.hours || ''} onChange={change} className="field" /></Field>
            <Field label="Địa chỉ" className="sm:col-span-2"><textarea name="address" value={form.address || ''} onChange={change} className="field min-h-20 resize-y" /></Field>
            <Field label="Giới thiệu ngắn" className="sm:col-span-2"><textarea name="about" value={form.about || ''} onChange={change} className="field min-h-24 resize-y" /></Field>
          </div>

          <h3 className="mt-7 border-t border-line pt-6 font-bold">Mạng xã hội</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Facebook"><input name="social.facebook" value={form.social?.facebook || ''} onChange={change} className="field" /></Field>
            <Field label="YouTube"><input name="social.youtube" value={form.social?.youtube || ''} onChange={change} className="field" /></Field>
            <Field label="Instagram" className="sm:col-span-2"><input name="social.instagram" value={form.social?.instagram || ''} onChange={change} className="field" /></Field>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={reset} className="btn-ghost px-5">Khôi phục mặc định</button>
            <button type="submit" className="btn-primary px-5">Lưu thông tin</button>
          </div>
        </form> : (
          <section className="border border-line bg-white p-6">
            <h2 className="text-lg font-extrabold">Thông tin tài khoản</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-xs font-semibold uppercase text-ink-400">Tên hiển thị</dt><dd className="mt-1 font-bold">{currentUser.name}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-ink-400">Username</dt><dd className="mt-1 font-bold">@{currentUser.username}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-ink-400">Phân quyền</dt><dd className="mt-1 font-bold">{currentUser.role === 'sales' ? 'Nhân viên bán hàng' : 'Biên tập nội dung'}</dd></div>
            </dl>
          </section>
        )}

        <div className="space-y-6">
          <PasswordPanel currentUser={currentUser} users={users} setUsers={setUsers} onMessage={setMessage} />

          {isAdmin && <section className="border border-line bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-canvas"><Download size={19} /></span>
              <div>
                <h2 className="font-extrabold">Sao lưu dữ liệu</h2>
                <p className="mt-0.5 text-xs text-ink-500">Xe, slider, showroom, khách hàng và user</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              Vì dữ liệu nằm trong localStorage, hãy tải bản sao lưu JSON định kỳ để tránh mất dữ liệu khi xoá cache trình duyệt.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={exportBackup} className="btn-dark w-full">Xuất JSON</button>
              <label className="btn-ghost w-full cursor-pointer">
                Nhập JSON
                <input type="file" accept="application/json,.json" onChange={importBackup} className="sr-only" />
              </label>
            </div>
            <div className="mt-4 border-t border-line pt-4 text-xs text-ink-400">
              Hiện có {cars.length} xe · {slides.length} slide · {leads.length} khách hàng · {users.length} user
            </div>
          </section>}

          <section className="border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-800">
            <strong>Lưu ý:</strong> localStorage chỉ tồn tại trên trình duyệt này. Khách gửi form từ máy khác sẽ không xuất hiện tại đây nếu chưa tích hợp backend hoặc Google Sheet.
          </section>
        </div>
      </div>
    </div>
  )
}

function PasswordPanel({ currentUser, users, setUsers, onMessage }) {
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (hashPassword(password.current) !== currentUser.passwordHash) return setError('Mật khẩu hiện tại không đúng.')
    if (password.next.length < 6) return setError('Mật khẩu mới cần ít nhất 6 ký tự.')
    if (password.next !== password.confirm) return setError('Xác nhận mật khẩu chưa khớp.')
    setUsers(users.map((user) => user.id === currentUser.id
      ? { ...user, passwordHash: hashPassword(password.next) }
      : user))
    setPassword({ current: '', next: '', confirm: '' })
    setError('')
    onMessage('Đã đổi mật khẩu quản trị.')
  }

  const change = (event) => setPassword((old) => ({ ...old, [event.target.name]: event.target.value }))

  return (
    <form onSubmit={submit} className="border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center bg-canvas"><Lock size={19} /></span>
        <div>
          <h2 className="font-extrabold">Đổi mật khẩu</h2>
          <p className="mt-0.5 text-xs text-ink-500">Tối thiểu 6 ký tự</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <Field label="Mật khẩu hiện tại"><input name="current" type="password" value={password.current} onChange={change} className="field" autoComplete="current-password" /></Field>
        <Field label="Mật khẩu mới"><input name="next" type="password" value={password.next} onChange={change} className="field" autoComplete="new-password" /></Field>
        <Field label="Nhập lại mật khẩu"><input name="confirm" type="password" value={password.confirm} onChange={change} className="field" autoComplete="new-password" /></Field>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" className="btn-dark mt-5 w-full">Cập nhật mật khẩu</button>
    </form>
  )
}

function Field({ label, className = '', children }) {
  return <label className={className}><span className="label">{label}</span>{children}</label>
}
