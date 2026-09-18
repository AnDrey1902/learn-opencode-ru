---
title: 5.7b MCP — продвинутый уровень
subtitle: OAuth, управление правами и частые сервисы
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.7b"
duration: 20 минут
practice: 20 минут
level: Продвинутый
description: Изучите OAuth-аутентификацию MCP, управление правами и интеграцию частых сервисов — постройте безопасную систему расширений.
tags:
  - MCP
  - OAuth
  - Управление правами
prerequisite:
  - 5.7a Основы MCP
  - 5.5 Контроль прав
---

# 5.7b MCP — продвинутый уровень

> 💡 **Коротко**: освойте OAuth-аутентификацию, управление правами и настройку частых MCP-сервисов.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/07b-mcp-advanced-notes.mini.jpeg" alt="Шпаргалка урока: MCP — продвинутый уровень" data-zoom-src="/images/5-advanced/07b-mcp-advanced-notes.jpeg" />

---

## Что вы сможете после урока

- Подключать защищённые сервисы через OAuth-аутентификацию
- Управлять правами и состоянием включения MCP-инструментов
- Интегрировать MCP в файлы правил
- Настраивать частые MCP-сервисы

---

## OAuth-аутентификация

OpenCode автоматически отрабатывает OAuth-процесс:

1. Видит ответ 401 и запускает OAuth-процесс
2. Использует **динамическую регистрацию клиента (RFC 7591)** (если сервер поддерживает)
3. Безопасно хранит токены в `~/.local/share/opencode/mcp-auth.json`

### Автоаутентификация

В большинстве случаев особая настройка не нужна:

```jsonc
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

При первом использовании OpenCode сам предложит аутентификацию.

### Предрегистрация клиента

Если сервер не поддерживает динамическую регистрацию, задайте credentials клиента:

```jsonc
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### Команды управления

```bash
# Вручную запустить аутентификацию
opencode mcp auth my-oauth-server

# Посмотреть статус аутентификации всех серверов
opencode mcp auth list

# Список всех MCP-серверов
opencode mcp list

# Удалить сохранённые credentials
opencode mcp logout my-oauth-server

# Отладить подключение и OAuth-процесс
opencode mcp debug my-oauth-server
```

### Разбор команды debug

Когда с MCP-подключением проблемы — диагностируйте командой `debug`:

```bash
opencode mcp debug my-oauth-server
```

**Пример вывода**:

```
MCP OAuth Debug

Server: my-oauth-server
URL: https://mcp.example.com/mcp
Auth status: ✓ authenticated
  Access token: eyJhbGciOiJSUzI1NiIs...
  Expires: 2026-02-15T12:00:00.000Z
  Refresh token: present

Testing connection...
HTTP response: 200 OK
✓ Server responded successfully
```

**Что значат статусы**:

| Статус | Описание |
|------|------|
| `authenticated` | Аутентифицирован, можно нормально пользоваться |
| `expired` | Токен просрочен, нужна повторная аутентификация |
| `not authenticated` | Не аутентифицирован, выполните `opencode mcp auth` |

### Иконки состояния серверов

Что значат иконки в выводе `opencode mcp list`:

| Иконка | Состояние | Описание |
|------|------|------|
| ✓ | connected | Подключено, инструменты доступны |
| ○ | disabled | Отключено, `enabled: false` |
| ⚠ | needs_auth | Нужна OAuth-аутентификация |
| ✗ | failed | Ошибка подключения, смотрите текст ошибки |

**Пример вывода**:

```
MCP Servers

✓ filesystem connected
    npx -y @modelcontextprotocol/server-filesystem /projects
✓ context7 connected
    https://mcp.context7.com/mcp
○ disabled-server disabled
    npx -y some-command
✗ failed-server failed
    Connection timeout
```

### Отключение OAuth

Если сервер использует API-ключ вместо OAuth:

