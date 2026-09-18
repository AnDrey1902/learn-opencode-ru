---
title: 5.8b Протокол ACP
subtitle: Интеграция редакторов Zed, JetBrains, Neovim и других
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.8b"
duration: 15 минут
practice: 20 минут
level: Продвинутый
description: Используйте OpenCode в редакторах Zed, JetBrains, Neovim и других через протокол ACP.
tags:
  - ACP
  - Zed
  - JetBrains
  - Neovim
prerequisite:
  - 5.8a Расширение VS Code
---

# 5.8b Протокол ACP

> Используйте OpenCode в редакторах Zed, JetBrains, Neovim и других через протокол ACP.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/08b-acp-notes.mini.jpeg" alt="Шпаргалка урока: протокол ACP" data-zoom-src="/images/5-advanced/08b-acp-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. ACP = Agent Client Protocol — связь редактор ↔ OpenCode через JSON-RPC (stdio).
2. Запуск: `opencode acp` с параметрами `--cwd`, `--port`, `--hostname`.
3. Zed: `~/.config/zed/settings.json` → agent_servers с относительным путём.
4. JetBrains: acp.json → абсолютный путь к opencode (обязательно!).
5. Neovim: Avante.nvim (acp_providers) или CodeCompanion.nvim (adapter).
6. Поддерживается: встроенные и свои инструменты, слэш-команды, MCP-серверы, AGENTS.md, форматтеры, система прав.
7. Не поддерживается: /undo, /redo — используйте средства редактора.
8. Поиск пути: `which opencode` (Linux/macOS), `where opencode` (Windows).

</details>

---

## Что вы сможете после урока

- Понимать, что такое протокол ACP
- Настроить OpenCode в Zed
- Настроить OpenCode в JetBrains IDE
- Настроить OpenCode в Neovim

---

## Что такое ACP

**ACP** (Agent Client Protocol) — открытый протокол, стандартизирующий общение редакторов кода и AI-программистских агентов.

