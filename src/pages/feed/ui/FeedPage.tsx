import { useSearchParams } from 'react-router-dom'

import { MonitoringFilters, useMonitoringFilters } from '@/features/filter-monitoring'
import { EVENT_KIND_OPTIONS } from '@/entities/event'
import { RegionSelect } from '@/entities/region'
import type { EventKind } from '@/shared/api'
import { BASE_CRUMBS } from '@/shared/config'
import { isoDaysAgo, useDocumentTitle } from '@/shared/lib'
import { Button, Card, Field, Hero, Icon, PageBody, Segmented } from '@/shared/ui'
import { DataFreshness } from '@/widgets/data-freshness'
import { EventFeed } from '@/widgets/event-feed'

import styles from './FeedPage.module.css'

const KIND_OPTIONS = [{ value: 'all', label: 'Все' }, ...EVENT_KIND_OPTIONS] as const

export function FeedPage() {
  useDocumentTitle('Лента событий')
  const { filters } = useMonitoringFilters()
  const [params, setParams] = useSearchParams()
  const region = params.get('region')
  const kindParam = params.get('kind')
  const kind = EVENT_KIND_OPTIONS.some((option) => option.value === kindParam) ? (kindParam as EventKind) : undefined

  const setParam = (key: string, value: string | null) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )

  return (
    <>
      <Hero
        crumbs={[...BASE_CRUMBS, { label: 'Лента событий' }]}
        title="Лента событий"
        lead="Все сообщения о вспышках, введении и снятии карантинов — с первоисточниками: приказами ветслужб и публикациями на правовом портале."
      />
      <PageBody>
        <Card tone="white" className={styles.filters}>
          <MonitoringFilters />
          <div className={styles.row}>
            <Field label="Регион" className={styles.region}>
              {({ id }) => <RegionSelect id={id} value={region} onChange={(code) => setParam('region', code)} />}
            </Field>
            {region && (
              <Button variant="ghost" size="s" onClick={() => setParam('region', null)}>
                <Icon name="close" size={18} />
                Все регионы
              </Button>
            )}
            <div className={styles.kind}>
              <span className={styles.label} aria-hidden="true">
                Тип события
              </span>
              <Segmented
                legend="Тип события"
                value={kind ?? 'all'}
                options={KIND_OPTIONS}
                onChange={(value) => setParam('kind', value === 'all' ? null : value)}
              />
            </div>
          </div>
        </Card>
        <div className={styles.layout}>
          <EventFeed
            filters={{
              region: region ?? undefined,
              species: filters.species,
              disease: filters.disease,
              kind,
              from: isoDaysAgo(filters.period),
            }}
          />
          <DataFreshness />
        </div>
      </PageBody>
    </>
  )
}
