# Фронтенд мониторинга эпизоотической ситуации

Веб-интерфейс сервиса «Эпизоомонитор»: карта регионов с уровнем значимости событий, карточка региона, «Моё хозяйство» с Telegram-оповещениями и дайджестом, лента событий, справочник болезней и проверка перед покупкой и перевозкой животных.

Стек: React 19, TypeScript, Vite, React Router, TanStack Query, Zustand, d3-geo, Recharts, CSS Modules. Архитектура — Feature-Sliced Design. Пакетный менеджер — pnpm 9.15.9 (зафиксирован в `packageManager`).

## Запуск

Нужны Node.js 22+ и запущенный API бэкенда на `http://localhost:8000` (см. `backend/README.md`).

```bash
pnpm install
pnpm dev
```

Интерфейс: <http://localhost:5173>. Dev-сервер проксирует `/api` на `API_URL` (по умолчанию `http://localhost:8000`), поэтому CORS в разработке не нужен.

Полный стенд в Docker из корня репозитория (бэкенд подключается через `include`, его файлы не меняются):

```bash
docker compose up --build -d
```

Интерфейс: <http://localhost:8080>. nginx отдаёт статику и проксирует `/api` на сервис `api`. Для ссылок из Telegram-бота задайте в `backend/.env` `FRONTEND_URL=http://localhost:8080`.

## Команды

| Команда | Что делает |
|---|---|
| `pnpm dev` | dev-сервер с прокси API |
| `pnpm build` | проверка типов и продакшен-сборка в `dist/` |
| `pnpm lint` | ESLint и steiger (правила FSD) |
| `pnpm typecheck` | TypeScript без сборки |
| `pnpm test` | модульные тесты Vitest |
| `pnpm e2e` | сквозные тесты Playwright в установленном Chrome против работающего API |
| `pnpm api:types` | перегенерировать типы из `backend/docs/openapi.json` |
| `pnpm geo` | пересобрать облегчённую геометрию регионов в `public/geo/regions.json` |

Для e2e без Chrome задайте `PLAYWRIGHT_CHANNEL=chromium` и установите браузер командой `pnpm exec playwright install chromium`.

## Архитектура (FSD)

```
src/
  app/        entrypoint (провайдеры, ErrorBoundary), routes, layout, styles (токены)
  pages/      map, region, farm, feed, diseases, disease, route-check, not-found
  widgets/    header, footer, epizootic-map, region-overview, region-history, region-ranking,
              neighbor-regions, event-feed, farm-status, weekly-digest, product-offers,
              route-verdict, data-freshness
  features/   filter-monitoring, setup-farm, subscribe-telegram, check-route,
              share-link
  entities/   region, event, quarantine, disease, significance, summary, report,
              farm, subscription, offer
  shared/     api (клиент, DTO из OpenAPI), ui (кит в стиле платформы), lib, config
```

Правила проверяются автоматически: импорт только из нижних слоёв и только через `index.ts` слайса (ESLint `no-restricted-imports`), остальное — steiger. Сущности связаны через `@x`: `entities/significance/@x/event` и `@x/quarantine`.

Фильтры (вид, болезнь, период), выбранный регион, тип события и маршрут перевозки хранятся в адресе страницы — выборкой можно поделиться ссылкой.

## Дизайн

Токены в `src/app/styles/tokens.css`: шрифт Onest 400/500, основной зелёный `#1CCB01`, текст `#171A1C`, карточки `#F6F7F8` с радиусом 24, кнопки 40/48/56 px с радиусом 16, шапка со скруглённым низом 40 px. Название сервиса задаётся константой `SERVICE_NAME` в `src/shared/config/env.ts`; ссылок и символики сторонних платформ в интерфейсе нет.

Шкала значимости 0–5 повторяет официальную интерпретацию итоговой оценки ИАЦ (1 — незначимо … 5 — чрезвычайное событие). Цвета подобраны так, что светлота падает монотонно, а соседние ступени различимы при дейтеранопии и протанопии (OKLab ΔE ≥ 8,9). Уровень всегда дублируется цифрой и словом. Две серии графика истории проверены валидатором палитр (CVD ΔE 30).

## Решения

- **Карта на d3-geo вместо MapLibre.** Для хороплета без подложки SVG легче и не требует тайлов и ключей; равновеликая коническая проекция Альберса (центральный меридиан 100° в. д.) передаёт форму России без растяжения севера, Чукотка не разрывается. Масштаб и сдвиг — d3-zoom, у карты есть табличная альтернатива «Список» для клавиатуры и скринридеров.
- **Геометрия.** `scripts/build-geo.mjs` упрощает 8 МБ GeoJSON бэкенда до 207 КБ (mapshaper) и выравнивает порядок обхода колец под сферическую модель d3; скрипт падает, если какой-то регион покрывает больше полусферы.
- **pnpm.** npm 11.0 падает на разрешении peer-зависимостей (`Cannot read properties of null (reading 'edgesOut')`).
- **TypeScript 5.9.** openapi-typescript и typescript-eslint пока не поддерживают TypeScript 6–7.
- **Профиль хозяйства анонимный.** UUID хранится в `localStorage` (с запасным хранилищем в памяти для приватного режима), ключ риск-панели — только в `sessionStorage`.

## Проверки

На 14.10.2026 на локальном API с корпусом из 159 сводок:

- `pnpm typecheck`, `pnpm lint` (ESLint + steiger) — без ошибок;
- `pnpm test` — 31 модульный тест;
- `pnpm e2e` — 10 сценариев (5 на десктопе, 5 на Pixel 7): карта → регион, хозяйство, перевозка, риск-панель, отсутствие горизонтальной прокрутки;
- Docker-образ: SPA-маршруты, геометрия и прокси `/api` отвечают 200.

## Ограничения

- Telegram-сценарий с настоящим ботом не проверен: на сервере нет токена бота. Ветки «ссылка выдана», «бот не настроен» и сохранение настроек покрыты модульными тестами.
- Под параллельной нагрузкой локальный API на SQLite отвечает медленно, поэтому e2e ограничены тремя воркерами; рабочая БД бэкенда — PostgreSQL.
