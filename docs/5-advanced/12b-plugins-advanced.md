---
title: 5.12b Продвинутые плагины
subtitle: Частые хуки и продвинутые функции
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.12b"
duration: 30 минут
practice: 40 минут
level: Продвинутый
description: Изучите частые хуки событий и функций, создавайте свои инструменты и плагины аутентификации, реализуйте продвинутые функции плагинов.
tags:
  - Плагины
  - Хуки
  - Продвинутые функции
prerequisite:
  - 5.12a Основы плагинов
---

# Продвинутые плагины

> 💡 **Коротко**: освойте частые типы хуков и реализуйте продвинутые функции плагинов.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/plugins-advanced-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.12b Продвинутые плагины"
     data-zoom-src="/images/5-advanced/plugins-advanced-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Два типа хуков: Event (прослушивание, не меняет данные) и Functional (перехват, меняет данные).
2. События: command.executed, file.edited, session.created/idle/updated (9), message.updated/removed (4), LSP/permission/todo/TUI.
3. Конвейер: Start → config → chat.message → chat.params → permission.ask → tool.execute.before → tool.execute.after.
4. Функциональные хуки: config, chat.message (модификация сообщений), chat.params (temperature, topP), permission.ask (allow/deny/ask).
5. Свои инструменты: tool() с Zod-схемой (args), ToolContext (sessionID, messageID, agent, abort).
6. Auth-хуки: auth.provider, methods (api/oauth), loader.
7. Экспериментальные хуки: session.compacting, chat.messages.transform, chat.system.transform, text.complete (API может измениться).
8. Ловушки: хук не срабатывает → проверить имя функции; output не меняется → мутировать объект; abort не отвечает → ctx.abort.aborted в цикле.

</details>

---

## Что вы сможете после урока

- Понимать разницу хуков событий и функциональных хуков
- Использовать частые типы хуков и находить полный список в определениях типов
- Создавать свои инструменты
- Реализовывать плагины аутентификации

---

## Классификация хуков

У плагинов OpenCode два класса хуков:

| Тип | Особенности | Назначение |
|------|------|------|
| **Хуки событий** | Пассивное слушание, данные не меняют | Логи, уведомления, статистика |
| **Функциональные хуки** | Активный перехват, данные меняют | Контроль прав, изменение параметров, преобразование данных |

### Хуки событий

<AdInArticle />

Единой подпиской `event` подписывайтесь на события, которые умеет получать плагин:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    event: async ({ event }) => {
      console.log(`Event: ${event.type}`, event.properties)
    },
  }
}
```

### Функциональные хуки

Конкретным именем хука перехватывайте конкретные операции:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      // output можно менять — повлияет на дальнейшее выполнение
      console.log(`Tool: ${input.tool}`)
    },
  }
}
```

---

## Типы событий

События подписываются хуком `event` и различаются по `event.type`. Ниже — частые события, а не полный список; в целевой версии есть ещё события доступности обновлений, освобождения сервера, VCS, PTY и другие — сверяйтесь с union-типом событий в SDK.

### События команд

| Событие | Момент срабатывания |
|------|---------|
| `command.executed` | После выполнения слэш-команды |

### События файлов

| Событие | Момент срабатывания |
|------|---------|
| `file.edited` | После правки файла |
| `file.watcher.updated` | Детект изменений наблюдателем файлов |

### События установки

| Событие | Момент срабатывания |
|------|---------|
| `installation.updated` | После установки или обновления OpenCode |

### События LSP

| Событие | Момент срабатывания |
|------|---------|
| `lsp.client.diagnostics` | Обновление диагностики LSP |
| `lsp.updated` | Изменение статуса LSP-сервиса |

### События сообщений

| Событие | Момент срабатывания |
|------|---------|
| `message.part.removed` | Фрагмент сообщения удалён |
| `message.part.updated` | Фрагмент сообщения обновлён |
| `message.removed` | Сообщение удалено |
| `message.updated` | Сообщение обновлено |

### События прав

| Событие | Момент срабатывания |
|------|---------|
| `permission.replied` | Пользователь ответил на запрос права |
| `permission.updated` | Статус права изменился |

### События сервера

