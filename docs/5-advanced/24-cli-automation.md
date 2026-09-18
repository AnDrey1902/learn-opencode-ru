---
title: "Автоматизация CLI: OpenCode в скриптах"
subtitle: "Автоматизация CLI"
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.24"
duration: 25 минут
practice: 30 минут
level: Продвинутый
description: "Научитесь автоматизировать OpenCode из командной строки: неинтерактивный режим, удалённый сервер, интеграция CI/CD — полный автопилот процессов."
tags:
  - CLI
  - Автоматизация
  - CI/CD
  - Удалённый доступ
prerequisite:
  - 5.1a Основы конфигурации
  - 2.2 Управление сессиями
---

# Автоматизация CLI: OpenCode в скриптах

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/24-cli-automation-notes.mini.jpeg"
     alt="Шпаргалка урока: автоматизация CLI"
     data-zoom-src="/images/5-advanced/24-cli-automation-notes.jpeg" />

---

## Что вы сможете после урока

- Вызывать OpenCode в скриптах без участия человека
- Поднимать удалённый сервер для общих AI-сессий команды
- Встраивать OpenCode в CI/CD-конвейеры для авторевью кода
- Одной командой забирать PR и стартовать нужную сессию OpenCode

---

## С какими трудностями вы столкнулись

- Каждый раз открывать TUI и вручную вводить команды — сплошная рутина
- Хочется гонять OpenCode на сервере, а графического интерфейса нет
- В CI/CD хочется автоматической AI-проверки кода, а как встроить — неясно
- В командной работе хочется всем подключаться к одному инстансу OpenCode

---

## Когда это пригодится

- **Автоматизация скриптами**: пакетная обработка нескольких проектов, задачи по расписанию
- **Интеграция CI/CD**: ревью кода, автоисправления, генерация документации
- **Удалённая разработка**: запуск на сервере, подключение с локального терминала
- **Командная работа**: общий инстанс OpenCode, совместное редактирование

---

## 🎒 Перед началом

- [ ] Пройден урок [5.1a Основы конфигурации](./01a-config-basics)
- [ ] Умеете запускать `opencode` в терминале для старта TUI
- [ ] Знакомы с базовыми shell-командами (`cd`, `echo`, конвейеры)

---

## Главная идея

У OpenCode четыре терминальных режима работы:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Режимы работы OpenCode                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐              ┌─────────────────┐                  │
│   │  Интерактив TUI  │              │ Неинтерактив CLI │                  │
│   │                 │              │                 │                  │
│   │  opencode       │              │  opencode run   │                  │
│   │                 │              │                 │                  │
│   │  • Повседневная │              │  • Для скриптов │                  │
│   │    разработка   │              │  • Для CI/CD    │                  │
│   │  • Живой диалог │              │  • Автопроцессы │                  │
│   │  • Решения      │              │                 │                  │
│   │    человека     │              │                 │                  │
│   └─────────────────┘              └─────────────────┘                  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    Компактный интерактив                          │   │
│   │                                                                   │   │
│   │  opencode --mini   →  сжатый интерфейс для связного диалога       │   │
│   │                        и shell-операций                           │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      Режим сервера                                │   │
│   │                                                                   │   │
│   │  opencode serve    →  headless-сервер (только API)                 │   │
│   │  opencode web      →  сервер с веб-интерфейсом                    │   │
│   │  opencode attach   →  подключение к удалённому серверу            │   │
│   │                                                                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Главные различия**:

| Режим | Команда | Особенности |
|------|------|------|
| TUI | `opencode` | Интерактив, для работы руками |
| Mini | `opencode --mini` | Сжатый интерактив, связный ввод с replay сессий |
| Run | `opencode run` | Неинтерактив, выполнил и вышел |
| Serve | `opencode serve` | Headless-сервер, только API |
| Web | `opencode web` | Сервер с веб-интерфейсом |

### Компактный интерактив: opencode --mini

