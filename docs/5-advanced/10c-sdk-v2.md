---
title: "SDK V2: полное руководство по API нового поколения"
subtitle: Полное руководство по API нового поколения SDK V2
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.10c"
duration: 30 минут
practice: 40 минут
level: Продвинутый
description: Изучите OpenCode SDK V2 (@opencode-ai/sdk/v2). Урок охватывает двухуровневую структуру клиентов, модули Permission и Question, расширенный Session3, Sync, Worktree и другие возможности, а также границы сосуществования V1 и V2.
tags:
  - SDK
  - V2
  - API
  - Экспериментальное
prerequisite:
  - 5.10a Основы SDK
  - 5.10b Справочник API
---

# 5.10c SDK V2: API нового поколения

> **Коротко**: V2 — вход нового поколения в OpenCode SDK: сохраняя V1, расширяет сессии, вопросы, текущую позицию, потоки событий, пагинацию истории, рантайм-операции, запросы прав и другие API.

::: warning ⚠️ Границы версий
`v1.18.22` экспортирует и `@opencode-ai/sdk`, и `@opencode-ai/sdk/v2`. Интерфейсы V2 ещё развиваются — при использовании фиксируйте версию SDK; V1 в целевой версии **не удалён**, существующие интеграции не обязаны срочно мигрировать из-за расширений V2. Глава фиксируется на `v1.18.22` с тегом `packages/sdk/js/src/v2/`.
:::

---

## Что вы сможете после урока

- Различать V1 и V2 и знать, когда какой использовать
- Создавать клиентов через `@opencode-ai/sdk/v2`
- Понимать двухуровневые пути доступа `client.*` и `client.v2.*`
- Пользоваться независимыми модулями Permission и Question
- Вызывать расширенные методы Session3 (interrupt, wait, compact и др.)
- Мигрировать с V1 на V2

---

## Что такое V2

### Позиционирование V1 и V2

Пакет OpenCode SDK (`@opencode-ai/sdk`) через `exports` в `package.json` открывает два входа:

| Путь входа | Версия | Статус | Кому подходит |
|---------|------|------|--------|
| `@opencode-ai/sdk` | V1 | Сохранён | Существующие интеграции, код на старых роутах |
| `@opencode-ai/sdk/v2` | V2 | Сосуществует с V1, развивается | Нужны новые способности, готовы фиксировать версию и проверять, — продвинутым |

