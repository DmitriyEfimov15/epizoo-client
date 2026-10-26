import { useQuery } from '@tanstack/react-query'

import { apiGet, type MetaDto } from '@/shared/api'

/** Сведения об актуальности данных: дата последней сводки, источник, дисклеймер. */
export function useReportMeta() {
  return useQuery({
    queryKey: ['meta'],
    queryFn: ({ signal }) => apiGet<MetaDto>('/meta', { signal }),
    staleTime: 10 * 60_000,
  })
}