`opencode --mini` — открытый вход в сжатый интерактив. Не пишите `opencode run --mini`; команда `opencode run` по умолчанию так и остаётся неинтерактивной «выполнил задачу и вышел».

```bash
# Старт сжатого интерактива
opencode --mini

# Продолжить свежую сессию; по умолчанию replay истории сессии, при ресайзе терминала replay повторяется
opencode --mini --continue

# Продолжить сессию без replay истории
opencode --mini --continue --no-replay
```

В поле ввода Mini восклицательный знак `!` в начале включает **режим Shell**. Продолжайте вводить команду и отправляйте на выполнение; выход сразу по <kbd>Esc</kbd> либо клавишей <kbd>Backspace</kbd> при курсоре в начале ввода.

---

## Часть 1: неинтерактив opencode run

### 1.1 Базовое использование

`opencode run` — самая частая CLI-команда. Даже запущенная прямо из терминала, она по умолчанию не уходит в интерактив, а выполняет задачу и автоматически выходит.

```bash
# Простейшее использование
opencode run "Перечисли все TypeScript-файлы этого проекта"

# Вы увидите:
# > opencode · anthropic/claude-sonnet-4-5
#
# ✱ Glob "**/*.ts" in . · 12 matches
#
# В этом проекте 12 TypeScript-файлов:
# - src/index.ts
# - src/utils.ts
# ...
```

### 1.2 Частые опции

| Опция | Описание | Пример |
|------|------|------|
| `-m, --model` | Указать модель | `-m anthropic/claude-opus-4-5` |
| `--agent` | Указать Agent | `--agent code-reviewer` |
| `-f, --file` | Приложить файлы | `-f src/main.ts -f package.json` |
| `-c, --continue` | Продолжить прошлую сессию | `-c` |
| `-s, --session` | Указать ID сессии | `-s session_abc123` |
| `--format json` | Вывод в JSON | `--format json` |
| `--share` | Автошаринг сессии | `--share` |
| `--title` | Заголовок сессии | `--title "Чиним баг входа"` |

### 1.3 Боевые примеры

#### Пример 1: скрипт ревью кода

```bash
#!/bin/bash
# code-review.sh - авторевью изменений текущей ветки

# Список изменённых файлов
CHANGED_FILES=$(git diff --name-only main)

# Нет изменений — выходим
if [ -z "$CHANGED_FILES" ]; then
  echo "Изменений не найдено"
  exit 0
fi

# Ревью каждого файла
for file in $CHANGED_FILES; do
  echo "Ревью: $file"
  opencode run -f "$file" "Проверь качество кода этого файла, фокус: 1) потенциальные баги 2) производительность 3) стиль кода"
done
```

#### Пример 2: чтение из stdin

```bash
# Конвейерный ввод
cat error.log | opencode run "Разбери этот лог ошибок, найди первопричину"

# В связке с git diff
git diff main | opencode run "Проверь, есть ли проблемы в этих изменениях"
```

#### Пример 3: вывод в JSON (удобно скриптам)

```bash
# JSON-вывод
opencode run --format json "Перечисли все комментарии TODO" > todos.json

# Пример JSON-вывода:
# {"type":"text","timestamp":1705316400000,"sessionID":"xxx","part":{"text":"Нашёл 5 TODO..."}}
```

---

## Часть 2: режим сервера

### 2.1 Запуск удалённого сервера

::: info 🤔 Когда нужен удалённый сервер?
- **Общие сессии**: участники команды подключаются к одному инстансу OpenCode
- **Разработка на сервере**: запуск на удалённом сервере, подключение с локального терминала
- **Без холодного старта**: MCP-серверы всегда resident — нет, всегда наготове, `opencode run --attach` подключается напрямую
:::

#### opencode serve (headless-режим)

```bash
# Старт headless-сервера (только API, без интерфейса)
opencode serve

# Вы увидите:
# Warning: OPENCODE_SERVER_PASSWORD is not set; server is unsecured.
# opencode server listening on http://localhost:4096
```

::: warning ⚠️ Предупреждение безопасности
По умолчанию `opencode serve` **без защиты аутентификацией**.