| Событие | Момент срабатывания |
|------|---------|
| `server.connected` | Сервер успешно подключён |

### События сессий

| Событие | Момент срабатывания |
|------|---------|
| `session.created` | Новая сессия создана |
| `session.compacted` | Сжатие сессии завершено |
| `session.deleted` | Сессия удалена |
| `session.diff` | Сгенерирован diff сессии |
| `session.error` | Ошибка сессии |
| `session.idle` | Сессия в простое (ответ AI завершён) |
| `session.status` | Статус сессии изменился |
| `session.updated` | Информация о сессии обновлена |

### События дел

| Событие | Момент срабатывания |
|------|---------|
| `todo.updated` | Список дел обновлён |

### События TUI

| Событие | Момент срабатывания |
|------|---------|
| `tui.prompt.append` | В промпт дописан контент |
| `tui.command.execute` | Выполняется команда TUI |

| `tui.toast.show` | Показ всплывающего уведомления |

---

## Разбор функциональных хуков

### config

Срабатывает после загрузки конфигурации, конфигурацию можно менять:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    config: async (config) => {
      // config: объект Config (полные определения типов — в config.ts)
      // Свойства меняются напрямую, например:
      config.model = "anthropic/claude-opus-4-5-thinking"
    },
  }
}
```

**Типы параметров**: `config: Config` (чтение и запись)

### chat.message

Срабатывает при получении нового сообщения, содержимое сообщения можно менять:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "chat.message": async (input, output) => {
      // input: { sessionID, agent, model, messageID, variant }
      // output: { message, parts }
      console.log(`New message in session: ${input.sessionID}`)
    },
  }
}
```

**Типы input**:

| Поле | Тип | Описание |
|------|------|------|
| `sessionID` | `string` | ID сессии |
| `agent` | `string` | Имя Agent |
| `model` | `{ providerID, modelID }` | Информация о модели |
| `messageID` | `string` | ID сообщения |
| `variant` | `string` | Вариант сообщения |

**Типы output**:

| Поле | Тип | Описание |
|------|------|------|
| `message` | `Message` | Объект сообщения (изменяемый) |
| `parts` | `Part[]` | Части содержимого сообщения (изменяемые) |

### chat.params

Срабатывает перед вызовом LLM, параметры модели можно менять:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "chat.params": async (input, output) => {
      // input: { sessionID, agent, model, provider, message }
      // output: { temperature, topP, topK, options }

      // Принудительно низкая температура
      output.temperature = 0.3

      // Добавить параметры провайдера — HTTP-заголовком они автоматически не станут
      output.options.seed = 1
    },
  }
}
```

**Типы input**:

| Поле | Тип | Описание |
|------|------|------|
| `sessionID` | `string` | ID сессии |
| `agent` | `string` | Имя Agent |
| `model` | `{ providerID, modelID }` | Информация о модели |
| `provider` | `Provider` | Объект провайдера |
| `message` | `Message` | Текущее сообщение |

**Типы output** (изменяемые):

| Поле | Тип | Описание |
|------|------|------|
| `temperature` | `number?` | Параметр температуры |
| `topP` | `number?` | Параметр Top-P |
| `topK` | `number?` | Параметр Top-K |
| `options` | `Record<string, unknown>` | Свои параметры провайдера — не путать с HTTP-заголовками |

Когда нужно менять заголовки запросов — отдельный хук `chat.headers`:

```ts
export const TraceHeadersPlugin: Plugin = async () => ({
  "chat.headers": async (input, output) => {
    output.headers["X-Session-ID"] = input.sessionID
  },
})
```

### permission.ask

Срабатывает при запросе права, решение о правах можно менять:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "permission.ask": async (input, output) => {
      // input: объект Permission
      // output: { status: "ask" | "deny" | "allow" }

      // Автоматически разрешать заданные шаблоны чтения
      if (input.type === "read" && input.pattern?.startsWith("/safe/")) {
        output.status = "allow"
      }
    },
  }
}
```

### tool.execute.before

