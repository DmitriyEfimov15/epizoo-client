import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib'

import styles from './Container.module.css'

export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.container, className)} {...rest} />
}
