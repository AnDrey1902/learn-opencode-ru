---
title: C4 Скрипты автоматизации
subtitle: Освобождение от рутины
course: Практический курс OpenCode на русском языке
stage: Этап 4
lesson: "C4"
duration: 20 минут
practice: 25 минут
level: Продвинутый
description: Пишите с AI скрипты автоматизации и задачи по расписанию, освобождайтесь от рутины и растите офисную эффективность.
tags:
  - Автоматизация
  - Скрипты
  - Задачи по расписанию
prerequisite:
  - C1 Порядок в файлах
---

# C4 Скрипты автоматизации

> 💡 **Коротко**: упакуйте повторяющиеся процессы в «команды + скрипты» — переиспользуйте в один шаг.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/4-scenarios/office-automation-notes.mini.jpeg"
     alt="Шпаргалка урока: C4 Скрипты автоматизации"
     data-zoom-src="/images/4-scenarios/office-automation-notes.jpeg" />

---

## Что вы сможете после урока

- Распознавать повторяющиеся задачи под автоматизацию
- Упаковывать задачи в переиспользуемые «пользовательские команды»
- Просить AI генерировать и дорабатывать скрипты
- Связывать автоматизацию через CLI

---

## С какими трудностями вы столкнулись

- Каждый день одна и та же рутина — уходит время
- Хотите автоматизировать скриптом, но не программируете
- Хочется «запуск в один шаг», а приходится каждый раз заново описывать задачу

---

## Когда это пригодится

- Когда нужно: заставить компьютер автоматически делать рутину
- И не хочется: каждый день вручную повторять одно и то же

---

## 🎒 Перед началом

> Убедитесь, что выполнены следующие условия:

- [ ] Пройден урок [C1 Порядок в файлах](./office-files)
- [ ] Есть повторяющаяся задача под автоматизацию

---

## Основная идея

### Как распознать шанс автоматизации

| Признак | Пример |
|-----|------|
| Повторяемость | Ежедневный разбор файлов счетов |
| Ясные правила | Раскладка по месяцам |
| Долго, но просто | Пакетное переименование |
| Легко ошибиться | Ручное копирование, пропуски шагов |

### Уровни автоматизации

```
Ручные действия → команда в один шаг → скрипт → (необязательно) внешний планировщик
```

### Доступные инструменты и функции (OpenCode)

| Инструмент/функция | Назначение | Ключевые пояснения (проверяемо) |
|-----------|------|------------------|
| Пользовательские команды (Custom Commands) | Упаковка «шаблона промпта» в `/имя-команды` | Шаблон команды берётся из содержимого Markdown-файла (официально: `opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34`; исходники: `opencode/packages/opencode/src/config/config.ts:214`～`opencode/packages/opencode/src/config/config.ts:218`) |
| Параметры команд | Передача аргументов команде | `$ARGUMENTS` / `$1` / `$2`… (официально: `opencode/packages/web/src/content/docs/commands.mdx:111`～`opencode/packages/web/src/content/docs/commands.mdx:161`) |
| Встраивание вывода shell в команду | Подстановка вывода ``!`cmd` `` в промпт | Синтаксис ``!`command` `` (официально: `opencode/packages/web/src/content/docs/commands.mdx:164`～`opencode/packages/web/src/content/docs/commands.mdx:179`; исходники: `opencode/packages/opencode/src/config/markdown.ts:7`～`opencode/packages/opencode/src/config/markdown.ts:15`) |
| Ссылки на файлы в команде | Подстановка содержимого через `@path/to/file` | Синтаксис `@...` (официально: `opencode/packages/web/src/content/docs/commands.mdx:198`～`opencode/packages/web/src/content/docs/commands.mdx:212`; исходники: `opencode/packages/opencode/src/config/markdown.ts:6`～`opencode/packages/opencode/src/config/markdown.ts:12`) |
| `opencode run` | Неинтерактивный запуск (удобно для скриптов и конвейеров) | CLI поддерживает `opencode run [message..]` (официально: `opencode/packages/web/src/content/docs/cli.mdx:311`～`opencode/packages/web/src/content/docs/cli.mdx:350`) |
| MCP-серверы | Подключение внешних инструментов (базы данных, API, поиск) | Инструменты MCP становятся доступны автоматически, но занимают контекст (официально: `opencode/packages/web/src/content/docs/mcp-servers.mdx:8`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:21`) |
| `/compact` | Сжатие сессии, меньше лишнего вывода инструментов | Алиас `/summarize`; горячие клавиши `ctrl+x c` (официально: `opencode/packages/web/src/content/docs/tui.mdx:82`～`opencode/packages/web/src/content/docs/tui.mdx:90`) |

---

## Повторите за мной

<AdInArticle />

### Шаг 1: опишите повторяющуюся задачу (сначала «правила», потом «выполнение»)

**Зачем**
Автоматизация больше всего боится «мутных правил». Опишите процесс так, чтобы его могла выполнить машина.

```
Каждый день я делаю одну и ту же рутину:
1. Перенести PDF со счетами из каталога загрузок в Финансы/Счета/
2. Создавать подкаталоги по месяцам (например, 2025-01/)
3. Переименовывать в формат «Счёт_дата_сумма.pdf»

Сначала сделайте две вещи:
A) Чётко пропишите правила (откуда дата, откуда сумма, как разруливать конфликты)
B) Предложите схему «сначала предпросмотр, потом выполнение»
```

### Шаг 2: зафиксируйте процесс в «пользовательской команде»

**Зачем**
Не хочется каждый раз переписывать огромный промпт.

#### Способ 1: файл Markdown-команды (рекомендуется)

> Расположение файлов команд (официально):

- На уровне проекта: `.opencode/command/`
- Глобально: `~/.config/opencode/command/`

(официально: `opencode/packages/web/src/content/docs/commands.mdx:80`～`opencode/packages/web/src/content/docs/commands.mdx:84`)

Создайте `.opencode/command/organize-invoices.md`:

```markdown
---
description: Разбор счетов (раскладка + переименование)
agent: build
model: anthropic/claude-opus-4-5-thinking
---

