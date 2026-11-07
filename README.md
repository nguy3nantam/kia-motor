# Kia Phú Mỹ Hưng — Website bán hàng online

Website showroom Kia, thiết kế **tối giản** và tập trung vào **bán hàng online**.

## Chức năng trọng tâm

1. **Form đăng ký báo giá / lái thử** — có validate SĐT Việt Nam và lưu tạm thông tin vào `localStorage` của người dùng. Form chưa gửi dữ liệu tới showroom; khách cần liên hệ trực tiếp cho tới khi tích hợp backend.
2. **Nút liên hệ nổi** — một nút sticky duy nhất (logo KIA), bấm xổ menu: Gọi hotline / Chat Zalo / Nhận tư vấn. Kèm hotline ở header/footer.
3. **Dự toán chi phí lăn bánh** — tính phí trước bạ, biển số, đăng kiểm, phí đường bộ, bảo hiểm… theo tỉnh/thành.

Ngoài ra: slider hero, danh mục xe theo phân khúc, chi tiết xe (phiên bản, màu, thông số), dịch vụ hậu mãi, ưu đãi.

## Trang quản trị

Truy cập: `http://localhost:5173/quan-tri` khi chạy dev hoặc
`http://localhost:4173/quan-tri` khi chạy preview.

- Tài khoản mặc định: `admin` / `kia2026`
- Đổi mật khẩu tại **Cài đặt → Đổi mật khẩu** ngay sau lần đăng nhập đầu tiên.
- Dashboard tổng quan lead, lead mới trong ngày, trạng thái và số xe.
- Quản lý lead: tìm kiếm, lọc, thêm thủ công, đổi trạng thái, ghi chú nội bộ,
  gọi điện, xoá và xuất CSV.
- Quản lý xe: thêm, sửa, xoá, phiên bản, màu, thông số, ảnh, giá và ưu đãi.
- Tùy chỉnh Slider Home: thêm/sửa/xoá, bật/tắt, sắp xếp, chọn xe liên kết
  và dùng ảnh riêng cho từng slide.
- Quản lý user: thêm/sửa/xoá/khoá tài khoản, reset mật khẩu, xem lần đăng nhập
  gần nhất và phân quyền theo vai trò.
- Google Tag: cấu hình GTM và GA4 bằng `VITE_GTM_ID` / `VITE_GA4_ID`, tạo file
  `.env.production`, tự chèn script vào website công khai và bỏ qua `/quan-tri`.
- **Quản trị viên**: toàn quyền. **Nhân viên bán hàng**: dashboard, lead và đổi
  mật khẩu. **Biên tập nội dung**: dashboard, xe, slider và đổi mật khẩu.
- Quản lý thông tin showroom: tên, hotline, Zalo, email, địa chỉ, giờ mở cửa,
  giới thiệu và mạng xã hội.
- Sao lưu/khôi phục toàn bộ dữ liệu bằng file JSON.

> Trang quản trị dùng `localStorage`, nên dữ liệu chỉ tồn tại trên đúng trình
> duyệt/máy đang sử dụng. Mật khẩu phía client chỉ ngăn truy cập tình cờ, không
> phải cơ chế bảo mật thực. Khi triển khai chính thức nên kết nối backend hoặc
> Google Sheet. Hosting production cần cấu hình SPA rewrite để `/quan-tri` trả về
> `index.html`.
>
> Không sử dụng form hoặc trang quản trị hiện tại để tiếp nhận dữ liệu khách hàng
> trên production. Cần tích hợp dịch vụ lưu trữ và xác thực phía server, bảo vệ
> dữ liệu cá nhân, và kiểm tra lại thông tin showroom mẫu trước khi công bố.

## Công nghệ

- React 19 + Vite 8
- Tailwind CSS 4

## Hiệu năng & tài nguyên

- **Không hotlink ra ngoài.** Toàn bộ ảnh, logo và font đều nằm trong `public/`.
- **Ảnh xe định dạng WebP** (giữ nền trong suốt), mỗi ảnh ~20–35 KB.
  Ảnh trong `public/images/cars/` được tham chiếu qua trường `image` trong `src/data/cars.js`.
- **Font Be Vietnam Pro tự host** tại `public/fonts/` (chỉ 2 subset `vietnamese` + `latin`,
  mỗi weight khai báo `unicode-range` nên trình duyệt chỉ tải subset thật sự dùng).
  Muốn thêm weight/ngôn ngữ khác: thêm file `.woff2` vào `public/fonts/` rồi khai báo
  thêm `@font-face` trong `src/index.css`.
- **Ảnh hero ưu tiên tải** (`fetchPriority="high"`), các ảnh còn lại `loading="lazy"`.
- **SEO**: `public/robots.txt`, thẻ Open Graph/Twitter và dữ liệu có cấu trúc
  `AutoDealer` (JSON-LD) trong `index.html`.
- Thông tin mặc định trong `index.html` cần được cập nhật trước khi triển khai:
  trình thu thập dữ liệu và mạng xã hội có thể không chạy JavaScript hoặc không
  đọc dữ liệu đã chỉnh trong `localStorage`. Dùng URL tuyệt đối theo tên miền thật
  cho ảnh chia sẻ, và xác minh dữ liệu có cấu trúc bằng công cụ của Google.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # kiểm thử lưu trữ
npm run build    # build ra thư mục dist/
npm run preview  # xem trước bản build
```

### Google Tag production

Sao chép `.env.example` thành `.env.production`, nhập ID rồi build lại:

```env
VITE_GTM_ID=GTM-ABC1234
VITE_GA4_ID=G-ABCD123456
```

Nếu GA4 đã được cấu hình bên trong GTM, để trống `VITE_GA4_ID` để tránh ghi
nhận page view hai lần. Mục **Google Tag** trong trang quản trị có thể kiểm tra
định dạng ID và tạo file `.env.production` giúp bạn.

## Cấu trúc

```
src/
  admin/          # dashboard + quản lý lead, xe, showroom
  components/     # UI components
  context/        # state dùng chung (lead, chi tiết xe, modal)
  data/           # dữ liệu mẫu: site config + danh sách xe
  lib/            # định dạng, validate, router nhỏ và localStorage
  App.jsx
  main.jsx
  index.css       # design tokens (Tailwind @theme)
```

## Tùy biến

- **Thông tin showroom** (tên, hotline, Zalo, địa chỉ): sửa `src/data/site.js`.
  Nhớ cập nhật số điện thoại/địa chỉ tương ứng trong JSON-LD ở `index.html`.
- **Danh sách xe** (giá, phiên bản, màu, thông số, ưu đãi): sửa `src/data/cars.js`.
- **Màu sắc thương hiệu**: sửa biến `--color-kia-*` trong `src/index.css`.
- **Logo thương hiệu**: các phiên bản logo nằm tại `public/images/brand/`.
- **Tên miền khi triển khai**: đổi các URL tương đối trong `index.html`
  (thẻ `og:image`, JSON-LD) thành URL tuyệt đối, và bổ sung `sitemap.xml`.

> Ảnh từng dòng xe được lưu cục bộ tại `public/images/cars/`, lấy từ website Kia Việt Nam tham khảo.
> Đường dẫn ảnh của từng mẫu được cấu hình bằng trường `image` trong `src/data/cars.js`.
