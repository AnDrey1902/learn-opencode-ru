---
title: 5.10b Справочник API
subtitle: Полная документация API SDK
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.10b"
duration: 30 минут
practice: 40 минут
level: Продвинутый
description: SDK OpenCode предоставляет 20 модулей API плюс 1 метод ответа на права и 32 типа событий — сессии, файлы, конфигурация, MCP, LSP и весь остальной функционал.
tags:
  - SDK
  - API
  - Справочная документация
prerequisite:
  - 5.10a Основы SDK
---

# 5.10b Справочник API

> **Коротко**: SDK OpenCode предоставляет 20 модулей API плюс 1 метод ответа на права и 32 типа событий — сессии, файлы, конфигурация, MCP, LSP и весь остальной функционал.

---

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/10b-sdk-reference-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.10b Справочник API"
     data-zoom-src="/images/5-advanced/10b-sdk-reference-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Обзор: 21 API-модуль — Session (ядро, 22 метода), File/Find/Config, TUI/Auth/Provider, MCP/LSP/Formatter, PTY/Tool.
2. Session — ключевые методы: create, get, list, delete, update, prompt (синхр.), promptAsync (асинхр.), messages/todo/diff/status.
3. Управление сессиями: abort, fork, revert, unrevert.
4. 35+ типов событий: message, session, permission, file, tui.toast, pty, vcs.
5. Типы: Session, Message, Part (TextPart/ToolPart/FilePart), Todo, Agent.
6. Трюки: проверять result.error вместо data; noReply:true для контекста; promptAsync для долгих задач.
7. Ловушки: data=undefined → смотреть error; обрыв потока → ребондинг; tool.list пуст → задать provider+model; permission без ответа → postSessionIdPermissionId.

</details>

---

## Обзор модулей API

Клиент SDK открывает модули классом `OpencodeClient`:

::: info Границы версий
Таблицы главы описывают вход V1 `@opencode-ai/sdk`. В `v1.18.22` V1 по-прежнему экспортируется и сохраняется, а через `@opencode-ai/sdk/v2` расширяются сессии, вопросы, текущая позиция, потоки событий, пагинация истории, рантайм-операции и запросы прав; плоские параметры V2 нельзя смешивать с V1-записью `{ path, body }` этой главы.
:::

> Источники: [`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20),[`V1 OpencodeClient:1157-1197`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L1157-L1197),[`V2 Session3:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873)

| Модуль | Описание | Источник |
|------|------|------|
| `global` | Глобальная подписка на события | `sdk.gen.ts:233-243` |
| `project` | Управление проектами | `sdk.gen.ts:245-265` |
| `session` | Ведение сессий (ядро) | `sdk.gen.ts:431-700` |
| `file` | Операции с файлами | `sdk.gen.ts:808-838` |
| `find` | Функции поиска | `sdk.gen.ts:776-806` |
| `config` | Управление конфигурацией | `sdk.gen.ts:337-371` |
| `app` | Информация о приложении | `sdk.gen.ts:840-864` |
| `tui` | Управление TUI-интерфейсом | `sdk.gen.ts:1026-1143` |
| `event` | Подписка на события | `sdk.gen.ts:1145-1155` |
| `auth` | Управление аутентификацией | `sdk.gen.ts:866-926` |
| `provider` | Провайдеры моделей | `sdk.gen.ts:753-774` |
| `mcp` | Управление MCP-серверами | `sdk.gen.ts:928-974` |
| `lsp` | Статус LSP-серверов | `sdk.gen.ts:976-986` |
| `formatter` | Статус форматтеров | `sdk.gen.ts:988-998` |
| `command` | Список команд | `sdk.gen.ts:703-713` |
| `path` | Информация о путях | `sdk.gen.ts:407-417` |
| `vcs` | Информация контроля версий | `sdk.gen.ts:419-429` |
| `pty` | PTY-сессии терминалов | `sdk.gen.ts:267-335` |
| `tool` | Управление инструментами (экспериментальное) | `sdk.gen.ts:373-393` |
| `instance` | Управление инстансами | `sdk.gen.ts:395-405` |

---

<AdInArticle />

## Ведение сессий Session

Сессии — главный модуль SDK: отправка сообщений, ведение истории и др.

### Список методов

