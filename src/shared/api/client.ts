import { API_BASE_URL } from '@/shared/config'

/** Ошибка API в едином формате бэкенда `{code, message}`. */
export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue>

export function buildUrl(path: string, params?: QueryParams): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  }
  const query = search.toString()
  return `${API_BASE_URL}${path}${query ? `?${query}` : ''}`
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { code?: string; message?: string }
    return new ApiError(
      response.status,
      body.code ?? 'http_error',
      body.message ?? 'Сервис временно недоступен',
    )
  } catch {
    return new ApiError(response.status, 'http_error', 'Сервис временно недоступен')
  }
}

interface RequestOptions {
  params?: QueryParams
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export async function request(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  { params, body, headers, signal }: RequestOptions = {},
): Promise<Response> {
  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'network_error', 'Нет связи с сервисом. Проверьте подключение.')
  }
  if (!response.ok) throw await toApiError(response)
  return response
}

export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  return (await request('GET', path, options)).json() as Promise<T>
}

export async function apiSend<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await request(method, path, options)
  return (response.status === 204 ? undefined : await response.json()) as T
}
