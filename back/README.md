# Guild Planner — Backend

REST API для календаря встреч в фэнтези-фолк стилистике.

## Стек

- Node.js + TypeScript (strict)
- Express.js
- Prisma ORM
- PostgreSQL
- Zod (валидация)
- Winston (логи)
- Swagger UI (документация)

## Быстрый старт

### 1. Запуск PostgreSQL

```bash
docker-compose up -d
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Миграция базы данных

```bash
npx prisma migrate dev --name init
```

### 4. Запуск сервера

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`.

### 5. Документация API

Swagger UI: `http://localhost:3000/docs`

### 6. Health check

```bash
curl http://localhost:3000/health
# => { "status": "ok" }
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DATABASE_URL` | `postgresql://guild_planner:guild_planner_secret@localhost:5432/guild_planner?schema=public` | URL подключения к PostgreSQL |
| `PORT` | `3000` | Порт сервера |
| `NODE_ENV` | `development` | Режим работы |

## API Эндпоинты

| Метод | Эндпоинт | Описание |
|---|---|---|
| POST | `/api/rooms` | Создать комнату |
| POST | `/api/rooms/:roomId/join` | Присоединиться к комнате |
| GET | `/api/rooms/:roomId/calendar` | Получить календарь |
| POST | `/api/rooms/:roomId/availability` | Toggle отметки даты |
| DELETE | `/api/rooms/:roomId/availability` | Удалить все отметки пользователя |
| GET | `/api/rooms/:roomId/users` | Список пользователей |

## Postman коллекция

Импортируйте файл `GuildPlanner.postman_collection.json` в Postman.

## Production сборка

```bash
npm run build
npm start
```
