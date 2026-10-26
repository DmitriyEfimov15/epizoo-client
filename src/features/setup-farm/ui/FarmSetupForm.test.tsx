import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useFarmStore } from '@/entities/farm'
import { mockFetch, renderWithProviders } from '@/shared/lib/testing'

import { FarmSetupForm } from './FarmSetupForm'

const regions = [{ code: '22', name: 'Алтайский край', aliases: [], federal_district: 'Сибирский федеральный округ' }]

afterEach(() => {
  vi.unstubAllGlobals()
  useFarmStore.getState().reset()
})

it('не отправляет форму без региона и видов', async () => {
  const calls = mockFetch({ '/refs/regions': regions })
  renderWithProviders(<FarmSetupForm />)
  await userEvent.click(screen.getByRole('button', { name: 'Показать мою сводку' }))
  expect(screen.getByText('Выберите регион хозяйства')).toBeInTheDocument()
  expect(screen.getByText('Отметьте хотя бы один вид')).toBeInTheDocument()
  expect(calls.some((call) => call.init?.method === 'POST')).toBe(false)
})

it('создаёт профиль и сохраняет токен в браузере', async () => {
  const token = '9b2c1d7e-0000-4000-8000-000000000001'
  const calls = mockFetch({
    '/refs/regions': regions,
    '/farms': { token, region_code: '22', district: null, species: ['cattle'], created_at: '2026-10-14T10:00:00Z' },
  })
  const onDone = vi.fn()
  window.scrollTo = vi.fn()
  renderWithProviders(<FarmSetupForm onDone={onDone} />)

  const input = await screen.findByRole('combobox')
  await waitFor(() => expect(input).toBeEnabled())
  await userEvent.type(input, 'Алтай')
  await userEvent.keyboard('{Enter}')
  await userEvent.click(screen.getByRole('button', { name: 'КРС' }))
  await userEvent.click(screen.getByRole('button', { name: 'Показать мою сводку' }))

  await waitFor(() => expect(onDone).toHaveBeenCalled())
  const post = calls.find((call) => call.init?.method === 'POST')
  expect(JSON.parse(String(post?.init?.body))).toEqual({ region_code: '22', district: null, species: ['cattle'] })
  expect(useFarmStore.getState().token).toBe(token)
})
