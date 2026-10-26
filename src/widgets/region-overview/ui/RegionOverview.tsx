import { useState } from 'react'

import { QuarantineItem, sortQuarantines } from '@/entities/quarantine'
import { useRegion } from '@/entities/region'
import { SignificanceBadge } from '@/entities/significance'
import { SummaryBlock, useRegionSummary } from '@/entities/summary'
import type { RegionDto, SpeciesSlug } from '@/shared/api'
import { formatCount } from '@/shared/lib'
import { Button, ErrorState, Notice, Skeleton } from '@/shared/ui'

import styles from './RegionOverview.module.css'

interface RegionOverviewProps {
  code: string
  species?: SpeciesSlug
  period: number
  /** Сколько карантинов показать сразу. */
  quarantineLimit?: number
  /** Можно ли раскрыть полный список (на странице региона). */
  expandable?: boolean
}

export function RegionStats({ region, period }: { region: RegionDto; period: number }) {
  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <span className={styles.value}>{region.event_count}</span>
        <span className={styles.label}>сообщений за {period} дн.</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{region.active_quarantine_count}</span>
        <span className={styles.label}>действующих карантинов</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{region.unconfirmed_quarantine_count}</span>
        <span className={styles.label}>статус не подтверждён</span>
      </div>
    </div>
  )
}

/** Статус региона: уровень, счётчики, сводка и карантины. */
export function RegionOverview({ code, species, period, quarantineLimit, expandable }: RegionOverviewProps) {
  const region = useRegion(code, species, period)
  const [expanded, setExpanded] = useState(false)
  const summary = useRegionSummary(code, species, period)

  if (region.isPending) {
    return (
      <div className={styles.overview}>
        <Skeleton height={44} width={240} />
        <Skeleton height={96} />
        <Skeleton height={120} />
      </div>
    )
  }
  if (region.isError) return <ErrorState error={region.error} onRetry={() => region.refetch()} compact />

  const data = region.data
  const sorted = sortQuarantines(data.quarantines)
  const quarantines = quarantineLimit && !expanded ? sorted.slice(0, quarantineLimit) : sorted
  const hidden = sorted.length - quarantines.length
  return (
    <div className={styles.overview}>
      <div className={styles.head}>
        <SignificanceBadge level={data.level} size="l" />
      </div>
      <RegionStats region={data} period={period} />

      <section className={styles.section} aria-labelledby={`summary-${code}`}>
        <h3 id={`summary-${code}`} className={styles.sectionTitle}>
          Сводка сообщений
        </h3>
        {summary.isPending && <Skeleton height={72} />}
        {summary.isError && (
          <Notice tone="neutral">Сводка временно недоступна. Сообщения и первоисточники — ниже.</Notice>
        )}
        {summary.data && <SummaryBlock summary={summary.data} />}
      </section>

      <section className={styles.section} aria-labelledby={`quarantines-${code}`}>
        <h3 id={`quarantines-${code}`} className={styles.sectionTitle}>
          Карантины ({data.quarantines.length})
        </h3>
        {data.quarantines.length === 0 ? (
          <Notice tone="neutral">
            Сообщений о неснятых карантинах нет. Это не подтверждает благополучие — уточняйте у ветслужбы.
          </Notice>
        ) : (
          <ul className={styles.list}>
            {quarantines.map((item) => (
              <li key={item.id}>
                <QuarantineItem quarantine={item} />
              </li>
            ))}
          </ul>
        )}
        {hidden > 0 &&
          (expandable ? (
            <Button variant="secondary" size="s" className={styles.expand} onClick={() => setExpanded(true)}>
              Показать все ({sorted.length})
            </Button>
          ) : (
            <p className={styles.more}>и ещё {formatCount(hidden, ['карантин', 'карантина', 'карантинов'])}</p>
          ))}
      </section>
    </div>
  )
}
