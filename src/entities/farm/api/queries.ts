import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  apiGet,
  apiSend,
  type DashboardDto,
  type DigestDto,
  type FarmDto,
  type FarmInDto,
} from '@/shared/api'

export const farmKeys = {
  all: ['farm'] as const,
  detail: (token: string) => [...farmKeys.all, token] as const,
  dashboard: (token: string) => [...farmKeys.all, token, 'dashboard'] as const,
  digest: (token: string) => [...farmKeys.all, token, 'digest'] as const,
}

export function useFarm(token: string | null) {
  return useQuery({
    queryKey: farmKeys.detail(token ?? ''),
    queryFn: ({ signal }) => apiGet<FarmDto>(`/farms/${token}`, { signal }),
    enabled: Boolean(token),
  })
}

export function useFarmDashboard(token: string | null) {
  return useQuery({
    queryKey: farmKeys.dashboard(token ?? ''),
    queryFn: ({ signal }) => apiGet<DashboardDto>(`/farms/${token}/dashboard`, { signal }),
    enabled: Boolean(token),
  })
}

export function useFarmDigest(token: string | null) {
  return useQuery({
    queryKey: farmKeys.digest(token ?? ''),
    queryFn: ({ signal }) => apiGet<DigestDto>(`/farms/${token}/digest`, { signal }),
    enabled: Boolean(token),
  })
}

/** Создание или обновление профиля: при наличии токена — PUT, иначе — POST. */
export function useSaveFarm() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ token, farm }: { token: string | null; farm: FarmInDto }) =>
      token
        ? apiSend<FarmDto>('PUT', `/farms/${token}`, { body: farm })
        : apiSend<FarmDto>('POST', '/farms', { body: farm }),
    onSuccess: (farm) => {
      client.setQueryData(farmKeys.detail(farm.token), farm)
      return client.invalidateQueries({ queryKey: farmKeys.detail(farm.token) })
    },
  })
}
