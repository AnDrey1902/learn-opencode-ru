---
title: 5.10a Основы SDK
subtitle: Управление OpenCode программным способом
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.10a"
duration: 25 минут
practice: 30 минут
level: Продвинутый
description: Управляйте OpenCode программным способом через SDK для автоматизации и глубокой интеграции.
tags:
  - SDK
  - Программный интерфейс
  - Автоматизация
prerequisite:
  - 5.1 Всё о конфигурации
  - 5.9 Удалённая разработка
---

# 5.10a Основы SDK

> **Коротко**: управляйте OpenCode программным способом через JavaScript/TypeScript SDK для автоматических процессов и своих интеграций.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/10a-sdk-basics-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.10a Основы SDK"
     data-zoom-src="/images/5-advanced/10a-sdk-basics-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Установка: `npm install @opencode-ai/sdk`; 3 режима: `createOpencode()` (сервер+клиент, рекомендуется), `createOpencodeClient()` (только клиент), `createOpencodeTui()` (TUI).
2. Базовый API: сессии (CRUD), промпты (sync/async), файлы, TUI-контроль.
3. Пример: `const { client, server } = await createOpencode()` → `client.session.list()` → обязательно `server.close()`.
4. Real-time: `event.subscribe()` → Event Stream → message.updated, session.idle, permission.updated.
5. TypeScript-типы: Session, Message, Event, Config — полная типизация для автодополнения.
6. События: `for await (const event of stream)` — цикл обработки SSE.
7. Ловушки: SDK не коннектится → запустить сервер; конфликт портов → другой port; таймаут → увеличить timeout; разрыв потока → переподключение.

</details>

---

## Что вы сможете после урока

- Установить и настроить OpenCode SDK
- Создавать экземпляры сервера и клиента
- Запускать TUI-интерфейс
- Вести сессии и отправлять сообщения
- Слушать события реального времени

---

## С какими трудностями вы столкнулись

- Хотите вызывать OpenCode из своего приложения
- Хотите пакетно обрабатывать задачи программным способом
- Хотите построить свои интеграции (плагины IDE, инструменты CI/CD и т. д.)
- Хотите автоматизировать действия OpenCode в скриптах

---

## Архитектура SDK: обзор

<AdInArticle />

```
┌─────────────────────────────────────────────────────────┐
│                    Ваше приложение                        │
├─────────────────────────────────────────────────────────┤
│                   @opencode-ai/sdk                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │createOpencode│  │createOpencode│  │createOpencode│    │
│  │             │  │   Client    │  │    Tui      │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │              │
│  Сервер+клиент    Только подключение     Запуск TUI     │
│                   к клиенту                             │
└─────────┼────────────────┼────────────────┼─────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                  OpenCode Server                         │
│            HTTP API (порт по умолчанию 4096)              │
└─────────────────────────────────────────────────────────┘
```

---

## Установка SDK

```bash
npm install @opencode-ai/sdk
```

### Входы V1 и V2

Примеры урока используют вход V1 `@opencode-ai/sdk`. К `v1.18.22` V1 **не удалён**; тот же пакет дополнительно экспортирует `@opencode-ai/sdk/v2` для сессий, вопросов, текущей позиции, потоков событий, пагинации истории, рантайм-операций, запросов прав и других расширений V2. Структуры параметров двух входов различаются — не копируйте вызовы V1 вида `{ path, body }` после смены одного лишь import.

```typescript
// V1: вход для дальнейших примеров урока
import { createOpencodeClient } from "@opencode-ai/sdk"

// V2: плоские параметры, подробности в 5.10c
import { createOpencodeClient as createV2Client } from "@opencode-ai/sdk/v2"
```

> Источники: [`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20),[`V1 sdk.gen.ts:431-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L431-L700),[`V2 location:5038-5058`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5038-L5058),[`V2 session:5171-5793`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5171-L5793)

---

## Три способа использования

### 1. Сервер + клиент (рекомендуется)

Одновременный запуск сервера и клиента — для standalone-скриптов и автоматизации:

```typescript
import { createOpencode } from "@opencode-ai/sdk"

const { client, server } = await createOpencode()

// Вызываем API через client
const sessions = await client.session.list()
console.log(`Сейчас сессий: ${sessions.data?.length}`)

// По завершении закрываем сервер
server.close()
```

