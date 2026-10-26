import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { safeStorage } from '@/shared/lib'

interface FarmState {
  /** UUID анонимного профиля хозяйства — единственный ключ доступа, хранится только в браузере. */
  token: string | null
  setToken: (token: string) => void
  reset: () => void
}

const memory = new Map<string, string>()
const fallback: Storage = {
  get length() {
    return memory.size
  },
  clear: () => memory.clear(),
  getItem: (key) => memory.get(key) ?? null,
  key: (index) => [...memory.keys()][index] ?? null,
  removeItem: (key) => void memory.delete(key),
  setItem: (key, value) => void memory.set(key, value),
}

export const useFarmStore = create<FarmState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      reset: () => set({ token: null }),
    }),
    {
      name: 'epizoo-farm',
      storage: createJSONStorage(() => safeStorage('local') ?? fallback),
    },
  ),
)

export const useFarmToken = () => useFarmStore((state) => state.token)
