import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiSend, type SubscriptionDto, type SubscriptionInDto, type TelegramLinkDto } from '@/shared/api'

/** Ключ дашборда хозяйства: подписка приходит в его составе. */
const dashboardKey = (token: string) => ['farm', token, 'dashboard'] as const

export const DEFAULT_SUBSCRIPTION: SubscriptionInDto = {
  min_level: 3,
  include_neighbors: true,
  digest_enabled: true,
}

export function useTelegramLink(token: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => apiSend<TelegramLinkDto>('POST', `/farms/${token}/telegram-link`),
    onSuccess: () => client.invalidateQueries({ queryKey: dashboardKey(token) }),
  })
}

export function useUpdateSubscription(token: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (settings: SubscriptionInDto) =>
      apiSend<SubscriptionDto>('PUT', `/farms/${token}/subscription`, { body: settings }),
    onSuccess: () => client.invalidateQueries({ queryKey: dashboardKey(token) }),
  })
}

export function useDeleteSubscription(token: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => apiSend<void>('DELETE', `/farms/${token}/subscription`),
    onSuccess: () => client.invalidateQueries({ queryKey: dashboardKey(token) }),
  })
}
