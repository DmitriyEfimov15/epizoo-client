import { SignificanceBadge } from '@/entities/significance'
import type { MapRegionDto } from '@/shared/api'
import { cn } from '@/shared/lib'

import styles from './RegionRanking.module.css'

interface RegionRankingProps {
  data: MapRegionDto[]
  selected?: string | null
  onSelect: (code: string) => void
  /** Ограничить число строк (топ на главной). */
  limit?: number
  caption: string
}

/** Табличное представление карты — доступно с клавиатуры и скринридера. */
export function RegionRanking({ data, selected, onSelect, limit, caption }: RegionRankingProps) {
  const sorted = [...data].sort(
    (a, b) =>
      b.level - a.level ||
      b.active_quarantine_count - a.active_quarantine_count ||
      b.event_count - a.event_count ||
      a.name.localeCompare(b.name, 'ru'),
  )
  const rows = limit ? sorted.slice(0, limit) : sorted
  return (
    <div className={cn(!limit && styles.scroll)}>
      <table className={cn(styles.table, limit && styles.compact)}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className={limit ? 'visually-hidden' : undefined}>Уровень</span>
            </th>
            <th scope="col">Регион</th>
            <th scope="col" className={styles.num}>
              {limit ? <abbr title="Действующие карантины">Кар.</abbr> : 'Карантины'}
            </th>
            <th scope="col" className={styles.num}>
              {limit ? <abbr title="Сообщения за период">Сообщ.</abbr> : 'Сообщения'}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((region) => (
            <tr key={region.code} className={cn(styles.row, region.code === selected && styles.selected)}>
              <td>
                <SignificanceBadge level={region.level} compact />
              </td>
              <td>
                <button type="button" onClick={() => onSelect(region.code)}>
                  {region.name}
                </button>
              </td>
              <td className={styles.num}>{region.active_quarantine_count}</td>
              <td className={styles.num}>{region.event_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
