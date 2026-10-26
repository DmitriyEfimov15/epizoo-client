import { type ReactNode, useId } from 'react'

import { cn } from '@/shared/lib'

import styles from './Section.module.css'

interface SectionProps {
  title: string
  lead?: ReactNode
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** Блок страницы с заголовком H2 в типографике платформы (24/32). */
export function Section({ title, lead, action, className, children }: SectionProps) {
  const id = useId()
  return (
    <section className={cn(styles.section, className)} aria-labelledby={id}>
      <div className={styles.head}>
        <div>
          <h2 id={id} className={styles.title}>
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
