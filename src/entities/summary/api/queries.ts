import { useQuery } from '@tanstack/react-query'

import { apiGet, type SpeciesSlug, type SummaryDto } from '@/shared/api'

export const summaryKeys = {
  region: (code: string, species: SpeciesSlug | undefined, period: number) =>
    ['summary', code, species ?? null, period] as const,
}

/** Саммари запрашивается отдельно, чтобы карточка региона не ждала языковую модель. */
export function useRegionSummary(code: string | undefined, species: SpeciesSlug | undefined, period: number) {
  return useQuery({
    queryKey: summaryKeys.region(code ?? '', species, period),
    queryFn: ({ signal }) =>
      apiGet<SummaryDto>(`/regions/${code}/summary`, { signal, params: { species, period } }),
    enabled: Boolean(code),
    staleTime: 30 * 60_000,
  })
}
