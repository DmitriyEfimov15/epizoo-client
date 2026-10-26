import { ApiError, apiGet, buildUrl } from './client'

afterEach(() => vi.unstubAllGlobals())

it('buildUrl отбрасывает пустые параметры', () => {
  expect(buildUrl('/map', { species: 'cattle', disease: undefined, period: 30, x: '' })).toBe(
    '/api/v1/map?species=cattle&period=30',
  )
})

it('превращает ответ с ошибкой в ApiError с кодом и сообщением бэкенда', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ code: 'not_found', message: 'Регион не найден' }), { status: 404 })),
  )
  await expect(apiGet('/regions/00')).rejects.toMatchObject({ status: 404, code: 'not_found', message: 'Регион не найден' })
})

it('сообщает о сетевой ошибке понятным текстом', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))))
  const error = await apiGet('/meta').catch((e: unknown) => e)
  expect(error).toBeInstanceOf(ApiError)
  expect((error as ApiError).code).toBe('network_error')
})