> Источник: [`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20)

V2 перепроектировала структуру API и не полностью совместима с V1. `package.json` экспортирует и `.`, и `./v2` — в `v1.18.22` входы сосуществуют.

### Двухуровневая структура клиентов V2 (важно)

Главная особенность клиента V2 — **двухуровневые пути доступа**, поймёте их — поймёте ядро V2:

```
client                         OpencodeClient (27 модулей)
├── session  → Session2        Старые роуты /session/* (базовые методы)
├── permission → Permission    /permission/* (кросс-сессионные права)
├── question → Question        /question/* (кросс-сессионные вопросы)
├── part     → Part            CRUD частей сообщений
├── sync     → Sync            Синхронизация workspace
├── worktree → Worktree        Управление git worktree
├── experimental → Experimental Набор экспериментальных функций
├── ...
└── v2       → V2              Новое пространство имён роутов /api/* (17 подмодулей)
    ├── session    → Session3  /api/session/* (расширенные методы)
    ├── permission → Permission3 /api/session/{}/permission
    ├── question   → Question3 /api/session/{}/question
    ├── health     → Health    /api/health
    ├── agent      → Agent     /api/agent
    ├── model      → Model     /api/model
    ├── fs         → Fs        /api/fs/*
    └── ...
```

**Главные различия**:

| Путь доступа | Класс | Роуты | Назначение |
|---------|-----|------|------|
| `client.session` | Session2 | `/session/*` | Базовые методы (list/create/prompt) |
| `client.v2.session` | Session3 | `/api/session/*` | **Расширенные методы** (interrupt/wait/compact/switchModel) |
| `client.permission` | Permission | `/permission/*` | Кросс-сессионное управление правами |
| `client.v2.permission` | Permission3 | `/api/session/{}/permission` | Права уровня сессии |

> Источники: [`sdk.gen.ts:6990-7075`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6990-L7075) (определения классов V2),[`sdk.gen.ts:7077-7219`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219) (определение OpencodeClient)

::: tip Запоминалка одной фразой
**Расширенные методы сессий — в `client.v2.session`**, а не в `client.session`. `client.session` — базовые методы совместимых старых роутов.
:::

### Стиль параметров: сверяйтесь с generated-сигнатурой

Большинство методов V2 больше не используют общую V1-структуру `{ path: {...}, body: {...} }` — `buildClientParams` раскладывает поля в path, query и body. Но плоскими стали не все параметры: часть эндпоинтов сохраняет обёртки тел запросов вроде `body` и `worktreeCreateInput`. При вызовах сверяйтесь с generated TypeScript-сигнатурами.

```typescript
// ❌ Стиль V1 (в V2 неприменим)
client.permission.reply({
  path: { requestID: "req-1" },
  body: { response: "always" },
})

// ✅ Стиль V2 (плоский)
client.permission.reply({
  requestID: "req-1",
  reply: "always",
})
```

> Источник: [`sdk.gen.ts:3121-3144`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3121-L3144) (автораздача `buildClientParams`)

---

## Начало работы с V2

### Установка

V2 и V1 живут в одном npm-пакете, ставить отдельно не нужно:

```bash
npm install @opencode-ai/sdk
```

### Создание клиента

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",        // Каталог проекта
  experimental_workspaceID: "ws-123",      // Необязательно: идентификатор workspace
})
```

**Параметры конфигурации клиента**:

| Параметр | Тип | Описание |
|------|------|------|
| `baseUrl` | `string` | URL сервера, по умолчанию `http://localhost:4096` |
| `directory` | `string` | Каталог проекта, передаётся заголовком `X-Opencode-Directory` |
| `experimental_workspaceID` | `string` | Идентификатор workspace, передаётся заголовком `X-Opencode-Workspace` |
| `fetch` | `function` | Своя реализация fetch |
| `headers` | `object` | Свои заголовки запросов |

> Источник: [`v2/client.ts:50-92`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/client.ts#L50-L92)

::: details Как передаются directory и workspaceID?
`directory` кодируется в заголовок `X-Opencode-Directory`, `experimental_workspaceID` — в заголовок `X-Opencode-Workspace`. Для запросов `GET` и `HEAD` перехватчик клиента дописывает их и в query string; `/api/*` дополняет как обычными ключами, так и `location[directory]` / `location[workspace]`, остальные методы оставляют только заголовки.
:::

---

## Обзор 27 модулей OpencodeClient

Клиент V2 открывает 27 свойств-модулей.

> Источник: [`sdk.gen.ts:7077-7219`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219)

### Совместимые с V1 модули (19 штук)

`global` `project` `pty` `config` `tool` `instance` `path` `vcs` `command` `provider` `find` `file` `app` `mcp` `lsp` `formatter` `tui` `auth` `event`

Эти модули в основном совпадают с V1, использование — в разделе [5.10b Справочник API](./10b-sdk-reference).

### Новые и усиленные модули V2 (8 штук)

| Модуль | Путь доступа | Описание |
|------|---------|------|
| **session** | `client.session` / `client.v2.session` | Два слоя: базовый Session2 + усиленный Session3 |
| **permission** | `client.permission` | Кросс-сессионное управление правами |
| **question** | `client.question` | Кросс-сессионное управление вопросами |
| **part** | `client.part` | CRUD частей сообщений |
| **sync** | `client.sync` | Синхронизация workspace |
| **worktree** | `client.worktree` | Управление git worktree |
| **experimental** | `client.experimental` | Набор экспериментальных функций |
| **v2** | `client.v2` | Пространство имён новых роутов /api/* (17 подмодулей) |

Ниже — подробно по каждому.

---

## Подробно о главных новых возможностях V2

### 1. Независимый модуль Permission

В V1 ответ на запросы прав требовал сверхдлинного `postSessionIdPermissionsPermissionId()` и только для запросов конкретной сессии. V2 подняла управление правами в независимый модуль с кросс-сессионными запросами и ответами.

| Метод | Роут | Описание |
|------|------|------|
| `permission.list()` | `GET /permission` | Список ожидающих запросов прав всех сессий |
| `permission.reply()` | `POST /permission/{requestID}/reply` | Ответить на запрос права |
| `permission.respond()` | `POST /session/{sessionID}/permissions/{permissionID}` | ⚠️ Deprecated, вместо него `reply` |

> Источник: [`sdk.gen.ts:3085-3193`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3085-L3193)

```typescript
// Список всех ожидающих запросов прав (кросс-сессионно)
const pending = await client.permission.list()
for (const request of pending.data ?? []) {
  console.log(`[${request.sessionID}] ${request.permission}: ${request.patterns.join(", ")}`)
}

// Ответить на запрос права (обратите внимание: поле reply, а не response)
await client.permission.reply({
  requestID: "req-123",
  reply: "always",     // "once" | "always" | "reject"
})
```

::: warning Внимание на имя поля
У метода `reply()` поле тела называется **`reply`** (а не `response`). `response` — имя поля deprecated-метода `respond()`.
:::

**Сравнение с V1**:

| Операция | V1 | V2 |
|------|----|----|
| Список запросов прав | ❌ Не поддерживается | ✅ `permission.list()` |
| Ответить на право | `postSessionIdPermissionsPermissionId({path:{id,permissionID},body:{response}})` | `permission.reply({requestID, reply})` |
| Кросс-сессионные запросы | ❌ | ✅ |

### 2. Независимый модуль Question

Через инструмент `question` Agent задаёт вам вопросы. В V1 единого интерфейса управления не было, V2 добавила независимый модуль.

| Метод | Роут | Описание |
|------|------|------|
| `question.list()` | `GET /question` | Список всех неотвеченных вопросов |
| `question.reply()` | `POST /question/{requestID}/reply` | Ответить на вопрос |
| `question.reject()` | `POST /question/{requestID}/reject` | Отклонить вопрос |

> Источник: [`sdk.gen.ts:2982-3084`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L2982-L3084)

```typescript
// Все неотвеченные вопросы
const questions = await client.question.list()
for (const q of questions.data ?? []) {
  console.log(`[${q.sessionID}] ${q.questions[0]?.header ?? "(no question)"}`)
}

// Ответить на вопрос
await client.question.reply({
  requestID: "q-456",
  answers: [["Вариант A"]],
})

// Отклонить вопрос
await client.question.reject({ requestID: "q-456" })
```

::: tip Разница прав и вопросов
- **Permission**: Agent просит **действие** (выполнить команду, отредактировать файл) — просит у вас разрешения.
- **Question**: Agent нужна **информация** (выбрать вариант, подтвердить предпочтение) — задаёт вам вопрос.
:::

### 3. Усиление Session (client.v2.session)

Здесь в V2 легче всего споткнуться. Усиленные методы сессий лежат в **`client.v2.session`** (класс Session3), а не в `client.session` (класс Session2).

**Session2 (client.session)**: совместимые старые роуты `/session/*` с базовыми методами list, create, prompt, messages и др.

**Session3 (client.v2.session)**: новые роуты `/api/session/*`. Кроме управляющих методов целевая версия поддерживает создание и получение сессий, списки сессий и сообщений с курсорами, вопросы и права уровня сессии, пагинацию истории и потоки событий. Текущая позиция — тот же V2-неймспейс `client.v2.location`, а не метод Session3.

> Источники: [`sdk.gen.ts:5038-5058`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5038-L5058) (текущая позиция),[`sdk.gen.ts:5171-5424`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5171-L5424) (права и вопросы),[`sdk.gen.ts:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873) (Session3)

**Новые методы Session3**:

| Метод | Роут | Описание |
|------|------|------|
| `interrupt()` | `POST /api/session/{sessionID}/interrupt` | Прервать текущее выполнение |
| `wait()` | `POST /api/session/{sessionID}/wait` | Дождаться простоя сессии |
| `compact()` | `POST /api/session/{sessionID}/compact` | Запустить сжатие контекста |
| `context()` | `GET /api/session/{sessionID}/context` | Получить текущий контекст |
| `history()` | `GET /api/session/{sessionID}/history` | Получить историю |
| `switchModel()` | `POST /api/session/{sessionID}/model` | Сменить модель |
| `switchAgent()` | `POST /api/session/{sessionID}/agent` | Сменить agent |
| `events()` | `GET /api/session/{sessionID}/event` | Поток событий уровня сессии |

Причём `list()` и `messages()` поддерживают курсорную пагинацию, `history({ sessionID, limit, after })` возвращает ограниченные страницы событий после указанного aggregate-номера; `events({ sessionID, after })` сначала доигрывает, затем непрерывно пушит события.

> Источники: [`sdk.gen.ts:5426-5517`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5517),[`sdk.gen.ts:5715-5793`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5715-L5793)

```typescript
const sessionID = "sess-abc"

// Обратите внимание: эти методы — в client.v2.session (Session3)
await client.v2.session.interrupt({ sessionID })
await client.v2.session.wait({ sessionID })
await client.v2.session.compact({ sessionID })

// Смена модели
await client.v2.session.switchModel({
  sessionID,
  model: { providerID: "anthropic", id: "claude-sonnet-4-20250514" },
})

// Смена agent
await client.v2.session.switchAgent({ sessionID, agent: "plan" })

// Получение контекста
const ctx = await client.v2.session.context({ sessionID })
```

::: danger Самая частая ловушка
Писать усиленные методы на `client.session` — ошибка. Запомните:
- `client.session.prompt()` ✅ (базовый метод в Session2)
- `client.v2.session.interrupt()` ✅ (усиленный метод в Session3)
- `client.session.interrupt()` ❌ (в Session2 такого метода нет)
:::

### 4. Модуль Part (CRUD частей сообщений)

V2 добавила точечные операции над **частями** сообщений. Сообщение состоит из нескольких Part, V2 умеет удалять и обновлять отдельные Part.

| Метод | Роут | Описание |
|------|------|------|
| `part.delete()` | `DELETE /session/{sessionID}/message/{messageID}/part/{partID}` | Удалить часть |
| `part.update()` | `PATCH /session/{sessionID}/message/{messageID}/part/{partID}` | Обновить часть |

> Источник: [`sdk.gen.ts:4330-4406`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4330-L4406)

```typescript
// Обновить текстовую часть
await client.part.update({
  sessionID: "sess-abc",
  messageID: "msg-1",
  partID: "part-3",
  part: { type: "text", text: "Изменённое содержимое" },
})

// Удалить часть
await client.part.delete({
  sessionID: "sess-abc",
  messageID: "msg-1",
  partID: "part-3",
})
```

### 5. Модуль Sync (синхронизация workspace)

Sync — механизм синхронизации событий нескольких workspace в V2.

| Метод | Роут | Описание |
|------|------|------|
| `sync.start()` | `POST /sync/start` | Запустить цикл синхронизации |
| `sync.replay()` | `POST /sync/replay` | Проиграть события синхронизации |
| `sync.steal()` | `POST /sync/steal` | Перенести сессию в текущий workspace |
| `sync.history.list()` | `POST /sync/history` | Список истории событий синхронизации |

> Источники: [`sdk.gen.ts:4448-4576`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4448-L4576) (класс Sync),[`sdk.gen.ts:4407-4446`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4407-L4446) (класс History)

::: tip Обратите внимание
`sync.history` — **свойство-геттер** (возвращает экземпляр класса History), а не метод. Вызывайте `sync.history.list()`.
:::

```typescript
// Запуск синхронизации
await client.sync.start()

// История событий синхронизации (history — геттер, затем list)
const history = await client.sync.history.list({
  body: { "sess-abc": 10 },  // Вернуть события с seq > 10
})
```

::: details Зачем нужен Sync?
Когда OpenCode одновременно работает в нескольких workspace, сессии может понадобиться мигрировать между workspace. Sync даёт журнал событий для отслеживаемой и replay-миграции. Проектировался под будущие распределённые и кластерные сценарии — пользователям одной машины обычно не нужен.

Workspace целевой версии создаются и обнаруживаются через adapter, встроенный adapter — `worktree`; warp сессий умеет через `copyChanges` копировать текущий патч. Релиз v1.16.0 добавлял managed clone с сохранением грязных файлов и неотслеживаемых, но этот путь уже заменён путём adapter и worktree — считать его текущим поведением `v1.18.22` нельзя.

> Текущая реализация: [`adapters/index.ts:5-18`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18),[`workspace.ts:492-538`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538),[`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620),[`workspace.ts:728-739`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739). Исторические границы: [релиз `v1.16.0`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0),коммит `5661af203487b90cf9ee0844b198b03cce26c412`.
:::

### 6. Модуль Worktree (управление git worktree)

V2 добавила полный интерфейс управления git worktree.

| Метод | Роут | Описание |
|------|------|------|
| `worktree.list()` | `GET /experimental/worktree` | Список всех worktree |
| `worktree.create()` | `POST /experimental/worktree` | Создать worktree |
| `worktree.remove()` | `DELETE /experimental/worktree` | Удалить worktree с веткой |
| `worktree.reset()` | `POST /experimental/worktree/reset` | Сбросить на дефолтную ветку |

> Источники: [`sdk.gen.ts:1582-1723`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1582-L1723),[`types.gen.ts:2167-2187`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/types.gen.ts#L2167-L2187)

```typescript
// Список всех worktree
const worktrees = await client.worktree.list()

// Создать новый worktree
await client.worktree.create({
  worktreeCreateInput: { name: "feature-experiment" },
})

// Удалить
await client.worktree.remove({
  worktreeRemoveInput: { directory: "/path/to/worktree" },
})
```

::: tip Связь с уроком 5.25 Git Worktree
Здесь — программный интерфейс SDK. Ручная работа с worktree — в уроке [5.25 Процессы Git Worktree](./25-git-worktree).
:::

### 7. Набор модулей Experimental

`client.experimental` — агрегирующий модуль: workspace, resource, capabilities, console, control-plane и другие передовые функции.

| Подфункция | Префикс роутов | Описание |
|--------|---------|------|
| workspace | `/experimental/workspace` | Управление несколькими рабочими пространствами |
| resource | `/experimental/resource` | Запросы MCP-ресурсов |
| capabilities | `/experimental/capabilities` | Декларации возможностей |
| console | `/experimental/console` | Консоль (переключение организаций) |
| controlPlane | `/experimental/control-plane` | Control plane (миграция сессий) |
| session | `/experimental/session` | Экспериментальные сессии (фоновые под-агенты) |

> Источник: [`sdk.gen.ts:1243-1278`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1243-L1278)

Экспериментальная сессия методом `background` уводит блокирующего под-агента в фон:

```typescript
// Увести блокирующего под-агента в фон
await client.experimental.session.background({ sessionID: "sess-abc" })
```

Интерфейс лишь отсоединяет текущий блокирующий синхронный под-агент сессии. Способность фоновых под-агентов по-прежнему под флагом `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true` (или общим флагом `OPENCODE_EXPERIMENTAL=true`); без флага интерфейс возвращает `false`. Кроме того, `subagent_depth` по умолчанию `1` и запрещает под-агентам запускать под-агентов; глубже — только явным повышением.

> Источники: [`runtime-flags.ts:10-14,43`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L10-L14),[experimental handler:159-170](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts#L159-L170),[`task.ts:96-115`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L96-L115),[`config.ts:84-86`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L84-L86),[`sdk.gen.ts:805-886`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L805-L886)

---

## Полный пример: авто-помощник на V2

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",
})

async function runTask(task: string) {
  // 1. Создать сессию (client.session — Session2, базовые методы)
  const session = await client.session.create({
    title: task.slice(0, 50),
    agent: "build",
  })
  const sessionID = session.data!.id

  // 2. Асинхронно отправить задачу (плоские параметры)
  await client.session.promptAsync({
    sessionID,
    parts: [{ type: "text", text: task }],
    model: { providerID: "anthropic", modelID: "claude-sonnet-4-20250514" },
  })

  // 3. Опрашивать запросы прав, автоматически разрешать чтение
  const poll = setInterval(async () => {
    const pending = await client.permission.list()
    for (const req of pending.data ?? []) {
      // permission — тип операции (вроде "read", "grep"), patterns — шаблоны совпадения
      if (req.permission === "read" || req.permission === "grep") {
        await client.permission.reply({
          requestID: req.id,
          reply: "always",   // Обратите внимание: поле называется reply
        })
      }
    }
  }, 1000)

  // 4. Дождаться завершения сессии (усиленный метод в client.v2.session)
  await client.v2.session.wait({ sessionID })
  clearInterval(poll)

  // 5. Забрать результат (базовые методы — снова в client.session)
  const messages = await client.session.messages({ sessionID })
  const last = messages.data?.at(-1)

  // 6. Прочитать расход токенов и стоимость (поддерживают и V1, и V2)
  if (last?.info.role === "assistant") {
    console.log(`Стоимость: $${last.info.cost}`)
    console.log(`Токены: вход ${last.info.tokens.input} / выход ${last.info.tokens.output}`)
  }

  return last
}

const result = await runTask("Разбери структуру проекта и создай README")
console.log(result)
```

> **Главное**: базовые методы (create, promptAsync, messages) — в `client.session`, усиленные (wait, interrupt, compact) — в `client.v2.session`. При смешивании следите за путями.

---

## Гид миграции V1 → V2

### Пути импорта

```typescript
// V1
import { createOpencodeClient } from "@opencode-ai/sdk"

// V2
import { createOpencodeClient } from "@opencode-ai/sdk/v2"
```

### Структура параметров

```typescript
// V1: вложенная структура
await client.session.create({ body: { title: "xxx" } })
await client.session.prompt({ path: { id: "sess-1" }, body: { parts: [...] } })

// V2: плоская структура
await client.session.create({ title: "xxx" })
await client.session.prompt({ sessionID: "sess-1", parts: [...] })
```

### Ответы на права

```typescript
// V1: сверхдлинное имя метода + вложенные параметры
await client.postSessionIdPermissionsPermissionId({
  path: { id: sessionID, permissionID: "perm-1" },
  body: { response: "always" },
})

// V2: независимый модуль + плоские параметры
await client.permission.reply({
  requestID: "req-1",
  reply: "always",   // Имя поля изменилось: response → reply
})
```

### Управление сессиями

```typescript
// V1: прерывание и сжатие уже были, но имена методов другие
await client.session.abort({ path: { id: sessionID } })
await client.session.summarize({ path: { id: sessionID } })
// В V1 нет wait — опрашивайте сами

// V2: усиленные методы в client.v2.session
await client.v2.session.interrupt({ sessionID })
await client.v2.session.wait({ sessionID })
await client.v2.session.compact({ sessionID })
await client.v2.session.switchModel({ sessionID, model: { ... } })
await client.v2.session.switchAgent({ sessionID, agent: "plan" })
```

### Таблица соответствия возможностей

| Возможность | V1 | V2 |
|------|----|----|
| Ответить на права | `postSessionIdPermissionsPermissionId` | `permission.reply` |
| Список прав | ❌ | `permission.list` |
| Управление вопросами | ❌ | `question.list/reply/reject` |
| Прервать сессию | `session.abort` | `v2.session.interrupt` |
| Ждать завершения | ❌ (опрос вручную) | `v2.session.wait` |
| Запустить сжатие | `session.summarize` | `v2.session.compact` |
| Сменить модель | ❌ | `v2.session.switchModel` |
| Сменить agent | ❌ | `v2.session.switchAgent` |
| CRUD частей сообщений | ❌ | `part.update/delete` |
| worktree | ❌ | `worktree.list/create/remove/reset` |
| Синхронизация workspace | ❌ | `sync.start/replay/steal/history.list` |

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| `createOpencodeClient is not exported` | Неверный путь импорта | V2 импортируется из `@opencode-ai/sdk/v2` |
| `client.session.interrupt is not a function` | Неверный путь доступа | Усиленные методы — в `client.v2.session` |
| Ошибка типов параметров | Применена структура параметров другого эндпоинта | Смотрите generated-сигнатуру метода; параметры в основном плоские, часть — с обёртками тел |
| `permission.reply` ругается на поля | Поле названо `response` | В V2 поле называется `reply` |
| `sync.history is not a function` | `history` — геттер, а не метод | Вызывайте `sync.history.list()` |
| Запрос вернул HTML | Подключились к серверу V1 без поддержки `/api/*` | Убедитесь, что версия сервера поддерживает V2 |
| Сигнатуры методов V2 расходятся с документацией | V2 экспериментален, API меняется | Сверяйтесь с исходниками `sdk.gen.ts` |
| `v2.session.wait` висит бесконечно | Сессия всё выполняется | Сначала `v2.session.interrupt` или задайте тайм-аут |

---

## Итоги урока

Вы научились:

1. **Позиционированию V2**: развивающийся API нового поколения, сосуществует с V1 в одном npm-пакете
2. **Двухуровневой структуре**: `client.*` (база + новые понятия) и `client.v2.*` (новые роуты /api/*)
3. **Стилю параметров**: в основном поля методов-эндпоинтов, редко с обёртками тел — сверяйтесь с generated-сигнатурой
4. **Главным новым способностям**: независимым модулям Permission и Question, усиленным методам Session3 (в `client.v2.session`), CRUD Part, Sync и Worktree
5. **Главному в миграции**: различиям путей импорта, структур параметров, имён полей прав и путей доступа сессий

---

## Связанные материалы

- [5.10a Основы SDK](./10a-sdk-basics) — введение в SDK V1
- [5.10b Справочник API](./10b-sdk-reference) — полная документация API V1
- [Исходники типов V2 (v1.18.22)](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/types.gen.ts)
- [Исходники generated SDK V2 (v1.18.22)](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts)

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> Целевая версия: v1.18.22 (2026-08-24)

| Функция | Путь к файлу | Строки |
|-----|---------|------|
| Конфиг exports V1/V2 | [`packages/sdk/js/package.json`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20) | 12-20 |
| Индекс V2 (createOpencode) | [`packages/sdk/js/src/v2/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/index.ts#L1-L23) | 1-23 |
| Клиент V2 (createOpencodeClient) | [`packages/sdk/js/src/v2/client.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/client.ts#L50-L92) | 50-92 |
| Сервер V2 (ServerOptions) | [`packages/sdk/js/src/v2/server.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/server.ts#L5-L30) | 5-30 |
| OpencodeClient из 27 модулей | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219) | 7077-7219 |
| Пространство имён V2 (17 подмодулей) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6990-L7075) | 6990-7075 |
| Модуль Permission | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3085-L3193) | 3085-3193 |
| Модуль Question | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L2982-L3084) | 2982-3084 |
| Модуль Session3 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873) | 5426-5873 |
| Модуль Session2 (базовые методы) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3362-L4329) | 3362-4329 |
| Модуль Part (update/delete) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4330-L4406) | 4330-4406 |
| Модуль Sync + класс History | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4407-L4576) | 4407-4576 |
| Модуль Worktree | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1582-L1723) | 1582-1723 |
| Модуль Workspace (experimental) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1006-L1242) | 1006-1242 |
| Модуль Experimental (агрегатор) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1243-L1278) | 1243-1278 |

**Главные классы**:
- `OpencodeClient`: главный класс клиента V2 из 27 свойств-модулей
- `V2`: пространство имён `client.v2` из 17 подмодулей /api/*
- `Session2` (`client.session`): базовые методы старых роутов
- `Session3` (`client.v2.session`): усиленные методы новых роутов (interrupt/wait/compact/switchModel/switchAgent)
- `Permission` (`client.permission`): кросс-сессионное управление правами
- `Question` (`client.question`): кросс-сессионное управление вопросами

**Обратите внимание**: пакеты `packages/client/` (`@opencode-ai/client`) — приватные, generated на Effect HttpApi, а не публичный SDK, — вне рамок главы.

</details>
