import { type KeyboardEvent, useId, useMemo, useState } from 'react'

import { cn } from '@/shared/lib'

import fieldStyles from '../field/Field.module.css'
import { Icon } from '../icon/Icon'
import styles from './Combobox.module.css'

export interface ComboboxOption {
  value: string
  label: string
  meta?: string
  /** Дополнительные строки для поиска (синонимы). */
  keywords?: string[]
}

interface ComboboxProps {
  id?: string
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  describedBy?: string
  invalid?: boolean
  disabled?: boolean
  label?: string
}

const normalize = (text: string) => text.toLowerCase().replace(/ё/g, 'е')

/** Поле с поиском по списку (паттерн ARIA combobox). */
export function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder,
  describedBy,
  invalid,
  disabled,
  label,
}: ComboboxProps) {
  const listId = useId()
  const selected = options.find((option) => option.value === value)
  const [query, setQuery] = useState(selected?.label ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  // Выбор сменился снаружи (сброс формы, обмен регионов) — синхронизируем текст поля при рендере.
  const [syncedLabel, setSyncedLabel] = useState(selected?.label)
  if (syncedLabel !== selected?.label) {
    setSyncedLabel(selected?.label)
    setQuery(selected?.label ?? '')
  }

  const filtered = useMemo(() => {
    const needle = normalize(query.trim())
    if (!needle || needle === normalize(selected?.label ?? '')) return options
    return options.filter((option) =>
      [option.label, option.meta ?? '', ...(option.keywords ?? [])].some((text) =>
        normalize(text).includes(needle),
      ),
    )
  }, [options, query, selected?.label])

  const choose = (option: ComboboxOption) => {
    onChange(option.value)
    setQuery(option.label)
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((index) => Math.min(index + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && open) {
      event.preventDefault()
      const option = filtered[active]
      if (option) choose(option)
    } else if (event.key === 'Escape') {
      setOpen(false)
      setQuery(selected?.label ?? '')
    }
  }

  const activeOption = open ? filtered[active] : undefined

  return (
    <div className={styles.root}>
      <div className={styles.inputWrap}>
        <Icon name="search" className={styles.icon} />
        <input
          id={id}
          className={cn(fieldStyles.control, styles.input)}
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? `${listId}-${activeOption.value}` : undefined}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={(event) => {
            event.target.select()
            setOpen(true)
          }}
          onBlur={() => {
            setOpen(false)
            setQuery(selected?.label ?? '')
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      {open && (
        <ul id={listId} role="listbox" className={styles.list}>
          {filtered.length === 0 && <li className={styles.empty}>Ничего не найдено</li>}
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${option.value}`}
              role="option"
              aria-selected={index === active}
              className={styles.option}
              onMouseDown={(event) => {
                event.preventDefault()
                choose(option)
              }}
              onMouseEnter={() => setActive(index)}
            >
              <span>{option.label}</span>
              {option.meta && <span className={styles.meta}>{option.meta}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
