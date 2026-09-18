---
title: 5.9b Справочник HTTP API
subtitle: Полная документация API сервера OpenCode
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.9b"
duration: 25 минут
level: Продвинутый
description: Сервер OpenCode предоставляет полный REST API для программного взаимодействия с OpenCode.
tags:
  - API
  - HTTP
  - REST
prerequisite:
  - 5.9a Основы удалённого режима
---

# 5.9b Справочник HTTP API

> 💡 **Коротко**: сервер OpenCode предоставляет полный REST API для программного взаимодействия с OpenCode.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/remote-api-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.9b Справочник HTTP API"
     data-zoom-src="/images/5-advanced/remote-api-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Обзор: 19 категорий REST API, интерактивная дока на localhost:4096/doc.
2. Session API (главный): создание POST /session, получение GET /session/:id, удаление, форк, шаринг.
3. Message API: отправка POST /session/:id/message, асинхронная prompt_async, command, shell.
4. File API: поиск файлов и содержимого, чтение, список каталогов.
5. Event Stream (SSE): GET /event — server.connected, session.created, message.created; для мониторинга.
6. TUI Control API: append-prompt, submit-prompt, show-toast, open-sessions — для IDE-плагинов.
7. 19 категорий: /global, /project, /session, /config, /provider, /file, /tui, /auth, /command, /agent.
8. Ловушки: CORS → `--cors <origin>`, разрывы SSE → прокси/таймаут, 404 → проверить ID сессии/сообщения.

</details>

---

## Что вы сможете после урока

- Понимать общую структуру API OpenCode
- Управлять сессиями и сообщениями через API
- Выполнять команды и операции с файлами через API
- Слушать поток событий SSE

---

## Обзор API

Сервер OpenCode публикует спецификацию OpenAPI 3.1 — интерактивная документация доступна по адресу:

```
http://<hostname>:<port>/doc
```

Например: `http://localhost:4096/doc`

Большинство путей `/session`, `/file`, `/event` ниже относятся к API V1. В `v1.18.22` V1 сохраняется, а через `/api/*` расширяется V2; обновление не переводит существующие вызовы V1 на V2 автоматически.