Срабатывает перед выполнением инструмента, параметры меняются или выполнение останавливается исключением:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      // input: { tool, sessionID, callID }
      // output: { args }

      if (input.tool === "bash" && output.args.command.includes("rm -rf")) {
        throw new Error("Dangerous command blocked!")
      }
    },
  }
}
```

**Типы input**:

| Поле | Тип | Описание |
|------|------|------|
| `tool` | `string` | Имя инструмента (вроде `read`, `bash`, `write`) |
| `sessionID` | `string` | ID сессии |
| `callID` | `string` | ID вызова инструмента |

**Типы output** (изменяемые):

| Поле | Тип | Описание |
|------|------|------|
| `args` | `Record<string, unknown>` | Параметры инструмента (меняются или перехватываются) |

**Выброс исключения**: выброшенный `Error` останавливает выполнение инструмента, текст ошибки возвращается LLM.

### tool.execute.after

Срабатывает после выполнения инструмента, вывод можно менять:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "tool.execute.after": async (input, output) => {
      // input: { tool, sessionID, callID }
      // output: { title, output, metadata }

      // Добавить метку времени выполнения
      output.metadata.executedAt = new Date().toISOString()
    },
  }
}
```

**Типы input**:

| Поле | Тип | Описание |
|------|------|------|
| `tool` | `string` | Имя инструмента |
| `sessionID` | `string` | ID сессии |
| `callID` | `string` | ID вызова инструмента |

**Типы output** (изменяемые):

| Поле | Тип | Описание |
|------|------|------|
| `title` | `string` | Заголовок выполнения инструмента (показывается в UI) |
| `output` | `string` | Вывод инструмента (возвращается LLM) |
| `metadata` | `Record<string, unknown>` | Метаданные (дописываются свободно) |

---

## Экспериментальные хуки

> ⚠️ **Предупреждение**: хуки ниже начинаются с `experimental.` — API может измениться в будущих версиях.

### experimental.session.compacting

Срабатывает перед сжатием сессии, контекст сжатия настраивается:

```ts
export const CompactionPlugin: Plugin = async () => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // input: { sessionID }
      // output: { context: string[], prompt?: string }

      // Способ 1: дописать дополнительный контекст
      output.context.push(`
## Пользовательский контекст

Сохранить состояние:
- Статус текущей задачи
- Важные решения
- Файлы в работе
`)
    },
  }
}
```

Полная замена промпта сжатия:

```ts
export const CustomCompactionPlugin: Plugin = async () => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Заданный prompt полностью заменяет промпт сжатия по умолчанию
      // При этом массив output.context игнорируется
      output.prompt = `
Вы генерируете промпт продолжения для мультиагентной сессии.

Подведите итог:
1. Текущая задача и её статус
2. Изменяемые файлы и ответственные
3. Зависимости между агентами
4. Следующий шаг завершённой работы

Отформатируйте структурированным промптом, по которому новый агент восстановит работу.
`
    },
  }
}
```

### experimental.chat.messages.transform

Срабатывает перед отправкой сообщений LLM, список сообщений преобразуется:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "experimental.chat.messages.transform": async (input, output) => {
      // output.messages: Array<{ info: Message, parts: Part[] }>

      // Отфильтровать отдельные сообщения
      output.messages = output.messages.filter(m =>
        !m.parts.some(p => p.type === "text" && p.text.includes("SECRET"))
      )
    },
  }
}
```

### experimental.chat.system.transform

Срабатывает перед отправкой системного промпта LLM:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "experimental.chat.system.transform": async (input, output) => {
      // output.system: string[]

      // Дописать свои системные инструкции
      output.system.push("Always respond in formal English.")
    },
  }
}
```

### experimental.text.complete

Срабатывает после завершения дополнения текста:

```ts
export const MyPlugin: Plugin = async () => {
  return {
    "experimental.text.complete": async (input, output) => {
      // input: { sessionID, messageID, partID }
      // output: { text }

      // Финальный текст вывода можно менять
      output.text = output.text.replace(/\bAI\b/g, "Assistant")
    },
  }
}
```

---

## Свои инструменты

Плагины добавляют свои инструменты для вызова AI:

