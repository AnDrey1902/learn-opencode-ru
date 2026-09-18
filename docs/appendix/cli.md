---
title: Справочник команд CLI
description: Полный справочник инструмента командной строки OpenCode
---

# Справочник команд CLI

> Все команды и опции инструмента командной строки `opencode`

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/appendix/cli-notes.mini.jpeg"
     alt="Шпаргалка: справочник команд CLI"
     data-zoom-src="/images/appendix/cli-notes.jpeg" />

---

## Обзор команд

| Команда | Функция |
|------|------|
| `opencode` | Старт TUI-интерфейса |
| `opencode --mini` | Старт сжатого интерактива |
| `opencode run` | Неинтерактивное выполнение задач |
| `opencode serve` | Старт headless-сервера |
| `opencode web` | Старт веб-интерфейса |
| `opencode attach` | Подключение к удалённому серверу |
| `opencode auth` | Управление аутентификацией |
| `opencode models` | Список доступных моделей |
| `opencode agent` | Управление Agent |
| `opencode mcp` | Управление MCP-серверами |
| `opencode session` | Управление сессиями |
| `opencode stats` | Статистика использования |
| `opencode export` | Экспорт сессий |
| `opencode import` | Импорт сессий |
| `opencode github` | Интеграция GitHub |
| `opencode pr` | Забор и обработка PR |
| `opencode acp` | Сервер ACP |
| `opencode upgrade` | Обновление версии |
| `opencode uninstall` | Деинсталляция OpenCode |

---

## Главные команды

### opencode

Старт TUI-интерфейса.

```bash
opencode [project]
```

**Опции**:
| Опция | Коротко | Описание |
|------|--------|------|
| `--continue` | `-c` | Продолжить прошлую сессию |
| `--session` | `-s` | Указать ID сессии |
| `--prompt` | | Стартовый промпт |
| `--model` | `-m` | Указать модель (формат: provider/model) |
| `--agent` | | Указать Agent |
| `--auto` | | Автоподтверждение запросов прав, не запрещённых явно (опасно) |
| `--mini` | | Старт сжатого интерактива |
| `--no-replay` | | В Mini при продолжении сессии и ресайзе терминала не проигрывать историю |
| `--replay-limit` | | В Mini проигрывать максимум N свежих сообщений |
| `--port` | | Порт прослушивания |
| `--hostname` | | Адрес прослушивания |

**Примеры**:
```bash
# Старт TUI
opencode

# Старт со стартовым промптом
opencode --prompt "Разбери структуру кода этого проекта"

# С указанной моделью
opencode -m anthropic/claude-sonnet-4-20250514

# Продолжить прошлую сессию
opencode -c

# Старт Mini; при продолжении история проигрывается по умолчанию
opencode --mini -c

# Продолжить сессию без replay
opencode --mini -c --no-replay
```

Mini — это `opencode --mini`, а не `opencode run --mini`. В поле ввода Mini восклицательный знак `!` в начале включает Shell mode; выход сразу по <kbd>Esc</kbd> либо клавишей <kbd>Backspace</kbd> при курсоре в начале ввода.

`--auto` действует в стандартном TUI. Целевая версия принимает скрытый `--yolo` как алиас совместимости, но в новые скрипты пишите открытый параметр `--auto`. Вход Mini этот флаг автоподтверждения не пробрасывает.

---

### opencode run

Неинтерактивное выполнение задач для скриптов и CI/CD.

```bash
opencode run [message..]
```

