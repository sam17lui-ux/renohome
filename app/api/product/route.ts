import { NextResponse } from 'next/server'

// Retailer-agnostic product extractor.
// Reads a product page's structured metadata (JSON-LD Product, Open Graph,
// itemprop/meta fallbacks) and returns the key fields the app needs.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// hostname fragment / site-name -> canonical retailer
const RETAILER_MATCHERS: { test: RegExp; name: string }[] = [
  { test: /diy\.com|b\s*&\s*q|b and q|\bbandq\b/i, name: 'B&Q' },
  { test: /ikea/i, name: 'IKEA' },
  { test: /wayfair/i, name: 'Wayfair' },
  { test: /dunelm/i, name: 'Dunelm' },
]

const CURRENCY_SYMBOL: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  '£': '£',
  $: '$',
  '€': '€',
}

type Extracted = {
  ok: boolean
  name?: string
  price?: number
  currency?: string
  retailer?: string
  source?: string
  image?: string
  inStock?: boolean
  error?: string
}

function mapRetailer(...candidates: (string | undefined)[]): string {
  const hay = candidates.filter(Boolean).join(' ')
  for (const m of RETAILER_MATCHERS) if (m.test.test(hay)) return m.name
  return 'Other'
}

function parsePrice(raw: unknown): number | undefined {
  if (raw == null) return undefined
  if (typeof raw === 'number') return isFinite(raw) ? raw : undefined
  let str = String(raw).trim()
  if (!str) return undefined
  // keep digits, separators; drop currency symbols/letters
  str = str.replace(/[^0-9.,]/g, '')
  if (!str) return undefined
  // normalise thousands/decimal: if both , and . present, the last one is the decimal
  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) str = str.replace(/\./g, '').replace(',', '.')
    else str = str.replace(/,/g, '')
  } else if (str.includes(',')) {
    // treat comma as decimal only if it looks like one (e.g. 18,50)
    str = /,\d{2}$/.test(str) ? str.replace(',', '.') : str.replace(/,/g, '')
  }
  const n = parseFloat(str)
  return isFinite(n) ? n : undefined
}

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase()
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return true
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h)) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true
  if (h === '::1' || h === '[::1]') return true
  return false
}

// ---- meta / json-ld parsing ----

