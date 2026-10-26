import { EventCard } from '@/entities/event'
import { useFarmDigest } from '@/entities/farm'
import { useRegionRefs } from '@/entities/region'
import { formatDateRange } from '@/shared/lib'
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui'

import styles from './WeeklyDigest.module.css'

/** Дайджест прошедшей недели — тот же текст бот присылает по понедельникам. */
export function WeeklyDigest({ token }: { token: string }) {
  const digest = useFarmDigest(token)
  const { data: regions } = useRegionRefs()
  if (digest.isPending) return <Skeleton height={160} radius={24} />
  if (digest.isError) return <ErrorState error={digest.error} onRetry={() => digest.refetch()} compact />
  const data = digest.data
  const names = new Map((regions ?? []).map((r) => [r.code, r.name]))
  return (
    <div className={styles.digest}>
      <p className={styles.period}>Неделя {formatDateRange(data.week_start, data.week_end)}</p>
      <p className={styles.text}>{data.text}</p>
      {data.events.length === 0 ? (
        <EmptyState compact title="За неделю новых сообщений нет" icon="check" />
      ) : (
        <ul className={styles.list}>
          {data.events.slice(0, 5).map((event) => (
            <li key={event.id}>
              <EventCard event={event} regionName={names.get(event.region_code)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
