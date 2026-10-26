import { SignificanceBadge } from '@/entities/significance/@x/quarantine'
import type { QuarantineDto } from '@/shared/api'
import { speciesLabel } from '@/shared/config'
import { formatDate, hostname } from '@/shared/lib'
import { Badge } from '@/shared/ui'

import { QUARANTINE_STATUS } from '../model/status'
import styles from './QuarantineItem.module.css'

export function QuarantineItem({ quarantine }: { quarantine: QuarantineDto }) {
  const status = QUARANTINE_STATUS[quarantine.status]
  return (
    <div className={styles.item}>
      <span className={styles.level}>
        <SignificanceBadge level={quarantine.level} compact />
      </span>
      <p className={styles.title}>
        {quarantine.disease_name}
        {quarantine.locality && <>, {quarantine.locality}</>}
      </p>
      <p className={styles.meta}>
        <Badge tone={quarantine.status === 'active' ? 'error' : 'warning'} title={status.hint}>
          {status.label}
        </Badge>
        <span>с {formatDate(quarantine.since)}</span>
        {quarantine.species.length > 0 && <span>{quarantine.species.map(speciesLabel).join(', ')}</span>}
      </p>
      {quarantine.source_urls.length > 0 && (
        <p className={styles.sources}>
          {quarantine.source_urls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              Акт: {hostname(url)}
            </a>
          ))}
        </p>
      )}
    </div>
  )
}
