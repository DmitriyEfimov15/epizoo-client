import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, useId } from 'react'

import { cn } from '@/shared/lib'

import styles from './Field.module.css'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  className?: string
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

/** Подпись, подсказка и ошибка вокруг любого поля ввода. */
export function Field({ label, hint, error, hideLabel, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : styles.label}>
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...rest }: InputProps) {
  return <input className={cn(styles.control, className)} {...rest} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, ...rest }: SelectProps) {
  return <select className={cn(styles.control, className)} {...rest} />
}