```ts
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async () => {
  return {
    tool: {
      mytool: tool({
        description: "Это свой инструмент",
        args: {
          foo: tool.schema.string().describe("Входной параметр"),
          count: tool.schema.number().optional().describe("Необязательный числовой параметр"),
        },
        async execute(args, ctx) {
          // args: { foo: string, count?: number }
          // ctx: ToolContext
          return `Hello ${args.foo}!`
        },
      }),
    },
  }
}
```

### Параметры функции tool

| Параметр | Тип | Описание |
|------|------|------|
| `description` | `string` | Описание функции инструмента — по нему AI решает, когда использовать |
| `args` | `Record<string, ZodType>` | Определение параметров через Zod-схемы |
| `execute` | `(args, ctx) => Promise<ToolResult>` | Функция выполнения инструмента; возвращает строку или структурированный результат |

### ToolContext

Второй параметр функции `execute` даёт контекст выполнения:

| Свойство | Тип | Описание |
|------|------|------|
| `sessionID` | `string` | ID текущей сессии |
| `messageID` | `string` | ID текущего сообщения |
| `agent` | `string` | Имя Agent, вызвавшего инструмент |
| `abort` | `AbortSignal` | Сигнал останова для отмены долгих операций |
| `directory` | `string` | Текущий рабочий каталог |
| `worktree` | `string` | Путь текущего worktree |
| `metadata()` | `function` | Обновление заголовка и метаданных вызова инструмента |
| `ask()` | `function` | Инициирование запроса права |

### Сигнал abort в работе

```ts
tool({
  description: "Долго выполняющаяся задача",
  args: {},
  async execute(args, ctx) {
    for (let i = 0; i < 100; i++) {
      if (ctx.abort.aborted) {
        return "Задача отменена"
      }
      await doWork(i)
    }
    return "Задача выполнена"
  },
})
```

### Шпаргалка Zod-схем

`tool.schema` — это Zod, частые типы:

```ts
tool.schema.string()           // Строка
tool.schema.number()           // Число
tool.schema.boolean()          // Булево
tool.schema.array(...)         // Массив
tool.schema.object({...})      // Объект
tool.schema.enum(["a", "b"])   // Перечисление
tool.schema.optional()         // Необязательное (цепочка)
tool.schema.describe("...")    // Описание (цепочка)
```

---

## Хуки аутентификации

Плагины v1 заявляют для провайдера набор способов аутентификации. Экран входа читает `methods` и по выбору пользователя выполняет процесс API-ключа или OAuth; `loader` превращает сохранённые credentials в конфигурацию провайдера:

```ts
export const MyAuthPlugin: Plugin = async () => {
  return {
    auth: {
      provider: "my-provider",

      // Необязательно: загрузка конфигурации из существующей аутентификации
      loader: async (auth, provider) => {
        const token = await auth()
        if (token.type === "oauth") return { apiKey: token.access }
        return { apiKey: token.key }
      },

      methods: [
        {
          type: "api",
          label: "API Key",
          // OpenCode покажет встроенное поле ввода пароля API-ключа и сохранит credentials
        },
        {
          type: "oauth",
          label: "OAuth Login",
          authorize: async () => {
            return {
              url: "https://example.com/oauth/authorize",
              instructions: "Complete login in browser",
              method: "auto",
              callback: async () => {
                // Ожидание OAuth-колбэка
                return {
                  type: "success",
                  access: "access_token",
                  refresh: "refresh_token",
                  expires: Date.now() + 3600000,
                }
              },
            }
          },
        },
      ],
    },
  }
}
```

### Типы способов аутентификации

| Тип | Описание |
|------|------|
| `api` | Способ API-ключа: пользователь вводит ключ напрямую |
| `oauth` | Способ OAuth: переход в браузер для авторизации |

