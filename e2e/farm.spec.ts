import { expect, test } from './fixtures'

test('профиль хозяйства: создание и персональная сводка', async ({ page }) => {
  await page.goto('/farm')
  await page.getByRole('button', { name: 'Показать мою сводку' }).click()
  await expect(page.getByText('Выберите регион хозяйства')).toBeVisible()

  await page.getByRole('combobox').fill('Алтайский')
  await page.getByRole('option', { name: /Алтайский край/ }).click()
  await page.getByRole('button', { name: 'КРС' }).click()
  await page.getByRole('button', { name: 'Показать мою сводку' }).click()

  await expect(page.getByRole('heading', { name: 'Обстановка для вашего хозяйства' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Алтайский край' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Дайджест недели' })).toBeVisible()

  // Профиль переживает перезагрузку — токен хранится в браузере.
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Обстановка для вашего хозяйства' })).toBeVisible()
})
