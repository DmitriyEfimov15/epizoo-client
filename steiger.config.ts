import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Страницы и виджеты сервиса намеренно уникальны: дублирование не ожидается.
    rules: { 'fsd/insignificant-slice': 'off' },
  },
])
