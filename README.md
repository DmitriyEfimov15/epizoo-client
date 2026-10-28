# Фронтенд мониторинга эпизоотической ситуации

Веб-интерфейс сервиса «Эпизоомонитор»: карта регионов с уровнем значимости событий, карточка региона, «Моё хозяйство» с Telegram-оповещениями и дайджестом, лента событий, справочник болезней и проверка перед покупкой и перевозкой животных. Фильтры, выбранный регион и маршрут хранятся в адресе страницы, поэтому выборкой можно поделиться ссылкой.

Стек: React 19, TypeScript, Vite, React Router, TanStack Query, Zustand, d3-geo, Recharts, CSS Modules. Пакетный менеджер — pnpm 9.15.9.

## Запуск

Нужны Node.js 22+ и запущенный API бэкенда на `http://localhost:8000` (см. `backend/README.md`).

```bash
pnpm install
pnpm dev
```

Интерфейс: <http://localhost:5173>. Dev-сервер проксирует `/api` на `API_URL` (по умолчанию `http://localhost:8000`).

Полный стенд (бэкенд + фронтенд) в Docker из корня репозитория:

```bash
docker compose up --build -d
```

Интерфейс: <http://localhost:8080>, nginx отдаёт статику и проксирует `/api` на сервис `api`.

Основные команды: `pnpm build` — сборка, `pnpm lint` — ESLint и steiger, `pnpm test` — Vitest, `pnpm e2e` — Playwright, `pnpm api:types` — типы из `backend/docs/openapi.json`.

## Архитектура

Проект построен по Feature-Sliced Design:

```
src/
  app/        точка входа, провайдеры, маршруты, layout, дизайн-токены
  pages/      map, region, farm, feed, diseases, disease, route-check, not-found
  widgets/    крупные блоки страниц: карта, обзор и история региона, лента событий,
              статус хозяйства, дайджест, вердикт по маршруту, предложения банка
  features/   пользовательские сценарии: фильтры, настройка хозяйства,
              подписка в Telegram, проверка маршрута, поделиться ссылкой
  entities/   region, event, quarantine, disease, significance, summary, report,
              farm, subscription, offer
  shared/     API-клиент и DTO из OpenAPI, UI-кит, утилиты, конфигурация
```

Слои импортируют только нижележащие и только через `index.ts` слайса — это проверяют ESLint (`no-restricted-imports`) и steiger. Данные с сервера загружаются через TanStack Query, локальное состояние — Zustand. Карта — SVG-хороплет на d3-geo (проекция Альберса) без тайлов, с табличной альтернативой для клавиатуры и скринридеров. Профиль хозяйства анонимный: его UUID хранится в `localStorage`.
