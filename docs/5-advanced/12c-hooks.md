---
title: 5.12c Урок по хукам
subtitle: Хуки плагинов и конфигурации — полный разбор
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.12c"
duration: 25 минут
practice: 30 минут
level: Продвинутый
description: Системно изучите Hook в OpenCode (хуки плагинов и конфигурации), освойте подписку на события, перехват инструментов, переписывание параметров LLM и контроль разрешений.
tags:
  - Хуки
  - Hook
  - Плагины
  - Расширение
prerequisite:
  - 5.12a Основы плагинов
  - 5.12b Продвинутые плагины (рекомендуется сначала)
---

# Урок по хукам

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/hooks-notes.mini.jpeg"
     alt="Шпаргалка урока: хуки"
     data-zoom-src="/images/5-advanced/hooks-notes.jpeg" />

---

> 💡 **Коротко**: Hook — это «интерфейс расширения» OpenCode: выполняйте свою логику при наступлении событий или перехватывайте и меняйте данные в ключевых процессах.

---

## Что вы сможете после урока

> Только то, что получится сразу, без воды

- Знать, какие Hook поддерживает OpenCode (хуки плагинов / хуки конфигурации)
- Выбирать правильный Hook: прослушивание событий или перехват функций
- Писать типовые хуки: уведомления, аудит, блокировка по безопасности, настройка параметров, усиление сжатия контекста

---

## Ваша боль

> Если это про вас — урок для вас

- Хотите автоматически запускать скрипт после завершения сессии, но не знаете, где это настроить
- Хотите запретить AI читать чувствительные файлы, но не находите места для перехвата
- Слышите про «Hook», но не понимаете, при чём тут плагины
- Хотите автоматически подстраивать параметры LLM под разные Agent, но не знаете, с чего начать

---

## Когда это пригодится

> Нужно не каждый день, но когда нужно — очень выручает

- Когда вам надо:
  - Выполнять свою логику при наступлении событий (уведомления, логи, аудит)
  - Перехватывать вызовы инструментов, менять параметры или запрещать выполнение
  - Менять параметры вызова LLM (температура, top_p и т. д.)
  - Задавать собственную логику решений о разрешениях
  - Обогащать контекст при сжатии сессии
- И при этом не хочется:
  - Менять исходный код OpenCode
  - Каждый раз делать это вручную

---

## 🎒 Подготовка

> Убедитесь, что всё ниже выполнено, иначе сначала доделайте

- [ ] Пройден [5.12a Основы плагинов](./12a-plugins-basics)
- [ ] Пройден [5.12b Продвинутые плагины](./12b-plugins-advanced) (рекомендуется)
- [ ] Есть работающий проект в OpenCode
- [ ] Есть доступ к `~/.config/opencode/` или к папке `.opencode/` в проекте

---

## Ключевая идея

> Сначала «как думать», без команд

- Hook — это по сути набор «подключаемых функций обратного вызова»
- OpenCode вызывает Hook в определённые моменты и передаёт управление вам
- Есть два пути подключить Hook:
  - **Хук плагина**: пишете код, возвращаете объект hooks (мощнее и гибче)
  - **Хук конфигурации**: прописываете команды в `opencode.json` (проще, но возможности ограничены)
- Событийный Hook пассивно слушает и ничего не меняет (логи, уведомления)
- Функциональный Hook активно перехватывает и может менять данные (переписывание параметров, контроль разрешений)

---

### 🆕 Новые хуки в v1.1.65

| Hook | Описание | Назначение |
|-----|------|------|
| `tool.definition` | Изменение определения инструмента | Свои описания инструментов, настройка Schema параметров |
| `command.execute.before` | Перехват перед выполнением команды | Изменение параметров команды, добавление логов |
| `shell.env` | Перед выполнением Shell | Внедрение переменных окружения |

---

## Делаем вместе

> Шаг за шагом, в расчёте на ошибки

### Шаг 1: создайте свой первый хук плагина

**Зачем**
Сначала сделаем простейшее уведомление о завершении сессии и проверим, что весь процесс работает.