Разложи PDF со счетами из каталога $1 в $2:

Требования:
1. Сначала выведи список «операций к выполнению» (перемещения и переименования), не выполняй сразу
2. Выполнишь после моего подтверждения

Подсказка: сегодняшняя дата — !`date +%Y-%m-%d`
```

Запуск команды:

```text
/organize-invoices ~/Downloads ~/Documents/Финансы/Счета
```

> Пояснения:
> - «Содержимое» файла команды и есть шаблон (официально: `opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34`).
> - Конструкция ``!`date ...` `` подставляет вывод команды в промпт (официально: `opencode/packages/web/src/content/docs/commands.mdx:164`～`opencode/packages/web/src/content/docs/commands.mdx:179`).

#### Способ 2: команда через JSONC в `opencode.json`

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "organize-invoices": {
      "template": "Разложи PDF со счетами из каталога $1 в $2:\n\nТребования:\n1. Сначала выведи список операций (перемещения и переименования), не выполняй сразу\n2. Выполнишь после моего подтверждения\n",
      "description": "Разбор счетов (раскладка + переименование)",
      "agent": "build",
      "model": "anthropic/claude-opus-4-5-thinking",
      "subtask": true
    }
  }
}
```

> Пояснения:
> - `command.<name>.template` обязателен (официально: `opencode/packages/web/src/content/docs/commands.mdx:221`～`opencode/packages/web/src/content/docs/commands.mdx:236`).
> - `description/agent/model/subtask` — всё необязательное (исходники: `opencode/packages/opencode/src/config/config.ts:49`～`opencode/packages/opencode/src/config/config.ts:55`; официально: `opencode/packages/web/src/content/docs/commands.mdx:57`～`opencode/packages/web/src/content/docs/commands.mdx:66`).
> - `subtask: true` принудительно ведёт через subagent (официально: `opencode/packages/web/src/content/docs/commands.mdx:77`～`opencode/packages/web/src/content/docs/commands.mdx:93`).

### Шаг 3: скрипт пусть пишет AI, но требуйте тестируемость

**Зачем**
Скрипты автоматизации страшнее всего «написал раз — и сразу в бой». Нужны тесты, переиспользование и итерации.

```
По правилам выше создай скрипт scripts/organize_invoices.py:
1. Сканируй исходный каталог в поисках PDF
2. Разбирай дату и сумму (если не разбирается — тоже дай стратегию)
3. Создавай целевую структуру каталогов
4. Пиши подробный лог (что с каждым файлом сделано)

Требования:
- Сделай и «режим предпросмотра (dry-run)», и «боевой режим»
- Дай мне одну минимальную запускаемую команду
```

### Шаг 4: подключите автоматизацию к «скриптовым вызовам» через CLI

**Зачем**
Возможно, захотите дёргать те же промпты из терминальных скриптов или конвейеров.

OpenCode CLI умеет неинтерактивный запуск:

```bash
opencode run "Проверь дизайн параметров scripts/organize_invoices.py и предложи улучшения"
```

(официально: `opencode/packages/web/src/content/docs/cli.mdx:311`～`opencode/packages/web/src/content/docs/cli.mdx:350`)

---

## Продвинутое: расширение возможностей

### MCP-серверы (необязательно)

