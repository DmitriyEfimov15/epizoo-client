import { cn } from '@/shared/lib'

import { levelInfo } from '../model/levels'
import styles from './SignificanceBadge.module.css'

interface SignificanceBadgeProps {
  level: number
  size?: 'm' | 'l'
  /** Без текстовой подписи — только цифра в цветном круге. */
  compact?: boolean
}

/** Уровень значимости: всегда цифра и слово, не только цвет. */
export function SignificanceBadge({ level, size = 'm', compact }: SignificanceBadgeProps) {
  const info = levelInfo(level)
  const dot = (
    <span className={styles.dot} style={{ background: info.color, color: info.textColor }}>
      {info.level}
    </span>
  )
  if (compact) {
    return (
      <span title={`Уровень ${info.level}: ${info.label}`} aria-label={`Уровень ${info.level}: ${info.label}`}>
        {dot}
      </span>
    )
  }
  return (
    <span className={cn(styles.badge, size === 'l' && styles.large)} title={info.description}>
      {dot}
      <span>
        <span className="visually-hidden">Уровень значимости: </span>
        {info.label}
      </span>
    </span>
  )
}
