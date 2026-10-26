import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib'

import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'brand' | 'warning' | 'error' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cn(styles.badge, styles[tone], className)} {...rest} />
}
