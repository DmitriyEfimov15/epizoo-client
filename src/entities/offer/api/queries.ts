import { useQuery } from '@tanstack/react-query'

import { apiGet, type OfferDto, type SpeciesSlug } from '@/shared/api'

export function useOffers(region: string | undefined, species?: SpeciesSlug) {
  return useQuery({
    queryKey: ['offers', region ?? '', species ?? null],
    queryFn: ({ signal }) => apiGet<OfferDto[]>('/offers', { signal, params: { region, species } }),
    enabled: Boolean(region),
  })
}
