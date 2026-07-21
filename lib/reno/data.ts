// ============================================================
// Reno Board — types, constants, seed data & formatting helpers
// ============================================================

export type ColumnId = 'ideas' | 'quotes' | 'started' | 'hold' | 'complete'

export type Job = {
  id: string
  title: string
  room: string
  column: ColumnId
  cost: number
  contractor?: string
  contact?: string
  due?: string
}

export type Product = {
  id: string
  name: string
  retailer: string
  room: string
  jobId?: string | null
  bought: boolean
  price: number
  target: number
  history: number[]
  discountCode?: string
  discountPrice?: number
  discountExpiry?: string
  backInStock?: boolean
  link?: string
}

export type Project = {
  id: string
  name: string
  rooms: string[]
  budgetTotal: number
  jobs: Job[]
  products: Product[]
}

// font stacks — the literal family names resolve via the Google Fonts <link>
export const SERIF =
  "'Recoleta','Canela','Newsreader',Georgia,serif"
export const SANS = "'Geist',system-ui,sans-serif"
export const MONO = "'Geist Mono',monospace"

export const CURRENCY = '£'

export const COLUMNS: { id: ColumnId; label: string; accent: string }[] = [
  { id: 'ideas', label: 'Ideas', accent: '#A7A093' },
  { id: 'quotes', label: 'Getting Quotes', accent: '#D29A6B' },
  { id: 'started', label: 'Work Started', accent: '#a96e4f' },
  { id: 'hold', label: 'On Hold', accent: '#C2933C' },
  { id: 'complete', label: 'Complete', accent: '#9CAF88' },
]

export const RETAILERS = ['B&Q', 'IKEA', 'Wayfair', 'Dunelm', 'Other']

export const RETAILER_URL: Record<string, string> = {
  'B&Q': 'https://www.diy.com',
  IKEA: 'https://www.ikea.com/gb/en/',
  Wayfair: 'https://www.wayfair.co.uk',
  Dunelm: 'https://www.dunelm.com',
  Other: '#',
}

export const ONB_PRESETS = [
  'Kitchen',
  'Bathroom',
  'Living room',
  'Bedroom',
  'Master bedroom',
  'Ensuite',
  'Dining room',
  'Hallway',
  'Home office',
  'Laundry',
  'Garage',
  'Garden',
]

export const ONB_DOTS = ['#a96e4f', '#C2933C', '#677A53', '#9A9079']

export const ROOM_PALETTE = [
  '#A96E4F',
  '#9CAF88',
  '#C2933C',
  '#677A53',
  '#D29A6B',
  '#A7A093',
  '#76805E',
  '#B0723F',
]

export const ROOM_COLORS: Record<string, string> = {
  Kitchen: '#A96E4F',
  Bathroom: '#9CAF88',
  'Living Room': '#B0723F',
  'Main Bedroom': '#76805E',
  'Spare Bedroom': '#D29A6B',
  Hallway: '#A7A093',
  'Whole house': '#C2933C',
}

export function roomColor(name: string, i = 0): string {
  return ROOM_COLORS[name] || ROOM_PALETTE[i % ROOM_PALETTE.length]
}

// ---------- seed project ----------