function metaContent(html: string, key: string): string | undefined {
  // property="og:title" content="..."  (either attribute order)
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${key}["'][^>]*?content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*?(?:property|name|itemprop)=["']${key}["']`, 'i'),
  ]
  for (const p of patterns) {
    const m = p.exec(html)
    if (m) return decodeEntities(m[1].trim())
  }
  return undefined
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
}

function collectJsonLd(html: string): unknown[] {
  const out: unknown[] = []
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const raw = m[1].trim()
    if (!raw) continue
    try {
      out.push(JSON.parse(raw))
    } catch {
      // some sites embed multiple objects or trailing commas — try a lenient recovery
      try {
        out.push(JSON.parse(raw.replace(/,\s*([}\]])/g, '$1')))
      } catch {
        /* ignore malformed block */
      }
    }
  }
  return out
}

function flattenLd(node: unknown, acc: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (!node) return acc
  if (Array.isArray(node)) {
    node.forEach((n) => flattenLd(n, acc))
    return acc
  }
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>
    acc.push(obj)
    if (obj['@graph']) flattenLd(obj['@graph'], acc)
  }
  return acc
}

function typeIncludes(t: unknown, name: string): boolean {
  if (typeof t === 'string') return t.toLowerCase() === name.toLowerCase()
  if (Array.isArray(t)) return t.some((x) => typeof x === 'string' && x.toLowerCase() === name.toLowerCase())
  return false
}

function offerPrice(offers: unknown): { price?: number; currency?: string; inStock?: boolean } {
  const list = Array.isArray(offers) ? offers : offers ? [offers] : []
  for (const o of list) {
    if (!o || typeof o !== 'object') continue
    const off = o as Record<string, unknown>
    const spec = off.priceSpecification as Record<string, unknown> | undefined
    const price =
      parsePrice(off.price) ??
      parsePrice(off.lowPrice) ??
      parsePrice(spec?.price) ??
      parsePrice((off as Record<string, unknown>).highPrice)
    if (price != null) {
      const currency = String(off.priceCurrency || spec?.priceCurrency || '') || undefined
      const avail = String(off.availability || '')
      const inStock = avail ? /InStock|LimitedAvailability|PreOrder/i.test(avail) : undefined
      return { price, currency, inStock }
    }
  }
  return {}
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const target = (searchParams.get('url') || '').trim()

  if (!target) return NextResponse.json<Extracted>({ ok: false, error: 'No URL provided.' }, { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return NextResponse.json<Extracted>({ ok: false, error: 'That doesn’t look like a valid link.' }, { status: 400 })
  }
  if (!/^https?:$/.test(parsed.protocol))
    return NextResponse.json<Extracted>({ ok: false, error: 'Only http(s) links are supported.' }, { status: 400 })
  if (isPrivateHost(parsed.hostname))
    return NextResponse.json<Extracted>({ ok: false, error: 'That host isn’t allowed.' }, { status: 400 })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  let html = ''
  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
    })
    if (!res.ok)
      return NextResponse.json<Extracted>(
        { ok: false, error: `The page returned ${res.status}. Enter the details manually.` },
        { status: 200 },
      )
    const reader = res.body?.getReader()
    if (reader) {
      const decoder = new TextDecoder()
      let received = 0
      const MAX = 2_000_000 // 2MB cap
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        received += value.byteLength
        html += decoder.decode(value, { stream: true })
        if (received > MAX) {
          try {
            await reader.cancel()
          } catch {}
          break
        }
      }
    } else {
      html = await res.text()
    }
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError'
    return NextResponse.json<Extracted>(
      { ok: false, error: aborted ? 'The page took too long to load.' : 'Couldn’t reach that page. Enter the details manually.' },
      { status: 200 },
    )
  } finally {
    clearTimeout(timer)
  }

  // ----- structured data -----
  const ldNodes = collectJsonLd(html).flatMap((n) => flattenLd(n))
  const product = ldNodes.find((o) => typeIncludes(o['@type'], 'Product'))

  let name: string | undefined
  let price: number | undefined
  let currency: string | undefined
  let image: string | undefined
  let inStock: boolean | undefined
  let siteName: string | undefined

  if (product) {
    name = typeof product.name === 'string' ? decodeEntities(product.name) : undefined
    const op = offerPrice(product.offers)
    price = op.price
    currency = op.currency
    inStock = op.inStock
    const img = product.image
    image = typeof img === 'string' ? img : Array.isArray(img) && typeof img[0] === 'string' ? img[0] : undefined
    const brand = product.brand
    if (typeof brand === 'string') siteName = brand
    else if (brand && typeof brand === 'object') siteName = String((brand as Record<string, unknown>).name || '')
  }

  // ----- meta fallbacks -----
  siteName = siteName || metaContent(html, 'og:site_name')
  if (!name) name = metaContent(html, 'og:title') || metaContent(html, 'twitter:title')
  if (!name) {
    const t = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)
    if (t) name = decodeEntities(t[1].trim())
  }
  if (price == null)
    price =
      parsePrice(metaContent(html, 'product:price:amount')) ??
      parsePrice(metaContent(html, 'og:price:amount')) ??
      parsePrice(metaContent(html, 'twitter:data1')) ??
      parsePrice(metaContent(html, 'price'))
  currency = currency || metaContent(html, 'product:price:currency') || metaContent(html, 'og:price:currency')
  if (!image) image = metaContent(html, 'og:image')
  if (inStock == null) {
    const avail = metaContent(html, 'og:availability') || metaContent(html, 'product:availability')
    if (avail) inStock = /instock|in stock|available/i.test(avail)
  }

  const retailer = mapRetailer(siteName, parsed.hostname)
  const currencySymbol = currency ? CURRENCY_SYMBOL[currency.toUpperCase()] || currency : undefined

  if (!name && price == null)
    return NextResponse.json<Extracted>(
      { ok: false, error: 'Couldn’t read product details from that page. Enter them manually.', retailer, source: parsed.hostname },
      { status: 200 },
    )

  return NextResponse.json<Extracted>({
    ok: true,
    name: name?.slice(0, 160),
    price,
    currency: currencySymbol,
    retailer,
    source: siteName || parsed.hostname,
    image,
    inStock,
  })
}
