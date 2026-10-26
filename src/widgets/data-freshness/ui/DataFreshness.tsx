import { useReportMeta } from '@/entities/report'
import { formatCount, formatDate } from '@/shared/lib'
import { Card, Skeleton } from '@/shared/ui'

import styles from './DataFreshness.module.css'

/** Актуальность данных, источник и дисклеймер. */
export function DataFreshness() {
  const meta = useReportMeta()
  if (meta.isPending) return <Skeleton height={140} radius={24} />
  if (meta.isError) return null
  const data = meta.data
  return (
    <Card as="aside" className={styles.box} aria-label="Актуальность данных">
      <p className={styles.line}>
        <span className={styles.dot} aria-hidden="true" />
        Данные на{' '}
        <span className={styles.date}>{data.last_report_date ? formatDate(data.last_report_date) : '—'}</span>
      </p>
      <p>
        {formatCount(data.report_count, ['сводка', 'сводки', 'сводок'])} ИАЦ Россельхознадзора
        {data.first_report_date && ` с ${formatDate(data.first_report_date)}`}.{' '}
        <a href={data.source_url} target="_blank" rel="noopener noreferrer">
          Первоисточник
        </a>
      </p>
      <p>{data.disclaimer}</p>
    </Card>
  )
}
