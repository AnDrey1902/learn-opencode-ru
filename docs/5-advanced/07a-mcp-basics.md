---
title: 5.7a Основы MCP
subtitle: Подключение внешних сервисов для начинающих
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.7a"
duration: 15 минут
practice: 15 минут
level: Продвинутый
description: Подключайте внешние сервисы через MCP, чтобы AI вызывал базы данных, поисковики, мониторинги и любые другие инструменты.
tags:
  - MCP
  - Расширения
  - Внешние инструменты
prerequisite:
  - 5.1 Всё о конфигурации
---

# 5.7a Основы MCP

> 💡 **Коротко**: подключайте внешние сервисы через MCP (Model Context Protocol), чтобы AI вызывал базы данных, поисковики, мониторинги и любые другие инструменты.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/07a-mcp-basics-notes.mini.jpeg" alt="Шпаргалка урока: основы MCP" data-zoom-src="/images/5-advanced/07a-mcp-basics-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. MCP = Model Context Protocol — подключение AI к внешним сервисам (БД, поиск, мониторинг).
2. Поток: пользователь → OpenCode → AI → MCP-инструменты → MCP-сервер → результат.
3. Локальный MCP: `"type": "local"`, `command` — массив команд (npx), `environment`, `timeout`.
4. Удалённый MCP: `"type": "remote"`, `url`, `headers`, `oauth`.
5. 5 статусов: connected, disabled, failed, needs_auth, needs_cli.
6. Проверка: `opencode mcp list`.
7. Быстрый старт: локальный everything, поиск контекста context7, поиск кода gh_grep.
8. Использование: промпты «use context7 для React hooks», «use gh_grep для JWT».

</details>

---

## Что вы сможете после урока

- Понимать назначение и архитектуру протокола MCP
- Настраивать локальные MCP-серверы
- Настраивать удалённые MCP-серверы
- Смотреть состояние MCP-подключений

---

## С какими трудностями вы столкнулись

- AI работает только с локальными файлами, до внешних сервисов не дотягивается
- Хотите, чтобы AI смотрел логи Sentry, искал по документации, дёргал базы данных
- Слышали про MCP, но не знаете, как настроить и пользоваться

---

## Что такое MCP

MCP (Model Context Protocol) — стандартный протокол, через который AI вызывает внешние инструменты и сервисы.

**Главные понятия**:

- **MCP-сервер**: внешний процесс или удалённый сервис, предоставляющий инструменты
- **MCP-инструмент**: конкретная функция сервера (поиск, запрос, действие)
- **MCP-клиент**: встроенный в OpenCode коннектор

**Как это работает**:

```
Вопрос пользователя → OpenCode → AI решает вызвать MCP-инструмент → MCP-сервер выполняет → возвращает результат
```

### На что обратить внимание

- MCP-серверы растят расход контекста: чем больше инструментов, тем быстрее тратятся токены
- Отдельные MCP (вроде GitHub) добавляют массу токенов и легко упираются в лимит контекста
- Рекомендуем включать только нужные MCP-серверы

---

## Где лежит конфиг

OpenCode ищет конфиги в нескольких местах, **позже загруженный перекрывает ранее загруженный** (приоритет снизу вверх):

| Порядок загрузки | Место | Назначение |
|----------|------|------|
| 1 (низший) | `~/.config/opencode/opencode.json` | Глобальный конфиг, общий для всех проектов |
| 2 | `opencode.json` | Конфиг в корне проекта |
| 3 (высший) | `.opencode/opencode.json` | Конфиг уровня проекта (рекомендуется) |

::: tip Почему рекомендуем .opencode/opencode.json?
У него высший приоритет, он лежит в каталоге `.opencode/` аккуратнее и удобно ведётся вместе с остальными настройками (agents, commands).
:::

---

## Интерактивное добавление: opencode mcp add

Не хочется править JSON руками? Добавьте MCP интерактивной командой:

```bash
opencode mcp add
```

Действуйте по подсказкам:

```
? Location: (Use arrow keys)
❯ Current project
    /path/to/project/.opencode/opencode.json
  Global
    ~/.config/opencode/opencode.json

? MCP server name: filesystem

? Select MCP server type:
❯ Local
  Remote

? Enter command to run:
opencode x @modelcontextprotocol/server-filesystem /path/to/allowed/dir
```

> ⚠️ **Обратите внимание**: выбор места показывается только в Git-проектах. Вне Git-проекта запись сразу идёт в глобальный конфиг.

**Вы должны увидеть**:

```
✓ MCP server "filesystem" added successfully
```

---

## Локальные MCP-серверы

Локальные MCP-серверы работают на вашей машине и общаются через stdio.

### Как настроить

