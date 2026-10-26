import { test as base } from '@playwright/test'

export { expect } from '@playwright/test'

/** Демо-окно при входе перекрывает страницу: в сквозных сценариях считаем его уже закрытым. */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => sessionStorage.setItem('epizoo-demo-notice', 'dismissed'))
    await provide(page)
  },
})