| Метод | Описание | Тип возврата |
|------|------|----------|
| `session.list()` | Список всех сессий | `Session[]` |
| `session.get({ path })` | Одна сессия | `Session` |
| `session.create({ body })` | Создание новой сессии | `Session` |
| `session.delete({ path })` | Удаление сессии | `boolean` |
| `session.update({ path, body })` | Обновление свойств сессии | `Session` |
| `session.status()` | Статусы всех сессий | `{ [sessionID: string]: SessionStatus }` |
| `session.children({ path })` | Список дочерних сессий | `Session[]` |
| `session.todo({ path })` | Список дел сессии | `Todo[]` |
| `session.init({ path, body })` | Разбор приложения и создание AGENTS.md | `boolean` |
| `session.fork({ path, body })` | Форк сессии в указанном сообщении | `Session` |
| `session.abort({ path })` | Прерывание выполняющейся сессии | `boolean` |
| `session.share({ path })` | Поделиться сессией | `Session` |
| `session.unshare({ path })` | Отменить шаринг | `Session` |
| `session.diff({ path })` | Файловые различия сессии | `FileDiff[]` |
| `session.summarize({ path, body })` | Суммирование содержимого сессии | `boolean` |
| `session.messages({ path })` | Список сообщений сессии | `{info: Message, parts: Part[]}[]` |
| `session.message({ path })` | Детали одного сообщения | `{info: Message, parts: Part[]}` |
| `session.prompt({ path, body })` | Отправка сообщения с ожиданием ответа | `{info: AssistantMessage, parts: Part[]}` |
| `session.promptAsync({ path, body })` | Асинхронная отправка сообщения (без ожидания) | `204 No Content` |
| `session.command({ path, body })` | Отправка команды | `{info: AssistantMessage, parts: Part[]}` |
| `session.shell({ path, body })` | Выполнение shell-команды | `AssistantMessage` |
| `session.revert({ path, body })` | Откат к указанному сообщению | `Session` |
| `session.unrevert({ path })` | Повтор отменённых сообщений и состояния файлов | `Session` |

::: tip Ответы на права
В классе Session **нет** метода `permission()`. Отвечайте на запросы прав прямым методом `OpencodeClient`:

```typescript
await client.postSessionIdPermissionsPermissionId({
  path: { id: "session-id", permissionID: "perm-id" },
  body: { response: "always" },  // "once" | "always" | "reject"
})
```
:::

### Undo, Revert и Redo

V1-метод `session.revert()` соответствует undo и revert: он сдвигает границу сессии к указанному `messageID` (с точностью до `partID`), собирает патчи после границы и по умолчанию восстанавливает связанные файловые снапшоты. `session.unrevert()` соответствует redo и unrevert: восстанавливает исходный снапшот и снимает состояние revert. Оба отклоняют работающие сессии.

```typescript
// Undo: вернуться к указанному сообщению с откатом файловых патчей границы по умолчанию
await client.session.revert({
  path: { id: sessionID },
  body: { messageID: "msg-123" },
})

// Redo: восстановить только что отменённые сообщения и состояние файлов
await client.session.unrevert({ path: { id: sessionID } })
```

Настройка `snapshot: false` отключает только undo и redo файловых снапшотов, способность revert границ сообщений сохраняется.

