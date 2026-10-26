import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DEMO_NOTICE_KEY, DemoNotice } from './DemoNotice'

afterEach(() => sessionStorage.clear())

test('показывает предупреждение о демо-версии и запоминает закрытие на сессию', async () => {
  const { unmount } = render(<DemoNotice />)
  const dialog = screen.getByRole('alertdialog', { name: 'Это демонстрационный стенд' })
  expect(dialog).toHaveTextContent('не официальный сервис')
  expect(screen.getByRole('button', { name: 'Понятно' })).toHaveFocus()

  await userEvent.click(screen.getByRole('button', { name: 'Понятно' }))
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  expect(sessionStorage.getItem(DEMO_NOTICE_KEY)).toBe('dismissed')

  unmount()
  render(<DemoNotice />)
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
})

test('закрывается по Escape', async () => {
  render(<DemoNotice />)
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
})
