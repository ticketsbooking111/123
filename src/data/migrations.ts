import { getDB } from './db'

/**
 * Simple, idempotent app-level migration manager.
 * We store schemaVersion in meta('schemaVersion') and run upgrades accordingly.
 */
export async function migrate(targetVersion: number) {
  const db = getDB()
  await db.open()
  const currentKV = await db.meta.get('schemaVersion')
  const current = currentKV ? parseInt(currentKV.value) : 1

  for (let v = current; v < targetVersion; v++) {
    const next = v + 1
    // Example migration: ensure 'checksUntil' exists on leases (v2 change)
    if (next === 2) {
      await db.transaction('rw', db.leases, async () => {
        const all = await db.leases.toArray()
        await Promise.all(
          all.map(l => {
            if (!('checksUntil' in l)) {
              // Assign explicitly to make shape consistent
              ;(l as any).checksUntil = undefined
              return db.leases.put(l)
            }
            return Promise.resolve()
          })
        )
      })
    }
    // Future migrations can be added here (if (next === 3) { ... })
    await db.meta.put({ key: 'schemaVersion', value: String(next) })
  }

  if (!currentKV) {
    // initialize schemaVersion if was not set
    await db.meta.put({ key: 'schemaVersion', value: String(current) })
  }
}
