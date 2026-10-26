import { useQuery } from '@tanstack/react-query'

import { apiGet, type DiseaseDto, type SpeciesSlug } from '@/shared/api'

export const diseaseKeys = {
  all: ['diseases'] as const,
  list: (species?: SpeciesSlug) => [...diseaseKeys.all, 'list', species ?? null] as const,
  detail: (slug: string) => [...diseaseKeys.all, 'detail', slug] as const,
}

export function useDiseases(species?: SpeciesSlug) {
  return useQuery({
    queryKey: diseaseKeys.list(species),
    queryFn: ({ signal }) => apiGet<DiseaseDto[]>('/diseases', { signal, params: { species } }),
    staleTime: 60 * 60_000,
  })
}

export function useDisease(slug: string | undefined) {
  return useQuery({
    queryKey: diseaseKeys.detail(slug ?? ''),
    queryFn: ({ signal }) => apiGet<DiseaseDto>(`/diseases/${slug}`, { signal }),
    enabled: Boolean(slug),
    staleTime: 60 * 60_000,
  })
}
