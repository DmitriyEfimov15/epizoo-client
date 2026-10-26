import type { OfferDto } from '@/shared/api'
import { Icon, type IconName } from '@/shared/ui'

import styles from './OfferCard.module.css'

const ICONS: Record<string, IconName> = {
  televeterinarian: 'bell',
  'livestock-insurance': 'shield',
  'preferential-farm-credit': 'chart',
  'veterinary-catalog': 'book',
}

export function OfferCard({ offer }: { offer: OfferDto }) {
  return (
    <a className={styles.card} href={offer.url} target="_blank" rel="noopener noreferrer">
      <span className={styles.icon}>
        <Icon name={ICONS[offer.id] ?? 'arrowRight'} />
      </span>
      <span className={styles.title}>{offer.title}</span>
      <span className={styles.text}>{offer.description}</span>
      <span className={styles.more}>
        Подробнее
        <Icon name="external" size={16} />
      </span>
    </a>
  )
}