```bash
# Создайте файл плагина в каталоге проекта
mkdir -p .opencode/plugin
```

```ts
// .opencode/plugin/notify.ts
import type { Plugin } from "@opencode-ai/plugin"

export const NotifyPlugin: Plugin = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Сессия завершена" with title "OpenCode"'`
      }
    },
  }
}
```

**Что вы должны увидеть**:
OpenCode загрузит этот плагин при запуске, а после завершения сессии покажет уведомление.

---

### Шаг 2: блокировка чувствительных файлов

<AdInArticle />

**Зачем**
Перехватим вызовы инструментов хуком `tool.execute.before`, чтобы запретить AI читать чувствительные файлы.

```ts
// .opencode/plugin/guard.ts
import type { Plugin } from "@opencode-ai/plugin"

export const GuardPlugin: Plugin = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "read") return

      const filePath = String(output.args.filePath)
      const sensitivePatterns = [".env", ".pem", ".key", "credentials"]

      for (const pattern of sensitivePatterns) {
        if (filePath.includes(pattern)) {
          throw new Error(`Политика безопасности: запрещено читать чувствительный файл: ${filePath}`)
        }
      }
    },
  }
}
```

**Что вы должны увидеть**:
Если попросить AI прочитать файл `.env`, будет выброшена ошибка и выполнение остановится.

---

### Шаг 3: настройка параметров LLM под Agent

**Зачем**
Разным сценариям нужны разные параметры — будем подстраивать их автоматически хуком `chat.params`.

```ts
// .opencode/plugin/params.ts
import type { Plugin } from "@opencode-ai/plugin"

export const ParamsPlugin: Plugin = async () => {
  return {
    "chat.params": async (input, output) => {
      // Генерации кода нужен более детерминированный вывод
      if (input.agent === "code") {
        output.temperature = 0.2
      }

      // Планированию пригодится больше креативности
      if (input.agent === "plan") {
        output.temperature = 0.7
      }

      // Добавляем собственный заголовок трассировки
      output.options["X-Trace-Session"] = input.sessionID
    },
  }
}
```

**Что вы должны увидеть**:
Параметры LLM автоматически меняются от сессии к сессии в зависимости от Agent.

---

### Шаг 4: автоматические решения по запросам разрешений

**Зачем**
Уменьшим число ручных подтверждений: безопасные операции одобряем автоматически.

```ts
// .opencode/plugin/auto-permit.ts
import type { Plugin } from "@opencode-ai/plugin"

export const AutoPermitPlugin: Plugin = async () => {
  return {
    "permission.ask": async (input, output) => {
      // Операции чтения разрешаем автоматически
      if (input.tool === "read") {
        output.status = "allow"
        return
      }

      // Опасные команды запрещаем автоматически
      if (input.tool === "bash" && String(input.metadata?.command).includes("rm -rf")) {
        output.status = "deny"
        return
      }

      // Остальное по-прежнему спрашиваем
      output.status = "ask"
    },
  }
}
```

**Что вы должны увидеть**:
Чтение файлов больше не показывает запросы разрешений, а команды удаления блокируются.

---

### Шаг 5: обогащение контекста при сжатии сессии

**Зачем**
Когда диалог становится слишком длинным и требует сжатия, внедрим ключевую информацию о проекте.

```ts
// .opencode/plugin/compaction.ts
import type { Plugin } from "@opencode-ai/plugin"

export const CompactionPlugin: Plugin = async () => {
  return {
    "experimental.session.compacting": async (input, output) => {
      output.context.push(`
## Ключевая информация о проекте
- Изменяемые файлы: src/**
- Ключевые ограничения: запрещено читать .env и файлы ключей
- Текущая задача: написать урок по хукам и добавить его в боковую панель
- Важное решение: используем строгий режим TypeScript
`)
    },
  }
}
```

**Что вы должны увидеть**:
После сжатия диалога контекст будет содержать вашу дополнительную информацию.

---

### Шаг 6: изменение определения инструментов (v1.1.65+)

**Зачем**
Иногда нужно поменять описание инструмента или Schema параметров — чтобы AI лучше понимал назначение инструмента или чтобы добавить ограничения.

```ts
// .opencode/plugin/tool-definition.ts
import type { Plugin } from "@opencode-ai/plugin"

