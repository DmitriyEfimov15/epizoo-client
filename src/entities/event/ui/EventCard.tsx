import { useState } from 'react'
import { Link } from 'react-router-dom'

import { SignificanceBadge } from '@/entities/significance/@x/event'
import type { EventDto } from '@/shared/api'
import { routes, speciesLabel } from '@/shared/config'
import { cn, formatDate, hostname } from '@/shared/lib'
import { Badge, Icon } from '@/shared/ui'

import { EVENT_KINDS } from '../model/kinds'
import styles from './EventCard.module.css'

interface EventCardProps {
  event: EventDto
  /** Название региона, если карточка показана вне страницы региона. */
  regionName?: string
}

export function EventCard({ event, regionName }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)
  const kind = EVENT_KINDS[event.kind]
  const place = [regionName, event.district, event.locality].filter(Boolean).join(', ')
  return (
    <article className={cn(styles.card, expanded && styles.expanded)}>
      <div className={styles.head}>
        <div className={styles.tags}>
          <Badge tone={kind.tone}>{kind.label}</Badge>
          <SignificanceBadge level={event.level} />
        </div>
        <time className={styles.date} dateTime={event.date}>
          {formatDate(event.date)}
        </time>
      </div>
      <h3 className={styles.title}>
        <Link to={routes.disease(event.disease_slug)}>{event.disease_name}</Link>
        {event.species.length > 0 && <> · {event.species.map(speciesLabel).join(', ')}</>}
      </h3>
      {place && (
        <p className={styles.place}>
          {regionName ? (
            <Link to={routes.region(event.region_code)}>{place}</Link>
          ) : (
            place
          )}
        </p>
      )}
      <p className={styles.text}>{event.text}</p>
      {event.text.length > 220 && (
        <button type="button" className={styles.more} onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}
      {event.source_urls.length > 0 && (
        <ul className={styles.sources} aria-label="Первоисточники">
          {event.source_urls.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {hostname(url)}
                <Icon name="external" size={14} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
