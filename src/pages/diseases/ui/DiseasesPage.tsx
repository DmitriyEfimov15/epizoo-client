import { useState } from 'react'

import { MonitoringFilters, useMonitoringFilters } from '@/features/filter-monitoring'
import { DiseaseTile, useDiseases } from '@/entities/disease'
import { BASE_CRUMBS } from '@/shared/config'
import { useDocumentTitle } from '@/shared/lib'
import { Card, EmptyState, ErrorState, Field, Hero, Input, PageBody, Skeleton } from '@/shared/ui'

import styles from './DiseasesPage.module.css'

const normalize = (text: string) => text.toLowerCase().replace(/ё/g, 'е')

export function DiseasesPage() {
  useDocumentTitle('Справочник болезней')
  const { filters } = useMonitoringFilters()
  const diseases = useDiseases(filters.species)
  const [query, setQuery] = useState('')
  const needle = normalize(query.trim())
  const list = (diseases.data ?? []).filter(
    (disease) => !needle || [disease.name, ...disease.aliases].some((name) => normalize(name).includes(needle)),
  )

  return (
    <>
      <Hero
        crumbs={[...BASE_CRUMBS, { label: 'Справочник болезней' }]}
        title="Справочник болезней животных"
        lead="Болезни, которые встречаются в оперативных сводках. Признаки и порядок действий приведены только по проверенным ветеринарным правилам."
      />
      <PageBody>
        <Card tone="white" className={styles.toolbar}>
          <Field label="Поиск по названию" className={styles.search}>
            {({ id }) => (
              <Input
                id={id}
                type="search"
                placeholder="Например, бруцеллёз или АЧС"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            )}
          </Field>
          <MonitoringFilters withPeriod={false} withDisease={false} />
        </Card>
        {diseases.isPending ? (
          <Skeleton height={300} radius={24} />
        ) : diseases.isError ? (
          <ErrorState error={diseases.error} onRetry={() => diseases.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState title="Ничего не найдено" text="Попробуйте другое название или вид животных." />
        ) : (
          <ul className={styles.grid}>
            {list.map((disease) => (
              <li key={disease.slug}>
                <DiseaseTile disease={disease} />
              </li>
            ))}
          </ul>
        )}
      </PageBody>
    </>
  )
}