В `opencode.json` или `.opencode/opencode.json` в разделе `mcp`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-local-mcp": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "enabled": true,
      "environment": {
        "MY_ENV_VAR": "value"
      }
    }
  }
}
```

### Опции конфигурации

<AdInArticle />

| Опция | Тип | Обязат. | Описание |
|------|------|------|------|
| `type` | String | ✓ | Обязательно `"local"` |
| `command` | Array | ✓ | Массив команды, например `["npx", "-y", "xxx"]` или `["bun", "x", "xxx"]` |
| `cwd` | String | | Рабочий каталог MCP-процесса; относительные пути резолвятся от текущего workspace-каталога |
| `environment` | Object | | Пары ключ-значение переменных окружения |
| `enabled` | Boolean | | Включён ли, по умолчанию `true` |
| `timeout` | Number | | Тайм-аут подключения (миллисекунды), по умолчанию 30000 |

> ⚠️ **Обратите внимание**: официальная документация называет значением по умолчанию для timeout 2000+ms, но в исходниках значение по умолчанию — 30000ms (30 секунд). Источник: `mcp/index.ts:29`

Без заданного `cwd` локальный MCP-процесс работает прямо в текущем workspace-каталоге. Заданный относительный путь OpenCode резолвит от workspace-каталога; абсолютный используется как есть.

```jsonc
{
  "mcp": {
    "project-tools": {
      "type": "local",
      "command": ["npx", "-y", "my-project-mcp"],
      "cwd": "tools/mcp"
    }
  }
}
```

Исходники: [определение `cwd` в локальной конфигурации MCP](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/mcp.ts#L6-L23),[резолвинг относительно workspace](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/index.ts#L340-L357).

### Roots и согласование возможностей

При подключении к MCP-серверу OpenCode заявляет клиентскую возможность `roots`; когда сервер запрашивает roots, OpenCode возвращает `file://`-URI текущего workspace-каталога. Это не отдельная редактируемая настройка и не открывает автоматически произвольные каталоги.

Какие данные отдаёт сервер — определяют заявленные им capabilities. Например, инструменты обнаруживаются только при заявленной capability `tools`, а возможности ресурсов появляются только при заявленной `resources`. Не приравнивайте «успешное подключение» к поддержке сервером всех возможностей MCP.

Исходники: [клиентские capabilities](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/index.ts#L38-L50),[ответ roots](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/index.ts#L75-L80).

### Как пользоваться

После настройки добавьте в диалог подсказку, направляющую AI:

```
use the my-local-mcp tool to do something
```

---

## Удалённые MCP-серверы

Удалённые MCP-серверы подключаются по протоколу HTTP/SSE.

### Как настроить

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

### Опции конфигурации

| Опция | Тип | Обязат. | Описание |
|------|------|------|------|
| `type` | String | ✓ | Обязательно `"remote"` |
| `url` | String | ✓ | URL удалённого MCP-сервера |
| `enabled` | Boolean | | Включён ли, по умолчанию `true` |
| `headers` | Object | | Пользовательские заголовки запросов |
| `oauth` | Object/false | | Конфиг OAuth или отключение OAuth |
| `timeout` | Number | | Тайм-аут подключения (миллисекунды), по умолчанию 30000 |

---

## Состояние подключения

У MCP-подключения 5 состояний:

| Состояние | Описание |
|------|------|
| `connected` | Подключено, инструменты доступны |
| `disabled` | В конфиге `enabled: false`, не подключено |
| `failed` | Ошибка подключения, смотрите текст ошибки |
| `needs_auth` | Нужна OAuth-аутентификация |
| `needs_client_registration` | Нужна предрегистрация client ID |

Текущее состояние смотрите так:

```bash
opencode mcp list
```

---

## Быстрый старт на примерах

### Пример 1: локальный тестовый сервер

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"]
    }
  }
}
```

Проверка использования:

```
use the everything tool to add 3 and 4
```

### Пример 2: поиск по документации Context7

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

Проверка использования:

```
use context7: найди лучшие практики React hooks
```

### Пример 3: поиск кода через Grep

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

Проверка использования:

```
use the gh_grep tool: найди, как в Node.js реализовать проверку JWT
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Тайм-аут подключения MCP | Короткий `timeout` или медленная сеть | Увеличьте `timeout`, по умолчанию 30000ms |
| Локальный MCP не стартует | Команды нет или неверный путь | Проверьте массив `command` и PATH |
| Удалённый MCP не подключается | Неверный URL или сервер недоступен | Проверьте правильность URL и сеть |

---

## Итоги урока

Вы научились:

1. **Протоколу MCP**: стандартному протоколу подключения AI к внешним сервисам
2. **Местам конфигурации**: уровень проекта vs глобальный, общее для команды vs личное
3. **Интерактивному добавлению**: команда `opencode mcp add`
4. **Локальным MCP**: `type: "local"` + массив `command`
5. **Удалённым MCP**: `type: "remote"` + `url`
6. **Состояниям подключения**: 5 состояний и способ проверки

---

## Что дальше

- [5.7b MCP: продвинутый уровень](./07b-mcp-advanced) — OAuth-аутентификация, управление правами, больше примеров MCP

::: tip Возникли вопросы?
Конфиг MCP застрял? [Присоединяйтесь к сообществу](/community) — нас уже 2000+ человек: общение, ответы на вопросы в реальном времени.
:::