- Сайт: [agentclientprotocol.com](https://agentclientprotocol.com)
- Список поддерживаемых редакторов: [отчёт о прогрессе ACP](https://zed.dev/blog/acp-progress-report#available-now)

### Как это работает

```
Редактор ←→ JSON-RPC (stdio) ←→ opencode acp
```

Редактор запускает `opencode acp` как дочерний процесс и общается через stdin/stdout в формате nd-JSON (JSON с разделителями-новыми строками) по JSON-RPC.

В части переходных релизов эта новая реализация называлась `acp-next`; к `v1.18.22` она стала официальной реализацией `opencode acp` — отдельной команды `opencode acp-next` для запуска нет. Исходники: [точка входа команды ACP](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/acp.ts#L9-L25),[текущая реализация Agent](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/agent.ts#L32-L85).

---

## Запуск ACP-сервиса

```bash
opencode acp
```

### Параметры команды

| Параметр | Описание | Пример |
|------|------|------|
| `--cwd` | Рабочий каталог | `--cwd /path/to/project` |
| `--port` | Порт прослушивания | `--port 4096` |
| `--hostname` | Имя хоста прослушивания | `--hostname 0.0.0.0` |

> Источники: `cli.mdx:481-487`,`acp.ts:16-20`

---

## Настройка Zed

Репозиторий OpenCode раньше поставлял расширение Zed в комплекте, но оно удалено. В `v1.18.22` запускайте `opencode acp` через конфигурацию ACP `agent_servers` в Zed — не ищите и не ставьте старое комплектное расширение из репозитория.

Добавьте в конфиг [Zed](https://zed.dev) `~/.config/zed/settings.json`:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

### Как пользоваться

<AdInArticle />

1. Откройте палитру команд
2. Выполните `agent: new thread`

### Привязка горячих клавиш (необязательно)

Отредактируйте `keymap.json`:

```json
[
  {
    "bindings": {
      "cmd-alt-o": [
        "agent::NewExternalAgentThread",
        {
          "agent": {
            "custom": {
              "name": "OpenCode",
              "command": {
                "command": "opencode",
                "args": ["acp"]
              }
            }
          }
        }
      ]
    }
  }
]
```

---

## Настройка JetBrains IDE

Поддерживаются все JetBrains IDE (IntelliJ IDEA, WebStorm, PyCharm и др.).

По [официальной документации](https://www.jetbrains.com/help/ai-assistant/acp.html) создайте `acp.json`:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

> **Обратите внимание**: JetBrains требует **абсолютный путь** к opencode.

### Поиск пути opencode

```bash
# macOS / Linux
which opencode

# Windows
where opencode
```

### Как пользоваться

В селекторе агентов AI-чата выберите "OpenCode".

---

## Настройка Neovim

### Avante.nvim

Добавьте в конфиг [Avante.nvim](https://github.com/yetone/avante.nvim):

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

Чтобы передать переменные окружения:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" },
      env = {
        OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")
      }
    }
  }
}
```

### CodeCompanion.nvim

Добавьте в конфиг [CodeCompanion.nvim](https://github.com/olimorris/codecompanion.nvim):

```lua
require("codecompanion").setup({
  strategies = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

Переменные окружения — по [документации CodeCompanion](https://codecompanion.olimorris.dev/configuration/adapters#environment-variables-setting-an-api-key).

---

## Поддерживаемые возможности

Реализация ACP в `v1.18.22` — не полный TUI, но главные возможности сессий покрыты:

| Возможность | Поддержка |
|------|------|
| Отправка промптов, стриминг сообщений, вызовы инструментов и запросы разрешений | ✅ |
| Обнаружение и выполнение доступных слэш-команд | ✅ |
| Создание, список, загрузка, replay, восстановление и закрытие сессий | ✅ |
| Отмена выполняющегося промпта | ✅ |
| Выбор модели | ✅ |
| Выбор Agent (в ACP показывается как Session Mode) | ✅ |
| Выбор variant модели (в ACP показывается как Effort) | ✅ |
| Регистрация MCP-серверов, переданных клиентом | ✅ |

Точка входа Agent: [`acp/agent.ts:43-84`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/agent.ts#L43-L84); загрузка сессий, replay сообщений и отправка команд: [`acp/service.ts:211-235`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/service.ts#L211-L235),[`acp/service.ts:494-543`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/service.ts#L494-L543); опции моделей, Effort и Session Mode: [`acp/config-option.ts:38-109`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/config-option.ts#L38-L109).

### Неподдерживаемые возможности

Не приравнивайте список TUI-команд к списку slash-команд ACP. Следующие TUI-команды в режиме ACP недоступны:

- `/undo` — отмена сообщения
- `/redo` — повтор сообщения

> Источник: `acp.mdx:147-149`

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| JetBrains не находит команду | Относительный путь | Используйте абсолютный путь к opencode |
| Zed не отвечает | opencode не установлен или не в PATH | Проверьте, что `which opencode` возвращает верный путь |
| Переменные окружения Neovim не действуют | Неправильно передан env | Используйте конфиг `env = { ... }` |
| `/undo` не работает | ACP не поддерживает команду | Ожидаемо: пользуйтесь отменой самого редактора |

---

## Связанные материалы

- [5.8a Расширение VS Code](./08a-ide-vscode) — установка расширения VS Code/Cursor
- [Шпаргалка/Справочник CLI](../appendix/cli) — все опции командной строки
- [Сайт ACP](https://agentclientprotocol.com) — спецификация протокола

---

## Итоги урока

Вы научились:

1. Базовым понятиям протокола ACP
2. Настройке редактора Zed (settings.json + keymap)
3. Настройке JetBrains IDE (нужен абсолютный путь)
4. Настройке Neovim (Avante.nvim, CodeCompanion.nvim)
5. Ограничениям режима ACP

---

## Анонс следующего урока

> В следующем уроке изучим удалённый режим: запуск OpenCode на сервере и доступ через веб-интерфейс.