#### Параметры ServerOptions

| Параметр | Тип | Описание | По умолчанию |
|------|------|------|--------|
| `hostname` | `string` | Имя хоста сервера | `127.0.0.1` |
| `port` | `number` | Порт сервера | `4096` |
| `signal` | `AbortSignal` | Сигнал останова | `undefined` |
| `timeout` | `number` | Тайм-аут старта сервера (миллисекунды) | `5000` |
| `config` | `Config` | Объект конфигурации, перекрывает `opencode.json` | `{}` |

> **Источник**: `packages/sdk/js/src/server.ts:5-11`

#### Пример перекрытия конфигурации

```typescript
import { createOpencode } from "@opencode-ai/sdk"

const opencode = await createOpencode({
  hostname: "127.0.0.1",
  port: 4097,  // Другой порт во избежание конфликтов
  timeout: 10000,
  config: {
    model: "anthropic/claude-opus-4-5-thinking",
    logLevel: "DEBUG",
  },
})

console.log(`Сервер работает на ${opencode.server.url}`)

// По завершении закрыть
opencode.server.close()
```

---

### 2. Только клиент

Подключение к уже запущенному инстансу OpenCode — для разработки плагинов:

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
})

// Пользуемся client напрямую
const sessions = await client.session.list()
```

#### Параметры ClientOptions

| Параметр | Тип | Описание | По умолчанию |
|------|------|------|--------|
| `baseUrl` | `string` | URL сервера | `http://localhost:4096` |
| `fetch` | `function` | Своя реализация fetch | `globalThis.fetch` |
| `parseAs` | `string` | Способ разбора ответа: `auto`, `json`, `text`, `blob`, `arrayBuffer`, `stream`, `formData` | `auto` |
| `responseStyle` | `"data" \| "fields"` | Стиль возврата: `data` — только данные, `fields` — полный ответ | `fields` |
| `throwOnError` | `boolean` | При ошибке бросать исключение, а не возвращать | `false` |
| `directory` | `string` | Каталог проекта (передаётся заголовком `X-Opencode-Directory`) | `undefined` |

> **Источник**: `packages/sdk/js/src/gen/client/types.gen.ts:10-52`,`packages/sdk/js/src/client.ts:33`

#### Переключение каталогов нескольких проектов

```typescript
// Подключение к другому проекту
const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",
})
```

#### Удалённое подключение (с аутентификацией)

При подключении к удалённому серверу OpenCode с заданным `OPENCODE_SERVER_PASSWORD` передавайте Basic Auth через `headers`:

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"

// Удалённое подключение (с аутентификацией)
const client = createOpencodeClient({
  baseUrl: "http://192.168.1.100:4096",
  headers: {
    // Формат Basic Auth: Base64(username:password)
    // В браузере и Edge Runtime — через btoa()
    Authorization: `Basic ${btoa("opencode:your-password")}`
  },
  directory: "/projects/my-app"  // Каталог удалённого проекта
})
```

::: details В Node.js — через Buffer
```typescript
// В Node.js нет btoa, используйте Buffer
Authorization: `Basic ${Buffer.from("opencode:password").toString("base64")}`
```
:::

| Сценарий | Имя пользователя | Пояснение |
|------|--------|------|
| По умолчанию | `opencode` | Имя пользователя сервера по умолчанию |
| Своё | Значение переменной окружения `OPENCODE_SERVER_USERNAME` | Если на сервере задано своё имя |

> **Источник**: `packages/opencode/src/server/auth.ts:36-42` (генерация заголовка Basic Auth),`packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (разбор запросов)

---

### 3. Запуск TUI-интерфейса

Программный запуск терминального интерфейса OpenCode:

```typescript
import { createOpencodeTui } from "@opencode-ai/sdk"

const tui = createOpencodeTui({
  project: "/path/to/my-project",
  model: "anthropic/claude-opus-4-5-thinking",
  session: "abc123",  // Восстановить указанную сессию
  agent: "build",
})

// Пользователь общается в TUI
// ...

// Закрыть TUI
tui.close()
```