**Опции**:
| Опция | Коротко | Описание |
|------|--------|------|
| `--command` | | Имя выполняемой слэш-команды, message — параметры команды |
| `--continue` | `-c` | Продолжить прошлую сессию |
| `--session` | `-s` | Указать ID сессии |
| `--share` | | Поделиться сессией |
| `--model` | `-m` | Указать модель (формат: provider/model) |
| `--agent` | | Указать Agent |
| `--file` | `-f` | Приложить файлы (можно несколько) |
| `--format` | | Формат вывода: default (форматированный) или json (сырой JSON) |
| `--title` | | Заголовок сессии |
| `--attach` | | Подключиться к работающему серверу (вроде `http://localhost:4096`) |
| `--port` | | Порт локального сервера (по умолчанию случайный) |
| `--variant` | | Вариант модели (сила рассуждений: high, max, minimal) |
| `--auto` | | Автоподтверждение запросов прав, не запрещённых явно (опасно) |

**Примеры**:
```bash
# Базовое использование
opencode run "Исправь ошибки типов в src/main.ts"

# С указанной моделью
opencode run -m anthropic/claude-sonnet-4-5 "Review this code"

# С приложенными файлами (можно несколько)
opencode run -f src/main.ts -f package.json "Analyze this project"

# Продолжить прошлую сессию
opencode run -c "What else needs to be done?"

# Вывод в JSON (удобно скриптам)
opencode run --format json "List all TypeScript files"

# Подключиться к удалённому серверу (без холодного старта MCP)
opencode serve  # В другом терминале стартует
opencode run --attach http://localhost:4096 "Explain async/await"

# Своей командой
opencode run --command explain --file code.ts "How does this work?"

# С вариантом модели (сила рассуждений)
opencode run -m anthropic/claude-opus-4-5 --variant max "Analyze entire codebase"

# С автошарингом сессии
opencode run --share "Generate project documentation"

# С заголовком сессии
opencode run --title "Bug Fix" "Fix the login issue"

# Читать ввод из stdin
echo "Count lines of code" | opencode run "Analyze"

# Неинтерактивно с автоподтверждением спрашиваемых прав
opencode run --auto "Прогони тесты и почини упавшее"
```

`opencode run` по умолчанию неинтерактивен. Скрытый `--yolo` в целевой версии совместим с `--auto`, но в новые скрипты его не пишите. Оба автоматически подтверждают лишь изначально спрашиваемые запросы, правила с `deny` в конфигурации по-прежнему отклоняют выполнение.

---

### opencode serve

Старт headless-сервера с доступом по API.

```bash
opencode serve
```

**Опции**:
| Опция | Описание |
|------|------|
| `--port` | Порт прослушивания |
| `--hostname` | Адрес прослушивания |
| `--mdns` | Включить обнаружение mDNS |
| `--cors` | Разрешённые CORS-источники |

**Примеры**:
```bash
# Старт с умолчаниями
opencode serve

# Указать порт и разрешить удалённый доступ
opencode serve --port 4096 --hostname 0.0.0.0
```

---

### opencode web

Старт с веб-интерфейсом.

```bash
opencode web
```

**Опции**:
| Опция | Описание |
|------|------|
| `--port` | Порт прослушивания |
| `--hostname` | Адрес прослушивания |
| `--mdns` | Включить обнаружение mDNS |
| `--cors` | Разрешённые CORS-источники |

**Примеры**:
```bash
# Старт веб-интерфейса
opencode web

# Указать порт
opencode web --port 4096
```

---

### opencode attach

Подключение к удалённому серверу OpenCode.

```bash
opencode attach [url]
```

**Опции**:
| Опция | Коротко | Описание |
|------|--------|------|
| `--dir` | | Рабочий каталог TUI |
| `--session` | `-s` | Указать ID сессии |

**Примеры**:
```bash
# В одном терминале стартует сервер
opencode web --port 4096 --hostname 0.0.0.0

# В другом терминале подключаемся
opencode attach http://10.20.30.40:4096
```

---

## Команды управления

<AdInArticle />

### opencode auth

Управление аутентификацией и API-ключами. Credentials хранятся в `~/.local/share/opencode/auth.json`.

```bash
opencode auth <subcommand>
```

