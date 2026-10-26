import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib'

import { Icon } from '../icon/Icon'
import styles from './Chip.module.css'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

/** Переключаемый чип фильтра. */
export function Chip({ selected, className, children, ...rest }: ChipProps) {
  return (
    <button type="button" aria-pressed={selected} className={cn(styles.chip, className)} {...rest}>
      {selected && <Icon name="check" size={16} />}
      {children}
    </button>
  )
}
