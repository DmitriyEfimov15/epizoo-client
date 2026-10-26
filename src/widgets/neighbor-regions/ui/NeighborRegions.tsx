import { Link } from 'react-router-dom'

import { SignificanceBadge } from '@/entities/significance'
import type { MapRegionDto } from '@/shared/api'
import { routes } from '@/shared/config'
import { formatCount } from '@/shared/lib'
import { EmptyState } from '@/shared/ui'

import styles from './NeighborRegions.module.css'

/** Соседние регионы, от самых неблагополучных. */
export function NeighborRegions({ neighbors, search = '' }: { neighbors: MapRegionDto[]; search?: string }) {
  if (neighbors.length === 0) {
    return <EmptyState compact title="Соседних регионов по суше нет" icon="map" />
  }
  const sorted = [...neighbors].sort((a, b) => b.level - a.level || b.event_count - a.event_count)
  return (
    <ul className={styles.list}>
      {sorted.map((region) => (
        <li key={region.code}>
          <Link className={styles.item} to={`${routes.region(region.code)}${search}`}>
            <SignificanceBadge level={region.level} compact />
            <span>
              <span className={styles.name}>{region.name}</span>
              <span className={styles.meta}>
                {formatCount(region.active_quarantine_count, ['карантин', 'карантина', 'карантинов'])} ·{' '}
                {formatCount(region.event_count, ['сообщение', 'сообщения', 'сообщений'])}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