| Подкоманда | Функция |
|--------|------|
| `login` | Вход (интерактивный выбор провайдера) |
| `list` / `ls` | Список настроенных провайдеров |
| `logout` | Выход из провайдера |

**Примеры**:
```bash
# Интерактивный вход
opencode auth login

# Список настроенных провайдеров
opencode auth list

# Выход
opencode auth logout
```

---

### opencode models

Список доступных моделей.

```bash
opencode models [provider]
```

**Опции**:
| Опция | Описание |
|------|------|
| `--refresh` | Обновить кэш моделей |
| `--verbose` | Подробности (включая метаданные стоимости) |

**Примеры**:
```bash
# Все доступные модели
opencode models

# Только модели Anthropic
opencode models anthropic

# Обновить список моделей
opencode models --refresh
```

---

### opencode agent

Управление конфигурацией Agent.

```bash
opencode agent <subcommand>
```

| Подкоманда | Функция |
|--------|------|
| `list` | Список всех Agent |
| `create` | Создание нового Agent (интерактивно) |

**Примеры**:
```bash
# Список Agent
opencode agent list

# Создать нового Agent
opencode agent create
```

---

### opencode mcp

Управление MCP-серверами.

```bash
opencode mcp <subcommand>
```

| Подкоманда | Функция |
|--------|------|
| `list` / `ls` | Список MCP-серверов со статусами подключений |
| `add` | Добавление MCP-сервера (интерактивно) |
| `auth [name]` | OAuth-аутентификация |
| `auth list` / `auth ls` | Список серверов с OAuth и статусы аутентификации |
| `logout [name]` | Удаление OAuth-credentials |
| `debug <name>` | Отладка проблем OAuth-подключения |

**Примеры**:
```bash
# Список MCP-серверов
opencode mcp list

# Добавить новый сервер
opencode mcp add

# OAuth-аутентификация
opencode mcp auth context7

# Список OAuth-статусов
opencode mcp auth ls

# Отладка подключения
opencode mcp debug context7
```

---

### opencode session

Управление сессиями.

```bash
opencode session <subcommand>
```

| Подкоманда | Функция |
|--------|------|
| `list` | Список сессий |

**Опции** (list):
| Опция | Коротко | Описание |
|------|--------|------|
| `--max-count` | `-n` | Ограничить N свежими сессиями |
| `--format` | | Формат вывода: table или json |

**Примеры**:
```bash
# Список сессий
opencode session list

# Последние 10 сессий
opencode session list -n 10

# Вывод в JSON
opencode session list --format json
```

---

### opencode stats

Статистика использования.

```bash
opencode stats
```

**Опции**:
| Опция | Описание |
|------|------|
| `--days` | Статистика за свежие N дней |
| `--tools` | Число показываемых инструментов (по умолчанию все) |
| `--models` | Детализация использования моделей (числом — Top N) |
| `--project` | Фильтр по проектам (пустая строка — текущий проект) |

**Примеры**:
```bash
# Статистика
opencode stats

# Последние 7 дней
opencode stats --days 7

# Топ-5 использования моделей
opencode stats --models 5
```

---

### opencode export

Экспорт данных сессии в JSON.

```bash
opencode export [sessionID]
```

Без ID сессии предложит выбрать.

**Примеры**:
```bash
opencode export abc123
```

---

### opencode import

Импорт данных сессий.

```bash
opencode import <file>
```

Поддерживает импорт из локальных файлов и URL шаринга OpenCode.

**Примеры**:
```bash
# Импорт из файла
opencode import session.json

# Импорт по URL шаринга
opencode import https://opncd.ai/share/abc123
```

---

### opencode github

Управление интеграцией GitHub.

```bash
opencode github <subcommand>
```

| Подкоманда | Функция |
|--------|------|
| `install` | Установка workflow GitHub Actions |
| `run` | Запуск GitHub Agent (для Actions) |

