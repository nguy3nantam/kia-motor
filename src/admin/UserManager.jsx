import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Edit, Plus, Search, Shield, Trash } from '../components/Icons'
import Modal from '../components/Modal'
import { hashPassword, USER_ROLES } from '../lib/store'
import { formatDateTime, PageHeader } from './AdminUI'

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export default function UserManager({ currentUser }) {
  const { users, setUsers } = useApp()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter((user) =>
      !term || [user.name, user.username, roleLabel(user.role)]
        .some((value) => String(value || '').toLowerCase().includes(term)),
    )
  }, [users, search])

  const save = (data, originalId) => {
    if (originalId) {
      const original = users.find((user) => user.id === originalId)
      const nextUser = {
        ...original,
        ...data,
        role: originalId === currentUser.id ? original.role : data.role,
        active: originalId === currentUser.id ? true : data.active,
        passwordHash: data.password
          ? hashPassword(data.password)
          : original.passwordHash,
      }
      delete nextUser.password
      delete nextUser.confirm
      setUsers(users.map((user) => user.id === originalId ? nextUser : user))
    } else {
      const nextUser = {
        id: makeId(),
        username: data.username,
        name: data.name,
        role: data.role,
        active: data.active,
        passwordHash: hashPassword(data.password),
        createdAt: new Date().toISOString(),
        lastLogin: null,
      }
      setUsers([...users, nextUser])
    }
    setEditing(null)
    setAdding(false)
  }

  const toggle = (user) => {
    if (user.id === currentUser.id) return window.alert('Bạn không thể tự khoá tài khoản đang đăng nhập.')
    const activeAdmins = users.filter((item) => item.role === 'admin' && item.active)
    if (user.role === 'admin' && user.active && activeAdmins.length <= 1) {
      return window.alert('Cần ít nhất một quản trị viên đang hoạt động.')
    }
    setUsers(users.map((item) => item.id === user.id ? { ...item, active: !item.active } : item))
  }

  const remove = (user) => {
    if (user.id === currentUser.id) return window.alert('Bạn không thể xoá tài khoản đang đăng nhập.')
    const activeAdmins = users.filter((item) => item.role === 'admin' && item.active)
    if (user.role === 'admin' && user.active && activeAdmins.length <= 1) {
      return window.alert('Cần ít nhất một quản trị viên đang hoạt động.')
    }
    if (window.confirm(`Xoá tài khoản “${user.username}”?`)) {
      setUsers(users.filter((item) => item.id !== user.id))
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Phân quyền"
        title="Quản lý user"
        description={`${users.length} tài khoản quản trị được lưu trên trình duyệt này.`}
        actions={(
          <button type="button" onClick={() => setAdding(true)} className="btn-primary px-4">
            <Plus size={17} /> Thêm user
          </button>
        )}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {USER_ROLES.map((role) => (
          <div key={role.id} className="border border-line bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{role.label}</div>
            <div className="mt-2 text-2xl font-extrabold">{users.filter((user) => user.role === role.id).length}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-5 max-w-xl">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="field bg-white pl-10" placeholder="Tìm tên, username, vai trò..." />
      </div>

      <div className="mt-5 space-y-3">
        {visible.map((user) => (
          <article key={user.id} className={`grid gap-5 border bg-white p-5 lg:grid-cols-[1fr_.7fr_.8fr_auto] lg:items-center ${user.active ? 'border-line' : 'border-line opacity-60'}`}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center bg-canvas text-ink-700"><Shield size={20} /></span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-bold">{user.name}</h2>
                  {user.id === currentUser.id && <span className="bg-kia-50 px-2 py-1 text-[10px] font-bold text-kia-700">Bạn</span>}
                </div>
                <div className="mt-1 text-xs text-ink-500">@{user.username}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Vai trò</div>
              <div className="mt-1 text-sm font-bold">{roleLabel(user.role)}</div>
            </div>
            <div className="text-xs text-ink-500">
              <div>Trạng thái: <strong className={user.active ? 'text-emerald-700' : 'text-red-600'}>{user.active ? 'Hoạt động' : 'Đã khoá'}</strong></div>
              <div className="mt-1">Đăng nhập cuối: {user.lastLogin ? formatDateTime(user.lastLogin) : 'Chưa đăng nhập'}</div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => toggle(user)} disabled={user.id === currentUser.id} className="h-10 border border-line px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40">{user.active ? 'Khoá' : 'Mở khoá'}</button>
              <button type="button" onClick={() => setEditing(user)} className="grid h-10 w-10 place-items-center border border-line" aria-label={`Sửa ${user.username}`}><Edit size={16} /></button>
              <button type="button" onClick={() => remove(user)} disabled={user.id === currentUser.id} className="grid h-10 w-10 place-items-center border border-line text-ink-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Xoá ${user.username}`}><Trash size={16} /></button>
            </div>
          </article>
        ))}
      </div>

      <UserEditor
        open={adding || Boolean(editing)}
        user={editing}
        users={users}
        currentUser={currentUser}
        onClose={() => { setAdding(false); setEditing(null) }}
        onSave={save}
      />
    </div>
  )
}

const roleLabel = (value) => USER_ROLES.find((role) => role.id === value)?.label || value

function UserEditor({ open, user, users, currentUser, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', username: '', role: 'sales', active: true, password: '', confirm: '' })
  const [error, setError] = useState('')
  const editingSelf = user?.id === currentUser.id

  useEffect(() => {
    if (!open) return
    setForm(user
      ? { name: user.name, username: user.username, role: user.role, active: user.active, password: '', confirm: '' }
      : { name: '', username: '', role: 'sales', active: true, password: '', confirm: '' })
    setError('')
  }, [open, user])

  const change = (event) => {
    const { name, value, type, checked } = event.target
    setForm((old) => ({ ...old, [name]: type === 'checkbox' ? checked : value }))
  }
  const submit = (event) => {
    event.preventDefault()
    const username = form.username.trim().toLowerCase()
    if (form.name.trim().length < 2) return setError('Vui lòng nhập tên hiển thị.')
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) return setError('Username cần 3–30 ký tự: a-z, số, dấu chấm, gạch ngang hoặc gạch dưới.')
    if (users.some((item) => item.id !== user?.id && item.username.toLowerCase() === username)) return setError('Username đã tồn tại.')
    if (!user && form.password.length < 6) return setError('Mật khẩu cần ít nhất 6 ký tự.')
    if (form.password && form.password.length < 6) return setError('Mật khẩu mới cần ít nhất 6 ký tự.')
    if (form.password !== form.confirm) return setError('Xác nhận mật khẩu chưa khớp.')
    onSave({ ...form, name: form.name.trim(), username }, user?.id)
  }

  return (
    <Modal open={open} onClose={onClose} title={user ? `Chỉnh sửa @${user.username}` : 'Thêm user'} size="lg">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên hiển thị *"><input name="name" value={form.name} onChange={change} className="field" autoFocus /></Field>
        <Field label="Username *"><input name="username" value={form.username} onChange={change} className="field" autoComplete="off" /></Field>
        <Field label="Vai trò"><select name="role" value={form.role} onChange={change} disabled={editingSelf} className="field">{USER_ROLES.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}</select></Field>
        <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold text-ink-700"><input name="active" type="checkbox" checked={form.active} onChange={change} disabled={editingSelf} className="h-5 w-5 accent-kia-600" /> Tài khoản hoạt động</label>
        <Field label={user ? 'Mật khẩu mới (để trống nếu giữ nguyên)' : 'Mật khẩu *'}><input name="password" type="password" value={form.password} onChange={change} className="field" autoComplete="new-password" /></Field>
        <Field label="Nhập lại mật khẩu"><input name="confirm" type="password" value={form.confirm} onChange={change} className="field" autoComplete="new-password" /></Field>
        {error && <p role="alert" className="text-sm font-semibold text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-line pt-5 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-ghost px-5">Huỷ</button>
          <button type="submit" className="btn-primary px-5">Lưu user</button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, children }) {
  return <label><span className="label">{label}</span>{children}</label>
}
