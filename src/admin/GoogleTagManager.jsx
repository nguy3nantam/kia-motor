import { useMemo, useState } from 'react'
import { Download, Tag } from '../components/Icons'
import {
  googleTagConfig,
  isValidGa4Id,
  isValidGtmId,
} from '../lib/googleTags'
import { downloadFile, readJSON, writeJSON } from '../lib/store'
import { PageHeader } from './AdminUI'

const DRAFT_KEY = 'kia-google-tag-draft'

export default function GoogleTagManager() {
  const saved = readJSON(DRAFT_KEY, {})
  const [form, setForm] = useState({
    gtmId: saved.gtmId || googleTagConfig.gtmId || '',
    ga4Id: saved.ga4Id || googleTagConfig.ga4Id || '',
  })
  const [message, setMessage] = useState('')

  const normalized = useMemo(() => ({
    gtmId: form.gtmId.trim().toUpperCase(),
    ga4Id: form.ga4Id.trim().toUpperCase(),
  }), [form])
  const gtmValid = !normalized.gtmId || isValidGtmId(normalized.gtmId)
  const ga4Valid = !normalized.ga4Id || isValidGa4Id(normalized.ga4Id)
  const hasOne = Boolean(normalized.gtmId || normalized.ga4Id)
  const envContent = `# Google Tag — Kia Phú Mỹ Hưng\nVITE_GTM_ID=${normalized.gtmId}\nVITE_GA4_ID=${normalized.ga4Id}\n`

  const change = (event) => {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }))
    setMessage('')
  }
  const validate = () => {
    if (!hasOne) return 'Hãy nhập ít nhất một ID GTM hoặc GA4.'
    if (!gtmValid) return 'GTM ID chưa đúng định dạng GTM-XXXXXXX.'
    if (!ga4Valid) return 'GA4 ID chưa đúng định dạng G-XXXXXXXXXX.'
    return ''
  }
  const saveDraft = () => {
    const error = validate()
    if (error) return setMessage(error)
    writeJSON(DRAFT_KEY, normalized)
    setMessage('Đã lưu bản nháp trên trình duyệt. Hãy tải file và build lại để áp dụng toàn site.')
  }
  const downloadEnv = () => {
    const error = validate()
    if (error) return setMessage(error)
    writeJSON(DRAFT_KEY, normalized)
    downloadFile('.env.production', envContent)
    setMessage('Đã tải .env.production. Đặt file vào thư mục gốc rồi chạy npm run build.')
  }
  const copyEnv = async () => {
    const error = validate()
    if (error) return setMessage(error)
    try {
      await navigator.clipboard.writeText(envContent)
      setMessage('Đã sao chép cấu hình biến môi trường.')
    } catch {
      setMessage('Trình duyệt không cho sao chép. Hãy dùng nút tải .env.production.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Tracking"
        title="Google Tag"
        description="Cấu hình Google Tag Manager và Google Analytics 4 cho toàn bộ website công khai."
      />

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <section className="border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-canvas text-ink-800"><Tag size={21} /></span>
            <div>
              <h2 className="font-extrabold">ID theo dõi</h2>
              <p className="mt-0.5 text-xs text-ink-500">Không cần dán nguyên đoạn script</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <Field label="Google Tag Manager Container ID">
              <input name="gtmId" value={form.gtmId} onChange={change} className={`field font-mono uppercase ${gtmValid ? '' : 'border-red-500'}`} placeholder="GTM-ABC1234" autoComplete="off" />
              <span className="mt-1 block text-xs text-ink-400">Lấy tại Google Tag Manager → Admin → Container Settings.</span>
            </Field>
            <Field label="Google Analytics 4 Measurement ID">
              <input name="ga4Id" value={form.ga4Id} onChange={change} className={`field font-mono uppercase ${ga4Valid ? '' : 'border-red-500'}`} placeholder="G-ABCD123456" autoComplete="off" />
              <span className="mt-1 block text-xs text-ink-400">Lấy tại GA4 → Admin → Data Streams → Web stream.</span>
            </Field>
          </div>

          {normalized.gtmId && normalized.ga4Id && (
            <div className="mt-5 border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
              Nếu GA4 đã được cài bên trong GTM, hãy để trống GA4 ID ở đây để tránh ghi nhận page view hai lần.
            </div>
          )}
          {message && <div role="status" className="mt-5 border border-line bg-canvas p-4 text-sm font-semibold text-ink-700">{message}</div>}

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={saveDraft} className="btn-ghost px-5">Lưu bản nháp</button>
            <button type="button" onClick={copyEnv} className="btn-ghost px-5">Sao chép cấu hình</button>
            <button type="button" onClick={downloadEnv} className="btn-primary px-5"><Download size={17} /> Tải .env.production</button>
          </div>
        </section>

        <div className="space-y-6">
          <section className="border border-line bg-white p-5 sm:p-6">
            <h2 className="font-extrabold">Trạng thái bản build hiện tại</h2>
            <div className="mt-5 space-y-3">
              <BuildStatus label="Google Tag Manager" id={googleTagConfig.gtmId} valid={isValidGtmId(googleTagConfig.gtmId)} />
              <BuildStatus label="Google Analytics 4" id={googleTagConfig.ga4Id} valid={isValidGa4Id(googleTagConfig.ga4Id)} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">Trạng thái chỉ thay đổi sau khi tạo `.env.production`, chạy build lại và triển khai thư mục `dist/` mới.</p>
          </section>

          <section className="border border-line bg-white p-5 sm:p-6">
            <h2 className="font-extrabold">Cách áp dụng toàn site</h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
              <li><strong>1.</strong> Nhập ID và tải file `.env.production`.</li>
              <li><strong>2.</strong> Đặt file vào thư mục gốc, cùng cấp `package.json`.</li>
              <li><strong>3.</strong> Chạy <code className="bg-canvas px-1.5 py-1 text-xs">npm run build</code>.</li>
              <li><strong>4.</strong> Triển khai lại thư mục <code className="bg-canvas px-1.5 py-1 text-xs">dist/</code>.</li>
            </ol>
          </section>

          <section className="border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-800">
            Script được tự chèn vào <code>&lt;head&gt;</code> trên website công khai và tự động bỏ qua đường dẫn <strong>/quan-tri</strong>.
          </section>
        </div>
      </div>
    </div>
  )
}

function BuildStatus({ label, id, valid }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-line p-4">
      <div><div className="text-sm font-bold">{label}</div><div className="mt-1 font-mono text-xs text-ink-500">{id || 'Chưa cấu hình'}</div></div>
      <span className={`shrink-0 px-2.5 py-1 text-[10px] font-bold ${valid ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-500'}`}>{valid ? 'Đã cấu hình' : 'Chưa bật'}</span>
    </div>
  )
}

function Field({ label, children }) {
  return <label><span className="label">{label}</span>{children}</label>
}
