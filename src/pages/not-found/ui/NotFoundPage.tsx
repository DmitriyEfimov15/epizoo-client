import { routes } from '@/shared/config'
import { useDocumentTitle } from '@/shared/lib'
import { ButtonLink, EmptyState, PageBody } from '@/shared/ui'

export function NotFoundPage() {
  useDocumentTitle('Страница не найдена')
  return (
    <PageBody>
      <EmptyState
        icon="map"
        title="Страница не найдена"
        text="Возможно, ссылка устарела. Вернитесь к карте регионов."
        action={<ButtonLink to={routes.map()}>К карте</ButtonLink>}
      />
    </PageBody>
  )
}
