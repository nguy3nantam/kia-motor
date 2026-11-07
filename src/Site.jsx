import { lazy, Suspense, useEffect } from 'react'
import { useApp } from './context/AppContext'
import Header from './components/Header'
import Hero from './components/Hero'
import QuickActions from './components/QuickActions'
import CarCatalog from './components/CarCatalog'
import CostEstimator from './components/CostEstimator'
import { ContactCTA, Promotion, Services } from './components/SalesSections'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'

// Lazy load modals - they're only needed when user interacts
const LeadModal = lazy(() => import('./components/LeadModal'))
const CarDetailModal = lazy(() => import('./components/CarDetailModal'))

function SiteMetadata() {
  const { site, cars } = useApp()

  useEffect(() => {
    document.title = `${site.name} — Báo giá & Lái thử xe Kia`
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.content = `${site.name}. Nhận báo giá, đăng ký lái thử và dự toán chi phí lăn bánh nhanh chóng.`
    }
    const jsonLd = document.querySelector('script[type="application/ld+json"]')
    if (jsonLd) {
      const prices = cars.map((car) => Number(car.price) || 0).filter(Boolean)
      const current = JSON.parse(jsonLd.textContent)
      jsonLd.textContent = JSON.stringify({
        ...current,
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: site.name,
        description: site.about,
        image: new URL(current.image, window.location.origin).href,
        logo: new URL('/images/brand/kia-logo-dark.webp', window.location.origin).href,
        telephone: site.hotline,
        email: site.email,
        priceRange: prices.length
          ? `${Math.min(...prices)} - ${Math.max(...prices)} VND`
          : undefined,
        address: {
          ...current.address,
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressCountry: 'VN',
        },
      })
    }
  }, [site, cars])

  return null
}

function ModalSuspense({ children }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  )
}

export default function Site() {
  const { lead, detailId } = useApp()

  return (
    <>
      <SiteMetadata />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 bg-ink-900 px-4 py-3 text-sm font-bold text-white transition-transform focus:translate-y-0"
      >
        Bỏ qua đến nội dung chính
      </a>
      <Header />
      <main id="main-content" tabIndex="-1" className="focus:outline-none">
        <Hero />
        <QuickActions />
        <CarCatalog />
        <CostEstimator />
        <Services />
        <Promotion />
        <ContactCTA />
      </main>
      <Footer />
      <FloatingContact />
      <ModalSuspense>
        {lead.open && <LeadModal />}
        {detailId && <CarDetailModal />}
      </ModalSuspense>
    </>
  )
}
