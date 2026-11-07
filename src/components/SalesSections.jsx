import { useApp } from '../context/AppContext'
import { ArrowRight, Calendar, Car, Check, Route, Shield, Sparkle } from './Icons'
import { Section, SectionHeading } from './Section'

const services = [
  { icon: Calendar, title: 'Đặt hẹn dịch vụ', desc: 'Chọn thời gian bảo dưỡng phù hợp, không phải chờ đợi.' },
  { icon: Shield, title: 'Bảo hành chính hãng', desc: 'Quy trình tiêu chuẩn Kia, phụ tùng chính hãng và minh bạch.' },
  { icon: Route, title: 'Cứu hộ & hỗ trợ', desc: 'Đồng hành cùng bạn trên mọi hành trình khi cần trợ giúp.' },
  { icon: Car, title: 'Thu xe cũ đổi xe mới', desc: 'Định giá nhanh, hỗ trợ thủ tục và bù chênh lệch linh hoạt.' },
]

export function Services() {
  return (
    <Section id="dich-vu">
      <SectionHeading eyebrow="Hậu mãi" title="An tâm trọn hành trình" desc="Dịch vụ chuyên nghiệp, quy trình rõ ràng và hỗ trợ xuyên suốt sau khi nhận xe." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, desc }) => (
          <article key={title} className="border-t-2 border-ink-900 bg-canvas p-5 transition-colors hover:bg-kia-100">
            <span className="grid h-11 w-11 place-items-center text-ink-800"><Icon size={24} /></span>
            <h3 className="mt-5 text-base">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{desc}</p>
            <a href="#lien-he" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-kia-600 hover:underline">Tìm hiểu thêm <ArrowRight size={14} /></a>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function Promotion() {
  const { openLead } = useApp()
  return (
    <Section id="uu-dai" muted>
      <div className="relative overflow-hidden rounded-none bg-ink-900 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-kia-600/25 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <span className="chip bg-white/10 text-white"><Sparkle size={14} /> Ưu đãi giới hạn</span>
            <h2 className="mt-5 max-w-xl text-2xl font-extrabold text-white sm:text-4xl">Sở hữu Kia dễ dàng hơn trong tháng này</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">Nhận ngay gói ưu đãi phí trước bạ, bảo hiểm vật chất và hỗ trợ lãi suất tùy dòng xe.</p>
            <button type="button" onClick={() => openLead(null, 'bao-gia')} className="btn mt-7 bg-white px-6 text-ink-900 hover:bg-white/90">Nhận ưu đãi của tôi <ArrowRight size={17} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {['Báo giá minh bạch, không phí ẩn', 'Hỗ trợ vay đến 85% giá trị xe', 'Giao xe nhanh, hỗ trợ đăng ký'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-none border border-white/10 bg-white/5 p-4 text-sm font-semibold"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-none bg-white/15 text-white"><Check size={15} /></span>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function ContactCTA() {
  const { openLead, site } = useApp()
  return (
    <Section id="lien-he">
      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <div>
          <SectionHeading eyebrow="Liên hệ" title="Sẵn sàng tìm chiếc Kia dành cho bạn?" desc={`Để lại thông tin hoặc gọi trực tiếp. Chuyên viên ${site.name} sẽ tư vấn mẫu xe, trả góp và lịch lái thử phù hợp.`} />
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => openLead(null, 'lai-thu')} className="btn-primary px-6">Đăng ký lái thử</button>
          </div>
        </div>
        <div className="card space-y-4 p-6 sm:p-7">
          {[['Địa chỉ showroom', site.address], ['Giờ mở cửa', site.hours], ['Hotline', site.hotline], ['Email', site.email]].map(([label, value]) => (
            <div key={label} className="border-b border-line pb-4 last:border-0 last:pb-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</div>
              <div className="mt-1 text-sm font-semibold text-ink-800">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
