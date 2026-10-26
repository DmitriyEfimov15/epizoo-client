import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib'

import styles from './Breadcrumbs.module.css'

export interface Crumb {
  label: string
  /** Внутренний маршрут. */
  to?: string
  /** Внешний адрес платформы. */
  href?: string
}

export function Breadcrumbs({ items, inverse }: { items: Crumb[]; inverse?: boolean }) {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className={cn(styles.list, inverse && styles.inverse)}>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.label} className={styles.item}>
              {last ? (
                <span aria-current="page">{item.label}</span>
              ) : item.to ? (
                <Link className={styles.link} to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <a className={styles.link} href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
