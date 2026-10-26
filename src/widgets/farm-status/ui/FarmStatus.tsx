import { useState } from 'react'
import { Link } from 'react-router-dom'

import { SignificanceBadge } from '@/entities/significance'
import type { DashboardDto } from '@/shared/api'
import { routes, speciesLabel } from '@/shared/config'
import { formatCount, hostname } from '@/shared/lib'
import { Badge, Button, Icon, Notice } from '@/shared/ui'

import styles from './FarmStatus.module.css'

const CHECKLIST_LIMIT = 5

/** «У вас / у соседей» и что делать — по профилю хозяйства. */
export function FarmStatus({ dashboard }: { dashboard: DashboardDto }) {
  const { farm, region, neighbors } = dashboard
  // Одинаковые пункты ветправил повторяются у разных болезней — показываем каждый один раз.
  const recommendations = [...new Map(dashboard.recommendations.map((item) => [item.text, item])).values()]
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? recommendations : recommendations.slice(0, CHECKLIST_LIMIT)
  const worstNeighbor = [...neighbors].sort((a, b) => b.level - a.level)[0]
  const neighborsWithEvents = neighbors.filter((n) => n.level > 0)
  return (
    <div className={styles.status}>
      <div className={styles.headline}>
        <h2 className={styles.region}>
          <Link to={`${routes.region(region.code)}?species=${farm.species[0] ?? ''}`}>{region.name}</Link>
        </h2>
        <span className={styles.tags}>
          {farm.district && <Badge>{farm.district}</Badge>}
          {farm.species.map((slug) => (
            <Badge key={slug} tone="brand">
              {speciesLabel(slug)}
            </Badge>
          ))}
        </span>
      </div>

      <div className={styles.compare}>
        <div className={styles.side}>
          <span className={styles.sideTitle}>У вас в регионе</span>
          <SignificanceBadge level={region.level} size="l" />
          <span className={styles.sideText}>
            {formatCount(region.active_quarantine_count, ['действующий карантин', 'действующих карантина', 'действующих карантинов'])}
            , {formatCount(region.event_count, ['сообщение', 'сообщения', 'сообщений'])} за 30 дней по вашим видам
          </span>
        </div>
        <div className={styles.side}>
          <span className={styles.sideTitle}>У соседей</span>
          {worstNeighbor ? (
            <>
              <SignificanceBadge level={worstNeighbor.level} size="l" />
              <span className={styles.sideText}>
                {neighborsWithEvents.length > 0
                  ? `Сообщения в ${formatCount(neighborsWithEvents.length, ['регионе', 'регионах', 'регионах'])} из ${neighbors.length}. Выше всего — ${worstNeighbor.name}.`
                  : 'В соседних регионах сообщений нет.'}
              </span>
            </>
          ) : (
            <span className={styles.sideText}>Соседних регионов по суше нет</span>
          )}
        </div>
      </div>

      {recommendations.length > 0 ? (
        <section aria-labelledby="farm-checklist">
          <h3 id="farm-checklist" className={styles.checklistTitle}>
            Что сделать
          </h3>
          <ul className={styles.checklist}>
            {visible.map((item) => (
              <li key={item.text}>
                <span className={styles.check}>
                  <Icon name="check" size={16} />
                </span>
                <span>
                  {item.text}
                  <a className={styles.source} href={item.source_url} target="_blank" rel="noopener noreferrer">
                    Ветеринарные правила · {hostname(item.source_url)}
                  </a>
                </span>
              </li>
            ))}
          </ul>
          {recommendations.length > CHECKLIST_LIMIT && !expanded && (
            <Button variant="secondary" size="s" className={styles.expand} onClick={() => setExpanded(true)}>
              Показать все ({recommendations.length})
            </Button>
          )}
        </section>
      ) : (
        <Notice tone="neutral">
          Проверенных рекомендаций по текущим болезням пока нет. Соблюдайте ветеринарные правила и при подозрении
          на болезнь сообщайте в ветслужбу.
        </Notice>
      )}
    </div>
  )
}