> Источники: [`V1 sdk.gen.ts:678-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L678-L700),[`session/revert.ts:38-98`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L98),[`config.ts:52-55`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55)

### Пример кода

```typescript
// Создание сессии
const session = await client.session.create({
  body: { title: "Задача рефакторинга кода" },
})

// Отправка сообщения
const result = await client.session.prompt({
  path: { id: session.data!.id },
  body: {
    model: { providerID: "anthropic", modelID: "claude-opus-4-5-thinking" },
    parts: [{ type: "text", text: "Отрефактори мне эту функцию" }],
  },
})

// Список сообщений
const messages = await client.session.messages({
  path: { id: session.data!.id },
})

// Список дел
const todos = await client.session.todo({
  path: { id: session.data!.id },
})

// Форк сессии
const forked = await client.session.fork({
  path: { id: session.data!.id },
  body: { messageID: "msg-123" },
})

// Файловые различия
const diff = await client.session.diff({
  path: { id: session.data!.id },
})

// Прерывание сессии
await client.session.abort({
  path: { id: session.data!.id },
})

// Шаринг сессии (создаёт доступный URL)
const shared = await client.session.share({ path: { id: session.data!.id } })
console.log(`Ссылка шаринга: ${shared.data?.share?.url}`)

// Отмена шаринга
await client.session.unshare({ path: { id: session.data!.id } })
```

### Параметры тела prompt

| Параметр | Тип | Описание |
|------|------|------|
| `parts` | `Array<TextPartInput \| FilePartInput \| AgentPartInput \| SubtaskPartInput>` | Части содержимого сообщения |
| `model` | `{providerID, modelID}` | Указать модель |
| `noReply` | `boolean` | `true` — не вызывать ответ AI (внедрение контекста) |
| `agent` | `string` | Использовать указанного Agent |

### Расход токенов и стоимость

Каждый ответ AI возвращает расход токенов и стоимость без отдельных запросов. Поле `info` (тип `AssistantMessage`), возвращаемое `session.prompt()`, несёт `cost` и `tokens`:

```typescript
const result = await client.session.prompt({
  path: { id: sessionID },
  body: {
    parts: [{ type: "text", text: "Разбери этот код" }],
  },
})

const info = result.data?.info  // AssistantMessage
if (info) {
  console.log(`Стоимость: $${info.cost}`)
  console.log(`Входные токены: ${info.tokens.input}`)
  console.log(`Выходные токены: ${info.tokens.output}`)
  console.log(`Токены рассуждений: ${info.tokens.reasoning}`)
  console.log(`Чтение кэша: ${info.tokens.cache.read}`)
  console.log(`Запись кэша: ${info.tokens.cache.write}`)
}
```

> Источник: `types.gen.ts:112-141` (тип AssistantMessage)

**Пошаговый учёт**: при многошаговой работе модели (например, вызовы инструментов) конец каждого шага порождает `StepFinishPart` тоже с полями `cost` и `tokens` — виден расход **каждого шага**:

```typescript
// Обход всех Part сообщения, суммирование пошагового расхода
const msg = await client.session.message({
  path: { id: sessionID, messageID: "msg-1" },
})

for (const part of msg.data?.parts ?? []) {
  if (part.type === "step-finish") {
    console.log(`Стоимость шага: $${part.cost}, вывод: ${part.tokens.output} tokens`)
  }
}
```

> Источник: `types.gen.ts:315-332` (тип StepFinishPart)

::: tip Суммарный расход всей сессии
Обойдите все сообщения из `session.messages()` и просуммируйте `cost` и `tokens` каждого `AssistantMessage`.
:::

### Мониторинг вызовов инструментов

`ToolPart` в ответах AI фиксирует полный жизненный цикл каждого вызова инструмента. По `part.state` видно этап инструмента, его вход, выход и длительность:

```typescript
const msg = await client.session.message({
  path: { id: sessionID, messageID: "msg-1" },
})

for (const part of msg.data?.parts ?? []) {
  if (part.type !== "tool") continue
  console.log(`Инструмент: ${part.tool}`)
  const state = part.state
  switch (state.status) {
    case "completed":
      console.log(`  Результат: ${state.output}`)
      console.log(`  Длительность: ${state.time.end - state.time.start}ms`)
      break
    case "error":
      console.log(`  Ошибка: ${state.error}`)
      break
    case "running":
      console.log(`  Выполняется...`)
      break
    case "pending":
      console.log(`  Ожидает выполнения`)
      break
  }
}
```

Четыре состояния вызовов инструментов:

| Состояние | Описание | Доступные поля |
|------|------|---------|
| `pending` | Ожидает выполнения | `input` (параметры), `raw` (сырой ввод) |
| `running` | Выполняется | `input`, `title`, `time.start` |
| `completed` | Завершён | `input`, `output` (результат), `title`, `time.{start,end}`, `attachments` (вложения) |
| `error` | Ошибка | `input`, `error` (текст ошибки), `time.{start,end}` |

> Источник: `types.gen.ts:237-305` (четыре подтипа ToolState + ToolPart)

### Статистика изменений кода сессий

Тип `Session` несёт поле `summary` — сколько кода изменила сессия, без ручного diff:

```typescript
const session = await client.session.get({ path: { id: sessionID } })
const summary = session.data?.summary
if (summary) {
  console.log(`Файлов изменено: ${summary.files}`)
  console.log(`Строк добавлено: ${summary.additions}`)
  console.log(`Строк удалено: ${summary.deletions}`)
  // summary.diffs — различия каждого файла
}
```

| Поле | Тип | Описание |
|------|------|------|
| `summary.files` | `number` | Число изменённых файлов |
| `summary.additions` | `number` | Число добавленных строк |
| `summary.deletions` | `number` | Число удалённых строк |
| `summary.diffs` | `FileDiff[]?` | Детализация различий каждого файла |

> Источник: `types.gen.ts:533-560` (поле Session.summary)

---

## Управление проектами Project

| Метод | Описание | Тип возврата |
|------|------|----------|
| `project.list()` | Список всех проектов | `Project[]` |
| `project.current()` | Текущий проект | `Project` |

```typescript
// Текущий проект
const current = await client.project.current()
console.log(`Путь проекта: ${current.data?.worktree}`)

// Все проекты
const projects = await client.project.list()
```

### Тип Project

```typescript
type Project = {
  id: string
  worktree: string      // Рабочий каталог
  vcsDir?: string       // Каталог VCS (вроде .git)
  vcs?: "git"           // Тип контроля версий
  time: {
    created: number
    initialized?: number
  }
}
```

---

## Операции с файлами File

| Метод | Описание | Тип возврата |
|------|------|----------|
| `file.list({ query })` | Список файлов и каталогов | `FileNode[]` |
| `file.read({ query })` | Чтение содержимого файла | `FileContent` |
| `file.status()` | Статус файлов (изменения git) | `File[]` |

```typescript
// Содержимое каталога
const nodes = await client.file.list({
  query: { path: "src" },
})

// Чтение файла
const content = await client.file.read({
  query: { path: "src/index.ts" },
})
console.log(content.data?.content)

// Статус git
const status = await client.file.status()
for (const file of status.data ?? []) {
  console.log(`${file.status}: ${file.path} (+${file.added}/-${file.removed})`)
}
```

---

## Функции поиска Find

| Метод | Описание | Тип возврата |
|------|------|----------|
| `find.text({ query })` | Поиск текста в содержимом файлов | Массив совпадений |
| `find.files({ query })` | Поиск файлов и каталогов по имени | `string[]` |
| `find.symbols({ query })` | Поиск символов рабочей области | `Symbol[]` |

### Параметры запроса find.files

| Параметр | Тип | Описание |
|------|------|------|
| `query` | `string` | Шаблон поиска (поддерживает glob, обязательный) |
| `dirs` | `"true" \| "false"` | Только каталоги (строка, необязательно) |
| `directory` | `string` | Перекрыть корень поиска (необязательно) |

```typescript
// Поиск текста
const matches = await client.find.text({
  query: { pattern: "TODO|FIXME" },
})

// Поиск файлов
const tsFiles = await client.find.files({
  query: { query: "*.ts" },
})

// Только каталоги
const dirs = await client.find.files({
  query: { query: "src", dirs: "true" },
})

// Поиск символов
const symbols = await client.find.symbols({
  query: { query: "handleRequest" },
})
```

---

## Управление конфигурацией Config

| Метод | Описание | Тип возврата |
|------|------|----------|
| `config.get()` | Текущая конфигурация | `Config` |
| `config.update({ body })` | Обновление конфигурации | `Config` |
| `config.providers()` | Список провайдеров и моделей по умолчанию | `{providers, default}` |

```typescript
// Получить конфигурацию
const config = await client.config.get()
console.log(`Текущая модель: ${config.data?.model}`)

// Динамическое обновление конфигурации
await client.config.update({
  body: {
    model: "anthropic/claude-haiku-4-5",
    logLevel: "DEBUG",
  },
})

// Информация о провайдерах
const { providers, default: defaults } = (await client.config.providers()).data!
```

---

## Информация о приложении App

| Метод | Описание | Тип возврата |
|------|------|----------|
| `app.log({ body })` | Запись в лог | `boolean` |
| `app.agents()` | Список всех Agent | `Agent[]` |

```typescript
// Запись в лог
await client.app.log({
  body: {
    service: "my-plugin",
    level: "info",
    message: "Операция завершена",
  },
})

// Список Agent
const agents = await client.app.agents()
for (const agent of agents.data ?? []) {
  console.log(`${agent.name}: ${agent.description}`)
}
```

---

## Управление TUI-интерфейсом

| Метод | Описание | Тип возврата |
|------|------|----------|
| `tui.appendPrompt({ body })` | Дописать текст в поле ввода | `boolean` |
| `tui.submitPrompt()` | Отправить текущий ввод | `boolean` |
| `tui.clearPrompt()` | Очистить поле ввода | `boolean` |
| `tui.showToast({ body })` | Показать уведомление | `boolean` |
| `tui.openHelp()` | Открыть диалог помощи | `boolean` |
| `tui.openSessions()` | Открыть выбор сессий | `boolean` |
| `tui.openThemes()` | Открыть выбор тем | `boolean` |
| `tui.openModels()` | Открыть выбор моделей | `boolean` |
| `tui.executeCommand({ body })` | Выполнить команду TUI | `boolean` |
| `tui.publish({ body })` | Опубликовать событие TUI | `boolean` |
| `tui.control.next()` | Получить следующий запрос TUI | - |
| `tui.control.response()` | Отправить ответ TUI | - |

### Параметры showToast

| Параметр | Тип | Описание |
|------|------|------|
| `message` | `string` | Содержимое уведомления |
| `title` | `string` | Заголовок уведомления (необязательно) |
| `variant` | `"info" \| "success" \| "warning" \| "error"` | Тип уведомления |
| `duration` | `number` | Длительность показа (миллисекунды) |

```typescript
// Уведомление об успехе
await client.tui.showToast({
  body: {
    title: "Операция успешна",
    message: "Файл сохранён",
    variant: "success",
    duration: 3000,
  },
})

// Выполнение команды
await client.tui.executeCommand({
  body: { command: "session.new" },
})
```

---

## Управление аутентификацией Auth

| Метод | Описание | Тип возврата |
|------|------|----------|
| `auth.set({ path, body })` | Задать credentials аутентификации | `boolean` |
| `auth.remove({ path })` | Удалить OAuth-credentials MCP | `boolean` |
| `auth.start({ path })` | Запустить OAuth-процесс | - |
| `auth.callback({ path, body })` | OAuth-колбэк | - |
| `auth.authenticate({ path })` | Авто-OAuth (открыть браузер) | - |

```typescript
// Задать API-ключ
await client.auth.set({
  path: { id: "anthropic" },
  body: { type: "api", key: "sk-xxx" },
})

// Задать OAuth-credentials
await client.auth.set({
  path: { id: "github" },
  body: {
    type: "oauth",
    access: "access-token",
    refresh: "refresh-token",
    expires: Date.now() + 3600000,
  },
})
```

---

## Управление провайдерами Provider

| Метод | Описание | Тип возврата |
|------|------|----------|
| `provider.list()` | Список всех провайдеров | `{ all: Provider[], default: Record<string, string>, connected: string[] }` |
| `provider.auth()` | Способы аутентификации провайдеров | `Record<string, ProviderAuthMethod[]>` |
| `provider.oauth.authorize({ path, body })` | OAuth-авторизация | - |
| `provider.oauth.callback({ path, body })` | OAuth-колбэк | - |

```typescript
// Список провайдеров
const providers = await client.provider.list()
for (const p of providers.data?.all ?? []) {
  console.log(`${p.name} (${p.id}): ${Object.keys(p.models).length} моделей`)
}

// Способы аутентификации
const authMethods = await client.provider.auth()
for (const [providerID, methods] of Object.entries(authMethods.data ?? {})) {
  console.log(providerID, methods)
}
```

---

## Управление MCP-серверами

| Метод | Описание | Тип возврата |
|------|------|----------|
| `mcp.status()` | Статус MCP-серверов | `Record<string, McpStatus>` |
| `mcp.add({ body })` | Динамическое добавление MCP-сервера | - |
| `mcp.connect({ path })` | Подключить MCP-сервер | - |
| `mcp.disconnect({ path })` | Отключить MCP-сервер | - |
| `mcp.auth.*` | OAuth-аутентификация MCP | - |

### Тип McpStatus

```typescript
type McpStatus =
  | { status: "connected" }
  | { status: "disabled" }
  | { status: "failed"; error: string }
  | { status: "needs_auth" }
  | { status: "needs_client_registration"; error: string }
```

```typescript
// Получить статусы
const status = await client.mcp.status()
for (const [name, value] of Object.entries(status.data ?? {})) {
  console.log(name, value.status)
}

// Динамически добавить MCP-сервер
await client.mcp.add({
  body: {
    name: "my-mcp",
    config: {
      type: "local",
      command: ["node", "mcp-server.js"],
    },
  },
})

// Подключить и отключить
await client.mcp.connect({ path: { name: "my-mcp" } })
await client.mcp.disconnect({ path: { name: "my-mcp" } })
```

---

## Статус LSP и форматтеров

```typescript
// Статус LSP
const lspStatus = await client.lsp.status()
for (const lsp of lspStatus.data ?? []) {
  console.log(`${lsp.name}: ${lsp.status}`)
}

// Статус форматтеров
const formatterStatus = await client.formatter.status()
for (const fmt of formatterStatus.data ?? []) {
  console.log(`${fmt.name}: ${fmt.enabled ? "включён" : "отключён"}`)
}
```

---

## PTY-сессии терминалов

Управление сессиями псевдотерминалов (экспериментальная функция).

| Метод | Описание | Тип возврата |
|------|------|----------|
| `pty.list()` | Список всех PTY-сессий | `Pty[]` |
| `pty.create({ body })` | Создание PTY-сессии | `Pty` |
| `pty.get({ path })` | Информация о PTY-сессии | `Pty` |
| `pty.update({ path, body })` | Обновление PTY-сессии | `Pty` |
| `pty.remove({ path })` | Удаление PTY-сессии | `boolean` |
| `pty.connect({ path })` | Подключение к PTY-сессии | `boolean` |

### Тип Pty

```typescript
type Pty = {
  id: string
  title: string
  command: string
  args: string[]
  cwd: string
  status: "running" | "exited"
  pid: number
}
```

```typescript
// Создать PTY-сессию
const pty = await client.pty.create({
  body: {
    command: "bash",
    cwd: "/home/user/project",
    title: "Терминал разработки",
  },
})

// Обновить размер окна
await client.pty.update({
  path: { id: pty.data!.id },
  body: {
    size: { rows: 24, cols: 80 },
  },
})
```

---

## Управление инструментами Tool (экспериментальное)

> API ниже по путям `/experimental/` — в будущих версиях могут измениться.

| Метод | Описание | Тип возврата |
|------|------|----------|
| `tool.ids()` | Список ID всех инструментов | `string[]` |
| `tool.list({ query })` | JSON-схемы инструментов | `ToolListItem[]` |

```typescript
// Все ID инструментов
const toolIds = await client.tool.ids()
console.log("Доступные инструменты:", toolIds.data)

// Детали инструментов (нужны модель и провайдер)
const tools = await client.tool.list({
  query: {
    provider: "anthropic",
    model: "claude-opus-4-5-thinking",
  },
})
```

---

## Информация о путях и VCS

```typescript
// Информация о путях
const pathInfo = await client.path.get()
console.log(`Каталог состояния: ${pathInfo.data?.state}`)
console.log(`Каталог конфигурации: ${pathInfo.data?.config}`)
console.log(`Рабочее дерево: ${pathInfo.data?.worktree}`)
console.log(`Текущий каталог: ${pathInfo.data?.directory}`)

// Информация VCS
const vcsInfo = await client.vcs.get()
console.log(`Текущая ветка: ${vcsInfo.data?.branch}`)
```

---

## Управление инстансами Instance

```typescript
// Уничтожить текущий инстанс
await client.instance.dispose()
```

---

## Список команд Command

```typescript
// Все команды
const commands = await client.command.list()
for (const cmd of commands.data ?? []) {
  console.log(`/${cmd.name}: ${cmd.description}`)
}
```

---

## Полный список типов событий

SDK поддерживает 32 типа событий реального времени через подписку `client.event.subscribe()`.

### События сервера

| Тип события | Описание | Свойства |
|----------|------|------|
| `server.connected` | Сервер подключён | - |
| `server.instance.disposed` | Инстанс уничтожен | `directory` |

### События установки

| Тип события | Описание | Свойства |
|----------|------|------|
| `installation.updated` | Установка обновлена | `version` |
| `installation.update-available` | Доступно обновление | `version` |

### События сессий

| Тип события | Описание | Свойства |
|----------|------|------|
| `session.created` | Сессия создана | `info: Session` |
| `session.updated` | Сессия обновлена | `info: Session` |
| `session.deleted` | Сессия удалена | `info: Session` |
| `session.status` | Статус сессии изменился | `sessionID`, `status` |
| `session.idle` | Сессия в простое | `sessionID` |
| `session.compacted` | Сессия сжата | `sessionID` |
| `session.diff` | Файловые изменения сессии | `sessionID`, `diff: FileDiff[]` |
| `session.error` | Ошибка сессии | `sessionID?`, `error` |

### События сообщений

| Тип события | Описание | Свойства |
|----------|------|------|
| `message.updated` | Сообщение обновлено | `info: Message` |
| `message.removed` | Сообщение удалено | `sessionID`, `messageID` |
| `message.part.updated` | Часть сообщения обновлена | `part: Part`, `delta?: string` |
| `message.part.removed` | Часть сообщения удалена | `sessionID`, `messageID`, `partID` |

### События прав

| Тип события | Описание | Свойства |
|----------|------|------|
| `permission.updated` | Запрос права ожидает | `Permission` |
| `permission.replied` | На право ответили | `sessionID`, `permissionID`, `response` |

### События файлов

| Тип события | Описание | Свойства |
|----------|------|------|
| `file.edited` | Файл отредактирован | `file` |
| `file.watcher.updated` | Наблюдатель файлов обновлён | `file`, `event: "add" \| "change" \| "unlink"` |

### События дел

| Тип события | Описание | Свойства |
|----------|------|------|
| `todo.updated` | Список дел обновлён | `sessionID`, `todos: Todo[]` |

### События команд

| Тип события | Описание | Свойства |
|----------|------|------|
| `command.executed` | Команда выполнена | `name`, `sessionID`, `arguments`, `messageID` |

### События VCS

| Тип события | Описание | Свойства |
|----------|------|------|
| `vcs.branch.updated` | Ветка переключена | `branch?` |

### События LSP

| Тип события | Описание | Свойства |
|----------|------|------|
| `lsp.updated` | Статус LSP обновлён | - |
| `lsp.client.diagnostics` | Диагностика LSP | `serverID`, `path` |

### События TUI

| Тип события | Описание | Свойства |
|----------|------|------|
| `tui.prompt.append` | В поле ввода дописан текст | `text` |
| `tui.command.execute` | Команда TUI выполнена | `command` |
| `tui.toast.show` | Показано уведомление | `title?`, `message`, `variant`, `duration?` |

### События PTY

| Тип события | Описание | Свойства |
|----------|------|------|
| `pty.created` | PTY-сессия создана | `info: Pty` |
| `pty.updated` | PTY-сессия обновлена | `info: Pty` |
| `pty.exited` | PTY-сессия завершена | `id`, `exitCode` |
| `pty.deleted` | PTY-сессия удалена | `id` |

### Пример слушания событий

```typescript
const events = await client.event.subscribe()

for await (const event of events.stream) {
  switch (event.type) {
    case "message.part.updated":
      // Инкрементальные обновления — для стримингового показа
      if (event.properties.delta) {
        process.stdout.write(event.properties.delta)
      }
      break

    case "session.status":
      const { sessionID, status } = event.properties
      if (status.type === "busy") {
        console.log(`Сессия ${sessionID} обрабатывает...`)
      } else if (status.type === "idle") {
        console.log(`Сессия ${sessionID} завершена`)
      } else if (status.type === "retry") {
        console.log(`Сессия ${sessionID} повторяется (${status.attempt})`)
      }
      break

    case "permission.updated":
      console.log(`Запрос права: ${event.properties.title}`)
      // Автоматически отвечаем на запросы прав
      await client.postSessionIdPermissionsPermissionId({
        path: {
          id: event.properties.sessionID,
          permissionID: event.properties.id,
        },
        body: { response: "always" },  // "once" — разово, "always" — всегда, "reject" — отклонить
      })
      break

    case "file.edited":
      console.log(`Файл изменён: ${event.properties.file}`)
      break

    case "todo.updated":
      console.log(`Дела обновлены:`, event.properties.todos)
      break
  }
}
```

---

## Полные определения типов

### Главные типы

```typescript
// Сессия
type Session = {
  id: string
  projectID: string
  directory: string
  parentID?: string
  title: string
  version: string
  summary?: {
    additions: number
    deletions: number
    files: number
    diffs?: FileDiff[]
  }
  share?: { url: string }
  time: {
    created: number
    updated: number
    compacting?: number
  }
  revert?: {
    messageID: string
    partID?: string
    snapshot?: string
    diff?: string
  }
}

// Статус сессии
type SessionStatus =
  | { type: "idle" }
  | { type: "busy" }
  | { type: "retry"; attempt: number; message: string; next: number }

// Сообщение
type Message = UserMessage | AssistantMessage

type UserMessage = {
  id: string
  sessionID: string
  role: "user"
  agent: string
  model: { providerID: string; modelID: string }
  time: { created: number }
  summary?: { title?: string; body?: string; diffs: FileDiff[] }
  system?: string
  tools?: { [key: string]: boolean }
}

type AssistantMessage = {
  id: string
  sessionID: string
  role: "assistant"
  parentID: string
  modelID: string
  providerID: string
  mode: string
  path: { cwd: string; root: string }
  time: { created: number; completed?: number }
  error?: MessageError
  cost: number
  tokens: {
    input: number
    output: number
    reasoning: number
    cache: { read: number; write: number }
  }
  finish?: string
  summary?: boolean
}
```

### Типы Part

```typescript
type Part =
  | TextPart
  | ReasoningPart
  | FilePart
  | ToolPart
  | StepStartPart
  | StepFinishPart
  | SnapshotPart
  | PatchPart
  | AgentPart
  | RetryPart
  | CompactionPart
  | SubtaskPart

type TextPart = {
  id: string
  sessionID: string
  messageID: string
  type: "text"
  text: string
  synthetic?: boolean
  ignored?: boolean
  time?: { start: number; end?: number }
  metadata?: { [key: string]: unknown }
}

type ToolPart = {
  id: string
  sessionID: string
  messageID: string
  type: "tool"
  callID: string
  tool: string
  state: ToolState
  metadata?: { [key: string]: unknown }
}

type ToolState =
  | { status: "pending"; input: object; raw: string }
  | { status: "running"; input: object; title?: string; time: { start: number } }
  | { status: "completed"; input: object; output: string; title: string; time: { start: number; end: number } }
  | { status: "error"; input: object; error: string; time: { start: number; end: number } }
```

### Типы ошибок

```typescript
type MessageError =
  | ProviderAuthError
  | UnknownError
  | MessageOutputLengthError
  | MessageAbortedError
  | ApiError

type ApiError = {
  name: "APIError"
  data: {
    message: string
    statusCode?: number
    isRetryable: boolean
    responseHeaders?: { [key: string]: string }
    responseBody?: string
  }
}
```

`AssistantMessage.error` — один из 5 типов:

| Тип ошибки | Смысл | Частые причины |
|---------|------|---------|
| `ProviderAuthError` | Ошибка аутентификации | Недействительный или просроченный API-ключ |
| `MessageOutputLengthError` | Превышена длина вывода | Больше максимума выходных токенов модели |
| `MessageAbortedError` | Прервано | Пользователь вызвал `session.abort()` или тайм-аут |
| `ApiError` | Ошибка API | Лимиты частоты (429), ошибки сервера (500) и т. д. — смотрите `data.statusCode` и `data.isRetryable` |
| `UnknownError` | Неизвестная ошибка | Прочие неклассифицированные ошибки |

```typescript
const result = await client.session.prompt({ path: { id: sessionID }, body: { ... } })
const error = result.data?.info.error
if (error) {
  switch (error.name) {
    case "APIError":
      if (error.data.isRetryable) console.log("Можно повторить, попробуйте позже")
      else console.log(`Ошибка API ${error.data.statusCode}: ${error.data.message}`)
      break
    case "ProviderAuthError":
      console.log("Проблема с API-ключом, проверьте конфигурацию аутентификации")
      break
    // ...
  }
}
```

> Источник: `types.gen.ts:70-110` (пять подтипов MessageError)

### Остальные типы

```typescript
type Todo = {
  id: string
  content: string
  status: string  // pending, in_progress, completed, cancelled
  priority: string  // high, medium, low
}

type Permission = {
  id: string
  type: string
  pattern?: string | string[]
  sessionID: string
  messageID: string
  callID?: string
  title: string
  metadata: { [key: string]: unknown }
  time: { created: number }
}

type Agent = {
  name: string
  description?: string
  mode: "subagent" | "primary" | "all"
  builtIn: boolean
  topP?: number
  temperature?: number
  color?: string
  model?: { modelID: string; providerID: string }
  prompt?: string
  tools: { [key: string]: boolean }
  options: { [key: string]: unknown }
  maxSteps?: number
  permission: {
    edit: "ask" | "allow" | "deny"
    bash: { [key: string]: "ask" | "allow" | "deny" }
    webfetch?: "ask" | "allow" | "deny"
    doom_loop?: "ask" | "allow" | "deny"
    external_directory?: "ask" | "allow" | "deny"
  }
}

type FileDiff = {
  file: string
  before: string
  after: string
  additions: number
  deletions: number
}
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| `data` возвращает `undefined` | Запрос упал, проверьте поле `error` | Проверьте `result.error` |
| Поток событий рвётся | Обрыв сети или перезапуск сервера | Реализуйте логику переподключения |
| `tool.list` пуст | Нужны `provider` и `model` | Добавьте query-параметры |
| Запросы прав без ответа | Нужно отвечать вручную | Используйте `postSessionIdPermissionsPermissionId` |
| Статус MCP `needs_auth` | MCP-серверу нужна OAuth-аутентификация | Вызовите `mcp.auth.authenticate` |

---

## Итоги урока

Вы научились:
1. **Полному списку из 20 модулей API плюс 1 метод ответа на права**
2. **32 типам событий** и их свойствам
3. **Главным определениям типов**: Session, Message, Part, Todo, Agent и др.
4. **Экспериментальным API**: управление Tool, PTY-терминалы

---

## Анонс следующего урока

> V1 разобрали, но в OpenCode сосуществует развивающийся вход V2. В следующем уроке — **[5.10c SDK V2 нового поколения](./10c-sdk-v2)**.
>
> Вы узнаете:
> - Совместимые модули верхнего уровня и пространство имён `client.v2.*`
> - Независимые модули Permission и Question (кросс-сессионное управление правами и вопросами)
> - Усиленные методы Session3 (interrupt, wait, compact, смена модели и агента)
> - Новые понятия Sync, Worktree и Workspace в V2
> - Полный гид миграции с V1 на V2

---

## Связанные материалы

- [5.10a Основы SDK](./10a-sdk-basics) — вводный урок
- [5.9 Удалённая разработка](./09a-remote-basics) — подробно о HTTP-сервере
- [Исходники типов SDK (v1.18.22)](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/types.gen.ts)
