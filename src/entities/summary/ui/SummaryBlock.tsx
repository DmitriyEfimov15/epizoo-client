import type { SummaryDto } from '@/shared/api'
import { formatCount, formatDateTime, hostname } from '@/shared/lib'
import { Badge, Icon } from '@/shared/ui'

import styles from './SummaryBlock.module.css'

const PROVIDERS: Record<string, string> = {
  template: 'Сводка по шаблону',
  yandex: 'YandexGPT',
}

const VISIBLE_SOURCES = 3

function SourceList({ urls, offset = 0 }: { urls: string[]; offset?: number }) {
  return (
    <ul className={styles.sources}>
      {urls.map((url, index) => (
        <li key={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {offset + index + 1}. {hostname(url)}
            <Icon name="external" size={14} />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Первые источники видны сразу, остальные — по раскрытию. */
function SourceLinks({ urls }: { urls: string[] }) {
  const rest = urls.slice(VISIBLE_SOURCES)
  return (
    <div className={styles.sourceBlock} aria-label="Источники сводки" role="group">
      <SourceList urls={urls.slice(0, VISIBLE_SOURCES)} />
      {rest.length > 0 && (
        <details className={styles.more}>
          <summary>Ещё {formatCount(rest.length, ['источник', 'источника', 'источников'])}</summary>
          <SourceList urls={rest} offset={VISIBLE_SOURCES} />
        </details>
      )}
    </div>
  )
}

export function SummaryBlock({ summary }: { summary: SummaryDto }) {
  const provider = PROVIDERS[summary.provider] ?? summary.provider
  const generated = summary.provider !== 'template'
  return (
    <div className={styles.block}>
      <p className={styles.text}>{summary.text}</p>
      <p className={styles.meta}>
        <Badge tone={generated ? 'info' : 'neutral'}>{provider}</Badge>
        <span>
          {generated ? 'Текст составлен моделью только по сообщениям ниже' : 'Выдержки из сообщений ветслужб'} ·{' '}
          {formatDateTime(summary.created_at)}
        </span>
      </p>
      {summary.source_urls.length > 0 && (
        <SourceLinks urls={summary.source_urls} />
      )}
    </div>
  )
}
