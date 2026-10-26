import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button, EmptyState } from '@/shared/ui'

interface State {
  error: Error | null
}

/** Последний рубеж: сбой рендеринга не должен оставлять пустой экран. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ошибка интерфейса', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ padding: 40 }}>
        <EmptyState
          icon="alert"
          title="Что-то пошло не так"
          text="Обновите страницу. Если ошибка повторится, вернитесь на карту."
          action={<Button onClick={() => window.location.assign('/')}>К карте</Button>}
        />
      </div>
    )
  }
}
