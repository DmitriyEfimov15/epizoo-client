import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useRegionHistory } from '@/entities/region'
import { formatDateRange, formatShortDate } from '@/shared/lib'
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui'

import styles from './RegionHistory.module.css'

const SERIES = [
  { key: 'set', label: 'Неблагополучные пункты (введены)', color: 'var(--series-set)' },
  { key: 'lifted', label: 'Карантин снят', color: 'var(--series-lifted)' },
] as const

interface Row {
  week: string
  start: string
  end: string
  set: number
  lifted: number
}

interface HistoryTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: unknown }>
}

function HistoryTooltip({ active, payload }: HistoryTooltipProps) {
  const row = payload?.[0]?.payload as Row | undefined
  if (!active || !row) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>Неделя {formatDateRange(row.start, row.end)}</p>
      {SERIES.map((series) => (
        <p key={series.key}>
          <span className={styles.swatch} style={{ background: series.color }} />
          {series.label}
          <b>{row[series.key]}</b>
        </p>
      ))}
    </div>
  )
}

/** Недельная динамика по еженедельным сводкам ИАЦ. */
export function RegionHistory({ code, disease }: { code: string; disease?: string }) {
  const query = useRegionHistory(code, disease)
  const rows = useMemo<Row[]>(() => {
    const weeks = new Map<string, Row>()
    for (const point of query.data ?? []) {
      const row = weeks.get(point.week_start) ?? {
        week: formatShortDate(point.week_start),
        start: point.week_start,
        end: point.week_end,
        set: 0,
        lifted: 0,
      }
      if (point.kind === 'quarantine_lifted') row.lifted += point.count
      else row.set += point.count
      weeks.set(point.week_start, row)
    }
    return [...weeks.values()].sort((a, b) => a.start.localeCompare(b.start))
  }, [query.data])

  if (query.isPending) return <Skeleton height={260} radius={24} />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} compact />
  if (rows.length === 0) {
    return <EmptyState compact title="В еженедельных сводках регион не упоминался" icon="chart" />
  }

  return (
    <figure className={styles.chart}>
      <figcaption className="visually-hidden">
        Число населённых пунктов по неделям: введённые и снятые карантины
      </figcaption>
      <ul className={styles.legend}>
        {SERIES.map((series) => (
          <li key={series.key}>
            <span className={styles.swatch} style={{ background: series.color }} />
            {series.label}
          </li>
        ))}
      </ul>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--gray-200)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={{ stroke: 'var(--gray-300)' }}
              tick={{ fontSize: 12, fill: 'var(--gray-800)' }}
              minTickGap={16}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--gray-800)' }}
            />
            <Tooltip
              content={(props) => <HistoryTooltip active={props.active} payload={props.payload} />}
              cursor={{ fill: 'var(--gray-100)' }}
            />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                fill={series.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={14}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className={styles.table}>
        <summary>Показать таблицей</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Неделя</th>
              <th scope="col">Введены</th>
              <th scope="col">Сняты</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.start}>
                <td>{formatDateRange(row.start, row.end)}</td>
                <td>{row.set}</td>
                <td>{row.lifted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
