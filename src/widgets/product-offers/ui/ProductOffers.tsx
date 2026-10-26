import { OfferCard, useOffers } from '@/entities/offer'
import type { OfferDto, SpeciesSlug } from '@/shared/api'
import { Skeleton } from '@/shared/ui'

import styles from './ProductOffers.module.css'

export function OfferGrid({ offers }: { offers: OfferDto[] }) {
  if (offers.length === 0) return null
  return (
    <>
      <ul className={styles.grid}>
        {offers.map((offer) => (
          <li key={offer.id}>
            <OfferCard offer={offer} />
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        Подборка зависит от ситуации в регионе. Условия продуктов определяет банк или партнёр.
      </p>
    </>
  )
}

/** Сервисы банка и платформы, полезные при текущей ситуации в регионе. */
export function ProductOffers({ region, species }: { region: string; species?: SpeciesSlug }) {
  const offers = useOffers(region, species)
  if (offers.isPending) return <Skeleton height={180} radius={24} />
  if (offers.isError || !offers.data) return null
  return <OfferGrid offers={offers.data} />
}