export const ToolDefinitionPlugin: Plugin = async () => {
  return {
    "tool.definition": async (input, output) => {
      // Добавим русское описание для инструмента read
      if (input.toolID === "read") {
        output.description = "Читает содержимое файла. Поддерживает текстовые файлы и картинки. Путь должен быть абсолютным."
      }

      // Добавим предупреждение о безопасности для bash
      if (input.toolID === "bash") {
        output.description += "\n\n⚠️ Внимание: опасные команды (например, rm -rf) требуют подтверждения пользователя."
      }

      // Меняем Schema параметров (например, добавляем значения по умолчанию или ограничения)
      if (input.toolID === "write" && output.parameters?.properties?.filePath) {
        output.parameters.properties.filePath.description = "Абсолютный путь к файлу, должен начинаться с /"
      }
    },
  }
}
```

**Что вы должны увидеть**:
При вызове инструментов AI будет использовать изменённые описания и определения параметров.

---

## Контрольные точки ✅

> Дальше — только когда всё пройдено; если что-то не сработало, вернитесь к нужному шагу

- [ ] Файлы плагинов лежат в каталоге `.opencode/plugin/`
- [ ] OpenCode загрузил плагины при запуске (смотрите стартовый лог)
- [ ] После завершения сессии пришло уведомление
- [ ] Попытка прочитать `.env` выбросила ошибку
- [ ] Параметры меняются от сессии к сессии в зависимости от Agent
- [ ] Запросы разрешений ведут себя как задумано
- [ ] (v1.1.65+) Определение инструментов успешно изменено

---

## Где обычно спотыкаются

> Здесь застревают 80% людей

| Симптом | Причина | Решение |
|-----|-----|-----|
| Плагин не загрузился | Неправильное расширение файла | Проверьте, что это файл `.ts` или `.js` |
| Изменения `output` не действуют | Вернули новый объект вместо изменения исходного | Меняйте напрямую: `output.xxx = ...` |
| Событие не срабатывает | Опечатка в `event.type` | Пользуйтесь подсказками типов TypeScript |
| Экспериментальный Hook перестал работать | После обновления версии API изменился | Смотрите журнал изменений и правьте код |
| Хук конфигурации не действует | Возможно, логика выполнения не реализована | Лучше используйте хуки плагинов |
| Конфликт нескольких плагинов | Hook определён повторно | Проверьте, нет ли дублирующихся реализаций Hook |

---

## Итоги урока

Вы научились:

1. Понимать два типа Hook (хуки плагинов / хуки конфигурации)
2. Выбирать подходящий тип Hook под задачу
3. Реализовывать типовые сценарии (уведомления, перехват, настройка параметров, разрешения, сжатие)
4. Следовать лучшим практикам написания Hook

---

## Что дальше

> На следующем уроке будем делать собственные инструменты — пригодятся хуки и знания о плагинах из этого урока.

---

## Шпаргалка: частые хуки

> 10 хуков, которые чаще всего нужны в разработке, — для быстрого поиска

| Hook | Когда срабатывает | Назначение | Можно ли менять данные |
|-----|---------|------|---------------|
| `event` | Все события | Общая подписка: логи/уведомления/статистика | ❌ |
| `config` | После загрузки конфигурации | Инициализация плагина, изменение конфигурации | ✅ |
| `tool.execute.before` | Перед выполнением инструмента | Перехват/изменение параметров, запрет выполнения | ✅ |
| `tool.execute.after` | После выполнения инструмента | Запись результата, изменение вывода | ✅ |
| `chat.message` | При получении нового сообщения | Запись/изменение содержимого сообщений | ✅ |
| `chat.params` | Перед вызовом LLM | Изменение температуры/Top-P/Top-K | ✅ |
| `permission.ask` | При запросе разрешения | Автоматическое разрешение/запрет | ✅ |
| `tool` | Регистрация инструмента | Добавление собственных инструментов | - |
| `experimental.session.compacting` | Перед сжатием сессии | Внедрение ключевой информации о проекте | ✅ |
| `tool.definition` | При регистрации инструмента | Изменение описания/параметров инструмента | ✅ |
| `command.execute.before` | Перед выполнением команды | Перехват/изменение параметров команды | ✅ |
| `shell.env` | Перед выполнением Shell | Внедрение переменных окружения | ✅ |
| `auth` | Процесс аутентификации | Свой способ аутентификации | - |

---

## Шпаргалка: частые события

> 10 событий, которые чаще всего нужны в разработке, — для быстрого поиска

| Событие | Описание | Для чего в Hook |
|-----|------|-----------|
| `session.idle` | Сессия завершена (простой) | Уведомления, очистка ресурсов, замер времени |
| `session.created` | Создана новая сессия | Инициализация состояния сессии |
| `file.edited` | Файл отредактирован | Запуск форматирования, запуск сборки |
| `message.updated` | Сообщение обновлено | Запись истории диалога, статистика |
| `tool.execute.after` | После выполнения инструмента | Логи, аудит |
| `tool.execute.before` | Перед выполнением инструмента | Проверка параметров, проверка разрешений |
| `permission.replied` | Пользователь ответил на запрос разрешения | Запись решений о разрешениях |
| `command.executed` | После выполнения команды | Аудит команд |
| `session.error` | Ошибка сессии | Отчёты об ошибках, уведомления |
| `server.connected` | Подключение сервера | Уведомления о состоянии соединения |

---

## Приложение: исходный код для справки

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение в исходниках</strong></summary>

| Возможность | Путь к файлу | Строки |
|-----|---------|------|
| Определение типов Hook | [`packages/plugin/src/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/index.ts) | 148-231 |
| Определение хука `tool.definition` | [`packages/plugin/src/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/index.ts) | 227-230 |
| Вызов хука `tool.definition` | [`packages/opencode/src/tool/registry.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/registry.ts) | 157 |
| Логика загрузки плагинов | [`packages/opencode/src/plugin/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/plugin/index.ts) | 20-82 |
| Сканирование каталога плагинов | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts) | 322-335 |
| Логика дедупликации плагинов | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts) | 369-387 |
| Schema хуков конфигурации | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts) | 1009-1030 |

**Ключевые фрагменты кода**:

```typescript
// Определение типов Hook
export interface Hooks {
  event?: (input: { event: Event }) => Promise<void>
  config?: (input: Config) => Promise<void>
  tool?: { [key: string]: ToolDefinition }
  auth?: AuthHook
  "chat.message"?: (input: {...}, output: {...}) => Promise<void>
  "chat.params"?: (input: {...}, output: {...}) => Promise<void>
  "permission.ask"?: (input: Permission, output: {...}) => Promise<void>
  "tool.execute.before"?: (input: {...}, output: {...}) => Promise<void>
  "tool.execute.after"?: (input: {...}, output: {...}) => Promise<void>
  "command.execute.before"?: (input: { command: string; sessionID: string; arguments: string }, output: {...}) => Promise<void>
  "shell.env"?: (input: { cwd: string }, output: { env: Record<string, string> }) => Promise<void>
  "tool.definition"?: (input: { toolID: string }, output: { description: string; parameters: any }) => Promise<void>
  "experimental.chat.messages.transform"?: (input: {}, output: {...}) => Promise<void>
  "experimental.chat.system.transform"?: (input: {}, output: {...}) => Promise<void>
  "experimental.session.compacting"?: (input: {...}, output: {...}) => Promise<void>
  "experimental.text.complete"?: (input: {...}, output: {...}) => Promise<void>
}

// Запуск плагинов
export async function trigger<Name extends keyof Required<Hooks>>(name: Name, input: Input, output: Output): Promise<Output> {
  if (!name) return output
  for (const hook of await state().then((x) => x.hooks)) {
    const fn = hook[name]
    if (!fn) continue
    await fn(input, output)
  }
  return output
}
```

</details>
