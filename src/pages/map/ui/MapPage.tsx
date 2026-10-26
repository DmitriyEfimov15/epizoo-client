import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { MonitoringFilters, useMonitoringFilters } from '@/features/filter-monitoring'
import { ShareButton } from '@/features/share-link'
import { useMapRegions } from '@/entities/region'
import { SignificanceLegend } from '@/entities/significance'
import { routes } from '@/shared/config'
import { useDocumentTitle } from '@/shared/lib'
import {
  ButtonLink,
  Card,
  Drawer,
  ErrorState,
  Hero,
  Icon,
  type IconName,
  PageBody,
  Section,
  Segmented,
} from '@/shared/ui'
import { DataFreshness } from '@/widgets/data-freshness'
import { EpizooticMap } from '@/widgets/epizootic-map'
import { RegionOverview } from '@/widgets/region-overview'
import { RegionRanking } from '@/widgets/region-ranking'

import styles from './MapPage.module.css'

const TILES: { to: string; icon: IconName; title: string; text: string }[] = [
  {
    to: routes.farm(),
    icon: 'home',
    title: 'Моё хозяйство',
    text: 'Укажите регион и животных — покажем, что происходит у вас и у соседей, и пришлём оповещение в Telegram.',
  },
  {
    to: routes.routeCheck(),
    icon: 'truck',
    title: 'Покупка и перевозка',
    text: 'Проверьте регион происхождения животных и регион назначения до сделки.',
  },
  {
    to: routes.diseases(),
    icon: 'book',
    title: 'Справочник болезней',
    text: 'Признаки, восприимчивые виды и порядок действий по ветеринарным правилам.',
  },
]

export function MapPage() {
  useDocumentTitle()
  const { filters } = useMonitoringFilters()
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<'map' | 'list'>('map')
  const selected = params.get('region')
  const regions = useMapRegions(filters)

  const select = (code: string | null) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (code) next.set('region', code)
        else next.delete('region')
        return next
      },
      { replace: true },
    )

  const selectedRegion = regions.data?.find((region) => region.code === selected)
  const filterSearch = new URLSearchParams(
    Object.entries({ species: filters.species, period: filters.period !== 30 ? String(filters.period) : undefined })
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString()

  return (
    <>
      <Hero
        title="Эпизоотическая ситуация в регионах России"
        lead="Карантины и вспышки болезней животных по оперативным сводкам Россельхознадзора. Выберите вид животных и регион — покажем значимость событий, сводку сообщений ветслужб и обстановку у соседей."
        aside={
          <>
            <ButtonLink to={routes.farm()} variant="secondary">
              <Icon name="bell" />
              Следить за своим регионом
            </ButtonLink>
          </>
        }
      />
      <PageBody>
        <Card className={styles.filters} tone="white">
          <MonitoringFilters />
        </Card>

        <div className={styles.layout}>
          <div className={styles.mapColumn}>
            <div className={styles.toolbar}>
              <SignificanceLegend />
              <Segmented
                legend="Представление"
                value={view}
                options={[
                  { value: 'map', label: 'Карта' },
                  { value: 'list', label: 'Список' },
                ]}
                onChange={setView}
              />
            </div>
            {regions.isError ? (
              <ErrorState error={regions.error} onRetry={() => regions.refetch()} />
            ) : view === 'map' ? (
              <EpizooticMap data={regions.data} selected={selected} onSelect={select} />
            ) : (
              <Card tone="outlined">
                <RegionRanking
                  data={regions.data ?? []}
                  selected={selected}
                  onSelect={select}
                  caption="Все регионы по уровню значимости"
                />
              </Card>
            )}
            {regions.isFetching && !regions.isPending && (
              <p className={styles.updating} aria-live="polite">
                Обновляем данные…
              </p>
            )}
          </div>

          <aside className={styles.side} aria-label="Регионы с наибольшей значимостью">
            <Card tone="outlined">
              <h2 className={styles.sideTitle}>Где сейчас напряжённее всего</h2>
              <RegionRanking
                data={regions.data ?? []}
                selected={selected}
                onSelect={select}
                limit={8}
                caption="Топ-8 регионов по уровню значимости"
              />
            </Card>
            <DataFreshness />
          </aside>
        </div>

        <Section title="Что ещё можно сделать">
          <div className={styles.tiles}>
            {TILES.map((tile) => (
              <Link key={tile.to} to={tile.to} className={styles.tile}>
                <span className={styles.tileIcon}>
                  <Icon name={tile.icon} size={24} />
                </span>
                <span className={styles.tileTitle}>{tile.title}</span>
                <span className={styles.tileText}>{tile.text}</span>
              </Link>
            ))}
          </div>
        </Section>
      </PageBody>

      <Drawer open={Boolean(selected)} title={selectedRegion?.name ?? 'Регион'} onClose={() => select(null)}>
        {selected && (
          <>
            <RegionOverview code={selected} species={filters.species} period={filters.period} quarantineLimit={3} />
            <div className={styles.drawerActions}>
              <ButtonLink to={`${routes.region(selected)}${filterSearch ? `?${filterSearch}` : ''}`}>
                Подробнее о регионе
                <Icon name="arrowRight" />
              </ButtonLink>
              <ShareButton title={selectedRegion?.name ?? 'Эпизоотическая ситуация'} />
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
