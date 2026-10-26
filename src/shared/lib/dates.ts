/** ISO-дата (YYYY-MM-DD) за `days` дней до сегодняшнего дня по местному времени. */
export function isoDaysAgo(days: number, today = new Date()): string {
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