**Опции run**:
| Опция | Описание |
|------|------|
| `--event` | Mock-событие GitHub |
| `--token` | Персональный токен доступа GitHub |

**Примеры**:
```bash
# Установка Actions
opencode github install
```

---

### opencode pr

Забор ветки GitHub PR локально и старт OpenCode.

```bash
opencode pr <number>
```

Команда:
1. Забирает PR через `gh pr checkout` в локальную ветку `pr/<номер-PR>`
2. Для Fork PR автоматически добавляет remote репозитория
3. При ссылке на сессию OpenCode в описании PR — импортирует её
4. Стартует OpenCode TUI

**Предусловия**:
- Установлен и настроен `gh` CLI
- Текущий каталог — Git-репозиторий

**Примеры**:
```bash
# Забрать PR #123 и стартовать OpenCode
opencode pr 123

# Вы увидите:
# Fetching and checking out PR #123...
# Successfully checked out PR #123 as branch 'pr/123'
# Starting opencode...
```

---

### opencode acp

Старт сервера ACP (Agent Client Protocol).

```bash
opencode acp
```

Общение через nd-JSON в stdin и stdout.

**Опции**:
| Опция | Описание |
|------|------|
| `--cwd` | Рабочий каталог |
| `--port` | Порт прослушивания |
| `--hostname` | Адрес прослушивания |

---

### opencode upgrade

Обновление до свежей или указанной версии.

```bash
opencode upgrade [target]
```

**Опции**:
| Опция | Коротко | Описание |
|------|--------|------|
| `--method` | `-m` | Способ установки: curl, npm, pnpm, bun, brew |

**Примеры**:
```bash
# Обновить до свежей
opencode upgrade

# Обновить до указанной версии
opencode upgrade v1.0.5

# Откатить на 0.x
opencode upgrade 0.15.31
```

---

### opencode uninstall

Деинсталляция OpenCode с удалением связанных файлов.

```bash
opencode uninstall
```

**Опции**:
| Опция | Коротко | Описание |
|------|--------|------|
| `--keep-config` | `-c` | Сохранить файлы конфигурации |
| `--keep-data` | `-d` | Сохранить данные сессий и снапшоты |
| `--dry-run` | | Только показать удаляемое |
| `--force` | `-f` | Пропустить запросы подтверждений |

**Примеры**:
```bash
# Полная деинсталляция
opencode uninstall

# С сохранением конфигурации
opencode uninstall --keep-config

# Предпросмотр удаляемого
opencode uninstall --dry-run
```

---

## Глобальные опции

Все команды поддерживают глобальные опции:

| Опция | Коротко | Описание |
|------|--------|------|
| `--help` | `-h` | Показать помощь |
| `--version` | `-v` | Показать номер версии |
| `--print-logs` | | Печатать логи в stderr |
| `--log-level` | | Уровень логов: DEBUG, INFO, WARN, ERROR |

---

## Переменные окружения

