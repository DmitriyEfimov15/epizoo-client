import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { parsePeriod, useMonitoringFilters } from './use-monitoring-filters'

const wrapper =
  (url: string) =>
  ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>

it('читает фильтры из адреса и отбрасывает неизвестный вид', () => {
  const { result } = renderHook(useMonitoringFilters, { wrapper: wrapper('/?species=goats&period=90') })
  expect(result.current.filters).toEqual({ species: undefined, disease: undefined, period: 90 })
})

it('обновляет и сбрасывает фильтры', () => {
  const { result } = renderHook(useMonitoringFilters, { wrapper: wrapper('/') })
  act(() => result.current.update({ species: 'pigs', disease: 'african-swine-fever' }))
  expect(result.current.filters.species).toBe('pigs')
  expect(result.current.isDefault).toBe(false)
  act(() => result.current.reset())
  expect(result.current.isDefault).toBe(true)
})

it('ограничивает период', () => {
  expect(parsePeriod('0')).toBe(30)
  expect(parsePeriod('400')).toBe(30)
  expect(parsePeriod('7')).toBe(7)
})
