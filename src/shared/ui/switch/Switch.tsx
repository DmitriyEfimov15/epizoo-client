import styles from './Switch.module.css'

interface SwitchProps {
  label: string
  hint?: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ label, hint, checked, disabled, onChange }: SwitchProps) {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </label>
  )
}