| Переменная | Тип | Описание |
|------|------|------|
| `OPENCODE_CONFIG` | string | Путь файла конфигурации |
| `OPENCODE_CONFIG_DIR` | string | Путь каталога конфигурации |
| `OPENCODE_CONFIG_CONTENT` | string | Инлайн-JSON конфигурации |
| `OPENCODE_PERMISSION` | string | Инлайн-JSON конфигурации прав |
| `OPENCODE_AUTO_SHARE` | boolean | Автошаринг сессий |
| `OPENCODE_DISABLE_AUTOUPDATE` | boolean | Отключить проверку автообновлений |
| `OPENCODE_DISABLE_PRUNE` | boolean | Отключить чистку старых данных |
| `OPENCODE_DISABLE_TERMINAL_TITLE` | boolean | Отключить обновление заголовка терминала |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS` | boolean | Отключить плагины по умолчанию |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | boolean | Отключить автоскачивание LSP-серверов |
| `OPENCODE_DISABLE_AUTOCOMPACT` | boolean | Отключить автосжатие контекста |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | boolean | Включить экспериментальные модели |
| `OPENCODE_ENABLE_EXA` | boolean | Включить веб-поиск Exa |
| `OPENCODE_CLIENT` | string | Идентификатор клиента (по умолчанию `cli`) |
| `OPENCODE_GIT_BASH_PATH` | string | Путь Git Bash в Windows |

### Безопасность сервера

Настройка аутентификации `opencode serve` и `opencode web`:

| Переменная | Тип | Описание |
|------|------|------|
| `OPENCODE_SERVER_PASSWORD` | string | Пароль сервера (**настоятельно рекомендуем задать**) |
| `OPENCODE_SERVER_USERNAME` | string | Имя пользователя (по умолчанию `opencode`) |

::: warning Напоминание о безопасности
Без `OPENCODE_SERVER_PASSWORD` сервер **без защиты аутентификацией** — доступен кому угодно.
:::

**Пример**:
```bash
# Задать аутентификацию сервера
export OPENCODE_SERVER_PASSWORD=your-secure-password
export OPENCODE_SERVER_USERNAME=admin

opencode serve --hostname 0.0.0.0
```

### API-ключи провайдеров

API-ключи провайдеров задаются подходящими переменными окружения:

| Переменная | Описание |
|------|------|
| `ANTHROPIC_API_KEY` | API-ключ Anthropic |
| `OPENAI_API_KEY` | API-ключ OpenAI |
| `DEEPSEEK_API_KEY` | API-ключ DeepSeek |
| `GROQ_API_KEY` | API-ключ Groq |

### Экспериментальные переменные

> Источник: [cli.mdx](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/cli.mdx)

| Переменная | Тип | Описание |
|------|------|------|
| `OPENCODE_EXPERIMENTAL` | boolean | Включить все экспериментальные функции |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY` | boolean | Включить обнаружение иконок |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` | boolean | Отключить копирование выделением в TUI |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number | Тайм-аут Bash по умолчанию (миллисекунды) |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | number | Максимум выходных токенов LLM |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER` | boolean | Включить монитор файлов каталогов |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER` | boolean | Отключить монитор файлов каталогов |
| `OPENCODE_EXPERIMENTAL_OXFMT` | boolean | Включить форматтер oxfmt |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | boolean | Включить экспериментальный инструмент LSP |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | boolean | Включить вывод типов LSP |
| `OPENCODE_ENABLE_EXA` | boolean | Включить поиск кода Exa |

---

## Связанные материалы

- [Справочник опций конфигурации](./config-ref) — подробности файлов конфигурации
- [Шпаргалка слэш-команд](./commands) — команды внутри TUI
- [Список провайдеров моделей](./providers) — доступные модели

## Ссылки на исходники

Поведение ниже зафиксировано по [`v1.18.22`](https://github.com/anomalyco/opencode/tree/v1.18.22):

| Поведение | Исходники | Строки |
|------|------|------|
| Неинтерактивность `run` по умолчанию, вход Mini | [`packages/opencode/src/cli/cmd/run.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run.ts#L3-L15) | 3-15 |
| Параметры `--mini`, replay и `--no-replay` | [`packages/opencode/src/cli/cmd/tui.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L123-L175) | 123-175 |
| `--auto` и скрытый алиас совместимости | [`packages/opencode/src/cli/cmd/run.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run.ts#L242-L274) | 242-274 |
| Параметры автоподтверждения стандартного TUI | [`packages/opencode/src/cli/cmd/tui.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L108-L121) | 108-121 |
| Отображение параметров автоподтверждения стандартного TUI | [`packages/opencode/src/cli/cmd/tui.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L287-L295) | 287-295 |
| Режим Mini Shell | [`packages/opencode/src/cli/cmd/run/footer.prompt.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run/footer.prompt.tsx#L1055-L1094) | 1055-1094 |
