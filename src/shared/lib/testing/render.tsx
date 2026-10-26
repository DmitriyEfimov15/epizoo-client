import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

/** Рендер с роутером и изолированным QueryClient (без повторов запросов). */
export function renderWithProviders(ui: ReactElement, { route = '/', ...options }: RenderOptions & { route?: string } = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
  return { client, ...render(ui, { wrapper: Wrapper, ...options }) }
}

/** Подменяет fetch: ответы по префиксу пути API. */
export function mockFetch(routes: Record<string, unknown>) {
  const calls: { url: string; init?: RequestInit }[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string, init?: RequestInit) => {
      calls.push({ url: input, init })
      const path = input.replace(/^\/api\/v1/, '').split('?')[0] ?? ''
      const key = Object.keys(routes).find((prefix) => path === prefix || path.startsWith(`${prefix}/`))
      if (key === undefined) return new Response(JSON.stringify({ code: 'not_found', message: 'Нет мока' }), { status: 404 })
      const body = routes[key]
      if (body instanceof Response) return body
      return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }),
  )
  return calls
}
