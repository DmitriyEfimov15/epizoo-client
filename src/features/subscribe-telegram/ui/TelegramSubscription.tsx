import { useState } from 'react'

import {
  DEFAULT_SUBSCRIPTION,
  useDeleteSubscription,
  useTelegramLink,
  useUpdateSubscription,
} from '@/entities/subscription'
import { LEVELS } from '@/entities/significance'
import { ApiError, type SubscriptionDto, type SubscriptionInDto } from '@/shared/api'
import { Button, ButtonExternal, Field, Icon, Notice, Select, Switch } from '@/shared/ui'

import styles from './TelegramSubscription.module.css'

/** Только редактируемые поля: бэкенд отклоняет лишние (extra="forbid"). */
function toSettings(subscription: SubscriptionDto | null): SubscriptionInDto {
  if (!subscription) return DEFAULT_SUBSCRIPTION
  return {
    min_level: subscription.min_level,
    include_neighbors: subscription.include_neighbors,
    digest_enabled: subscription.digest_enabled,
  }
}

interface TelegramSubscriptionProps {
  token: string
  subscription: SubscriptionDto | null
}

/** Оповещения о новых событиях и еженедельный дайджест в Telegram. */
export function TelegramSubscription({ token, subscription }: TelegramSubscriptionProps) {
  const link = useTelegramLink(token)
  const update = useUpdateSubscription(token)
  const remove = useDeleteSubscription(token)
  const [settings, setSettings] = useState<SubscriptionInDto>(() => toSettings(subscription))
  // Подписка пришла с сервера заново — берём её настройки при рендере, без эффекта.
  const [synced, setSynced] = useState(subscription)
  if (synced !== subscription) {
    setSynced(subscription)
    if (subscription) setSettings(toSettings(subscription))
  }

  const linked = Boolean(subscription?.chat_id)
  const unavailable = link.error instanceof ApiError && link.error.code === 'telegram_unavailable'

  const change = (patch: Partial<SubscriptionInDto>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    update.mutate(next)
  }

  return (
    <div className={styles.box}>
      <div className={styles.status}>
        <span className={styles.icon}>
          <Icon name="telegram" />
        </span>
        <span>
          {linked ? 'Оповещения приходят в Telegram' : subscription ? 'Ожидаем подтверждения в боте' : 'Оповещения в Telegram'}
          <span className={styles.text} style={{ display: 'block' }}>
            {linked
              ? 'Бот пришлёт сообщение о новом событии в вашем регионе и дайджест по понедельникам.'
              : 'Новые карантины рядом с хозяйством — сразу в мессенджер, без проверки сайта.'}
          </span>
        </span>
      </div>

      {!linked && !link.data && (
        <div className={styles.actions}>
          <Button onClick={() => link.mutate()} disabled={link.isPending}>
            <Icon name="telegram" />
            {link.isPending ? 'Готовим ссылку…' : 'Подключить Telegram'}
          </Button>
        </div>
      )}

      {link.data && !linked && (
        <Notice tone="info">
          Откройте бота и нажмите «Начать» — подписка привяжется к этому хозяйству. Не пересылайте ссылку: она
          даёт доступ к профилю.
          <div style={{ marginTop: 12 }}>
            <ButtonExternal href={link.data.url} size="s">
              Открыть бота
              <Icon name="external" size={16} />
            </ButtonExternal>
          </div>
        </Notice>
      )}

      {unavailable && (
        <Notice tone="warning">
          Telegram-бот пока не подключён на сервере. Оповещения заработают после настройки — сводка недели уже
          доступна на этой странице.
        </Notice>
      )}
      {link.isError && !unavailable && <Notice tone="warning">{link.error.message}</Notice>}

      {subscription && (
        <div className={styles.settings}>
          <Field label="Сообщать о событиях с уровня">
            {({ id }) => (
              <Select
                id={id}
                value={settings.min_level}
                onChange={(event) => change({ min_level: Number(event.target.value) })}
              >
                {LEVELS.filter((info) => info.level > 0).map((info) => (
                  <option key={info.level} value={info.level}>
                    {info.level} — {info.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Switch
            label="Учитывать соседние регионы"
            hint="Болезни не знают границ: вспышка у соседей — повод проверить меры защиты"
            checked={settings.include_neighbors}
            onChange={(include_neighbors) => change({ include_neighbors })}
          />
          <Switch
            label="Еженедельный дайджест"
            hint="По понедельникам: что изменилось у вас и у соседей"
            checked={settings.digest_enabled}
            onChange={(digest_enabled) => change({ digest_enabled })}
          />
          {update.isError && <Notice tone="warning">{update.error.message}</Notice>}
          <div className={styles.actions}>
            <Button variant="secondary" size="s" disabled={remove.isPending} onClick={() => remove.mutate()}>
              Отключить оповещения
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