`method` у OAuth — не тип аутентификации, а способ колбэка: `auto` — плагин сам ждёт колбэк внешнего браузера, `code` — пользователь вставляет код авторизации обратно. Сервис аутентификации провайдера вызывает `authorize` / `callback` по индексу способа (исходники: [`provider/auth.ts:41-53`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/provider/auth.ts#L41-L53),[`provider/auth.ts:163-180`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/provider/auth.ts#L163-L180)).

### Настройка prompts

| Тип | Описание |
|------|------|
| `text` | Поле текстового ввода |
| `select` | Выпадающий список |

Каждый prompt настраивается:
- `key`: имя ключа вводимого значения
- `message`: текст подсказки
- `validate`: функция валидации
- `when`: правило-условие, показывать ли этот prompt (старое поле-функция `condition` deprecated)

Эти `prompts` собирают дополнительные поля сверх API-ключа или параметры OAuth, а не заменяют встроенное поле ввода пароля API-ключа способа `api`. `api.authorize` необязателен; без своей валидации и обмена credentials опускайте его — OpenCode напрямую сохранит введённый пользователем ключ.

Исходники: [`packages/plugin/src/index.ts:95-147`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/index.ts#L95-L147).

### Коннектор интеграции v2

В `v1.18.22` есть ещё интерфейс v2 connector для связи интеграций (помимо провайдера) с credentials. Три класса способов:

| Способ | Назначение |
|------|------|
| `key` | Сохранение введённого пользователем API-ключа |
| `env` | Разбор credentials из указанной переменной окружения |
| `oauth` | Внешний браузерный OAuth с автоколбэком или кодом авторизации, плюс регистрация функции обновления |

Плагины v2 регистрируют или меняют integration и её способы через `context.integration.transform`, текущее подключение забирают через `context.integration.connection.active/resolve`. Интерфейс Effect: [`packages/plugin/src/v2/effect/integration.ts:15-62`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/v2/effect/integration.ts#L15-L62), интерфейс Promise: [`packages/plugin/src/v2/promise/integration.ts:1-14`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/v2/promise/integration.ts#L1-L14).

::: warning Не смешивайте интерфейсы поколений
Пример `auth: { provider, methods, loader }` выше — v1 `Plugin`. Коннектор v2 работает через `context.integration`, credentials хранятся, резолвятся и обновляются слоем integration connection; не лепите поля обоих в один объект.
:::

---

## Полный пример: плагин трекинга времени

```ts
import type { Plugin } from "@opencode-ai/plugin"

export const TimeTrackingPlugin: Plugin = async ({ client }) => {
  const sessionTimes = new Map<string, number>()

  return {
    event: async ({ event }) => {
      if (event.type === "session.created") {
        const sessionID = event.properties.info.id
        sessionTimes.set(sessionID, Date.now())
        await client.app.log({
          body: {
            service: "time-tracking",
            level: "info",
            message: `Session started: ${sessionID}`,
          },
        })
      }

      if (event.type === "session.idle") {
        const startTime = sessionTimes.get(event.properties.sessionID)
        if (startTime) {
          const duration = Date.now() - startTime
          await client.app.log({
            body: {
              service: "time-tracking",
              level: "info",
              message: `Session duration: ${Math.round(duration / 1000)}s`,
              extra: { sessionID: event.properties.sessionID, duration },
            },
          })
        }
      }
    },

    "chat.headers": async (input, output) => {
      // Добавить трекинг-заголовок всем запросам
      output.headers["X-Session-ID"] = input.sessionID
    },
  }
}
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Хук не срабатывает | Опечатка в имени функции | Используйте TypeScript для проверки типов |
| Изменение `output` не действует | Вернули новый объект вместо изменения исходного | Меняйте напрямую `output.xxx = ...` |
| Экспериментальные хуки отвалились | API изменился с версией | Смотрите журнал изменений, правьте код |
| Плагин аутентификации недействителен | Не совпало имя `provider` | Убедитесь в совпадении с ID провайдера конфигурации |
| Сигнал abort не реагирует | Не проверяется `ctx.abort.aborted` | Проверяйте регулярно в длинных циклах |

---

## Итоги урока

Вы научились:

1. Разнице хуков событий и функциональных хуков
2. Частым типам хуков и способу искать полный список в определениях типов
3. Созданию своих инструментов (с обработкой сигнала abort)
4. Реализации плагинов аутентификации

---

## Связанные материалы

- [5.12a Основы плагинов](./12a-plugins-basics) — установка плагинов и базовое использование
- [5.10 Разработка на SDK](./10a-sdk-basics) — использование SDK-клиента
- [5.13 Свои инструменты](./13-custom-tools) — больше примеров разработки инструментов
- [Экосистема](../appendix/ecosystem#плагины) — примеры плагинов сообщества
