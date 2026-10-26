import type { ReactNode } from 'react'

import { Container } from '../container/Container'
import styles from './Page.module.css'

export function PageBody({ children }: { children: ReactNode }) {
  return <Container className={styles.body}>{children}</Container>
}
