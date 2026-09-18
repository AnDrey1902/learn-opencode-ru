---
title: 5.13 Свои инструменты
subtitle: Расширение возможностей инструментов OpenCode
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.13"
duration: 25 минут
practice: 30 минут
level: Продвинутый
description: Создавайте свои инструменты, чтобы LLM вызывала ваши функции в диалоге и расширяла возможности OpenCode.
tags:
  - Инструменты
  - TypeScript
  - Расширения
prerequisite:
  - 5.1 Всё о конфигурации
---

# Свои инструменты

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/13-custom-tools-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.13 Свои инструменты"
     data-zoom-src="/images/5-advanced/13-custom-tools-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Создание инструментов — файлы в `.opencode/tool/`, файл = имя инструмента.
2. Структура: `description`, `args` (Zod-схема), `execute`.
3. Несколько инструментов в одном файле — формат имени `файл_экспорт`.
4. Параметры — типы Zod: string, optional, default, enum, boolean, array, object.
5. Контекст: sessionID, messageID, agent, abort (AbortSignal).
6. Зависимости — через `.opencode/package.json`.
7. Лимиты вывода: макс. 2000 строк / 50 KB.
8. Отключение: `tools` в конфиге, wildcard `math_*`.
9. Дебаг: `/tools`, `OPENCODE_DEBUG=1`, `bun check`.
10. Ошибки: расширение файла, Zod-схема, обрезка вывода, Windows `python` против `python3`.

</details>

---

Создаваемые вами функции, которые LLM вызывает в диалоге, — это свои инструменты. Они работают бок о бок со встроенными инструментами OpenCode (`read`, `write`, `bash`).

## Создание инструментов

Инструменты определяются файлами **TypeScript** или **JavaScript**. Но определение инструмента умеет вызывать скрипты на любом языке — TypeScript и JavaScript нужны только для самого определения.

### Расположение

Инструменты кладутся в:

- **Уровень проекта**: каталог `.opencode/tool/`
- **Глобальный уровень**: каталог `~/.config/opencode/tool/`

### Структура

Инструменты создаются хелпером `tool()` — типобезопасность и валидация из коробки:

```ts
// .opencode/tool/database.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Query the project database",
  args: {
    query: tool.schema.string().describe("SQL query to execute"),
  },
  async execute(args) {
    // Логика базы данных
    return `Executed query: ${args.query}`
  },
})
```

**Имя файла** и есть **имя инструмента**. Пример выше создаёт инструмент `database`.

### Несколько инструментов в одном файле

Из одного файла можно экспортировать несколько инструментов. Каждый экспорт становится отдельным инструментом вида `<имя-файла>_<имя-экспорта>`:

```ts
// .opencode/tool/math.ts
import { tool } from "@opencode-ai/plugin"

export const add = tool({
  description: "Add two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return args.a + args.b
  },
})

export const multiply = tool({
  description: "Multiply two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return args.a * args.b
  },
})
```

Получаются два инструмента: `math_add` и `math_multiply`.

### Совпадение имён со встроенными инструментами

Свои инструменты индексируются по имени. Совпадение имени со встроенным инструментом — **приоритет у своего**.

Например, этот файл заменит встроенный инструмент `bash`:

```ts title=".opencode/tool/bash.ts"
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Ограниченная обёртка над bash",
  args: {
    command: tool.schema.string().describe("Команда для выполнения"),
  },
  async execute(args) {
    // Перехватываем опасные команды
    const blocked = ["rm -rf", "sudo", "mkfs"]
    for (const cmd of blocked) {
      if (args.command.includes(cmd)) {
        return `⛔ Перехвачена опасная команда: ${args.command}`
      }
    }
    // Выполняем остальные команды...
    return `Выполняю: ${args.command}`
  },
})
```

::: tip 💡 Рекомендации
- **Если замена не задумана** — давайте уникальные имена, не конфликтуйте со встроенными
- **Хотите отключить встроенный**, а не заменить? Используйте [конфигурацию прав](./05-permissions.md), а не перекрытие именем
- **Хотите усилить встроенный**? Вызывайте исходную логику внутри своего (команды — через `Bun.$`)
:::

### Определение параметров