> Источники: [`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20),[`V1 sdk.gen.ts:431-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L431-L700),[`V2 sdk.gen.ts:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873)

### Расширения API V2

V2 — не только каталог моделей. Целевая версия уже расширила сессии, вопросы, текущую позицию, потоки событий, пагинацию истории, рантайм-операции и запросы прав:

| Метод | Путь | Описание |
|------|------|------|
| `GET` | `/api/location` | Разобрать текущую позицию directory/workspace |
| `GET` / `POST` | `/api/session` | Список сессий с пагинацией / создание сессии |
| `GET` | `/api/session/:sessionID` | Получить сессию |
| `GET` | `/api/session/:sessionID/history` | Читать ограниченные страницы событий по `after` и `limit` |
| `GET` | `/api/session/:sessionID/event` | Доиграть и продолжать подписываться на события сессии |
| `POST` | `/api/session/:sessionID/interrupt` | Прервать активное выполнение, которым владеет текущий процесс |
| `GET` | `/api/session/:sessionID/question` | Список ожидающих вопросов сессии |
| `POST` | `/api/session/:sessionID/question/:requestID/reply` | Ответить на ожидающий вопрос |
| `POST` | `/api/session/:sessionID/question/:requestID/reject` | Отклонить ожидающий вопрос |
| `GET` / `POST` | `/api/session/:sessionID/permission` | Список или создание запросов прав уровня сессии |
| `GET` | `/api/permission/request` | Список ожидающих запросов прав по позиции |
| `GET` | `/api/event` | Серверные события V2 по SSE |

> Источники: [`sdk.gen.ts:5038-5058`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5038-L5058),[`sdk.gen.ts:5171-5424`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5171-L5424),[`sdk.gen.ts:5426-5793`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5793),[`sdk.gen.ts:6319-6405`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6319-L6405),[`sdk.gen.ts:6549-6559`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6549-L6559)

---

## Аутентификация

Если на сервере задана переменная окружения `OPENCODE_SERVER_PASSWORD`, все запросы API требуют HTTP Basic Auth.

### Пример curl

```bash
# С Basic Auth
curl -u opencode:your-password http://localhost:4096/global/health

# Или вручную заголовком Authorization
curl -H "Authorization: Basic $(echo -n 'opencode:your-password' | base64)" \
  http://localhost:4096/global/health
```

### Параметры аутентификации

| Параметр | Описание |
|------|------|
| Имя пользователя | По умолчанию `opencode` или значение переменной окружения `OPENCODE_SERVER_USERNAME` |
| Пароль | Значение переменной окружения `OPENCODE_SERVER_PASSWORD` |

---

## Глобальный API

<AdInArticle />

### /global

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/global/health` | Здоровье сервера | `{ healthy: true, version: string }` |
| `GET` | `/global/event` | Глобальный поток событий (SSE) | Event stream |

**Пример**:

```bash
# Без пароля сервера
curl http://localhost:4096/global/health

# После настройки OPENCODE_SERVER_PASSWORD health тоже требует Basic Auth
curl -u opencode:your-password http://localhost:4096/global/health
```

Ответ:

```json
{
  "healthy": true,
  "version": "1.0.48"
}
```

> Источник: `opencode/packages/opencode/src/server/server.ts:131-150`

---

## API проектов

### /project

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/project` | Список всех проектов | `Project[]` |
| `GET` | `/project/current` | Текущий проект | `Project` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:88-94`

---

## API путей и контроля версий

### /path, /vcs

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/path` | Текущий путь | `Path` |
| `GET` | `/vcs` | VCS-информация текущего проекта | `VcsInfo` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:97-103`

---

## API инстансов

### /instance

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `POST` | `/instance/dispose` | Уничтожить текущий инстанс | `boolean` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:106-111`

---

## API конфигурации

### /config

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/config` | Информация о конфигурации | `Config` |
| `PATCH` | `/config` | Обновить конфигурацию | `Config` |
| `GET` | `/config/providers` | Список провайдеров и моделей по умолчанию | `{ providers: Provider[], default: Record<string, string> }` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:114-121`

---

## API провайдеров

### /provider

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/provider` | Список всех провайдеров | `{ all: Provider[], default: {...}, connected: string[] }` |
| `GET` | `/provider/auth` | Способы аутентификации провайдеров | `{ [providerID: string]: ProviderAuthMethod[] }` |
| `POST` | `/provider/{id}/oauth/authorize` | Начать OAuth-авторизацию | `ProviderAuthAuthorization` |
| `POST` | `/provider/{id}/oauth/callback` | Обработать OAuth-колбэк | `boolean` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:124-132`

---

## API сессий

### /session

Самый используемый API — ведение диалоговых сессий.

| Метод | Путь | Описание | Примечание |
|------|------|------|------|
| `GET` | `/session` | Список всех сессий | Возвращает `Session[]` |
| `POST` | `/session` | Создать новую сессию | body: `{ parentID?, title? }` |
| `GET` | `/session/status` | Статусы всех сессий | `{ [sessionID: string]: SessionStatus }` |
| `GET` | `/session/:id` | Детали сессии | Возвращает `Session` |
| `DELETE` | `/session/:id` | Удалить сессию с данными | Возвращает `boolean` |
| `PATCH` | `/session/:id` | Обновить свойства сессии | body: `{ title? }` |
| `GET` | `/session/:id/children` | Дочерние сессии | Возвращает `Session[]` |
| `GET` | `/session/:id/todo` | Список дел сессии | Возвращает `Todo[]` |
| `POST` | `/session/:id/init` | Проанализировать приложение и создать AGENTS.md | body: `{ messageID, providerID, modelID }` |
| `POST` | `/session/:id/fork` | Форкнуть сессию от указанного сообщения | body: `{ messageID? }` |
| `POST` | `/session/:id/abort` | Прервать выполняющуюся сессию | Возвращает `boolean` |
| `POST` | `/session/:id/share` | Поделиться сессией | Возвращает `Session` |
| `DELETE` | `/session/:id/share` | Отменить шаринг | Возвращает `Session` |
| `GET` | `/session/:id/diff` | Файловые различия сессии | query: `messageID?` |
| `POST` | `/session/:id/summarize` | Суммировать сессию | body: `{ providerID, modelID }` |
| `POST` | `/session/:id/revert` | Откатить к указанному сообщению или части с откатом связанных файловых патчей по умолчанию | body: `{ messageID, partID? }` |
| `POST` | `/session/:id/unrevert` | Повторить отменённые сообщения и состояние файлов | Возвращает `Session` |
| `POST` | `/session/:id/permissions/:permissionID` | Ответить на запрос права | body: `{ response }` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:135-157`

`revert` не просто прячет сообщения чата: сервис находит целевую границу, собирает последующие патчи, восстанавливает снапшот и обновляет diff сессии; `unrevert` восстанавливает исходный снапшот и снимает состояние revert. Оба требуют неработающей сессии. Настройка `snapshot: false` отключает только undo и redo файловых снапшотов, семантика отмены границ сообщений сохраняется.

> Источники: [`session/revert.ts:38-98`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L98),[`config.ts:52-55`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55),[`V1 sdk.gen.ts:678-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L678-L700)

**Пример — создание новой сессии**:

```bash
curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Сессия ревью кода"}'
```

---

## API Workspace (экспериментальный)

Workspace в `v1.18.22` управляются adapter: встроенный adapter — `worktree`, API умеет перечислять adapter, создавать и обнаруживать workspace, смотреть состояние подключений и warp-сессии. Запросы маршрутизируются workspace-aware через query `directory` / `workspace`; `warp` с `copyChanges` копирует Git-патч.

| Метод | Путь | Описание |
|------|------|------|
| `GET` | `/experimental/workspace/adapter` | Список доступных adapter текущего проекта |
| `GET` / `POST` | `/experimental/workspace` | Список и создание workspace |
| `POST` | `/experimental/workspace/sync-list` | Зарегистрировать обнаруженные adapter, но ещё не учтённые workspace |
| `GET` | `/experimental/workspace/status` | Состояние подключений |
| `POST` | `/experimental/workspace/warp` | Переместить session, опционально `copyChanges` |

::: warning Исторические границы
Релиз v1.16.0 с managed workspace cloning обещал сохранение грязных файлов и неотслеживаемых. Целевой тег уже идёт путём adapter и worktree. Историческую возможность нельзя напрямую считать поведением текущего API `v1.18.22`, реализация `copyChanges` — это Git-патч без обещания «копировать все неотслеживаемые файлы».
:::

> Текущая реализация: [пути API workspace:12-47](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts#L12-L47),[эндпоинты API workspace:53-127](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts#L53-L127),[`workspace.ts:492-538`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538),[`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620),[`workspace-routing.ts:148-185`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts#L148-L185). Исторические доказательства: [релиз `v1.16.0`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0),коммит `5661af203487b90cf9ee0844b198b03cce26c412`.

---

## API сообщений

### /session/:id/message

| Метод | Путь | Описание | Примечание |
|------|------|------|------|
| `GET` | `/session/:id/message` | Список сообщений | query: `limit?` |
| `POST` | `/session/:id/message` | Отправить сообщение и дождаться ответа | body — ниже |
| `GET` | `/session/:id/message/:messageID` | Детали сообщения | Возвращает `{ info, parts }` |
| `POST` | `/session/:id/prompt_async` | Асинхронная отправка сообщения (без ожидания) | Возвращает `204 No Content` |
| `POST` | `/session/:id/command` | Выполнить слэш-команду | body: `{ command, arguments, ... }` |
| `POST` | `/session/:id/shell` | Выполнить shell-команду | body: `{ agent, model?, command }` |

### Тело запроса отправки сообщения

```typescript
{
  messageID?: string,     // Необязательно, ID сообщения
  model?: {               // Необязательно, указать модель
    providerID: string,
    modelID: string
  },
  agent?: string,         // Необязательно, указать agent
  noReply?: boolean,      // Необязательно, без ожидания ответа
  system?: string,        // Необязательно, системный промпт
  tools?: Record<string, boolean>, // Устарело, приоритет у конфигурации permission
  parts: Part[]           // Содержимое сообщения
}
```

> Источник: `opencode/packages/web/src/content/docs/server.mdx:160-170`

**Пример — отправка сообщения**:

```bash
curl -X POST http://localhost:4096/session/abc123/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {"type": "text", "text": "Объясни назначение этого кода"}
    ]
  }'
```

---

## API команд

### /command

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/command` | Список всех команд | `Command[]` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:173-178`

---

## API файлов

### /find, /file

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/find?pattern=<pat>` | Поиск по содержимому файлов | Массив совпадений |
| `GET` | `/find/file?query=<q>` | Поиск файлов по имени | `string[]` (пути) |
| `GET` | `/find/symbol?query=<q>` | Поиск символов рабочей области | `Symbol[]` |
| `GET` | `/file?path=<path>` | Содержимое каталога | `FileNode[]` |
| `GET` | `/file/content?path=<p>` | Чтение содержимого файла | `FileContent` |
| `GET` | `/file/status` | Статус отслеживаемых файлов | `File[]` |

### Параметры запроса /find/file

| Параметр | Обязат. | Описание |
|------|------|------|
| `query` | Да | Строка поиска (нечёткое совпадение) |
| `type` | Нет | Ограничить `"file"` или `"directory"` |
| `directory` | Нет | Перекрыть корень проекта |
| `limit` | Нет | Максимум результатов (1–200) |
| `dirs` | Нет | Старый параметр, `"false"` — только файлы |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:181-199`

**Пример — поиск файлов**:

```bash
# Файлы с "config" в имени
curl "http://localhost:4096/find/file?query=config&limit=10"

# Поиск по содержимому файлов
curl "http://localhost:4096/find?pattern=TODO"
```

---

## API инструментов (экспериментальный)

### /experimental/tool

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/experimental/tool/ids` | Список ID всех инструментов | `ToolIDs` |
| `GET` | `/experimental/tool?provider=<p>&model=<m>` | Доступные модели инструменты и их JSON-схемы | `ToolList` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:202-208`

---

## API LSP, форматтеров и MCP

### /lsp, /formatter, /mcp

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/lsp` | Статус LSP-серверов | `LSPStatus[]` |
| `GET` | `/formatter` | Статус форматтеров | `FormatterStatus[]` |
| `GET` | `/mcp` | Статус MCP-серверов | `{ [name: string]: MCPStatus }` |
| `POST` | `/mcp` | Динамическое добавление MCP-сервера | body: `{ name, config }` |
| `POST` | `/mcp/:name/auth` | Запуск OAuth-аутентификации MCP | `{ authorizationUrl: string }` |
| `POST` | `/mcp/:name/auth/callback` | Обработка OAuth-колбэка MCP | `boolean` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:211-218`, `server.ts:2197-2230`

---

## API агентов

### /agent

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/agent` | Список всех доступных agent | `Agent[]` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:222-227`

---

## API логов

### /log

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `POST` | `/log` | Записать запись лога | `boolean` |

Тело запроса:

```typescript
{
  service: string,           // Имя сервиса
  level: "debug" | "info" | "warn" | "error",
  message: string,           // Текст лога
  extra?: Record<string, any> // Дополнительные метаданные
}
```

> Источник: `opencode/packages/web/src/content/docs/server.mdx:230-235`

---

## API управления TUI

### /tui

Удалённое управление интерфейсом TUI — главным образом для плагинов IDE.

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `POST` | `/tui/append-prompt` | Дописать текст в промпт | `boolean` |
| `POST` | `/tui/open-help` | Открыть диалог помощи | `boolean` |
| `POST` | `/tui/open-sessions` | Открыть выбор сессий | `boolean` |
| `POST` | `/tui/open-themes` | Открыть выбор тем | `boolean` |
| `POST` | `/tui/open-models` | Открыть выбор моделей | `boolean` |
| `POST` | `/tui/submit-prompt` | Отправить текущий промпт | `boolean` |
| `POST` | `/tui/clear-prompt` | Очистить промпт | `boolean` |
| `POST` | `/tui/execute-command` | Выполнить команду | body: `{ command }` |
| `POST` | `/tui/show-toast` | Показать уведомление | body: `{ title?, message, variant }` |
| `GET` | `/tui/control/next` | Ждать следующего управляющего запроса | Объект управляющего запроса |
| `POST` | `/tui/control/response` | Ответить на управляющий запрос | body: `{ body }` |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:238-253`

**Пример — удалённое управление TUI**:

```bash
# Дописать текст в промпт
curl -X POST http://localhost:4096/tui/append-prompt \
  -H "Content-Type: application/json" \
  -d '{"text": "Проверь этот код"}'

# Отправить промпт
curl -X POST http://localhost:4096/tui/submit-prompt

# Показать уведомление
curl -X POST http://localhost:4096/tui/show-toast \
  -H "Content-Type: application/json" \
  -d '{"message": "Операция завершена", "variant": "success"}'
```

---

## API аутентификации

### /auth

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `PUT` | `/auth/:id` | Задать credentials аутентификации | `boolean` |

Тело запроса обязано соответствовать схеме соответствующего провайдера.

> Источник: `opencode/packages/web/src/content/docs/server.mdx:256-261`

---

## API потока событий

### /event

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/event` | Поток событий SSE | События Server-sent |

После подключения первым приходит событие `server.connected`, дальше — события шины.

> Источник: `opencode/packages/web/src/content/docs/server.mdx:264-269`

**Пример — слушание событий**:

```bash
curl -N http://localhost:4096/event
```

Пример вывода:

```
event: server.connected
data: {}

event: session.created
data: {"id":"abc123","title":"Новая сессия"}

event: message.created
data: {"sessionID":"abc123","content":"..."}
```

---

## Документация API

### /doc

| Метод | Путь | Описание | Ответ |
|------|------|------|------|
| `GET` | `/doc` | Спецификация-документация OpenAPI 3.1 | HTML-страница |

> Источник: `opencode/packages/web/src/content/docs/server.mdx:272-277`

---

## Определения типов

Полные определения типов TypeScript — в SDK:

```
https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/types.gen.ts
```

Частые типы:
- `Session` — информация о сессии
- `Message` — информация о сообщении
- `Part` — части содержимого сообщений
- `Provider` — информация о провайдере
- `Agent` — информация об Agent
- `Config` — информация о конфигурации

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Запрос отвечает ошибкой CORS | Источник клиента не в белом списке | При старте добавьте `--cors <origin>` |
| После отправки сообщения нет ответа | Использовали `prompt_async` | Перейдите на синхронный интерфейс `/session/:id/message` |
| SSE-соединение часто рвётся | Сетевые тайм-ауты или проблемы прокси | Проверьте настройки прокси, увеличьте тайм-аут |
| Ошибка 404 | Сессия или сообщение с ID не существует | Сначала убедитесь в существовании ресурса через GET-интерфейсы |
| Экспериментальный API недоступен | Функция могла измениться или удалиться | Сверьтесь с актуальной документацией |

---

## Итоги урока

Вы научились:

1. **Структуре API**: 19 категорий API, покрывающих сессии, сообщения, файлы, инструменты и др.
2. **Ведению сессий**: созданию, запросам, форкам и шарингу сессий
3. **Обмену сообщениями**: синхронной и асинхронной отправке сообщений, выполнению команд
4. **Операциям с файлами**: поиску, чтению и списку файлов
5. **Управлению TUI**: удалённому управлению интерфейсом TUI
6. **Слушанию событий**: получению событий реального времени через SSE

---

## Связанные материалы

- [5.9a Основы удалённого режима](./09a-remote-basics) — запуск сервера и удалённые подключения
- [5.10 SDK](./10a-sdk-basics) — SDK для JavaScript и TypeScript
- [Официальная документация API](https://opencode.ai/docs/server) — полная документация на английском

---

## Анонс следующего урока

> В следующем уроке научимся разрабатывать с SDK.
