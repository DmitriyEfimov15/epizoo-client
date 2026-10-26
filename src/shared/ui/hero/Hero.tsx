import type { ReactNode } from 'react'

import { Breadcrumbs, type Crumb } from '../breadcrumbs/Breadcrumbs'
import { Container } from '../container/Container'
import styles from './Hero.module.css'

interface HeroProps {
  title: ReactNode
  lead?: ReactNode
  crumbs?: Crumb[]
  aside?: ReactNode
}

/** Зелёный баннер в начале страницы. */
export function Hero({ title, lead, crumbs, aside }: HeroProps) {
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>
        {crumbs && <Breadcrumbs items={crumbs} inverse />}
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {aside && <div className={styles.aside}>{aside}</div>}
      </Container>
    </section>
  )
}
