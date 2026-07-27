import type { Job, Product, Project } from './data'

// Bump this if the persisted shape changes in a breaking way — old data
// under a previous key is simply ignored rather than crashing the app.
const STORAGE_KEY = 'reno-board:v1'

type Persisted = { projects: Project[]; activeId: string }

function isJob(x: unknown): x is Job {
  if (!x || typeof x !== 'object') return false
  const j = x as Record<string, unknown>
  return typeof j.id === 'string' && typeof j.title === 'string' && typeof j.room === 'string' && typeof j.column === 'string'
}

function isProduct(x: unknown): x is Product {
  if (!x || typeof x !== 'object') return false
  const p = x as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.retailer === 'string' &&
    typeof p.price === 'number' &&
    Array.isArray(p.history)
  )
}

function isProject(x: unknown): x is Project {
  if (!x || typeof x !== 'object') return false
  const p = x as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    Array.isArray(p.rooms) &&
    typeof p.budgetTotal === 'number' &&
    Array.isArray(p.jobs) &&
    p.jobs.every(isJob) &&
    Array.isArray(p.products) &&
    p.products.every(isProduct)
  )
}

function isPersisted(x: unknown): x is Persisted {
  if (!x || typeof x !== 'object') return false
  const p = x as Record<string, unknown>
  return Array.isArray(p.projects) && p.projects.length > 0 && p.projects.every(isProject) && typeof p.activeId === 'string'
}

/** Reads and validates saved app data. Returns null if absent, corrupt, or on a server render. */
export function loadState(): Persisted | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isPersisted(parsed) ? parsed : null
  } catch {
    // corrupt JSON, storage disabled, or quota/security error — fall back to seed data
    return null
  }
}

/** Persists projects + the active project id. Silently no-ops on the server or if storage is unavailable. */
export function saveState(projects: Project[], activeId: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, activeId }))
  } catch {
    // e.g. storage quota exceeded or disabled — losing persistence silently is
    // preferable to crashing the app over a save that was never guaranteed
  }
}
