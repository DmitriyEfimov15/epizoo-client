import { useQuery } from '@tanstack/react-query'

import { apiGet, type RouteResultDto, type SpeciesSlug } from '@/shared/api'

export interface RouteParams {
  from: string
  to: string
  species: SpeciesSlug
}

export function useRouteCheck(params: RouteParams | null) {
  return useQuery({
    queryKey: ['route-check', params],
    queryFn: ({ signal }) =>
      apiGet<RouteResultDto>('/route-check', {
        signal,
        params: params ? { from: params.from, to: params.to, species: params.species } : undefined,
      }),
    enabled: Boolean(params),
  })
}
