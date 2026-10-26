import { useMemo } from 'react'

import { EventCard, type EventFilters, useEventsInfinite } from '@/entities/event'
import { useRegionRefs } from '@/entities/region'
import { formatCount } from '@/shared/lib'
import { Button, EmptyState, ErrorState, Skeleton } from '@/shared/ui'

import styles from './EventFeed.module.css'

interface EventFeedProps {
  filters: EventFilters
  /** Показывать регион в карточке (лента по всей стране). */
  showRegion?: boolean
  emptyText?: string
}

export function EventFeed({ filters, showRegion = true, emptyText }: EventFeedProps) {
  const query = useEventsInfinite(filters)
  const { data: regions } = useRegionRefs()
  const names = useMemo(() => new Map((regions ?? []).map((r) => [r.code, r.name])), [regions])

  if (query.isPending) {
    return (
      <div className={styles.list}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={160} radius={24} />
        ))}
      </div>
    )
  }
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />

  const items = query.data.pages.flatMap((page) => page.items)
  const total = query.data.pages[0]?.total ?? 0
  if (items.length === 0) {
    return (
      <EmptyState
        title="Сообщений не найдено"
        text={emptyText ?? 'Измените фильтры или период. Отсутствие сообщений не подтверждает благополучие.'}
      />
    )
  }
  return (
    <div className={styles.feed}>
      <p className={styles.total} aria-live="polite">
        Найдено {formatCount(total, ['сообщение', 'сообщения', 'сообщений'])}
      </p>
      <ul className={styles.list}>
        {items.map((event) => (
          <li key={event.id}>
            <EventCard event={event} regionName={showRegion ? names.get(event.region_code) : undefined} />
          </li>
        ))}
      </ul>
      {query.hasNextPage && (
        <Button
          className={styles.more}
          variant="secondary"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? 'Загружаем…' : `Показать ещё (${total - items.length})`}
        </Button>
      )}
    </div>
  )
}