Типы параметров задаются через `tool.schema` (это [Zod](https://zod.dev)):

```ts
args: {
  query: tool.schema.string().describe("SQL query to execute")
}
```

Частые примеры типов:

```ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Demo of parameter types",
  args: {
    // Строка
    name: tool.schema.string().describe("User name"),

    // Необязательный параметр
    email: tool.schema.string().email().optional().describe("Optional email"),

    // Со значением по умолчанию
    limit: tool.schema.number().default(10).describe("Max results"),

    // Перечисление
    status: tool.schema.enum(["pending", "done"]).describe("Task status"),

    // Булево
    verbose: tool.schema.boolean().describe("Enable verbose output"),

    // Массив
    tags: tool.schema.array(tool.schema.string()).describe("List of tags"),

    // Объект
    config: tool.schema.object({
      host: tool.schema.string(),
      port: tool.schema.number(),
    }).describe("Server config"),
  },
  async execute(args) {
    return JSON.stringify(args, null, 2)
  },
})
```

Можно импортировать Zod напрямую и возвращать обычный объект:

```ts
import { z } from "zod"

export default {
  description: "Tool description",
  args: {
    param: z.string().describe("Parameter description"),
  },
  async execute(args, context) {
    // Реализация инструмента
    return "result"
  },
}
```

### Контекст

<AdInArticle />

Инструменты принимают контекст текущей сессии:

```ts
// .opencode/tool/project.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get project information",
  args: {},
  async execute(args, context) {
    // Доступ к информации контекста
    const { agent, sessionID, messageID, abort } = context
    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}`
  },
})
```

Контекст содержит поля:

| Поле | Тип | Описание |
|-----|------|------|
| `sessionID` | `string` | ID текущей сессии |
| `messageID` | `string` | ID текущего сообщения |
| `agent` | `string` | Имя агента, вызвавшего инструмент |
| `directory` | `string` | Текущий каталог проекта (приоритетен при резолвинге относительных путей) |
| `worktree` | `string` | Корень worktree проекта |
| `abort` | `AbortSignal` | Детект отмены операции пользователем |

#### Обработка отмены операций

Когда пользователь отменяет операцию (например, Ctrl+C), срабатывает сигнал `abort`. Долгие инструменты должны слушать его и вовремя выходить:

```ts
// .opencode/tool/long-task.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "A long-running task",
  args: {},
  async execute(args, context) {
    // Проверяем, уже ли отменено
    if (context.abort.aborted) {
      return "Task cancelled"
    }

    // Передаём в API с поддержкой AbortSignal
    const response = await fetch("https://api.example.com/data", {
      signal: context.abort,
    })

    return await response.text()
  },
})
```

## Зависимости

Свои инструменты умеют пользоваться внешними npm-пакетами. Объявите зависимости в `package.json` каталога конфигурации:

```json
// .opencode/package.json
{
  "dependencies": {
    "node-fetch": "^3.0.0",
    "cheerio": "^1.0.0"
  }
}
```

При старте OpenCode сам выполнит `bun install` и поставит зависимости. Затем инструменты импортируют их:

```ts
// .opencode/tool/scraper.ts
import { tool } from "@opencode-ai/plugin"
import * as cheerio from "cheerio"

export default tool({
  description: "Extract text from a webpage",
  args: {
    url: tool.schema.string().url().describe("URL to scrape"),
  },
  async execute(args, context) {
    const response = await fetch(args.url, { signal: context.abort })
    const html = await response.text()
    const $ = cheerio.load(html)
    return $("body").text().trim()
  },
})
```

## Примеры

### Инструмент на Python

Инструменты пишутся на любом языке. Ниже — сложение двух чисел на Python.

Сначала создайте Python-скрипт:

```python
# .opencode/tool/add.py
import sys

a = int(sys.argv[1])
b = int(sys.argv[2])
print(a + b)
```

Затем создайте определение инструмента, вызывающее его:

```ts
// .opencode/tool/python-add.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Add two numbers using Python",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    const result = await Bun.$`python3 .opencode/tool/add.py ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