Но по умолчанию слушается только `127.0.0.1` (localhost) — снаружи по сети напрямую не достучаться. Только когда вы:
- открываете все сетевые интерфейсы через `--hostname 0.0.0.0`
- у сервера белый IP и порт открыт в файрволе

...возникают риски безопасности.

**При открытии доступа наружу пароль обязателен**:
```bash
# Задать пароль сервера
export OPENCODE_SERVER_PASSWORD=your-secure-password

# Затем стартовать
opencode serve
# Теперь доступ с аутентификацией
```
:::

#### opencode web (режим с веб-интерфейсом)

```bash
# Старт сервера с веб-интерфейсом
opencode web

# Вы увидите:
# Warning: OPENCODE_SERVER_PASSWORD is not set; server is unsecured.
#
#   Local access:      http://localhost:4096
#   Network access:    http://192.168.1.100:4096
```

### 2.2 Опции сервера

| Опция | Описание | По умолчанию |
|------|------|--------|
| `--port` | Порт прослушивания | Авто (в приоритете 4096) |
| `--hostname` | Адрес прослушивания | 127.0.0.1 |
| `--mdns` | Включить обнаружение сервисов mDNS | false |
| `--mdns-domain` | Домен mDNS | opencode.local |
| `--cors` | Домены белого списка CORS | - |

```bash
# Слушать все сетевые интерфейсы (доступ по локальной сети)
opencode serve --hostname 0.0.0.0

# Указать порт
opencode serve --port 8080

# Включить обнаружение mDNS (в локальной сети доступен как opencode.local)
opencode serve --hostname 0.0.0.0 --mdns
```

### 2.3 Настройка безопасности

**Переменные окружения**:

| Переменная | Описание |
|------|------|
| `OPENCODE_SERVER_PASSWORD` | Пароль сервера |
| `OPENCODE_SERVER_USERNAME` | Имя пользователя (по умолчанию opencode) |

```bash
# Задать пароль и имя пользователя
export OPENCODE_SERVER_USERNAME=admin
export OPENCODE_SERVER_PASSWORD=MySecurePassword123!

opencode serve --hostname 0.0.0.0
```

::: info 💡 Почему только переменные окружения?
Настройки с паролями **не поддерживаются в файле конфигурации `opencode.json`** — только через переменные окружения.

Это ради безопасности — чтобы пароли случайно не уехали в Git-репозиторий.

Глобальный конфиг `~/.config/opencode/opencode.json` поддерживает лишь серверные опции без секретов:
```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "opencode.local",
    "cors": ["http://example.com"]
  }
}
```
:::

### 2.4 Подключение к удалённому серверу

#### Подключение через attach

```bash
# Подключиться к удалённому серверу локально
opencode attach http://192.168.1.100:4096

# Указать рабочий каталог
opencode attach http://192.168.1.100:4096 --dir /projects/myapp
```

#### Подключение через run

```bash
# Сначала стартовать на сервере
opencode serve --hostname 0.0.0.0

# На другой машине подключиться и выполнить
opencode run --attach http://192.168.1.100:4096 "Разбери архитектуру этого проекта"
```

---

## Часть 3: интеграция CI/CD

### 3.1 Пример GitHub Actions

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup OpenCode
        run: |
          curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode/main/install | bash
          echo "$HOME/.opencode/bin" >> $GITHUB_PATH

      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Забрать изменённые файлы
          FILES=$(git diff --name-only origin/main...HEAD | head -10)

          for file in $FILES; do
            echo "Ревью: $file"
            opencode run -f "$file" --title "AI Review: $file" \
              "Как ревьюер кода проверь изменения этого файла. Смотри:
              1. Потенциальные баги и проблемы безопасности
              2. Читаемость и поддерживаемость кода
              3. Соответствие лучшим практикам

              Формат вывода:
              - 🟢 Принято
              - 🟡 Желательно улучшить
              - 🔴 Чинить обязательно"
          done
