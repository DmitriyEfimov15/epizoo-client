import { useQuery } from '@tanstack/react-query'
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import {
  apiGet,
  type HistoryPointDto,
  type MapRegionDto,
  type RegionDto,
  type RegionRefDto,
  type SpeciesSlug,
} from '@/shared/api'
import { GEOMETRY_URL } from '@/shared/config'

import type { MonitoringFilters } from '../model/filters'

export const regionKeys = {
  all: ['regions'] as const,
  refs: () => [...regionKeys.all, 'refs'] as const,
  map: (filters: MonitoringFilters) => [...regionKeys.all, 'map', filters] as const,
  detail: (code: string, species: SpeciesSlug | undefined, period: number) =>
    [...regionKeys.all, 'detail', code, species ?? null, period] as const,
  history: (code: string, disease?: string) =>
    [...regionKeys.all, 'history', code, disease ?? null] as const,
  geometry: () => [...regionKeys.all, 'geometry'] as const,
}

export function useRegionRefs() {
  return useQuery({
    queryKey: regionKeys.refs(),
    queryFn: ({ signal }) => apiGet<RegionRefDto[]>('/refs/regions', { signal }),
    staleTime: Infinity,
  })
}

export function useMapRegions(filters: MonitoringFilters) {
  return useQuery({
    queryKey: regionKeys.map(filters),
    queryFn: ({ signal }) =>
      apiGet<MapRegionDto[]>('/map', {
        signal,
        params: { species: filters.species, disease: filters.disease, period: filters.period },
      }),
    placeholderData: (previous) => previous,
  })
}

export function useRegion(code: string | undefined, species: SpeciesSlug | undefined, period: number) {
  return useQuery({
    queryKey: regionKeys.detail(code ?? '', species, period),
    queryFn: ({ signal }) =>
      apiGet<RegionDto>(`/regions/${code}`, { signal, params: { species, period } }),
    enabled: Boolean(code),
  })
}

export function useRegionHistory(code: string | undefined, disease?: string) {
  return useQuery({
    queryKey: regionKeys.history(code ?? '', disease),
    queryFn: ({ signal }) =>
      apiGet<HistoryPointDto[]>(`/regions/${code}/history`, { signal, params: { disease } }),
    enabled: Boolean(code),
  })
}

export interface RegionProperties {
  code: string
  name: string
}

export type RegionGeometry = FeatureCollection<Polygon | MultiPolygon, RegionProperties> & {
  attribution?: string
  license?: string
  license_url?: string
}

/** Упрощённые контуры регионов (собираются скриптом npm run geo). */
export function useRegionGeometry() {
  return useQuery({
    queryKey: regionKeys.geometry(),
    queryFn: async ({ signal }) => {
      const response = await fetch(GEOMETRY_URL, { signal })
      if (!response.ok) throw new Error('Не удалось загрузить контуры регионов')
      return (await response.json()) as RegionGeometry
    },
    staleTime: Infinity,
  })
}
