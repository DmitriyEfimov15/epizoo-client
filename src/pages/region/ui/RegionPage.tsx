import { useParams } from 'react-router-dom'

import { MonitoringFilters, useMonitoringFilters } from '@/features/filter-monitoring'
import { ShareButton } from '@/features/share-link'
import { useRegion } from '@/entities/region'
import { ApiError } from '@/shared/api'
import { BASE_CRUMBS, routes, speciesLabel } from '@/shared/config'
import { useDocumentTitle } from '@/shared/lib'
import { ButtonLink, Card, EmptyState, Hero, Icon, PageBody, Section, Skeleton } from '@/shared/ui'
import { EventFeed } from '@/widgets/event-feed'
import { NeighborRegions } from '@/widgets/neighbor-regions'
import { ProductOffers } from '@/widgets/product-offers'
import { RegionHistory } from '@/widgets/region-history'
import { RegionOverview } from '@/widgets/region-overview'

import styles from './RegionPage.module.css'

export function RegionPage() {
  const { code = '' } = useParams()
  const { filters } = useMonitoringFilters()
  const region = useRegion(code, filters.species, filters.period)
  useDocumentTitle(region.data?.name)

  if (region.error instanceof ApiError && region.error.status === 404) {
    return (
      <PageBody>
        <EmptyState
          icon="map"
          title="Регион не найден"
          text="Проверьте ссылку или выберите регион на карте."
          action={<ButtonLink to={routes.map()}>К карте</ButtonLink>}
        />
      </PageBody>
    )
  }

  const name = region.data?.name
  const search = filters.species ? `?species=${filters.species}` : ''
  return (
    <>
      <Hero
        crumbs={[...BASE_CRUMBS, { label: name ?? 'Регион' }]}
        title={name ?? <Skeleton width={320} height={40} />}
        lead={
          filters.species
            ? `Обстановка для вида «${speciesLabel(filters.species)}» за ${filters.period} дн.`
            : `Обстановка по всем видам животных за ${filters.period} дн.`
        }
        aside={
          <>
            <ButtonLink to={`${routes.routeCheck()}?from=${code}${filters.species ? `&species=${filters.species}` : ''}`} variant="secondary">
              <Icon name="truck" />
              Проверить перевозку из региона
            </ButtonLink>
            <ShareButton title={name ?? 'Регион'} />
          </>
        }
      />
      <PageBody>
        <Card tone="white">
          <MonitoringFilters />
        </Card>
        <div className={styles.layout}>
          <div className={styles.main}>
            <Section title="Статус региона">
              <RegionOverview code={code} species={filters.species} period={filters.period} quarantineLimit={6} expandable />
            </Section>
            <Section
              title="Динамика по неделям"
              lead="Число населённых пунктов в еженедельных сводных сообщениях ИАЦ: где введены и где сняты ограничения."
            >
              <RegionHistory code={code} disease={filters.disease} />
            </Section>
            <Section title="Сообщения ветслужб и СМИ">
              <EventFeed
                showRegion={false}
                filters={{ region: code, species: filters.species, disease: filters.disease }}
              />
            </Section>
          </div>
          <aside className={styles.side}>
            <Card tone="outlined">
              <h2 className={styles.sideTitle}>Соседние регионы</h2>
              {region.data ? (
                <NeighborRegions neighbors={region.data.neighbors} search={search} />
              ) : (
                <Skeleton height={160} />
              )}
            </Card>
            <Card>
              <h2 className={styles.sideTitle}>Полезные сервисы</h2>
              <ProductOffers region={code} species={filters.species} />
            </Card>
          </aside>
        </div>
      </PageBody>
    </>
  )
}
