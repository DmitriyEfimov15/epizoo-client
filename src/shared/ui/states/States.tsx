import type { ReactNode } from 'react'

import { cn } from '@/shared/lib'

import { Button } from '../button/Button'
import { Icon, type IconName } from '../icon/Icon'
import styles from './States.module.css'

interface EmptyStateProps {
  title: string
  text?: ReactNode
  icon?: IconName
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ title, text, icon = 'info', action, compact }: EmptyStateProps) {
  return (
    <div className={cn(styles.state, compact && styles.compact)}>
      <span className={styles.icon}>
        <Icon name={icon} size={28} />
      </span>
      <p className={styles.title}>{title}</p>
      {text && <p className={styles.text}>{text}</p>}
      {action}
    </div>
  )
}

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
  compact?: boolean
}

export function ErrorState({ error, onRetry, compact }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : 'Не удалось загрузить данные'
  return (
    <div className={cn(styles.state, styles.error, compact && styles.compact)} role="alert">
      <span className={styles.icon}>
        <Icon name="alert" size={28} />
      </span>
      <p className={styles.title}>Не удалось загрузить данные</p>
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="s" onClick={onRetry}>
          <Icon name="refresh" size={18} />
          Повторить
        </Button>
      )}
    </div>
  )
}
