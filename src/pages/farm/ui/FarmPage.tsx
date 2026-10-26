import { useState } from 'react'

import { FarmSetupForm } from '@/features/setup-farm'
import { TelegramSubscription } from '@/features/subscribe-telegram'
import { useFarmDashboard, useFarmStore } from '@/entities/farm'
import { ApiError } from '@/shared/api'
import { BASE_CRUMBS } from '@/shared/config'
import { useDocumentTitle } from '@/shared/lib'
import {
  Button,
  Card,
  Drawer,
  ErrorState,
  Hero,
  Icon,
  type IconName,
  Notice,
  PageBody,
  Section,
  Skeleton,
} from '@/shared/ui'
import { FarmStatus } from '@/widgets/farm-status'
import { NeighborRegions } from '@/widgets/neighbor-regions'
import { OfferGrid } from '@/widgets/product-offers'
import { WeeklyDigest } from '@/widgets/weekly-digest'

import styles from './FarmPage.module.css'

const CRUMBS = [...BASE_CRUMBS, { label: 'Моё хозяйство' }]

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'location',
    title: 'Сводка по вашему региону',
    text: 'Только болезни ваших животных: уровень значимости, действующие карантины и что сделать.',
  },
  {
    icon: 'map',
    title: 'Обстановка у соседей',
    text: 'Вспышка в соседнем регионе — сигнал заранее проверить меры защиты.',
  },
  {
    icon: 'telegram',
    title: 'Оповещения в Telegram',
    text: 'Новое событие рядом — сразу в мессенджер. Дайджест недели — по понедельникам.',
  },
]

function Setup() {
  return (
    <div className={styles.setup}>
      <Card tone="white">
        <FarmSetupForm />
      </Card>
      <Card as="aside">
        <ul className={styles.benefits}>
          {BENEFITS.map((item) => (
            <li key={item.title} className={styles.benefit}>
              <span className={styles.benefitIcon}>
                <Icon name={item.icon} />
              </span>
              <span>
                <p className={styles.benefitTitle}>{item.title}</p>
                <p className={styles.benefitText}>{item.text}</p>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Dashboard({ token }: { token: string }) {
  const dashboard = useFarmDashboard(token)
  const reset = useFarmStore((state) => state.reset)
  const [editing, setEditing] = useState(false)

  if (dashboard.error instanceof ApiError && dashboard.error.status === 404) {
    return (
      <>
        <Notice tone="warning">Профиль хозяйства не найден на сервере. Заполните его заново.</Notice>
        <Button onClick={reset}>Создать профиль</Button>
      </>
    )
  }
  if (dashboard.isPending) return <Skeleton height={320} radius={24} />
  if (dashboard.isError) return <ErrorState error={dashboard.error} onRetry={() => dashboard.refetch()} />

  const data = dashboard.data
  const search = data.farm.species[0] ? `?species=${data.farm.species[0]}` : ''
  return (
    <div className={styles.dashboard}>
      <div className={styles.main}>
        <Section
          title="Обстановка для вашего хозяйства"
          action={
            <Button variant="secondary" size="s" onClick={() => setEditing(true)}>
              Изменить профиль
            </Button>
          }
        >
          <Card tone="white">
            <FarmStatus dashboard={data} />
          </Card>
        </Section>
        <Section title="Дайджест недели" lead="Тот же текст бот присылает по понедельникам.">
          <WeeklyDigest token={token} />
        </Section>
        <Section title="Соседние регионы">
          <NeighborRegions neighbors={data.neighbors} search={search} />
        </Section>
      </div>
      <aside className={styles.side}>
        <Card tone="outlined">
          <TelegramSubscription token={token} subscription={data.subscription} />
        </Card>
        {data.offers.length > 0 && (
          <Card>
            <h2 className={styles.sideTitle}>Сервисы для вашей ситуации</h2>
            <OfferGrid offers={data.offers} />
          </Card>
        )}
        <Card>
          <h2 className={styles.sideTitle}>Профиль на этом устройстве</h2>
          <p style={{ font: 'var(--text-small)', color: 'var(--gray-800)', marginBottom: 16 }}>
            Ключ профиля хранится в браузере. Если сбросить его, сводка и подписка станут недоступны с этого
            устройства.
          </p>
          <div className={styles.profileActions}>
            <Button variant="secondary" size="s" onClick={reset}>
              Сбросить профиль
            </Button>
          </div>
        </Card>
      </aside>
      <Drawer open={editing} title="Профиль хозяйства" onClose={() => setEditing(false)}>
        <FarmSetupForm farm={data.farm} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      </Drawer>
    </div>
  )
}

export function FarmPage() {
  useDocumentTitle('Моё хозяйство')
  const token = useFarmStore((state) => state.token)
  return (
    <>
      <Hero
        crumbs={CRUMBS}
        title="Моё хозяйство"
        lead={
          token
            ? 'Персональная сводка по вашему региону и видам животных.'
            : 'Укажите регион и животных один раз — сервис будет показывать то, что важно именно вам. Без регистрации.'
        }
      />
      <PageBody>{token ? <Dashboard token={token} /> : <Setup />}</PageBody>
    </>
  )
}
