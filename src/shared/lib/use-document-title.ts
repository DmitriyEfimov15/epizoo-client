import { useEffect } from 'react'

const SUFFIX = 'Эпизоомонитор — эпизоотическая ситуация в регионах'

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX
  }, [title])
}
