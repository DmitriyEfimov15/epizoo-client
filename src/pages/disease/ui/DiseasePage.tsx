import { useNavigate, useParams } from 'react-router-dom'

import { useDisease } from '@/entities/disease'
import { useMapRegions } from '@/entities/region'
import { ApiError } from '@/shared/api'
import { BASE_CRUMBS, routes, speciesLabel } from '@/shared/config'
import { hostname, useDocumentTitle } from '@/shared/lib'
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  ErrorState,
  Hero,
  Icon,
  Notice,
  PageBody,
  Section,
  Skeleton,
} from '@/shared/ui'
import { RegionRanking } from '@/widgets/region-ranking'

import styles from './DiseasePage.module.css'

const PERIOD = 90

export function DiseasePage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const disease = useDisease(slug)
  const regions = useMapRegions({ disease: slug, period: PERIOD })
  useDocumentTitle(disease.data?.name)

  if (disease.error instanceof ApiError && disease.error.status === 404) {
    return (
      <PageBody>
        <EmptyState
          title="Болезнь не найдена"
          action={<ButtonLink to={routes.diseases()}>К справочнику</ButtonLink>}
        />
      </PageBody>
    )
  }

  const data = disease.data
  const affected = (regions.data ?? []).filter((region) => region.level > 0)
  return (
    <>
      <Hero
        crumbs={[...BASE_CRUMBS, { label: 'Справочник болезней', to: routes.diseases() }, { label: data?.name ?? '…' }]}
        title={data?.name ?? <Skeleton width={320} height={40} />}
        lead={data?.aliases.length ? `Также: ${data.aliases.join(', ')}` : undefined}
        aside={
          <ButtonLink to={`${routes.feed()}?disease=${slug}`} variant="secondary">
            <Icon name="list" />
            Сообщения по болезни
          </ButtonLink>
        }
      />
      <PageBody>
        {disease.isPending && <Skeleton height={240} radius={24} />}
        {disease.isError && !(disease.error instanceof ApiError && disease.error.status === 404) && (
          <ErrorState error={disease.error} onRetry={() => disease.refetch()} />
        )}
        {data && (
          <div className={styles.layout}>
            <div className={styles.main}>
              <Section title="О болезни">
                <div className={styles.tags}>
                  {data.is_zoonosis && <Badge tone="error">Опасна для человека</Badge>}
                  {data.species.map((species) => (
                    <Badge key={species} tone="brand">
                      {speciesLabel(species)}
                    </Badge>
                  ))}
                </div>
                <p className={styles.description}>{data.description}</p>
              </Section>
              <Section title="Признаки">
                {data.symptoms.length > 0 ? (
                  <ul className={styles.symptoms}>
                    {data.symptoms.map((symptom) => (
                      <li key={symptom}>{symptom}</li>
                    ))}
                  </ul>
                ) : (
                  <Notice tone="neutral">
                    Признаки ещё не сверены с первичными ветеринарными правилами — мы не публикуем непроверенные
                    сведения. Обратитесь к ветеринарному врачу.
                  </Notice>
                )}
              </Section>
              <Section title="Что делать">
                {data.recommendations.length > 0 ? (
                  <ol className={styles.steps}>
                    {data.recommendations.map((item) => (
                      <li key={`${item.text}|${item.source_url}`}>
                        <span>
                          {item.text}
                          <a className={styles.source} href={item.source_url} target="_blank" rel="noopener noreferrer">
                            Источник: {hostname(item.source_url)}
                          </a>
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <Notice tone="neutral">
                    При подозрении на заразную болезнь сообщите в государственную ветеринарную службу региона.
                  </Notice>
                )}
              </Section>
            </div>
            <Card as="aside" tone="outlined">
              <h2 className={styles.sideTitle}>Где регистрируется</h2>
              <p className={styles.sideLead}>Регионы с сообщениями или карантинами за {PERIOD} дней</p>
              {regions.isPending ? (
                <Skeleton height={200} />
              ) : affected.length === 0 ? (
                <EmptyState compact icon="check" title="Сообщений за период нет" />
              ) : (
                <RegionRanking
                  data={affected}
                  onSelect={(code) => navigate(routes.region(code))}
                  caption={`Регионы с сообщениями о болезни «${data.name}»`}
                />
              )}
            </Card>
          </div>
        )}
      </PageBody>
    </>
  )
}
