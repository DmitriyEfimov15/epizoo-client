import { defineConfig, devices } from '@playwright/test'

/**
 * Сквозные проверки против запущенного API (по умолчанию http://localhost:8000).
 * Dev-сервер фронтенда поднимается автоматически, если ещё не запущен.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  // Локальный API на SQLite однопоточен: ограничиваем параллелизм и даём запасу на ответы.
  expect: { timeout: 10_000 },
  workers: 3,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
    locale: 'ru-RU',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
