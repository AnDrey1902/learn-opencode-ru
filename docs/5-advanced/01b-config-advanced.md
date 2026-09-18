---
title: 5.1b Продвинутая конфигурация
subtitle: Полный справочник opencode.json
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.1b"
duration: 20 минут
level: Продвинутый
description: Освойте все опции конфигурации OpenCode и создайте полностью настроенные окружение разработки и AI-инструмент.
tags:
  - Конфигурация
  - JSON
  - Продвинутый уровень
prerequisite:
  - 5.1a Основы конфигурации
---

# 5.1b Продвинутая конфигурация

> Освойте все опции конфигурации OpenCode и создайте полностью настроенные окружение разработки.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/config-advanced-notes.mini.jpeg" alt="Шпаргалка урока: продвинутая конфигурация" data-zoom-src="/images/5-advanced/config-advanced-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. TUI: `scroll_speed`, `diff_style`; Keybinds: leader-префикс (`keybinds` — во МНОЖЕСТВЕННОМ!).
2. Поведение: `share` (manual/auto/disabled), `compaction` (auto/prune), `watcher` (игнорирует node_modules).
3. Функциональные конфиги — 8 модулей: tools, permission, agent, command, formatter, mcp, plugin, lsp.
4. Только `keybinds` пишется во множественном числе!
5. Экспериментальное: hook, batch_tool, openTelemetry.
6. Ловушки: keybind→keybinds, permissions→permission, agents→agent, tui.theme→theme, tools→permission.

</details>

---

## Что вы сможете после урока

- Настраивать интерфейс (TUI, горячие клавиши, сервер)
- Настраивать поведение (шаринг, сжатие, монитор)
- Настраивать функции (провайдеры, инструменты, права, Agent, команды, MCP и др.)
- Использовать экспериментальные функции
- Задавать моделям свои API URL

---

## С какими трудностями вы столкнулись

- Хотите настроить свои горячие клавиши
- Хотите управлять доступными AI инструментами
- Хотите пакетно отключить отдельные MCP-инструменты
- Хотите задать моделям приватно задеплоенный API
- Интересно, какие есть скрытые настройки

---

## Когда это пригодится

- Когда нужно: полностью управлять поведением OpenCode
- И не хочется: упираться в ограничения умолчаний

---

## Настройки интерфейса

<AdInArticle />

### Настройки TUI

Настройки TUI живут в отдельном `tui.json` или `tui.jsonc`, поля пишутся прямо в корне:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": true
  },
  "diff_style": "auto",
  "cursor": {
    "style": "block",
    "blinking": true
  }
}
```

| Поле | Описание | По умолчанию |
|-----|------|-------|
| `scroll_speed` | Множитель скорости прокрутки (минимум 0.001) | 3 |
| `scroll_acceleration.enabled` | Ускорение прокрутки в стиле macOS | false |
| `diff_style` | Стиль показа различий | `"auto"` |
| `cursor.style` | Форма курсора: `block`, `underline`, `line` или `default` | При заданном `cursor` — `"block"` |
| `cursor.blinking` | Мигает ли курсор; при `style` в `default` не действует | При заданном `cursor` — true |

> `scroll_acceleration.enabled` приоритетнее `scroll_speed`. После включения scroll_speed игнорируется.

Главный загрузчик конфигурации удаляет старые поля `theme`, `keybinds` и `tui`. При старте TUI мигратор проверяет старые главные конфиги: в том же каталоге уже есть `tui.json` — пропускает, иначе пишет новый `tui.json`, создаёт или переиспользует `<исходный-файл>.tui-migration.bak`, и лишь затем удаляет эти три поля из старого главного конфига. Одинокий `tui.jsonc` миграции не мешает.

Отдельная TUI-конфигурация сливается в порядке: глобальная конфигурация, `OPENCODE_TUI_CONFIG`, обычные конфиги проектов, встречные `.opencode`, `OPENCODE_CONFIG_DIR` — позже загруженное приоритетнее. Обычные файлы проектов применяются от корневой стороны к текущему каталогу, чем ближе к текущему — тем приоритетнее; несколько каталогов `.opencode` сливаются от текущей стороны к корневой, поэтому при конфликтах побеждает более корневой, загруженный позже. `OPENCODE_CONFIG_DIR` грузится последним.

Опции `diff_style`:
- `"auto"` — адаптация под ширину терминала
- `"stacked"` — всегда одноколоночный вид

### Настройка Keybinds

Свои горячие клавиши:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n",
    "session_compact": "<leader>c",
    "model_list": "<leader>m",
    "agent_list": "<leader>a",
    "session_interrupt": "escape"
  }
}
```