#### Параметры TuiOptions

| Параметр | Тип | Описание |
|------|------|------|
| `project` | `string` | Путь каталога проекта |
| `model` | `string` | Используемая модель (формат: `provider/model`) |
| `session` | `string` | ID восстанавливаемой сессии |
| `agent` | `string` | Используемый Agent (например, `build`, `plan`) |
| `signal` | `AbortSignal` | Сигнал останова |
| `config` | `Config` | Объект конфигурации |

> **Источник**: `packages/sdk/js/src/server.ts:13-20`

---

## Базовое использование API

### Ведение сессий

```typescript
// Создать новую сессию
const session = await client.session.create({
  body: { title: "Моя задача" },
})
console.log(`Сессия создана: ${session.data?.id}`)

// Список всех сессий
const sessions = await client.session.list()

// Получить одну сессию
const detail = await client.session.get({
  path: { id: session.data!.id },
})

// Удалить сессию
await client.session.delete({
  path: { id: session.data!.id },
})
```

### Отправка сообщений

```typescript
// Отправить промпт и дождаться ответа AI
const result = await client.session.prompt({
  path: { id: sessionId },
  body: {
    model: { providerID: "anthropic", modelID: "claude-opus-4-5-thinking" },
    parts: [{ type: "text", text: "Проанализируй проблемы производительности этого кода" }],
  },
})

// Внедрить контекст (без ответа AI)
await client.session.prompt({
  path: { id: sessionId },
  body: {
    noReply: true,
    parts: [{ type: "text", text: "Ты — профессиональный помощник по ревью кода." }],
  },
})
```

### Асинхронная отправка (без ожидания ответа)

```typescript
// Отправить и сразу вернуться — для долгих задач
await client.session.promptAsync({
  path: { id: sessionId },
  body: {
    parts: [{ type: "text", text: "Отрефактори весь модуль" }],
  },
})

// Ответ забирать через подписку на события
```

### Операции с файлами

```typescript
// Поиск текстового содержимого
const textResults = await client.find.text({
  query: { pattern: "function.*opencode" },
})

// Поиск файлов (поддерживает glob-шаблоны)
const files = await client.find.files({
  query: { query: "*.ts" },
})

// Только каталоги
const dirs = await client.find.files({
  query: { query: "src", dirs: "true" },
})

// Чтение содержимого файла
const content = await client.file.read({
  query: { path: "src/index.ts" },
})

// Статус файлов (изменения git)
const status = await client.file.status()
```

### Управление TUI

```typescript
// Дописать текст в поле ввода
await client.tui.appendPrompt({
  body: { text: "Проверь этот файл" },
})

// Отправить текущий ввод
await client.tui.submitPrompt()

// Очистить ввод
await client.tui.clearPrompt()

// Показать уведомление
await client.tui.showToast({
  body: {
    message: "Задача выполнена!",
    variant: "success",
    duration: 3000,  // Показывать 3 секунды
  },
})

// Открыть диалоги
await client.tui.openHelp()
await client.tui.openSessions()
await client.tui.openThemes()
await client.tui.openModels()

// Выполнить команду TUI
await client.tui.executeCommand({
  body: { command: "agent_cycle" },
})
```

---

## Слушание событий реального времени

### Подписка на поток событий

```typescript
const events = await client.event.subscribe()

for await (const event of events.stream) {
  console.log(`Тип события: ${event.type}`)
  console.log(`Данные события:`, event.properties)

  // Обработка по типу события
  switch (event.type) {
    case "message.updated":
      console.log("Сообщение обновлено:", event.properties.info)
      break
    case "session.idle":
      console.log("Сессия простаивает:", event.properties.sessionID)
      break
    case "permission.updated":
      console.log("Запрос права:", event.properties)
      break
  }
}
```

### Частые типы событий

| Тип события | Описание |
|---------|------|
| `message.updated` | Обновление содержимого сообщения |
| `message.part.updated` | Обновление части сообщения (включая delta-приращения) |
| `session.status` | Смена статуса сессии (idle/busy/retry) |
| `session.idle` | Сессия перешла в простой |
| `permission.updated` | Ожидающий запрос права |
| `file.edited` | Файл отредактирован |
| `todo.updated` | Список Todo обновлён |