const SEED_JOBS: Job[] = [
  { id: 'j1', title: 'Open up under-stairs storage', room: 'Hallway', cost: 0, column: 'ideas' },
  { id: 'j2', title: 'Replace kitchen splashback', room: 'Kitchen', cost: 480, column: 'ideas' },
  { id: 'j3', title: 'Add wardrobe to spare room', room: 'Spare Bedroom', cost: 1200, column: 'ideas' },
  { id: 'j4', title: 'Rewire ground floor', room: 'Whole house', cost: 3400, contractor: 'Marsh Electrical', due: 'Quote by 22 Jun', column: 'quotes' },
  { id: 'j5', title: 'Retile bathroom floor', room: 'Bathroom', cost: 1650, contractor: 'Awaiting two more', column: 'quotes' },
  { id: 'j6', title: 'Paint living room', room: 'Living Room', cost: 620, contractor: 'Self', due: 'Due 18 Jun', column: 'started' },
  { id: 'j7', title: 'Fit new kitchen units', room: 'Kitchen', cost: 5800, contractor: 'Holloway Joinery', due: 'Due 27 Jun', column: 'started' },
  { id: 'j8', title: 'Replace bedroom carpet', room: 'Main Bedroom', cost: 740, contractor: 'Waiting on flooring choice', column: 'hold' },
  { id: 'j9', title: 'Plaster hallway walls', room: 'Hallway', cost: 880, contractor: 'D. Pryce Plastering', column: 'complete' },
  { id: 'j10', title: 'Replace front door', room: 'Hallway', cost: 1320, contractor: 'Self', column: 'complete' },
]

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Metro ceramic wall tiles, 20×10cm (per m²)', retailer: 'B&Q', room: 'Kitchen', jobId: 'j2', bought: false, backInStock: true, price: 18.5, target: 16, history: [22, 21.5, 21, 20, 19.5, 18.5] },
  { id: 'p2', name: 'METOD base cabinet frame, 60cm', retailer: 'IKEA', room: 'Kitchen', jobId: 'j7', bought: false, price: 64, target: 60, history: [72, 70, 68, 67, 64, 64], discountCode: 'KITCHEN10', discountPrice: 57.6, discountExpiry: 'ends 30 Jun' },
  { id: 'p3', name: 'Brushed brass mixer tap', retailer: 'Wayfair', room: 'Bathroom', jobId: 'j5', bought: false, price: 58, target: 60, history: [89, 84, 79, 72, 65, 58] },
  { id: 'p4', name: 'Chunky knit wool rug, 160×230cm', retailer: 'Dunelm', room: 'Living Room', jobId: 'j6', bought: false, price: 99, target: 85, history: [129, 129, 119, 110, 105, 99] },
  { id: 'p5', name: 'Matte emulsion, Clay Earth 2.5L', retailer: 'B&Q', room: 'Living Room', jobId: 'j6', bought: true, price: 32, target: 30, history: [34, 34, 33, 32, 32, 32] },
  { id: 'p6', name: 'Engineered oak flooring (per m²)', retailer: 'Wayfair', room: 'Main Bedroom', jobId: 'j8', bought: false, price: 41, target: 42, history: [49, 48, 46, 45, 43, 41], discountCode: 'FLOOR15', discountPrice: 34.85, discountExpiry: 'ends 24 Jun' },
  { id: 'p7', name: 'Freestanding bath, 1700mm', retailer: 'Dunelm', room: 'Bathroom', jobId: null, bought: true, price: 430, target: 380, history: [430, 430, 430, 425, 430, 430] },
  { id: 'p8', name: 'PAX wardrobe frame, 100cm', retailer: 'IKEA', room: 'Spare Bedroom', jobId: 'j3', bought: false, price: 124, target: 110, history: [116, 118, 120, 120, 122, 124] },
]

export function makeMapleStreet(): Project {
  return {
    id: 'maple',
    name: 'Maple Street',
    rooms: ['Kitchen', 'Bathroom', 'Living Room', 'Main Bedroom', 'Spare Bedroom', 'Hallway', 'Whole house'],
    budgetTotal: 24000,
    jobs: SEED_JOBS.map((j) => ({ ...j })),
    products: SEED_PRODUCTS.map((p) => ({ ...p, history: [...p.history] })),
  }
}

// ---------- formatting helpers ----------

export function gbp(v: number | null | undefined): string {
  const sym = CURRENCY
  if (v == null || isNaN(v as number)) return sym + '0'
  const n = Number(v)
  return (
    sym +
    (Number.isInteger(n)
      ? n.toLocaleString('en-GB')
      : n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  )
}

export function plural(n: number, w: string): string {
  return `${n} ${w}${n === 1 ? '' : 's'}`
}

export function effective(p: Product): number {
  return p.discountPrice != null ? p.discountPrice : p.price
}

export function fmt(n: number | string): string {
  return Number(n || 0).toLocaleString('en-GB')
}

export type Spark = {
  d: string
  lastX: number
  lastY: number
  targetY: number | null
  width: number
  height: number
}

export function spark(
  data: number[],
  target: number | null,
  width = 96,
  height = 34,
): Spark {
  const pad = 4
  if (!data || data.length < 2)
    return { d: '', lastX: 0, lastY: 0, targetY: null, width, height }
  const all = target != null ? [...data, target] : data
  const min = Math.min(...all)
  const max = Math.max(...all)
  const range = max - min || 1
  const x = (i: number) => pad + (i / (data.length - 1)) * (width - pad * 2)
  const y = (v: number) => pad + (1 - (v - min) / range) * (height - pad * 2)
  let d = `M ${x(0).toFixed(1)} ${y(data[0]).toFixed(1)}`
  for (let i = 1; i < data.length; i++) {
    const xc = (x(i - 1) + x(i)) / 2
    const yc = (y(data[i - 1]) + y(data[i])) / 2
    d += ` Q ${x(i - 1).toFixed(1)} ${y(data[i - 1]).toFixed(1)} ${xc.toFixed(1)} ${yc.toFixed(1)}`
  }
  d += ` T ${x(data.length - 1).toFixed(1)} ${y(data[data.length - 1]).toFixed(1)}`
  return {
    d,
    lastX: +x(data.length - 1).toFixed(1),
    lastY: +y(data[data.length - 1]).toFixed(1),
    targetY: target != null ? +y(target).toFixed(1) : null,
    width,
    height,
  }
}
