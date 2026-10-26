import { useId } from 'react'

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
      {options.map((option) => (
        <label key={String(option.value)} className={styles.option}>
          <input
            type="radio"
            name={name}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