```

### 3.2 Пример GitLab CI

```yaml
# .gitlab-ci.yml
ai-review:
  stage: test
  image: node:20
  script:
    - curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode/main/install | bash
    - export PATH="$HOME/.opencode/bin:$PATH"
    - |
      git diff --name-only origin/main...$CI_COMMIT_SHA | while read file; do
        opencode run -f "$file" "Ревью кода: $file"
      done
  only:
    - merge_requests
```

### 3.3 Шаблон скрипта автоматизации

```bash
#!/bin/bash
# auto-fix.sh - автоисправление проблем стиля кода

set -e

# Проверить незакоммиченные изменения
if ! git diff --quiet; then
  echo "Ошибка: есть незакоммиченные изменения — сначала закоммитьте или отложите"
  exit 1
fi

# Забрать все проверяемые файлы
FILES=$(find src -name "*.ts" -o -name "*.tsx")

for file in $FILES; do
  echo "Обработка: $file"

  opencode run -f "$file" \
    "Исправь проблемы стиля кода этого файла, не меняя логику работы. Фокус:
    1. Конвенции именования переменных
    2. Отступы и форматирование кода
    3. Удали неиспользуемые импорты
    4. Добавь нужные комментарии"
done

echo "Все файлы обработаны"
```

---

## Часть 4: команда opencode pr

### 4.1 Что за функция

`opencode pr` — команда специально для работы с GitHub PR. Она:

1. Забирает указанный PR локально
2. Автоматически создаёт ветку `pr/<номер-PR>`
3. Если в описании PR есть ссылка на сессию OpenCode — импортирует её

```bash
# Забрать PR и стартовать OpenCode
opencode pr 123

# Вы увидите:
# Fetching and checking out PR #123...
# Successfully checked out PR #123 as branch 'pr/123'
#
# Starting opencode...
```

### 4.2 Сценарии использования

| Сценарий | Описание |
|------|------|
| Ревью чужих PR | Забрать одним действием, ревьюить прямо в OpenCode |
| Продолжение прошлой сессии | Автор PR поделился ссылкой на сессию — восстанавливаете контекст |
| Обработка Fork PR | Автоматически добавляет Fork remote, верно настраивает апстрим |

### 4.3 Предусловия

```bash
# Убедитесь, что установлен gh CLI
gh --version

# Убедитесь, что прошли аутентификацию
gh auth status
```

::: details Как установить gh CLI
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```
:::

---

## Часть 5: управление сессиями через CLI

### 5.1 Список сессий

```bash
# Список всех сессий
opencode session list

# Вы увидите:
# Session ID              Title                      Updated
# ─────────────────────────────────────────────────────────────
# session_abc123          Fix login bug              Today 14:30
# session_def456          Add user profile           Yesterday

# Ограничить число
opencode session list -n 10

# Формат JSON (удобно скриптам)
opencode session list --format json
```

### 5.2 Экспорт сессий

```bash
# Экспорт указанной сессии
opencode export session_abc123 > backup.json

# Без ID — интерактивный выбор
opencode export > backup.json
```

### 5.3 Импорт сессий

```bash
# Импорт из файла
opencode import backup.json

# Импорт по ссылке шаринга
opencode import https://opncd.ai/share/abc123
```

---

## Часть 6: другие полезные команды

### 6.1 opencode models

```bash
# Список всех доступных моделей
opencode models

# Список моделей конкретного провайдера
opencode models anthropic

# Подробности (включая цены)
opencode models --verbose

# Обновить кэш моделей
opencode models --refresh
```

### 6.2 opencode stats

```bash
# Статистика использования
opencode stats

# Последние 7 дней
opencode stats --days 7

# Детализация по моделям
opencode stats --models

# Только текущий проект
opencode stats --project ""
```

### 6.3 opencode upgrade и uninstall

```bash
# Обновить до свежей версии
opencode upgrade

# Обновить до указанной версии
opencode upgrade 0.1.50

# Установка указанным способом
opencode upgrade --method npm

# Деинсталляция (с сохранением конфигурации)
opencode uninstall --keep-config

# Предпросмотр удаляемого
opencode uninstall --dry-run
```

