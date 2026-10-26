/** Безопасный доступ к Web Storage: в приватном режиме он может быть недоступен. */
export function safeStorage(kind: 'local' | 'session'): Storage | undefined {
  try {
    const storage = kind === 'local' ? window.localStorage : window.sessionStorage
    const probe = '__probe__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return undefined
  }
}
