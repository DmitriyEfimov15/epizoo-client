import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { SubscriptionDto } from '@/shared/api'
import { mockFetch, renderWithProviders } from '@/shared/lib/testing'

import { TelegramSubscription } from './TelegramSubscription'

const token = '9b2c1d7e-0000-4000-8000-000000000001'

afterEach(() => vi.unstubAllGlobals())

it('выдаёт ссылку на бота и предупреждает не пересылать её', async () => {
  mockFetch({ [`/farms/${token}/telegram-link`]: { url: `https://t.me/epizoo_bot?start=${token}` } })
  renderWithProviders(<TelegramSubscription token={token} subscription={null} />)
  await userEvent.click(screen.getByRole('button', { name: 'Подключить Telegram' }))
  expect(await screen.findByRole('link', { name: /Открыть бота/ })).toHaveAttribute(
    'href',
    `https://t.me/epizoo_bot?start=${token}`,
  )
  expect(screen.getByText(/Не пересылайте ссылку/)).toBeInTheDocument()
})

it('объясняет, что бот не настроен на сервере', async () => {
  mockFetch({
    [`/farms/${token}/telegram-link`]: new Response(
      JSON.stringify({ code: 'telegram_unavailable', message: 'Telegram-бот не настроен' }),
      { status: 503 },
    ),
  })
  renderWithProviders(<TelegramSubscription token={token} subscription={null} />)
  await userEvent.click(screen.getByRole('button', { name: 'Подключить Telegram' }))
  expect(await screen.findByText(/бот пока не подключён на сервере/)).toBeInTheDocument()
})

it('сохраняет настройки привязанной подписки', async () => {
  const subscription: SubscriptionDto = {
    id: 1,
    min_level: 3,
    include_neighbors: true,
    digest_enabled: true,
    chat_id: 42,
  }
  const calls = mockFetch({ [`/farms/${token}/subscription`]: { ...subscription, min_level: 4 } })
  renderWithProviders(<TelegramSubscription token={token} subscription={subscription} />)

  expect(screen.getByText('Оповещения приходят в Telegram')).toBeInTheDocument()
  await userEvent.selectOptions(screen.getByLabelText('Сообщать о событиях с уровня'), '4')
  await userEvent.click(screen.getByRole('switch', { name: /Учитывать соседние регионы/ }))

  await waitFor(() => expect(calls.filter((call) => call.init?.method === 'PUT')).toHaveLength(2))
  const last = calls.filter((call) => call.init?.method === 'PUT').at(-1)
  expect(JSON.parse(String(last?.init?.body))).toEqual({
    min_level: 4,
    include_neighbors: false,
    digest_enabled: true,
  })
})