> Обратите внимание: ключ конфигурации — `keybinds` (**множественное число**) в корне `tui.json`. Этим он отличается от permission и agent главной конфигурации в единственном числе.

#### Клавиша Leader

Большинство горячих клавиш используют префикс клавиши `leader` против конфликтов с терминалом:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "leader": "ctrl+x"
  }
}
```

По умолчанию `ctrl+x`. Нажмите клавишу leader, затем горячую клавишу: например, `ctrl+x`, затем `n` — новая сессия.

#### Отключение горячих клавиш

Значения `"none"` или `false` отключают:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "session_compact": "none"
  }
}
```

#### Частые горячие клавиши

| Ключ конфигурации | Значение по умолчанию | Описание |
|--------|--------|------|
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | Выход из приложения |
| `session_new` | `<leader>n` | Новая сессия |
| `session_list` | `<leader>l` | Список сессий |
| `session_interrupt` | `escape` | Прервать текущую операцию |
| `session_compact` | `<leader>c` | Сжать сессию |
| `session_background` | `ctrl+b` | Увести синхронный под-агент в фон |
| `model_list` | `<leader>m` | Список моделей |
| `agent_list` | `<leader>a` | Список Agent |
| `agent_cycle` | `tab` | Переключить Agent |
| `command_list` | `ctrl+p` | Список команд |
| `messages_undo` | `<leader>u` | Отменить сообщение |
| `messages_redo` | `<leader>r` | Повторить сообщение |
| `diff_open` | `none` | Открыть просмотр Diff (по умолчанию не привязана) |
| `prompt_skills` | `none` | Открыть выбор Skill (по умолчанию не привязан) |

Список частых клавиш — в разделе [Шпаргалка/Горячие клавиши](../appendix/keybinds).

> Основания в исходниках: [Schema конфигурации TUI](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L61-L75) и [плоские горячие клавиши со значениями отключения](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L28-L33).

### Настройка Server

Настройка сервера команд `opencode serve` и `opencode web`:

```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "opencode.local",
    "cors": ["http://localhost:5173"]
  }
}
```

| Поле | Описание |
|-----|------|
| `port` | Порт прослушивания |
| `hostname` | Адрес прослушивания (при включённом mdns по умолчанию `0.0.0.0`) |
| `mdns` | Включить обнаружение сервисов mDNS (устройства сети видят) |
| `mdnsDomain` | Свой домен mDNS-сервиса (по умолчанию `opencode.local`) |
| `cors` | Список разрешённых CORS-источников |

---

## Настройки поведения

### Настройка Share

Управление поведением шаринга сессий:

```json
{
  "share": "manual"
}
```

| Значение | Описание |
|-----|------|
| `"manual"` | Ручной шаринг (по умолчанию) командой `/share` |
| `"auto"` | Автошаринг новых сессий |
| `"disabled"` | Функция шаринга отключена |

### Настройка Compaction

Управление поведением сжатия контекста:

```json
{
  "compaction": {
    "auto": true,
    "prune": true,
    "reserved": 10000
  }
}
```

| Поле | Описание | По умолчанию |
|-----|------|-------|
| `auto` | Автосжатие при заполнении контекста | true |
| `prune` | Удалять старые выводы инструментов ради экономии токенов | true |
| `reserved` | Буфер токенов при сжатии — запас окна против переполнения | - |

### Настройка Watcher

Настройка шаблонов игнора монитора файлов:

```json
{
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**", "*.log"]
  }
}
```

Глоб-синтаксисом исключайте шумные каталоги — меньше накладных расходов на мониторинг файлов.

### Настройка Instructions

Дополнительные файлы инструкций (сливаются с AGENTS.md):

```json
{
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    ".cursor/rules/*.md",
    "packages/*/AGENTS.md"
  ]
}
```

Глоб-шаблоны поддерживаются. Подходит для:
- Переиспользования существующих файлов правил (вроде rules у Cursor)
- Общих командных норм кодирования
- Подтягивания правил подпроектов в монорепозитории

### Настройка References

Ключом `references` дополняйте контекст проекта локальными каталогами или Git-репозиториями:

```jsonc
{
  "references": {
    "design-system": {
      "path": "../design-system",
      "description": "Командная библиотека компонентов и нормы дизайна"
    },
    "upstream": {
      "repository": "https://github.com/example/upstream.git",
      "branch": "main",
      "description": "Референсная реализация апстрима",
      "hidden": true
    }
  }
}
```

