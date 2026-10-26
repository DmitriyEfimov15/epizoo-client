import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { EventDto } from '@/shared/api'
import { renderWithProviders } from '@/shared/lib/testing'

import { EventCard } from './EventCard'

const event: EventDto = {
  id: 1,
  report_id: 1,
  date: '2026-10-13',
  disease_id: 3,
  disease_slug: 'leukosis',
  disease_name: 'Лейкоз КРС',
  region_code: '22',
  district: 'Бийский район',
  locality: 'Верх-Бехтемир',
  species: ['cattle'],
  kind: 'quarantine_lifted',
  text: 'Приказом Управления ветеринарии Алтайского края от 13.10.2026 № 400-п отменены ограничительные мероприятия (карантин) по лейкозу крупного рогатого скота на территории неблагополучного пункта – с. Верх-Бехтемир, Бийский район.',
  scores: [0, 2, 2, 0, 0, 2],
  total: 1,
  level: 1,
  source_urls: ['http://publication.pravo.gov.ru/document/2201202610130003'],
}

it('показывает тип, болезнь, место и первоисточник', () => {
  renderWithProviders(<EventCard event={event} regionName="Алтайский край" />)
  expect(screen.getByText('Карантин снят')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Лейкоз КРС' })).toHaveAttribute('href', '/diseases/leukosis')
  expect(screen.getByRole('link', { name: /Алтайский край, Бийский район, Верх-Бехтемир/ })).toHaveAttribute(
    'href',
    '/region/22',
  )
  expect(screen.getByRole('link', { name: /publication\.pravo\.gov\.ru/ })).toHaveAttribute(
    'href',
    event.source_urls[0],
  )
  expect(screen.getByText('13 октября 2026')).toBeInTheDocument()
})

it('сворачивает и раскрывает длинный текст', async () => {
  renderWithProviders(<EventCard event={event} />)
  const toggle = screen.getByRole('button', { name: 'Читать полностью' })
  await userEvent.click(toggle)
  expect(screen.getByRole('button', { name: 'Свернуть' })).toBeInTheDocument()
})
