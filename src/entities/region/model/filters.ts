import type { SpeciesSlug } from '@/shared/api'

/** Параметры выборки, общие для карты, карточки региона и ленты. */
export interface MonitoringFilters {
  species?: SpeciesSlug
  disease?: string
  /** Период в днях, 1–365. */
  period: number
}

export const PERIOD_OPTIONS = [
  { value: 7, label: '7 дней' },
  { value: 30, label: '30 дней' },
  { value: 90, label: '90 дней' },
  { value: 365, label: 'Год' },
] as const

export const DEFAULT_PERIOD = 30
