import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

import { SERVICE_NAME } from '@/shared/config'
import { safeStorage } from '@/shared/lib'
import { Button, Icon } from '@/shared/ui'

import styles from './DemoNotice.module.css'

/** Ключ в sessionStorage: окно показывается заново в каждой новой сессии браузера. */
export const DEMO_NOTICE_KEY = 'epizoo-demo-notice'

/** Предупреждение при входе: сайт — демо-стенд для презентации проекта, а не рабочий сервис. */
export function DemoNotice() {
  const [open, setOpen] = useState(() => safeStorage('session')?.getItem(DEMO_NOTICE_KEY) !== 'dismissed')
  const titleId = useId()
  const textId = useId()

  const close = useCallback(() => {
    safeStorage('session')?.setItem(DEMO_NOTICE_KEY, 'dismissed')
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') close()
      // В окне одна кнопка: фокус не уходит на страницу под затемнением.
      if (event.key === 'Tab') event.preventDefault()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, close])

  if (!open) return null
  return createPortal(
    <div className={styles.backdrop}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={textId}
      >
        <span className={styles.badge}>
          <Icon name="info" size={16} />
          Демо-версия
        </span>
        <h2 id={titleId} className={styles.title}>
          Это демонстрационный стенд
        </h2>
        <div id={textId} className={styles.text}>
          <p>
            «{SERVICE_NAME}» — прототип, подготовленный для презентации проекта на стипендиальном конкурсе
            РСХБ.Цифра. Это не официальный сервис Россельхозбанка или Россельхознадзора.
          </p>
          <p>
            Данные могут быть неполными или устаревшими: не принимайте по ним реальных решений и не вводите
            персональные данные.
          </p>
        </div>
        {/* Фокус сразу на единственное действие модального окна. */}
        <Button fullWidth autoFocus onClick={close}>
          Понятно
        </Button>
      </div>
    </div>,
    document.body,
  )
}
