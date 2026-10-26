import type { ReactNode } from 'react'

import { cn } from '@/shared/lib'

import { Icon } from '../icon/Icon'
import styles from './Notice.module.css'

interface NoticeProps {
  tone?: 'info' | 'warning' | 'neutral'
  children: ReactNode
  className?: string
}

/** Плашка-пояснение: дисклеймеры и ограничения данных. */
export function Notice({ tone = 'neutral', children, className }: NoticeProps) {
  return (
    <div className={cn(styles.notice, styles[tone], className)}>
      <Icon name={tone === 'warning' ? 'alert' : 'info'} size={18} />
      <div>{children}</div>
    </div>
  )
}
