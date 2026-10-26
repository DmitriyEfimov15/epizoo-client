import type { QuarantineDto } from '@/shared/api'

export const QUARANTINE_STATUS: Record<QuarantineDto['status'], { label: string; hint: string }> = {
  active: {
    label: 'Действует',
    hint: 'Сообщение о снятии карантина не найдено',
  },
  unconfirmed: {
    label: 'Не подтверждён',
    hint: 'Введён более 90 дней назад, о снятии сообщений нет. Уточните статус у ветслужбы',
  },
}

/** Сначала действующие, затем по уровню значимости и дате введения (новые выше). */
export function sortQuarantines(list: readonly QuarantineDto[]): QuarantineDto[] {
  return [...list].sort(
    (a, b) =>
      Number(b.status === 'active') - Number(a.status === 'active') ||
      b.level - a.level ||
      b.since.localeCompare(a.since),
  )
}
