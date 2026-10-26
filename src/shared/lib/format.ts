const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const shortDateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })
const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

/** ISO-дата `2026-10-13` без сдвига часового пояса. */
function parseIsoDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

export function formatDate(value: string): string {
  return dateFormat.format(parseIsoDate(value)).replace(' г.', '')
}

export function formatShortDate(value: string): string {
  return shortDateFormat.format(parseIsoDate(value))
}

export function formatDateRange(from: string, to: string): string {
  return `${formatShortDate(from)}–${formatShortDate(to)}`
}

export function formatDateTime(value: string): string {
  return dateTimeFormat.format(new Date(value))
}

/** plural(5, ['событие', 'события', 'событий']) → 'событий' */
export function plural(count: number, forms: readonly [string, string, string]): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

export function formatCount(count: number, forms: readonly [string, string, string]): string {
  return `${count.toLocaleString('ru-RU')} ${plural(count, forms)}`
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