Здесь для запуска Python-скрипта используется инструмент [`Bun.$`](https://bun.com/docs/runtime/shell).

### Вызов HTTP API

Частый кейс в реальных проектах — обёртка над вызовами HTTP API:

```ts
// .opencode/tool/jira.ts
import { tool } from "@opencode-ai/plugin"

export const getIssue = tool({
  description: "Get JIRA issue details by key",
  args: {
    key: tool.schema.string().describe("Issue key, e.g. PROJ-123"),
  },
  async execute(args, context) {
    const response = await fetch(
      `https://your-company.atlassian.net/rest/api/3/issue/${args.key}`,
      {
        headers: {
          Authorization: `Basic ${btoa("email@example.com:API_TOKEN")}`,
          Accept: "application/json",
        },
        signal: context.abort,
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch issue: ${response.status}`)
    }

    const issue = await response.json()
    return JSON.stringify(issue, null, 2)
  },
})
```

> В production API-токен читайте из переменных окружения, а не хардкодьте.

## Лимиты вывода

Возвращаемые значения инструментов автоматически обрезаются против переполнения контекста:

| Лимит | Значение |
|-----|-----|
| Максимум строк | 2000 строк |
| Максимум байт | 50 KB |

При превышении OpenCode допишет в конец `...N lines truncated...` или `...N chars truncated...`.

Если инструменту нужно вернуть много данных, рекомендуем:

1. **Возвращать выжимку** — только ключевое, полные данные пишите в файл
2. **Обработка страницами** — добавьте параметры пагинации, возвращайте частями
3. **Структурированный вывод** — возвращайте JSON, LLM его легко разберёт

## Отключение своих инструментов

Свои инструменты тоже отключаются конфигом `tools`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "database": false,
    "math_*": false
  }
}
```

Wildcard-шаблоны поддерживаются: `math_*` отключит все инструменты на `math_` (`math_add`, `math_multiply`).

## Отладка и проверка

### Подтверждение успешной загрузки инструментов

После старта OpenCode командой `/tools` посмотрите список всех доступных инструментов — убедитесь, что свои в списке.

### Частые методы отладки

1. **Смотрите логи** — ошибки загрузки инструментов пишутся в лог, подробные логи — запуск с `OPENCODE_DEBUG=1`
2. **Тестовый запуск** — попросите LLM напрямую вызвать инструмент в диалоге и смотрите результат
3. **Проверка синтаксиса** — TypeScript проверяется командой `bun check .opencode/tool/your-tool.ts`

## Инструменты vs плагины: разница

| Характеристика | Свои инструменты | Инструменты в плагинах |
|------|------------|-------------|
| Назначение | Функции для вызова LLM | Расширение поведения OpenCode + инструменты |
| Расположение | `.opencode/tool/` | `.opencode/plugin/` |
| Правила именования | `<имя-файла>` или `<имя-файла>_<имя-экспорта>` | Имя задаётся прямо в объекте `tool` |
| Когда подходят | Простые standalone-функции | Нужен контекст плагина или комбинация хуков |

Определение инструментов в плагинах — в разделе [Разработка плагинов](./12a-plugins-basics#свои-инструменты-1).

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Инструмента нет в списке `/tools` | Неверное расширение или ошибка синтаксиса | Только расширения `.ts` и `.js`, проверьте синтаксис TypeScript |
| Ошибка валидации параметров при вызове | Определение Zod-схемы не совпадает | Описания `.describe()` — ясные, чтобы LLM понимал смысл параметров |
| Возврат инструмента обрезан | Возврат больше 2000 строк или 50KB | Возвращайте выжимку или постранично, полные данные — в файл |
| Тайм-аут вызова инструмента | Долгая задача без обработки abort | Поддержите отмену через сигнал `context.abort` |
| Пакет зависимости не найден | Не объявлен в `.opencode/package.json` | Добавьте зависимость и перезапустите OpenCode |
| Python-инструмент падает на Windows | Команды `python3` нет | Используйте `python` или выбирайте динамически по платформе |
| Имя инструмента совпало со встроенным | Свой инструмент перекрывает встроенный одноимённый | Для отключения встроенных используйте конфигурацию прав, а не перекрытие именем |

## Связанные материалы

- [Встроенные инструменты](17-tools.md) — список встроенных инструментов OpenCode
- [MCP-серверы](07a-mcp-basics.md) — интеграция внешних инструментов через MCP
- [Разработка плагинов](./12a-plugins-basics) — создание плагинов и определение инструментов
