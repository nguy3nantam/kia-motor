/** Cấu hình showroom — sửa tại đây để đổi thông tin liên hệ */

export const site = {
  name: 'Kia Phú Mỹ Hưng',
  hotline: '0909 123 456',
  hotlineHref: 'tel:0909123456',
  zaloHref: 'https://zalo.me/0909123456',
  email: 'sales@kiaphumyhung.vn',
  address: '123 Nguyễn Văn Linh, Phú Mỹ Hưng, Quận 7, TP. Hồ Chí Minh',
  hours: 'Thứ 2 – Chủ nhật · 08:00 – 18:00',
  about:
    'Showroom Kia tại TP. Hồ Chí Minh — tư vấn tận tâm, báo giá minh bạch và dịch vụ hậu mãi chính hãng.',
  social: {
    facebook: 'https://facebook.com/kiaphumyhung',
    youtube: 'https://youtube.com/@kiaphumyhung',
    instagram: 'https://instagram.com/kiaphumyhung',
  },
  nav: [
    { label: 'Sản phẩm', href: '#san-pham' },
    { label: 'Dự toán lăn bánh', href: '#du-toan' },
    { label: 'Dịch vụ', href: '#dich-vu' },
    { label: 'Ưu đãi', href: '#uu-dai' },
    { label: 'Liên hệ', href: '#lien-he' },
  ],
}

/** Danh mục xe dùng cho bộ lọc */
export const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'SUV', label: 'SUV' },
  { id: 'Sedan', label: 'Sedan' },
  { id: 'Hatchback', label: 'Hatchback' },
  { id: 'MPV', label: 'MPV / Đa dụng' },
  { id: 'Hybrid', label: 'Hybrid' },
]

/** Tỉnh / thành phố & tỷ lệ lệ phí trước bạ ô tô mới */
export const provinces = [
  { name: 'Hà Nội', registrationRate: 0.12, plateFree: 20_000_000 },
  { name: 'TP. Hồ Chí Minh', registrationRate: 0.1, plateFree: 20_000_000 },
  { name: 'Hải Phòng', registrationRate: 0.1, plateFree: 1_000_000 },
  { name: 'Đà Nẵng', registrationRate: 0.1, plateFree: 1_000_000 },
  { name: 'Cần Thơ', registrationRate: 0.1, plateFree: 1_000_000 },
  { name: 'Tỉnh / thành khác', registrationRate: 0.1, plateFree: 1_000_000 },
]
