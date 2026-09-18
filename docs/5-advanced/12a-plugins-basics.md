---
title: 5.12a Основы плагинов
subtitle: Расширение функций через хуки
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.12a"
duration: 20 минут
practice: 25 минут
level: Продвинутый
description: Изучите основы плагинов OpenCode, расширяйте функции через механизм хуков, устанавливайте и настраивайте плагины.
tags:
  - Плагины
  - Хуки
  - Расширения
prerequisite:
  - 5.1 Всё о конфигурации
---

# Основы плагинов

> 💡 **Коротко**: плагины расширяют функции OpenCode через механизм хуков.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/plugins-basics-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.12a Основы плагинов"
     data-zoom-src="/images/5-advanced/plugins-basics-notes.jpeg" />

---

## Что вы сможете после урока

- Устанавливать и настраивать плагины (npm-пакеты и локальные)
- Подключать плагины в локальной разработке (способом абсолютных путей)
- Создавать простые локальные плагины
- Понимать механизм загрузки плагинов и нормы экспорта
- Отлаживать проблемы загрузки плагинов

---

## Что такое плагины

Плагины — модули JavaScript/TypeScript, расширяющие OpenCode через механизм хуков. Вы можете:

- добавлять функции (свои инструменты, уведомления)
- интегрировать внешние сервисы (трекеры времени, мониторинг)
- менять поведение по умолчанию (перехватывать чтение файлов, менять параметры LLM)

