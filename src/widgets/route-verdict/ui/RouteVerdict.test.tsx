import { screen } from '@testing-library/react'

import type { RegionDto, RouteResultDto } from '@/shared/api'
import { renderWithProviders } from '@/shared/lib/testing'

import { RouteVerdict } from './RouteVerdict'

const region = (code: string, name: string, level: number): RegionDto => ({
  code,
  name,
  level,
  event_count: 0,
  active_quarantine_count: level > 3 ? 2 : 0,
  unconfirmed_quarantine_count: 0,
  quarantines: [],
  events: [],
  neighbors: [],
})

const result: RouteResultDto = {
  from_region: region('22', 'Алтайский край', 4),
  to_region: region('54', 'Новосибирская область', 0),
  species: 'cattle',
  verdict: 'high',
  checklist: ['Уточнить ограничения у ветслужбы.', 'Проверить условия в «Цербере».'],
  official_url: 'https://cerberus.vetrf.ru/cerberus/transit/checkPath/pub',
  disclaimer: 'Результат справочный.',
}

it('показывает вердикт, оба региона, чек-лист и официальную ссылку', () => {
  renderWithProviders(<RouteVerdict result={result} />)
  expect(screen.getByRole('heading', { name: 'Высокий риск' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Алтайский край' })).toHaveAttribute('href', '/region/22')
  expect(screen.getByRole('link', { name: 'Новосибирская область' })).toBeInTheDocument()
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
    expect.arrayContaining(result.checklist),
  )
  expect(screen.getByRole('link', { name: /Условия перевозки в «Цербере»/ })).toHaveAttribute(
    'href',
    result.official_url,
  )
  expect(screen.getByText('Результат справочный.')).toBeInTheDocument()
})
