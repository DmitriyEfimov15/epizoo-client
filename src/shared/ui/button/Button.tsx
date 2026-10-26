import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '@/shared/lib'

import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 's' | 'm' | 'l'

interface CommonProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  iconOnly?: boolean
  children: ReactNode
}

function classes({ variant = 'primary', size = 'm', fullWidth, iconOnly }: CommonProps, extra?: string) {
  return cn(
    styles.button,
    styles[variant],
    size !== 'm' && styles[size],
    fullWidth && styles.full,
    iconOnly && styles.iconOnly,
    extra,
  )
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, fullWidth, iconOnly, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={classes({ variant, size, fullWidth, iconOnly, children: null }, className)}
      {...rest}
    />
  )
}

type ButtonLinkProps = CommonProps & LinkProps

/** Внутренняя ссылка с видом кнопки. */
export function ButtonLink({ variant, size, fullWidth, iconOnly, className, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes({ variant, size, fullWidth, iconOnly, children: null }, className)} {...rest} />
  )
}

type ExternalProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Внешняя ссылка с видом кнопки, открывается в новой вкладке. */
export function ButtonExternal({ variant, size, fullWidth, iconOnly, className, ...rest }: ExternalProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={classes({ variant, size, fullWidth, iconOnly, children: null }, className)}
      {...rest}
    />
  )
}
