import { Application } from './types'

type Payload = {
  data: Application[]
  savedAt: number
}

const KEY = 'job-tracker.applications.v2'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function loadApplications(seed: Application[]): Application[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    const parsed = JSON.parse(raw) as Payload | Application[]
    if (Array.isArray(parsed)) {
      // legacy format without expiry; treat as valid
      return parsed
    }
    if (!parsed || !Array.isArray(parsed.data) || typeof parsed.savedAt !== 'number') {
      return seed
    }
    const age = Date.now() - parsed.savedAt
    if (age > TTL_MS) {
      // expired
      try { localStorage.removeItem(KEY) } catch {}
      return seed
    }
    return parsed.data
  } catch {
    return seed
  }
}

export function saveApplications(apps: Application[]) {
  try {
    const payload: Payload = { data: apps, savedAt: Date.now() }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

export function clearApplications() {
  try { localStorage.removeItem(KEY) } catch {}
}
