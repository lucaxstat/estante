let docs = []
let nextId = 1

export function insertDoc(doc) {
  const id = String(nextId++)
  const now = new Date().toISOString()
  const record = Object.assign({ id, created_at: now }, doc)
  docs.unshift(record)
  return record
}

export function listDocs() {
  return docs
}

export function updateDoc(updated) {
  const idx = docs.findIndex((d) => d.id === String(updated.id))
  if (idx === -1) return null
  docs[idx] = Object.assign({}, docs[idx], updated)
  return docs[idx]
}

export function deleteDoc(id) {
  const idx = docs.findIndex((d) => d.id === String(id))
  if (idx === -1) return false
  docs.splice(idx, 1)
  return true
}

export function distinctTags() {
  const s = new Set()
  docs.forEach((d) => (d.tags || []).forEach((t) => s.add(t)))
  return Array.from(s)
}
