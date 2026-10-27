import { useId } from 'react'

import { cn } from '@/shared/lib'

import styles from './Segmented.module.css'

interface SegmentedProps<T extends string | number> {
  legend: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}

/** Сегментированный переключатель на основе радиокнопок. */
export function Segmented<T extends string | number>({ legend, value, options, onChange }: SegmentedProps<T>) {
  const name = useId()
  return (
    <fieldset className={styles.group}>
      <legend className="visually-hidden">{legend}</legend>
      {options.map((option) => {
        const checked = option.value === value
        return (
          <label key={String(option.value)} className={styles.option}>
            <input type="radio" name={name} checked={checked} onChange={() => onChange(option.value)} />
            {/* Выделение берём из состояния, а не из :checked: iOS Safari не перерисовывает
                соседний элемент, когда React меняет checked программно, и подсвечивает несколько пунктов. */}
            <span className={cn(styles.label, checked && styles.selected)}>{option.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
