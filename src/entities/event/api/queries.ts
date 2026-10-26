import { useInfiniteQuery } from '@tanstack/react-query'

import { apiGet, type EventKind, type EventPageDto, type SpeciesSlug } from '@/shared/api'

export interface EventFilters {
  region?: string
  disease?: string
  species?: SpeciesSlug
  kind?: EventKind
  from?: string
  to?: string
}

const PAGE_SIZE = 20

export const eventKeys = {
  all: ['events'] as const,
  list: (filters: EventFilters) => [...eventKeys.all, 'list', filters] as const,
}

export function useEventsInfinite(filters: EventFilters) {
  return useInfiniteQuery({
    queryKey: eventKeys.list(filters),
    queryFn: ({ pageParam, signal }) =>
      apiGet<EventPageDto>('/events', {
        signal,
        params: { ...filters, page: pageParam, page_size: PAGE_SIZE },
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page * last.page_size < last.total ? last.page + 1 : undefined,
  })
}