```jsonc
{
  "mcp": {
    "my-api-key-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

---

## Управление правами инструментов

<AdInArticle />

При регистрации MCP-инструменты именуются в формате `{имя-сервера}_{имя-инструмента}`.

### Глобальное отключение

Отключайте MCP-инструменты конфигом `permission`:

```jsonc
{
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    },
    "my-mcp-bar": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-bar"]
    }
  },
  "permission": {
    "my-mcp-foo_*": "deny"
  }
}
```

Пакетное отключение wildcard'ами:

```jsonc
{
  "permission": {
    "my-mcp*": "deny"
  }
}
```

### Включение для отдельных Agent

После глобального отключения включите в конкретном Agent:

```jsonc
{
  "mcp": {
    "my-mcp": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command"]
    }
  },
  "permission": {
    "my-mcp*": "deny"
  },
  "agent": {
    "my-agent": {
      "permission": {
        "my-mcp*": "allow"
      }
    }
  }
}
```

### Правила wildcard'ов

- `*` покрывает ноль и более любых символов
- `?` покрывает ровно один символ
- Остальные символы match'атся буквально

---

## Интеграция в файлы правил

В `AGENTS.md` или `.opencode/agents/*.md` настройте использование MCP по умолчанию:

```markdown
## Правила использования MCP

Когда нужно искать по документации — используй инструмент `context7`.

Когда не уверен, как реализовать функцию, — ищи примеры кода через `gh_grep`.
```

Так AI сам выберет подходящий MCP-инструмент без указаний в каждом промпте.

---

## Автообнаружение и обновление инструментов

### Правила именования инструментов

MCP-инструменты регистрируются в формате `{имя-сервера}_{имя-инструмента}`:

```
Инструмент read_file сервера filesystem → filesystem_read_file
Инструмент search сервера context7 → context7_search
```

Небуквенные, нецифровые символы (кроме подчеркивания и дефиса) в именах сервера и инструмента заменяются подчеркиванием. В `v1.18.22` действует старый формат выше; вариант `mcp__имя-сервера__имя-инструмента` мелькал лишь коротко в разработке, затем откачен — опирать на него конфиги прав и промпты нельзя.

Исходники: [текущие правила чистки и склейки имён инструментов](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/catalog.ts#L117-L119).

### Механизм автообнаружения

После настройки MCP-сервера OpenCode **автоматически обнаруживает** все предоставляемые сервером инструменты:

1. Подключается к MCP-серверу
2. Вызывает `listTools` для списка инструментов
3. Конвертирует инструменты в формат OpenCode
4. Добавляет в набор инструментов текущей сессии

### Уведомления об изменении инструментов

Если список инструментов MCP-сервера изменился (добавлены или удалены инструменты), OpenCode **автоматически получит уведомление и обновится**:

- Сервер шлёт уведомление об изменении списка (`notifications/tools/list_changed`)
- OpenCode перезапрашивает список инструментов
- Перезапуск OpenCode не нужен

Значит: после обновления версии MCP-сервера новые инструменты станут доступны сами.

### instructions серверов

MCP-сервер может вернуть instructions в результате инициализации. OpenCode добавляет instructions подключённых серверов в системный промпт; если сервер дал инструменты, но все они отключены правами текущего Agent или сессии, — этот текст не инжектится.

Исходники: [фильтрация прав и инжект instructions](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/system.ts#L119-L134).

### Resources и templates

Как только хотя бы один подключённый сервер заявит capability `resources`, OpenCode предоставляет три общих инструмента:

| Инструмент | Назначение |
|------|------|
| `list_mcp_resources` | Список ресурсов всех или указанного сервера |
| `list_mcp_resource_templates` | Шаблоны ресурсов с URI-параметрами |
| `read_mcp_resource` | Чтение ресурса по имени сервера и точному URI |

Ресурсами могут быть файлы, схемы баз данных или собственный контекст сервиса. Шаблон сначала заполняется параметрами URI, полученный URI отдаётся в `read_mcp_resource`. Интерфейс приложения тоже умеет подставлять MCP-ресурсы через `@`-дополнение.

Исходники: [имена инструментов](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L27-L31),[проверка capability ресурсов](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L136-L155),[templates](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L222-L245),[чтение ресурсов](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L305-L325),[дополнение ресурсов в приложении](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/app/src/components/prompt-input/slash-popover.tsx#L120-L163).

---

## Экспериментальный MCP Code Mode

Задайте переменную окружения и перезапустите OpenCode:

```bash
export OPENCODE_EXPERIMENTAL_CODE_MODE=true
```

Включённый флаг не гарантирует появление `execute`. Регистрируется `execute` лишь когда хотя бы один MCP-инструмент видим в правах текущего Agent и сессии; после включения обычные MCP-инструменты перестают торчать наружу по одному — их вызовы оркестрирует `execute`.

`execute` выполняет код ограниченного интерпретатора, а не обычный shell. Ему доступны только каталогизированные видимые MCP-инструменты, и каждый реальный MCP-вызов всё равно проходит проверку прав исходного инструмента. Подходит для оркестрации нескольких MCP-вызовов за раз, не подходит для запуска произвольных локальных программ и доступа к неразрешённым инструментам.

Исходники: [фильтрация видимых MCP-инструментов](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/code-mode.ts#L188-L212),[ограниченный рантайм](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/code-mode.ts#L239-L274),[условия видимости `execute`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/registry.ts#L280-L308).

---

## Частые MCP: рекомендации

### Sentry

Подключение мониторинговой платформы Sentry: запросы ошибок и проблем:

```jsonc
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

Первая аутентификация:

```bash
opencode mcp auth sentry
```

Пример использования:

```
use sentry: покажи свежие нерешённые ошибки
```

### Context7

Поиск документации всевозможных библиотек и фреймворков:

```jsonc
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

API-ключ для повышенных лимитов:

```jsonc
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

Пример использования:

```
use context7: как в Cloudflare Worker кэшировать JSON-ответ
```

### Grep by Vercel

Поиск фрагментов кода на GitHub:

```jsonc
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

Пример использования:

```
use the gh_grep tool: как в SST-фреймворке настроить свой домен
```

### Filesystem

Операции с локальной файловой системой (режим песочницы):

```jsonc
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": [
        "npx", "-y", "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

### Postgres

Прямые запросы к базе PostgreSQL:

```jsonc
{
  "mcp": {
    "postgres": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-postgres"],
      "environment": {
        "POSTGRES_CONNECTION_STRING": "{env:DATABASE_URL}"
      }
    }
  }
}
```

### Puppeteer

Автоматизация браузера и скрапинг страниц:

```jsonc
{
  "mcp": {
    "puppeteer": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Memory

Персистентное key-value хранилище:

```jsonc
{
  "mcp": {
    "memory": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

### SQLite

Лёгкие операции с базой данных:

```jsonc
{
  "mcp": {
    "sqlite": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sqlite", "/path/to/database.db"]
    }
  }
}
```

### Slack

Взаимодействие с рабочим пространством Slack:

```jsonc
{
  "mcp": {
    "slack": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-slack"],
      "environment": {
        "SLACK_BOT_TOKEN": "{env:SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "{env:SLACK_TEAM_ID}"
      }
    }
  }
}
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| MCP-инструменты не появляются | Глобальное отключение или Agent не настроен | Проверьте конфиг `permission` |
| Ошибка OAuth-аутентификации | Токен просрочен или credentials недействительны | Выполните `opencode mcp logout && opencode mcp auth` |
| Статус `needs_client_registration` | Сервер не поддерживает динамическую регистрацию | Задайте `clientId` в `oauth` |
| Контекст быстро заканчивается | Включено слишком много MCP-инструментов | Отключите неиспользуемые MCP, включайте для отдельных Agent |
| Конфликт имён инструментов | У нескольких MCP одноимённые инструменты | Различайте форматом `{имя-сервера}_{имя-инструмента}` |
| После аутентификации всё равно needs_auth | Не сохранился токен | Проверьте права `~/.local/share/opencode/mcp-auth.json` |
| **Неверный формат команды** | `command` строкой вместо массива | ❌ `"command": "npx xxx"` → ✓ `"command": ["npx", "-y", "xxx"]` |
| **Неверный формат URL** | В URL нет префикса протокола | ❌ `"url": "example.com/mcp"` → ✓ `"url": "https://example.com/mcp"` |
| **Браузер сам не открывается** | SSH или удалённое окружение | OpenCode покажет URL — скопируйте в браузер вручную |
| **Слишком короткий тайм-аут** | `timeout` аж 1000ms | Удалённым серверам советуем 2000+–10000ms, по умолчанию 30000ms |
| **Забыли включить сервер** | `enabled: false`, а удивляетесь, почему не работает | По умолчанию серверы включены, проверьте, не выставили ли `false` |

---

## Итоги урока

Вы научились:

1. **OAuth-аутентификации**: автоматической обработке и ручной настройке credentials клиента
2. **Командам отладки**: диагностике подключений через `opencode mcp debug`
3. **Иконкам состояний**: смыслу четырёх состояний ✓ ○ ⚠ ✗
4. **Управлению правами**: контролю доступа к инструментам через `permission`
5. **Автообнаружению инструментов**: правилам именования и механизму уведомлений об изменениях
6. **Расширению контекста**: instructions, resources и templates серверов
7. **Code Mode**: оркестрации разрешённых MCP-инструментов в ограниченной среде
8. **Интеграции в правила**: настройке использования MCP по умолчанию в AGENTS.md
9. **Частым MCP**: Sentry, Context7, Grep, Postgres и другим

---

## Связанные материалы

- [5.7a Основы MCP](./07a-mcp-basics) — стартовая настройка MCP
- [5.1 Всё о конфигурации](./01a-config-basics) — основы файлов конфигурации
- [5.2 Свои Agent](./02a-agent-quickstart) — настройка инструментов Agent
- [5.5 Контроль прав](./05-permissions) — детальная настройка прав
- [Официальная документация MCP](https://opencode.ai/docs/mcp-servers/) — англоязычный оригинал

---

## Анонс следующего урока

> В следующем уроке изучим **[Chrome DevTools MCP](./07c-mcp-chrome-devtools)**.
>
> Вы узнаете:
> - Как подключить AI напрямую к вашему браузеру Chrome
> - Как отлаживать залогиненные страницы (без повторного входа)
> - Как выделять элементы и запросы в DevTools для анализа AI
> - Функции скриншотов браузера, выполнения скриптов и другие
