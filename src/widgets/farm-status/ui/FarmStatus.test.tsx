import { screen } from '@testing-library/react'

import type { DashboardDto } from '@/shared/api'
import { renderWithProviders } from '@/shared/lib/testing'

import { FarmStatus } from './FarmStatus'

const region = {
  code: '22',
  name: 'Алтайский край',
  level: 4,
  event_count: 20,
  active_quarantine_count: 11,
  unconfirmed_quarantine_count: 0,
  quarantines: [],
  events: [],
  neighbors: [],
}

const dashboard: DashboardDto = {
  farm: { token: 't', region_code: '22', district: null, species: ['cattle'], created_at: '2026-10-14T10:00:00Z' },
  region,
  neighbors: [{ code: '04', name: 'Республика Алтай', level: 3, event_count: 1, active_quarantine_count: 0, unconfirmed_quarantine_count: 1 }],
  recommendations: [
    { text: 'Предоставьте животных для осмотра (пункт 7).', source_url: 'https://pravo.gov.ru/a' },
    { text: 'Предоставьте животных для осмотра (пункт 7).', source_url: 'https://pravo.gov.ru/b' },
    { text: 'Сообщите в ветслужбу в течение 24 часов.', source_url: 'https://pravo.gov.ru/a' },
  ],
  offers: [],
  subscription: null,
}

it('сравнивает «у вас» и «у соседей» и не дублирует рекомендации', () => {
  renderWithProviders(<FarmStatus dashboard={dashboard} />)
  expect(screen.getByText('У вас в регионе')).toBeInTheDocument()
  expect(screen.getByText(/Выше всего — Республика Алтай/)).toBeInTheDocument()
  expect(screen.getAllByText('Предоставьте животных для осмотра (пункт 7).')).toHaveLength(1)
  expect(screen.getByText('Сообщите в ветслужбу в течение 24 часов.')).toBeInTheDocument()
})
