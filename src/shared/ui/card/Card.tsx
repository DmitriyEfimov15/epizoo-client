import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib'

import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLElement> {
  tone?: 'gray' | 'white' | 'outlined'
  compact?: boolean
  as?: 'div' | 'section' | 'article' | 'aside' | 'li'
}

export function Card({ tone = 'gray', compact, as: Tag = 'div', className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(styles.card, tone !== 'gray' && styles[tone], compact && styles.compact, className)}
      {...rest}
    />
  )
}