---

## Контрольные пункты ✅

- [ ] Умеете выполнять разовые задачи через `opencode run`
- [ ] Умеете стартовать удалённый сервер через `opencode serve` и задавать пароль
- [ ] Умеете подключаться к удалённому серверу через `opencode attach`
- [ ] Умеете забирать и обрабатывать GitHub PR через `opencode pr`
- [ ] Умеете смотреть историю сессий через `opencode session list`
- [ ] Умеете бэкапить и восстанавливать сессии через `opencode export/import`

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| `opencode serve` ругается "address already in use" | Порт занят | Смените порт: `--port 8080` |
| Удалённое подключение отклонено | Файрвол или настройка hostname | Проверьте `--hostname 0.0.0.0` и файрвол |
| `opencode pr` ругается "gh CLI not found" | Не установлен GitHub CLI | Сначала установите gh и пройдите аутентификацию |
| `opencode run` вечно ждёт | AI выполняет долгую задачу | В скриптах добавляйте тайм-аут: `timeout 60 opencode run ...` |
| Не парсится JSON-вывод | Вывод содержит несколько строк JSON | Делите по переводам строк — каждая строка отдельный JSON-объект |
| Предупреждение про сервер без аутентификации | Пароль не задан | `export OPENCODE_SERVER_PASSWORD=xxx` |

---

## Итоги урока

Вы научились:

1. **Неинтерактивному режиму**: вызову OpenCode в скриптах через `opencode run`
2. **Режиму сервера**: удалённым сервисам через `opencode serve` и `web`
3. **Настройке безопасности**: защите сервера через `OPENCODE_SERVER_PASSWORD`
4. **Интеграции CI/CD**: встраиванию OpenCode в автопроцессы
5. **Обработке PR**: забору и обработке PR одной командой `opencode pr`
6. **Управлению сессиями**: спискам, экспорту и импорту сессий через CLI-команды

---

## Анонс следующего урока

> Этот урок — последний в продвинутом руководстве. Дальше можете:
> - Заглянуть в [шпаргалку](/appendix/) за справочником CLI-команд
> - Попробовать кейсы [сценарной практики](/4-scenarios/) по интеграции CI/CD
> - Углубиться в [разработку на SDK](/5-advanced/10a-sdk-basics) и писать свои инструменты интеграции

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> База версий: [`v1.18.22`](https://github.com/anomalyco/opencode/tree/v1.18.22)

| Функция | Путь к файлу | Строки |
|-----|---------|------|
| Неинтерактив `run` по умолчанию и вход Mini | [`packages/opencode/src/cli/cmd/run.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run.ts#L3-L15) | 3-15 |
| Параметры `--mini`, `--no-replay` и проброс входов | [`packages/opencode/src/cli/cmd/tui.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L123-L175) | 123-175 |
| Режим Mini Shell | [`packages/opencode/src/cli/cmd/run/footer.prompt.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run/footer.prompt.tsx#L1055-L1094) | 1055-1094 |
| Реализация команды `opencode serve` | [`packages/opencode/src/cli/cmd/serve.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/serve.ts#L6-L24) | 6-24 |
| Реализация команды `opencode web` | [`packages/opencode/src/cli/cmd/web.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/web.ts#L31-L84) | 31-84 |
| Реализация команды `opencode pr` | [`packages/opencode/src/cli/cmd/pr.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/pr.ts#L8-L115) | 8-115 |
| Переменные окружения аутентификации сервера | [`packages/core/src/flag/flag.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/flag/flag.ts#L32-L33) | 32-33 |
| Логика аутентификации сервера | [`packages/opencode/src/server/auth.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/auth.ts#L17-L47) | 17-47 |

**Ключевые переменные окружения**:
- `OPENCODE_SERVER_PASSWORD`: пароль сервера
- `OPENCODE_SERVER_USERNAME`: имя пользователя сервера (по умолчанию opencode)

</details>
