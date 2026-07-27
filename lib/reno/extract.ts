// Client helper for the server-side product extractor (/api/product).

export type Extracted = {
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

export async function extractProduct(url: string): Promise<Extracted> {
  try {
    const r = await fetch('/api/product?url=' + encodeURIComponent(url), {
      headers: { accept: 'application/json' },
    })
    return (await r.json()) as Extracted
  } catch {
    return { ok: false, error: 'Couldn’t reach the extractor. Enter the details manually.' }
  }
}
