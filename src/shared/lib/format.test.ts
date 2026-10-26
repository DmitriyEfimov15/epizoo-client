import { formatCount, formatDate, formatDateRange, hostname, plural } from './format'

describe('plural', () => {
  it.each([
    [1, 'событие'],
    [2, 'события'],
    [5, 'событий'],
    [11, 'событий'],
    [21, 'событие'],
    [24, 'события'],
    [112, 'событий'],
  ])('%i → %s', (count, expected) => {
    expect(plural(count, ['событие', 'события', 'событий'])).toBe(expected)
  })
})

describe('даты', () => {
  it('форматирует ISO-дату без сдвига пояса', () => {
    expect(formatDate('2026-10-13')).toBe('13 октября 2026')
  })

  it('форматирует диапазон', () => {
    expect(formatDateRange('2026-10-05', '2026-10-11')).toBe('05.10–11.10')
  })
})

it('formatCount и hostname', () => {
  expect(formatCount(3, ['карантин', 'карантина', 'карантинов'])).toBe('3 карантина')
  expect(hostname('http://www.publication.pravo.gov.ru/document/1')).toBe('publication.pravo.gov.ru')
})

it('isoDaysAgo', async () => {
  const { isoDaysAgo } = await import('./dates')
  expect(isoDaysAgo(30, new Date(2026, 9, 14))).toBe('2026-09-14')
  expect(isoDaysAgo(1, new Date(2026, 0, 1))).toBe('2025-12-31')
})
