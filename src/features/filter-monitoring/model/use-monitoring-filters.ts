import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DEFAULT_PERIOD, type MonitoringFilters } from '@/entities/region'
import { isSpeciesSlug } from '@/shared/config'

const MAX_PERIOD = 365

export function parsePeriod(value: string | null): number {
  const period = Number(value)
  return Number.isInteger(period) && period >= 1 && period <= MAX_PERIOD ? period : DEFAULT_PERIOD
}

/** Фильтры живут в адресе страницы, чтобы выборкой можно было поделиться ссылкой. */
export function useMonitoringFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<MonitoringFilters>(() => {
    const species = params.get('species')
    return {
      species: isSpeciesSlug(species) ? species : undefined,
      disease: params.get('disease') || undefined,
      period: parsePeriod(params.get('period')),
    }
  }, [params])

  const update = useCallback(
    (patch: Partial<MonitoringFilters>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(patch)) {
            const isDefault = key === 'period' && value === DEFAULT_PERIOD
            if (value === undefined || value === '' || isDefault) next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const reset = useCallback(() => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const key of ['species', 'disease', 'period']) next.delete(key)
        return next
      },
      { replace: true },
    )
  }, [setParams])

  const isDefault = !filters.species && !filters.disease && filters.period === DEFAULT_PERIOD
  return { filters, update, reset, isDefault }
}
