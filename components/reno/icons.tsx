import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
  sw?: number | string
}

function Icon({ size = 16, sw = 2, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
export const ArrowLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Icon>
)
export const Plus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const X = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
)
export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
)
export const ChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
)
export const ChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 18l6-6-6-6" />
  </Icon>
)
export const Home = (p: IconProps) => (
  <Icon sw={1.6} {...p}>
    <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Icon>
)
export const Bars = (p: IconProps) => (
  <Icon sw={1.7} {...p}>
    <rect x="3" y="4" width="5" height="16" rx="1.5" />
    <rect x="10" y="4" width="5" height="11" rx="1.5" />
    <rect x="17" y="4" width="4" height="7" rx="1.5" />
  </Icon>
)
export const Grid = (p: IconProps) => (
  <Icon sw={1.7} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Icon>
)
export const Tag = (p: IconProps) => (
  <Icon sw={1.7} {...p}>
    <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2.6 12.6A2 2 0 0 1 2 11.18V4a2 2 0 0 1 2-2h7.18a2 2 0 0 1 1.41.59l8 8a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1.3" fill="currentColor" stroke="none" />
  </Icon>
)
export const Play = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M8 5v14l11-7z" />
  </svg>
)
export const User = (p: IconProps) => (
  <Icon sw={1.8} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
)
export const Calendar = (p: IconProps) => (
  <Icon sw={1.8} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
)
export const Eye = (p: IconProps) => (
  <Icon sw={1.8} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)
export const Coin = (p: IconProps) => (
  <Icon sw={1.7} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M14.5 9.5a3 3 0 0 0-5 2.2c0 2 4 1.6 4 3.6a3 3 0 0 1-5 2.2" />
  </Icon>
)
export const TrendingDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M16 17h6v-6" />
    <path d="m22 17-8.5-8.5-5 5L2 7" />
  </Icon>
)
export const TrendingUp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M16 7h6v6" />
    <path d="m22 7-8.5 8.5-5-5L2 17" />
  </Icon>
)
export const Box = (p: IconProps) => (
  <Icon sw={1.8} {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </Icon>
)
export const Ticket = (p: IconProps) => (
  <Icon sw={1.7} {...p}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    <path d="M9 9h.01M15 9l-6 6" />
  </Icon>
)
export const Pencil = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Icon>
)
export const ExternalLink = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M7 7h10v10" />
  </Icon>
)
export const LinkChain = (p: IconProps) => (
  <Icon sw={1.8} {...p}>
    <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" />
  </Icon>
)
export const Refresh = (p: IconProps) => (
  <Icon sw={2} {...p}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </Icon>
)
export const Gauge = (p: IconProps) => (
  <Icon sw={1.6} {...p}>
    <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9" />
    <path d="M12 12l4.5-3" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
)
