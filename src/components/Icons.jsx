/**
 * Bộ icon dạng inline SVG (stroke) — nhẹ, không phụ thuộc thư viện ngoài.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Icon = ({ children, size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    {...base}
    {...props}
  >
    {children}
  </svg>
)

export const Phone = (p) => (
  <Icon {...p}>
    <path d="M6.6 3.5h2.2l1.2 3-1.6 1.2a12.5 12.5 0 0 0 5.9 5.9l1.2-1.6 3 1.2v2.2a2 2 0 0 1-2.2 2A16 16 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  </Icon>
)

export const Chat = (p) => (
  <Icon {...p}>
    <path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.1A7.5 7.5 0 1 1 20 12Z" />
    <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
  </Icon>
)

export const Calculator = (p) => (
  <Icon {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2.5" />
    <path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
  </Icon>
)

export const Calendar = (p) => (
  <Icon {...p}>
    <rect x="4" y="5" width="16" height="16" rx="2.5" />
    <path d="M4 9.5h16M8.5 3.5v3M15.5 3.5v3" />
  </Icon>
)

export const ChevronLeft = (p) => (
  <Icon {...p}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </Icon>
)

export const ChevronRight = (p) => (
  <Icon {...p}>
    <path d="M9.5 5.5 16 12l-6.5 6.5" />
  </Icon>
)

export const ArrowRight = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

export const Close = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const Menu = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)

export const Check = (p) => (
  <Icon {...p}>
    <path d="M5 12.5 9.5 17 19 7" />
  </Icon>
)

export const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Icon>
)

export const MapPin = (p) => (
  <Icon {...p}>
    <path d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.4" />
  </Icon>
)

export const Mail = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </Icon>
)

export const Shield = (p) => (
  <Icon {...p}>
    <path d="M12 3.5 19 6v6c0 4.3-3 7.3-7 8.5-4-1.2-7-4.2-7-8.5V6l7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
)

export const Car = (p) => (
  <Icon {...p}>
    <path d="M4 15.5V12l1.8-4.2A2 2 0 0 1 7.6 6.5h8.8a2 2 0 0 1 1.8 1.3L20 12v3.5" />
    <path d="M4 12h16M6 15.5h12" />
    <circle cx="7.5" cy="16.5" r="1.6" />
    <circle cx="16.5" cy="16.5" r="1.6" />
  </Icon>
)

export const Fuel = (p) => (
  <Icon {...p}>
    <path d="M13 4H7a1.5 1.5 0 0 0-1.5 1.5V19A1 1 0 0 0 6.5 20h7a1 1 0 0 0 1-1V4.5A1 1 0 0 0 13 4Z" />
    <path d="M5.5 9h9M14.5 8l3 3v6a1.5 1.5 0 0 0 3 0v-7l-2-2" />
  </Icon>
)

export const Gear = (p) => (
  <Icon {...p}>
    <path d="M6 5v14M6 5h7a3 3 0 0 1 0 6H6m0 0h8l4 8" />
  </Icon>
)

export const Users = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.9M17 19a5.5 5.5 0 0 0-2-4.3" />
  </Icon>
)

export const Sparkle = (p) => (
  <Icon {...p}>
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" />
    <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
  </Icon>
)

export const Route = (p) => (
  <Icon {...p}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18h4a3.5 3.5 0 0 0 0-7h-1a3.5 3.5 0 0 1 0-7h4" />
  </Icon>
)

export const Facebook = (p) => (
  <Icon {...p} strokeWidth={1.6}>
    <path d="M14.5 8.5V7a1.5 1.5 0 0 1 1.5-1.5h1.5V3h-2A3.5 3.5 0 0 0 12 6.5v2H10v3h2V21h2.5v-9.5H17l.5-3h-3Z" />
  </Icon>
)

export const YouTube = (p) => (
  <Icon {...p} strokeWidth={1.6}>
    <rect x="3" y="6" width="18" height="12" rx="3.5" />
    <path d="m11 9.5 3.5 2.5-3.5 2.5v-5Z" fill="currentColor" stroke="none" />
  </Icon>
)

export const Instagram = (p) => (
  <Icon {...p} strokeWidth={1.6}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.4" />
    <path d="M16.5 7.5h.01" />
  </Icon>
)

export const Lock = (p) => (
  <Icon {...p}>
    <rect x="4" y="10" width="16" height="11" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Icon>
)

export const LogOut = (p) => (
  <Icon {...p}>
    <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
    <path d="M17 8l4 4-4 4M21 12H9" />
  </Icon>
)

export const Plus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const Trash = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
    <path d="M10 11v6M14 11v6" />
  </Icon>
)

export const Edit = (p) => (
  <Icon {...p}>
    <path d="M4 20h4L20 8l-4-4L4 16zM14 6l4 4" />
  </Icon>
)

export const Download = (p) => (
  <Icon {...p}>
    <path d="M12 3v12M7 11l5 5 5-5M4 21h16" />
  </Icon>
)

export const Chart = (p) => (
  <Icon {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Icon>
)

export const Settings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 3a7 7 0 0 0-1.7 1L5 6.1 3 9.5 5.1 11a7 7 0 0 0 0 2L3 14.5l2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3h5l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2.1-1.5c.1-.3.1-.7.1-1Z" />
  </Icon>
)

export const Tag = (p) => (
  <Icon {...p}>
    <path d="M3 4v7l9 9 9-9-7-7H3Z" />
    <circle cx="8" cy="9" r="1.2" />
  </Icon>
)

export const Zalo = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 2.6C6.2 2.6 1.6 6.5 1.6 11.3c0 2.7 1.5 5.1 3.9 6.7-.1 1-.6 2.4-1.6 3.4 1.9-.3 3.4-1 4.4-1.7.9.2 2 .4 3.1.4 5.8 0 10.4-3.9 10.4-8.8S17.8 2.6 12 2.6Z"
    />
    <path
      fill="#fff"
      d="M7.1 14.6V8.9h1.2v4.7H11v1h-3.9Zm4.6 0V8.9h1.1v5.7h-1.1Zm2.6 0V8.9h1.1l2.3 3.5V8.9h1.1v5.7h-1.1l-2.3-3.5v3.5h-1.1Z"
    />
  </svg>
)