> Полный список типов событий — в разделе [5.10b Справочник API](./10b-sdk-reference#полный-список-типов-событий)

---

## Импорт типов

SDK предоставляет полные определения типов TypeScript:

```typescript
import type {
  // Главные типы
  Session,
  Message,
  Part,

  // Типы событий
  Event,
  EventMessageUpdated,
  EventSessionIdle,

  // Типы конфигурации
  Config,
  AgentConfig,
  ProviderConfig,

  // Прочие
  Todo,
  Permission,
  Agent,
  Provider,
  Model,
} from "@opencode-ai/sdk"
```

---

## Обработка ошибок

### Стандартная обработка ошибок

```typescript
try {
  const session = await client.session.get({
    path: { id: "invalid-id" }
  })
} catch (error) {
  console.error("Не удалось получить сессию:", (error as Error).message)
}
```

### Опция throwOnError

```typescript
// Глобальная настройка
const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  throwOnError: true,  // Все ошибочные запросы бросают исключения
})

// Или в отдельном запросе
const result = await client.session.get({
  path: { id: sessionId },
  throwOnError: true,
})
```

### Проверка возвращаемого значения

```typescript
const result = await client.session.get({
  path: { id: sessionId },
})

if (result.error) {
  console.error("Ошибка:", result.error)
} else {
  console.log("Сессия:", result.data)
}
```

---

## Боевой пример: пакетное ревью кода

```typescript
import { createOpencode } from "@opencode-ai/sdk"
import { readdir } from "fs/promises"

async function batchCodeReview(directory: string) {
  const { client, server } = await createOpencode({
    config: {
      model: "anthropic/claude-opus-4-5-thinking",
    },
  })

  try {
    // Создать сессию
    const session = await client.session.create({
      body: { title: `Пакетное ревью кода - ${directory}` },
    })
    const sessionId = session.data!.id

    // Найти все TypeScript-файлы
    const files = await client.find.files({
      query: { query: "*.ts", directory },
    })

    console.log(`Найдено файлов: ${files.data?.length}`)

    // Ревью по одному
    for (const file of files.data ?? []) {
      console.log(`Ревью: ${file}`)

      await client.session.prompt({
        path: { id: sessionId },
        body: {
          parts: [{
            type: "text",
            text: `Проверь файл ${file}, найди потенциальные проблемы и предложи улучшения.`
          }],
        },
      })
    }

    console.log("Ревью завершено!")
  } finally {
    server.close()
  }
}

batchCodeReview("./src")
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Не удаётся подключиться через SDK | Сервер не запущен | Сначала выполните `opencode serve` или используйте `createOpencode()` |
| Конфликт портов | Порт 4096 по умолчанию занят | Укажите другой порт `port: 4097` |
| Ошибка типов | Несовпадение версий SDK | Обновитесь: `npm update @opencode-ai/sdk` |
| Ошибка тайм-аута | Медленный старт сервера или проблемы сети | Увеличьте значение `timeout` |
| Обрыв потока событий | Разорвано соединение | Реализуйте логику переподключения |
| Путаница с форматом ответа | Настройка `responseStyle` | По умолчанию `fields`, возвращает `{ data, error, request, response }` |

---

## Итоги урока

Вы научились:

1. **Установке SDK**: `npm install @opencode-ai/sdk`
2. **Трём способам использования**:
   - `createOpencode()` — сервер + клиент
   - `createOpencodeClient()` — только клиент
   - `createOpencodeTui()` — запуск TUI
3. **Базовым API**: ведение сессий, отправка сообщений, операции с файлами, управление TUI
4. **Слушанию событий**: получение изменений статуса в реальном времени

---

## Связанные материалы

- [5.10b Справочник API](./10b-sdk-reference) — полная документация API
- [5.9 Удалённая разработка](./09a-remote-basics) — подробно о HTTP-сервере
- [Официальная документация SDK](https://opencode.ai/docs/sdk)

---

## Анонс следующего урока

> В разделе [5.10b Справочник API](./10b-sdk-reference) подробно разберём все 20 модулей API плюс 1 метод ответа на права, полные определения типов и 32 типа событий.
