import { useState } from 'react'

import { Button, Icon } from '@/shared/ui'

/** Делится текущей ссылкой: системное меню на телефоне, копирование на компьютере. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // Пользователь закрыл меню — пробуем скопировать.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Скопируйте ссылку', url)
    }
  }

  return (
    <Button variant="secondary" size="s" onClick={share} aria-live="polite">
      <Icon name={copied ? 'check' : 'copy'} size={18} />
      {copied ? 'Ссылка скопирована' : 'Поделиться'}
    </Button>
  )
}
