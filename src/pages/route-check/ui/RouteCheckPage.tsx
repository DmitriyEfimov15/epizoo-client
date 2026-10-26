import { useSearchParams } from 'react-router-dom'

import { RouteCheckForm, type RouteParams, useRouteCheck } from '@/features/check-route'
import { ShareButton } from '@/features/share-link'
import { useMapRegions } from '@/entities/region'
import { SignificanceLegend } from '@/entities/significance'
import { BASE_CRUMBS, isSpeciesSlug } from '@/shared/config'
import { useDocumentTitle } from '@/shared/lib'
import { Card, ErrorState, Hero, PageBody, Section, Skeleton } from '@/shared/ui'
import { EpizooticMap } from '@/widgets/epizootic-map'
import { RouteVerdict } from '@/widgets/route-verdict'

import styles from './RouteCheckPage.module.css'

const STEPS = [
  { title: 'Укажите маршрут', text: 'Регион, откуда везёте животных, и регион назначения.' },
  { title: 'Сверим с карантинами', text: 'Учитываем неснятые карантины и значимость событий по выбранному виду.' },
  { title: 'Получите чек-лист', text: 'Что уточнить у ветслужбы и где проверить официальные условия перевозки.' },
]

export function RouteCheckPage() {
  useDocumentTitle('Проверка перед перевозкой')
  const [search, setSearch] = useSearchParams()
  const from = search.get('from')
  const to = search.get('to')
  const speciesParam = search.get('species')
  const species = isSpeciesSlug(speciesParam) ? speciesParam : undefined
  const params: RouteParams | null = from && to && species ? { from, to, species } : null

  const check = useRouteCheck(params)
  const map = useMapRegions({ species, period: 30 })

  const submit = (next: RouteParams) => setSearch({ from: next.from, to: next.to, species: next.species })

  return (
    <>
      <Hero
        crumbs={[...BASE_CRUMBS, { label: 'Проверка перед перевозкой' }]}
        title="Проверка перед покупкой и перевозкой животных"
        lead="Перед сделкой узнайте, нет ли карантинов в регионе происхождения и в вашем регионе. Это поможет не купить больных животных и не попасть под ограничения при перевозке."
      />
      <PageBody>
        <Card tone="white">
          <RouteCheckForm
            key={`${from}-${to}-${species}`}
            initial={{ from: from ?? undefined, to: to ?? undefined, species }}
            onSubmit={submit}
          />
        </Card>

        {!params && (
          <Section title="Как это работает">
            <ol className={styles.how}>
              {STEPS.map((step) => (
                <li key={step.title}>
                  <b>{step.title}</b>
                  {step.text}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {params && check.isPending && <Skeleton height={320} radius={24} />}
        {params && check.isError && <ErrorState error={check.error} onRetry={() => check.refetch()} />}
        {check.data && params && (
          <div className={styles.result}>
            <RouteVerdict result={check.data} />
            <Card tone="outlined" className={styles.mapCard}>
              <h2 className={styles.mapTitle}>Маршрут на карте</h2>
              <EpizooticMap
                data={map.data}
                selected={params.to}
                highlight={[params.from, params.to]}
                focus={[params.from, params.to]}
                onSelect={(code) => setSearch({ ...Object.fromEntries(search), to: code })}
                ariaLabel="Карта с регионами отправления и назначения"
              />
              <SignificanceLegend />
              <ShareButton title="Проверка перевозки животных" />
            </Card>
          </div>
        )}
      </PageBody>
    </>
  )
}
