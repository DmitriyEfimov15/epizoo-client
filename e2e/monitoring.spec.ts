import { expect, test } from './fixtures'

test('карта → список → регион → страница региона', async ({ page }) => {
  await page.goto('/?species=cattle')
  await expect(page.getByRole('heading', { name: 'Эпизоотическая ситуация в регионах России' })).toBeVisible()
  await expect(page.getByLabel('Вид животных')).toHaveValue('cattle')

  await page.getByRole('radio', { name: 'Список' }).check()
  await page.getByRole('table', { name: 'Все регионы по уровню значимости' }).getByRole('button', { name: 'Алтайский край' }).click()

  const drawer = page.getByRole('dialog', { name: 'Алтайский край' })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('heading', { name: /Карантины/ })).toBeVisible()
  await drawer.getByRole('link', { name: 'Подробнее о регионе' }).click()

  await expect(page).toHaveURL(/\/region\/22\?species=cattle/)
  await expect(page.getByRole('heading', { level: 1, name: 'Алтайский край' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Динамика по неделям' })).toBeVisible()
})

test('проверка перевозки показывает вердикт и ссылку на «Цербер»', async ({ page }) => {
  await page.goto('/route-check?from=22&to=54&species=cattle')
  await expect(page.getByRole('status').getByRole('heading')).toHaveText(/риск/)
  await expect(page.getByRole('link', { name: /Условия перевозки в «Цербере»/ })).toHaveAttribute(
    'href',
    /cerberus\.vetrf\.ru/,
  )
})

test('нет горизонтальной прокрутки страницы', async ({ page }) => {
  test.setTimeout(120_000)
  for (const path of ['/', '/region/22', '/farm', '/feed', '/diseases', '/route-check?from=22&to=54&species=cattle']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const overflow = await page.evaluate(() => {
      const root = document.scrollingElement as HTMLElement
      root.scrollLeft = 100
      const shifted = root.scrollLeft
      root.scrollLeft = 0
      return shifted
    })
    expect(overflow, path).toBe(0)
  }
})