Локальные ссылки — через `path`, Git-ссылки — через `repository` с необязательным `branch`. Ссылки с `description` попадают в системный контекст; `hidden: true` лишь прячет их из `@`-автодополнения. Старый ключ в единственном числе `reference` deprecated — используйте `references`.

> `customize-opencode` — уже встроенный Skill по умолчанию для безопасного изменения собственной конфигурации OpenCode, ставить отдельно не нужно. Недолго живший Scout удалён до целевой версии — настраивать его и опираться на него не следует.

> Основания в исходниках: [Schema references](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/config/reference.ts#L5-L21),[главные ключи конфигурации и deprecated-алиасы](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L44-L50) и [встроенный Skill customize-opencode](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/skill/index.ts#L276-L284).

---

## Настройки функций

### Настройка Provider

Настройка AI-провайдеров и их моделей:

```jsonc
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "baseURL": "https://custom-anthropic.example.com/v1",
        "timeout": 600000,
        "setCacheKey": true
      },
      "models": {
        "claude-sonnet-4-5": {
          "provider": {
            "api": "https://custom-api.example.com/v1"
          }
        }
      }
    }
  }
}
```

#### Опции уровня Provider

| Поле | Описание |
|-----|------|
| `options.apiKey` | API-ключ с подстановкой переменных окружения `{env:VAR_NAME}` |
| `options.baseURL` | Свой базовый URL API (для прокси или приватных деплоев) |
| `options.timeout` | Тайм-аут запросов (миллисекунды), `false` отключает |
| `options.setCacheKey` | Включить Prompt Caching (только Anthropic) |
| `options.enterpriseUrl` | URL GitHub Enterprise (только Copilot) |

#### Свой API URL уровня моделей

> Новое в v1.1.60+

Отдельный API URL для одной модели:

```jsonc
{
  "provider": {
    "openai": {
      "models": {
        "gpt-4o": {
          "provider": {
            "api": "https://api.custom-openai.com/v1"
          }
        }
      }
    }
  }
}
```

Сценарии:
- Один провайдер с разными деплоями (разные регионы Azure OpenAI)
- Тестирование приватно задеплоенных моделей
- Прокси-сервер под конкретную модель

#### Чёрные и белые списки

Управление доступными моделями:

```json
{
  "provider": {
    "openai": {
      "whitelist": ["gpt-4o", "gpt-4o-mini"],
      "blacklist": ["gpt-3.5-turbo"]
    }
  }
}
```

| Поле | Описание |
|-----|------|
| `whitelist` | Только эти модели разрешены |
| `blacklist` | Эти модели запрещены |

> `whitelist` и `blacklist` взаимоисключают, при обоих побеждает `whitelist`.

### Настройка Tools

Управление доступными LLM инструментами:

```json
{
  "tools": {
    "write": false,
    "bash": false,
    "webfetch": true
  }
}
```

По умолчанию все инструменты включены. `false` отключает.

#### Wildcard-шаблоны

Ключи `tools` в итоге конвертируются в правила `permission`, поэтому wildcard опосредованно действуют через систему прав:

```json
{
  "tools": {
    "mymcp_*": false
  }
}
```

Отключает все инструменты MCP-сервера с именем `mymcp`.

> Прямое использование конфигурации `permission` рекомендуем ради wildcard-контроля с точной градацией allow/ask/deny.

#### Tools vs Permission

`tools` — наследие конфигурации, автоматически конвертируется в `permission`:

| Настройка tools | Эквивалент permission |
|-----------|-----------------|
| `"write": false` | `"edit": "deny"` |
| `"bash": false` | `"bash": "deny"` |

> Конфигурацию `permission` рекомендуем за точную градацию (allow/ask/deny). Подробности — [5.5 Контроль прав](./05-permissions).

### Настройка Permission

Точечный контроль прав:

```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny"
    }
  }
}
```

> Обратите внимание: ключ конфигурации — `permission` (единственное число), а не `permissions`.

Подробности — [5.5 Контроль прав](./05-permissions).

### Настройка Agent

Поведение Agent в конфигурации:

```jsonc
{
  "agent": {
    "code-reviewer": {
      "description": "Эксперт по ревью кода",
      "mode": "subagent",
      "model": "anthropic/claude-opus-4-5-thinking",
      "prompt": "Вы — эксперт по ревью кода...",

      // Продвинутая настройка
      "temperature": 0.3,
      "top_p": 0.9,
      "steps": 50,
      "color": "#FF5733",
      "hidden": true,

      // Права
      "permission": {
        "edit": "deny"
      }
    }
  }
}
```

> Обратите внимание: ключ конфигурации — `agent` (единственное число), а не `agents`.

#### Поля продвинутой настройки

| Поле | Тип | Описание |
|-----|------|------|
| `temperature` | конечное number | Параметр креативности; реальный диапазон задают модель и провайдер |
| `top_p` | конечное number | Параметр ядерной выборки; реальный диапазон задают модель и провайдер |
| `variant` | string | Вариант модели по умолчанию (действует лишь когда у Agent настроена своя модель) |
| `steps` | положительное целое | Максимум шагов автоитераций; по достижении — вывод финального текстового ответа |
| `color` | string | Hex-цвет (вроде `#FF5733`) или имя цвета темы (вроде `primary`) |
| `hidden` | boolean | Скрыть из @-меню (действует лишь для subagent) |

> `maxSteps` deprecated, используйте `steps`.

Подробности — [5.2 Свои Agent](./02a-agent-quickstart).

### Настройка Command

Определение команд в конфиге:

```jsonc
{
  "command": {
    "test": {
      "template": "Запустить тесты и показать упавшие результаты",
      "description": "Запуск тестов",
      "agent": "build",
      "model": "anthropic/claude-opus-4-5-thinking"
    },
    "component": {
      "template": "Создать React-компонент с именем $ARGUMENTS",
      "description": "Создание нового компонента"
    }
  }
}
```

> Обратите внимание: ключ конфигурации — `command` (единственное число), а не `commands`.

| Поле | Описание |
|-----|------|
| `template` | Шаблон команды, `$ARGUMENTS` — параметры |
| `description` | Описание команды |
| `agent` | Используемый Agent |
| `model` | Используемая модель |
| `subtask` | Запускать ли как подзадачу |

Подробности — [5.4 Быстрые команды](./04-commands).

### Настройка Formatter

Настройка форматтеров кода:

```json
{
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

> Обратите внимание: ключ конфигурации — `formatter` (единственное число), а не `formatters`.

Полное отключение форматирования значением `false`:

```json
{
  "formatter": false
}
```

Подробности — [5.18 Форматтеры](./18-formatters).

### Настройка MCP

Настройка MCP-серверов:

```json
{
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"]
    },
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "headers": {
        "Authorization": "Bearer your-token"
      },
      "oauth": {
        "clientId": "xxx",
        "clientSecret": "xxx",
        "scope": "read write"
      }
    }
  }
}
```

Удалённые MCP-серверы поддерживают `headers` (свои заголовки запросов) и `oauth` (OAuth-аутентификация). Значением `false` у `oauth` отключается автоопределение OAuth.

Подробности — [5.7 Расширения MCP](./07a-mcp-basics).

### Настройка Plugin

Загрузка npm-плагинов:

```json
{
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

Локальные плагины кладутся файлами (`.ts` или `.js`) в каталог `.opencode/plugin/`.

Подробности — [5.12 Система плагинов](./12a-plugins-basics).

### Настройка LSP

Настройка LSP-серверов:

```json
{
  "lsp": {
    "typescript": {
      "disabled": true
    },
    "custom-lsp": {
      "command": ["my-lsp-server", "--stdio"],
      "extensions": [".custom", ".myext"],
      "env": {
        "DEBUG": "true"
      },
      "initialization": {
        "settings": {}
      }
    }
  }
}
```

| Поле | Описание |
|-----|------|
| `disabled` | Отключить этот LSP |
| `command` | Команда запуска |
| `extensions` | Расширения файлов (для своих LSP обязательно) |
| `env` | Переменные окружения |
| `initialization` | Конфигурация инициализации LSP |

Значением `false` отключаются все LSP:

```json
{
  "lsp": false
}
```

Подробности — [5.19 LSP-серверы](./19-lsp).

---

## Экспериментальные функции

```json
{
  "experimental": {
    "batch_tool": true,
    "openTelemetry": true,
    "continue_loop_on_deny": false
  }
}
```

| Поле | Описание |
|-----|------|
| `batch_tool` | Включить пакетный инструмент |
| `openTelemetry` | Включить трассировку OpenTelemetry |
| `disable_paste_summary` | Отключить автосуммирование при вставке больших кусков текста |
| `primary_tools` | Список инструментов только для Primary Agent |
| `continue_loop_on_deny` | Продолжать цикл при отказе в инструменте |
| `mcp_timeout` | Глобальный тайм-аут запросов MCP (миллисекунды) |

> ⚠️ Экспериментальные функции могут измениться или удалиться в любой момент.

::: tip Про Hook (хуки событий)
Функционал Hook реализован через **систему плагинов**, а не конфигурацию `experimental`. Подробности — [5.12c Механизмы Hooks](./12c-hooks).
:::

---

## Полный пример конфигурации

Главная конфигурация `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // === Модели ===
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",

  // === Провайдер ===
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "timeout": 600000,
        "setCacheKey": true
      }
    },
    "openai": {
      "models": {
        "gpt-4o": {
          "provider": {
            "api": "https://custom-api.example.com/v1"
          }
        }
      }
    }
  },
  "disabled_providers": ["gemini"],

  // === Пользователь ===
  "username": "разработчик",

  // === Сервер ===
  "server": {
    "port": 4096,
    "hostname": "localhost"
  },

  // === Поведение ===
  "share": "manual",
  "compaction": {
    "auto": true,
    "prune": true
  },
  "autoupdate": true,
  "watcher": {
    "ignore": ["node_modules/**", "dist/**"]
  },
  "instructions": ["CONTRIBUTING.md"],

  // === Права ===
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git *": "allow"
    }
  },

  // === Agent ===
  "agent": {
    "code-reviewer": {
      "description": "Эксперт по ревью кода",
      "mode": "subagent",
      "temperature": 0.2,
      "permission": {
        "edit": "deny"
      }
    }
  },

  // === Команды ===
  "command": {
    "test": {
      "template": "Запустить тесты",
      "description": "Запуск тестового набора"
    }
  },

  // === Форматтеры ===
  "formatter": {
    "prettier": {
      "disabled": false
    }
  },

  // === MCP ===
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"]
    }
  }
}
```

Конфигурация интерфейса `tui.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "catppuccin",
  "scroll_speed": 3,
  "diff_style": "auto",
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n"
  }
}
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Использовали `keybind` | Ошибка в имени ключа | В `tui.json` используйте `keybinds` (**множественное число**) |
| Использовали `permissions` | Ошибка в имени ключа | Должно быть `permission` (единственное число) |
| Использовали `agents` | Ошибка в имени ключа | Должно быть `agent` (единственное число) |
| Использовали `commands` | Ошибка в имени ключа | Должно быть `command` (единственное число) |
| Использовали `formatters` | Ошибка в имени ключа | Должно быть `formatter` (единственное число) |
| В главной конфигурации `theme` / `keybinds` / `tui` | Неверный файл конфигурации | Перенесите в `tui.json` / `tui.jsonc` того же уровня |
| Настройка tools не действует | Наследие конфигурации | Рекомендуется `permission` |
| baseURL не действует | Неверное место | Должно быть в `provider.options.baseURL`, а не в корне |
| API URL модели не действует | Ошибка в поле | На уровне моделей — `provider.api`, на уровне провайдера — `options.baseURL` |
| Конфликт горячих клавиш | Конфликт с терминалом | Префикс клавиши leader |
| Свой LSP не работает | Нет extensions | Свой LSP обязан указывать extensions |

---

## Шпаргалка имён ключей конфигурации

| Опция | Верное имя ключа | Частая ошибка |
|--------|----------|----------|
| Provider | `provider` | ~~providers~~ |
| Permission | `permission` | ~~permissions~~ |
| Agent | `agent` | ~~agents~~ |
| Command | `command` | ~~commands~~ |
| Formatter | `formatter` | ~~formatters~~ |
| **Keybinds (конфиг TUI)** | `keybinds` | ~~keybind~~ |
| Theme (конфиг TUI) | `theme` | ~~tui.theme~~ |

---

## Итоги урока

Вы научились:

1. Отдельной конфигурации интерфейса TUI, горячим клавишам и серверным настройкам главной конфигурации
2. Настройкам поведения: шаринг, сжатие, монитор, файлы инструкций
3. Настройкам функций: провайдеры, references, инструменты, права, Agent, команды, форматтеры, MCP, плагины, LSP
4. Экспериментальным функциям: пакетные инструменты, OpenTelemetry и др.
5. Своим API URL моделей (v1.1.60+)

---

## Связанные материалы

- [5.1a Основы конфигурации](./01a-config-basics) — главная конфигурация
- [5.2 Свои Agent](./02a-agent-quickstart) — подробная настройка Agent
- [5.4 Быстрые команды](./04-commands) — подробная настройка команд
- [5.5 Контроль прав](./05-permissions) — подробная настройка прав
- [5.7 Расширения MCP](./07a-mcp-basics) — подробная настройка MCP
- [Шпаргалка/Горячие клавиши](../appendix/keybinds) — список частых клавиш
- [Шпаргалка/Справочник конфигурации](../appendix/config-ref) — таблица-шпаргалка конфигурации

---

## Анонс следующего урока

> В следующем уроке научимся создавать собственных Agent.