Примеры плагинов сообщества — в разделе [Экосистема](../appendix/ecosystem#плагины).

---

## Использование плагинов

Плагины загружаются двумя способами:

### Загрузка из локальных файлов

Положите файлы JavaScript или TypeScript в каталог плагинов:

| Каталог | Область |
|------|--------|
| `.opencode/plugin/` | Плагины уровня проекта |
| `~/.config/opencode/plugin/` | Глобальные плагины |

Файлы `.js` и `.ts` в этих каталогах загружаются автоматически при старте.

### Загрузка из npm

<AdInArticle />

Укажите npm-пакеты в конфиге:

```jsonc
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "opencode-helicone-session",
    "opencode-wakatime",
    "@my-org/custom-plugin"
  ]
}
```

Поддерживаются обычные пакеты и пакеты с областью (`@scope/package`).

### Загрузка из локального пути (режим разработки)

Если разрабатываете плагин локально, укажите в конфиге его абсолютный путь напрямую:

```jsonc
// opencode.json
{
  "plugin": [
    "/home/user/my-plugins/custom-tool/dist/index.js"
  ]
}
```

**Обратите внимание**:
- Используйте **абсолютный путь** к скомпилированному `.js`-файлу
- Префикс `file://` **не нужен**
- Путь ведёт к **конкретному .js-файлу**, а не к каталогу

| ❌ Неверно | ✅ Верно |
|-----------|-----------|
| `"file:///home/user/my-plugin"` | `"/home/user/my-plugin/dist/index.js"` |
| `"/home/user/my-plugin"` | `"/home/user/my-plugin/dist/index.js"` |
| `"/home/user/my-plugin/dist"` | `"/home/user/my-plugin/dist/index.js"` |

---

## Механизм установки плагинов

### npm-плагины

При старте устанавливаются автоматически через Bun. Пакеты и их зависимости кэшируются в:

```
~/.cache/opencode/node_modules/
```

### Локальные плагины

Загружаются прямо из каталога плагинов. Для использования внешних npm-пакетов создайте `package.json` в каталоге конфигурации:

```jsonc
// .opencode/package.json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

При старте OpenCode выполнит `bun install` и установит эти зависимости.

### Встроенные плагины

В OpenCode два встроенных плагина (отключаются через `OPENCODE_DISABLE_DEFAULT_PLUGINS=1`):

| Плагин | Функция |
|------|------|
| `opencode-copilot-auth` | Аутентификация GitHub Copilot |
| `opencode-anthropic-auth` | Аутентификация Anthropic |

---

## Порядок загрузки

Плагины грузятся из всех источников, хуки выполняются в порядке:

1. Глобальная конфигурация (`~/.config/opencode/opencode.json`)
2. Конфигурация проекта (`opencode.json`)
3. Глобальный каталог плагинов (`~/.config/opencode/plugin/`)
4. Проектный каталог плагинов (`.opencode/plugin/`)

**Правила дедупликации**:
- Одноимённые npm-пакеты одной версии грузятся один раз
- Локальный плагин и одноимённый npm-плагин грузятся раздельно
- Одинаковые функции из одного модуля инициализируются один раз (защита от дублей `export default` и именованных экспортов)

---

## Создание плагинов

Плагин — модуль, экспортирующий функцию плагина. Каждая функция принимает объект контекста и возвращает объект хуков.

### Базовая структура

```js
// .opencode/plugin/example.js
export const MyPlugin = async ({ project, client, $, directory, worktree, serverUrl }) => {
  console.log("Plugin initialized!")

  return {
    // Реализация хуков
  }
}
```

### Параметры контекста плагина

| Параметр | Тип | Описание |
|------|------|------|
| `project` | `Project` | Информация о текущем проекте |
| `directory` | `string` | Текущий рабочий каталог |
| `worktree` | `string` | Путь Git worktree |
| `client` | `OpencodeClient` | SDK-клиент OpenCode для общения с AI |
| `$` | `BunShell` | [shell API](https://bun.sh/docs/runtime/shell) Bun для выполнения команд |
| `serverUrl` | `URL` | URL сервера OpenCode (например, `http://localhost:4096`) |

### Поддержка TypeScript

Для TypeScript импортируйте типы из пакета плагинов:

```ts
// .opencode/plugin/my-plugin.ts
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree, serverUrl }) => {
  return {
    // Типобезопасная реализация хуков
  }
}
```

Пакет плагинов автоматически установится при старте в `.opencode/node_modules/`.

### Нормы экспорта плагинов (важно!)

Плагин **обязан экспортировать только default-функцию**, никаких других переменных и функций:

```ts
// ✅ Верно: только default-экспорт
export default MyPlugin;

// ❌ Неверно: заодно экспортировано другое
export default MyPlugin;
export { getConfig, DEFAULT_CONFIG };  // Приведёт к ошибке загрузки!
```

**Почему**: OpenCode вызывает **все экспорты** модуля как функции плагинов. Нефункциональные экспорты (объекты, константы) упадут с ошибкой:

```
ERROR: fn is not a function. (In 'fn(input)', 'fn' is an instance of Object)
```

Если конфиги или утилиты плагина нужны снаружи:
- вынесите их экспорты в отдельные файлы
- или динамически регистрируйте через хук `config` плагина

---

## Простой пример

### Отправка уведомлений

Уведомление в системе по завершении сессии:

```js
// .opencode/plugin/notification.js
export const NotificationPlugin = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session completed!" with title "OpenCode"'`
      }
    },
  }
}
```

> Если пользуетесь десктопным приложением OpenCode, оно само присылает системные уведомления о готовности ответа или ошибке сессии.

### Защита .env-файлов

Запрет чтения `.env`-файлов для OpenCode:

```js
// .opencode/plugin/env-protection.js
export const EnvProtection = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
```

### Логирование

Вместо `console.log` используйте `client.app.log()` для структурированных логов:

```ts
// .opencode/plugin/my-plugin.ts
export const MyPlugin = async ({ client }) => {
  await client.app.log({
    service: "my-plugin",
    level: "info",
    message: "Plugin initialized",
    extra: { foo: "bar" },
  })

  return {}
}
```

Уровни логов: `debug`, `info`, `warn`, `error`.

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Плагин не загрузился | Неверное расширение файла | Убедитесь, что файл `.js` или `.ts` |
| Зависимости не находятся | Нет package.json | Добавьте `package.json` в каталог `.opencode/` |
| Ошибка типов TypeScript | Пакет плагинов не установлен | OpenCode установит сам при старте, или вручную `bun add @opencode-ai/plugin` |
| Плагин выполняется дважды | Одновременно npm- и локальный плагин | Проверьте дубли в конфиге и каталоге плагинов |
| Переменные окружения не действуют | Локальный плагин не видит внешние пакеты | Объявите зависимости в `.opencode/package.json` |
| `fn is not a function` | Плагин экспортировал несколько нефункциональных значений | Оставьте только `export default`, удалите остальные экспорты |
| Недействительный путь локального плагина | Ошибка в написании пути | Абсолютный путь к `.js`-файлу, не к каталогу |

### Отладка загрузки плагинов

Если плагин не работает — смотрите лог загрузки в debug-режиме:

```bash
# Логи загрузки плагинов и ошибок
opencode run "test" --log-level DEBUG --print-logs 2>&1 | grep -E "(plugin\|error)"
```

Пример нормального вывода загрузки:
```
INFO service=plugin path=file:///home/user/my-plugin/dist/index.js loading plugin
INFO service=tool.registry status=started my_custom_tool
INFO service=tool.registry status=completed my_custom_tool
```

Пример вывода при ошибке загрузки:
```
ERROR service=plugin path=file:///home/user/my-plugin/dist/index.js error=fn is not a function
```

---

## Итоги урока

Вы научились:

1. Трём способам загрузки плагинов (локальный каталог / локальный путь / npm-пакет)
2. Правильной настройке локальной разработки плагинов (абсолютный путь к .js-файлу)
3. Порядку загрузки плагинов и механизму дедупликации
4. Базовой структуре создания простых плагинов и нормам экспорта
5. Использованию хуков `event` и `tool.execute.before`
6. Методам отладки проблем загрузки

---

## Что дальше

→ [5.12b Продвинутые плагины](./12b-plugins-advanced) — все типы хуков и продвинутое использование
