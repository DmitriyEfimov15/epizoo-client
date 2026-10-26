export type Level = 0 | 1 | 2 | 3 | 4 | 5

export interface LevelInfo {
  level: Level
  /** Короткая подпись по официальной интерпретации итоговой оценки ВНИИЗЖ. */
  label: string
  description: string
  color: string
  textColor: string
}

/**
 * Шкала из сводок ИАЦ: X=1 — незначимо; 1<X≤2 — низкая; 2<X≤3 — высокая для страны или региона;
 * 3<X≤4 — высокая; 4<X≤5 — чрезвычайное событие. Уровень = ceil(X), 0 — сообщений нет.
 */
export const LEVELS: readonly LevelInfo[] = [
  {
    level: 0,
    label: 'Сообщений нет',
    description: 'За период нет сообщений и действующих карантинов',
    color: 'var(--level-0)',
    textColor: 'var(--gray-800)',
  },
  {
    level: 1,
    label: 'Незначимо',
    description: 'Событие незначимо',
    color: 'var(--level-1)',
    textColor: 'var(--gray-950)',
  },
  {
    level: 2,
    label: 'Низкая',
    description: 'Значимость события низкая',
    color: 'var(--level-2)',
    textColor: 'var(--gray-950)',
  },
  {
    level: 3,
    label: 'Высокая для региона',
    description: 'Значимость высокая для страны или региона',
    color: 'var(--level-3)',
    textColor: 'var(--gray-950)',
  },
  {
    level: 4,
    label: 'Высокая',
    description: 'Значимость события высокая',
    color: 'var(--level-4)',
    textColor: 'var(--gray-950)',
  },
  {
    level: 5,
    label: 'Чрезвычайная',
    description: 'Чрезвычайное событие',
    color: 'var(--level-5)',
    textColor: 'var(--white)',
  },
]

export function levelInfo(level: number): LevelInfo {
  const index = Math.max(0, Math.min(5, Math.round(level)))
  return LEVELS[index] as LevelInfo
}
