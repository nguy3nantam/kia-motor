import { afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { loadLeads, saveLead, STORAGE_KEYS } from '../src/lib/store.js'

function mockStorage() {
  const values = new Map()
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  return values
}

afterEach(() => {
  delete globalThis.localStorage
})

test('saveLead persists and returns the new lead', () => {
  const values = mockStorage()
  const result = saveLead({ name: 'Test', phone: '0901234567' })

  assert.equal(result.length, 1)
  assert.equal(result[0].name, 'Test')
  assert.ok(result[0].id)
  assert.deepEqual(JSON.parse(values.get(STORAGE_KEYS.leads)), result)
  assert.deepEqual(loadLeads(), result)
})

test('saveLead reports storage failure without replacing existing data', () => {
  const values = mockStorage()
  const existing = [{ id: 'existing', createdAt: '2026-01-01T00:00:00.000Z' }]
  values.set(STORAGE_KEYS.leads, JSON.stringify(existing))
  globalThis.localStorage.setItem = () => { throw new Error('Storage unavailable') }

  assert.equal(saveLead({ name: 'Test' }), null)
  assert.deepEqual(JSON.parse(values.get(STORAGE_KEYS.leads)), existing)
})
