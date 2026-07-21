import type { CSSProperties } from 'react'

/**
 * Parse a CSS declaration string (e.g. "display:flex; gap:8px; color:#2C2A26;")
 * into a React style object. Lets us port the design prototype's inline styles
 * almost verbatim while keeping full fidelity on colors, radii and spacing.
 *
 * Declarations are split on ";" and each property/value on the first ":".
 * Property names are camelCased; custom properties (--x) are passed through.
 */
export function s(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i === -1) continue
    const rawProp = decl.slice(0, i).trim()
    const value = decl.slice(i + 1).trim()
    if (!rawProp || !value) continue
    const prop = rawProp.startsWith('--')
      ? rawProp
      : rawProp.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    out[prop] = value
  }
  return out as CSSProperties
}