MCP подключает к OpenCode внешние инструменты. После настройки инструменты MCP автоматически появляются в списке доступных (официально: `opencode/packages/web/src/content/docs/mcp-servers.mdx:8`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:9`).

**Пример: тестовый локальный MCP** (официальный пример: `@modelcontextprotocol/server-everything`):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"]
    }
  }
}
```

(официально: `opencode/packages/web/src/content/docs/mcp-servers.mdx:70`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:82`)

::: tip Приём
- MCP занимает контекст; чем больше инструментов, тем легче упереться в лимит (официально: `opencode/packages/web/src/content/docs/mcp-servers.mdx:14`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:21`).
- Через `enabled: false` можно временно отключить отдельный server (официально: `opencode/packages/web/src/content/docs/mcp-servers.mdx:43`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:44`).
:::

### Держите сессию «лёгкой» через /compact

```
/compact
```

- Алиас: `/summarize`
- Горячие клавиши: `ctrl+x c`

(официально: `opencode/packages/web/src/content/docs/tui.mdx:82`～`opencode/packages/web/src/content/docs/tui.mdx:90`)

### Подстановки env/file в конфиге (заодно исправляем написание provider.apiKey)

OpenCode поддерживает `{env:VAR}` и `{file:path}` (официально: `opencode/packages/web/src/content/docs/config.mdx:75`～`opencode/packages/web/src/content/docs/config.mdx:95`).

На примере `anthropic`: `apiKey` лежит в `provider.<id>.options.apiKey`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  },
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

(официально: `opencode/packages/web/src/content/docs/config.mdx:170`～`opencode/packages/web/src/content/docs/config.mdx:181`; исходники: `opencode/packages/opencode/src/config/config.ts:740`～`opencode/packages/opencode/src/config/config.ts:763`)

---

## Контрольные пункты ✅

> Продолжайте, только когда всё выполнено

- [ ] Нашли задачу под автоматизацию
- [ ] Зафиксировали процесс в пользовательской команде (Markdown или JSON)
- [ ] Сгенерировали тестируемый скрипт (с поддержкой dry-run)
- [ ] Знаете скриптовые вызовы через `opencode run`

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Пользовательская команда выполняется «как будто не сработала» | Шаблон написан во frontmatter, а не в теле | Телом файла команды и является шаблон (официально: `opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34`) |
| Пользовательская команда совпала по имени со встроенной | Перекрывает встроенную | Не называйте как `/init`, `/share` и т. п. (официально: `opencode/packages/web/src/content/docs/commands.mdx:319`～`opencode/packages/web/src/content/docs/commands.mdx:323`) |
| Вывод ``!`cmd` `` в команде не тот, что ждали | Команда выполняется в корне проекта | Пути пишите от корня проекта или явно указывайте каталог в шаблоне (официально: `opencode/packages/web/src/content/docs/commands.mdx:194`～`opencode/packages/web/src/content/docs/commands.mdx:195`) |
| `apiKey` провайдера не применяется | Написали `provider.<id>.apiKey` | По схеме кладите в `provider.<id>.options.apiKey` (исходники: `opencode/packages/opencode/src/config/config.ts:740`～`opencode/packages/opencode/src/config/config.ts:763`) |

---

## Индекс доказательств (поведение OpenCode в уроке)

| Тема | Вывод | Доказательство |
|---|---|---|
| Источник шаблона команды | Шаблоном является тело Markdown | `opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34` |
| Плейсхолдеры параметров команды | Поддерживаются `$ARGUMENTS` и `$1...` | `opencode/packages/web/src/content/docs/commands.mdx:111`～`opencode/packages/web/src/content/docs/commands.mdx:161` |
| Shell в команде | Поддерживается ``!`command` `` | `opencode/packages/web/src/content/docs/commands.mdx:164`～`opencode/packages/web/src/content/docs/commands.mdx:179` |
| Автоматизация через CLI | Поддерживается `opencode run` | `opencode/packages/web/src/content/docs/cli.mdx:311`～`opencode/packages/web/src/content/docs/cli.mdx:350` |
| Возможности MCP | Инструменты MCP доступны автоматически, но растят контекст | `opencode/packages/web/src/content/docs/mcp-servers.mdx:8`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:21` |

---

## Итоги урока

Вы научились:

1. Распознавать повторяющиеся задачи под автоматизацию
2. Фиксировать процессы пользовательскими командами
3. Просить AI генерировать тестируемые скрипты
4. Связывать автоматизацию через CLI

🎉 **Поздравляем с прохождением всей линии эффективности!**

---

## Что дальше

- Хотите глубже в настройку? → [Этап 5: глубокая настройка](/5-advanced/)
- Хотите попробовать другие сценарии? → [Авторская линия](/4-scenarios/writer-workflow) или [линия программиста](/4-scenarios/coder-daily)
