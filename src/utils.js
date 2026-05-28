import { STORAGE_KEY } from './constants'

export function mod(v) {
  const m = Math.floor((v - 10) / 2)
  return (m >= 0 ? '+' : '') + m
}

export function parseGMReply(text) {
  const match = text.match(/===JSON_START===\s*([\s\S]*?)\s*===JSON_END===/)
  let charData = null
  let cleanText = text
  if (match) {
    try { charData = JSON.parse(match[1]) } catch {}
    cleanText = text.replace(/===JSON_START===[\s\S]*?===JSON_END===/g, '').trim()
  }
  return { cleanText, charData }
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function writeSave(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function clearSave() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export function exportSave(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `pf_save_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}
