/** Cấu hình Google Tag được đóng gói vào website tại thời điểm `npm run build`. */
const normalize = (value) => String(value || '').trim().toUpperCase()

export const googleTagConfig = Object.freeze({
  gtmId: normalize(import.meta.env.VITE_GTM_ID),
  ga4Id: normalize(import.meta.env.VITE_GA4_ID),
})

export const isValidGtmId = (value) => /^GTM-[A-Z0-9]+$/.test(normalize(value))
export const isValidGa4Id = (value) => /^G-[A-Z0-9]+$/.test(normalize(value))

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

function injectGtm(id) {
  const dataLayer = ensureDataLayer()
  dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
  script.dataset.kiaGoogleTag = 'gtm'
  document.head.appendChild(script)

  const noScript = document.createElement('noscript')
  noScript.dataset.kiaGoogleTag = 'gtm-noscript'
  const iframe = document.createElement('iframe')
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}`
  iframe.height = '0'
  iframe.width = '0'
  iframe.style.display = 'none'
  iframe.style.visibility = 'hidden'
  iframe.title = 'Google Tag Manager'
  noScript.appendChild(iframe)
  document.body.prepend(noScript)
}

function injectGa4(id) {
  ensureDataLayer()
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  script.dataset.kiaGoogleTag = 'ga4'
  document.head.appendChild(script)

  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id)
}

/** Chèn script vào head cho website công khai; không tracking trang quản trị. */
export function initGoogleTags() {
  if (window.location.pathname.startsWith('/quan-tri')) return
  if (window.__kiaGoogleTagsInitialized) return

  const hasGtm = isValidGtmId(googleTagConfig.gtmId)
  const hasGa4 = isValidGa4Id(googleTagConfig.ga4Id)
  if (!hasGtm && !hasGa4) return

  window.__kiaGoogleTagsInitialized = true
  if (hasGtm) injectGtm(googleTagConfig.gtmId)
  if (hasGa4) injectGa4(googleTagConfig.ga4Id)
}
