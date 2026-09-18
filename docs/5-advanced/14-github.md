---
title: 5.14 Интеграция GitHub
subtitle: OpenCode в GitHub Actions
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.14"
duration: 15 минут
practice: 20 минут
level: Продвинутый
description: Используйте OpenCode в GitHub Actions для разбора Issue, автоисправлений и ревью PR.
tags:
  - GitHub
  - CI/CD
  - Автоматизация
prerequisite:
  - 5.9 Удалённая разработка
---

# Интеграция GitHub

Глубокая интеграция OpenCode с процессами GitHub. Упомяните `/opencode` или `/oc` в комментарии к Issue или PR — OpenCode выполнит задачу на вашем GitHub Actions runner.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/github-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.14 Интеграция GitHub"
     data-zoom-src="/images/5-advanced/github-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Обзор: упоминание `/opencode` или `/oc` в Issue/PR-комментариях, запуск на своём раннере.
2. Workflow: файл `.github/workflows/opencode.yml`, триггеры `issue_comment`, `pull_request_review_comment`.
3. Опции: model (обязательно), agent, prompt, use_github_token, mentions.
4. Токены: OIDC (по умолчанию), GITHUB_TOKEN (встроенный), PAT (ручной).
5. События: пользовательские (issue_comment, PR-события) и репозиторные (schedule, workflow_dispatch).
6. Права: read-only (id-token: write + read) против write (id-token: write + write).
7. Сценарии: объяснение Issue, исправление, ревью PR, комментарии к строкам кода.
8. Ошибки: у OIDC нет `id-token: write`; `/opencode` не срабатывает; Fork PR; права; mentions.

</details>

## Возможности

- **Разбор вопросов**: пусть OpenCode смотрит Issue и объясняет проблему
- **Исправления и реализация**: пусть OpenCode чинит Issue или реализует функцию — работает в новой ветке и открывает PR
- **Ревью PR**: автоматическое ревью качества кода Pull Request
- **Безопасность**: OpenCode работает на вашем собственном GitHub runner, код не покидает ваше окружение

## Установка

В каталоге проекта GitHub-репозитория выполните:

```bash
opencode github install
```

Мастер проведёт вас через шаги: установка GitHub App, выбор провайдера и модели, создание workflow-файла, настройка secrets.

### Ручная настройка

<AdInArticle />

Можно настроить и вручную:

**1. Установка GitHub App**

Перейдите на [github.com/apps/opencode-agent](https://github.com/apps/opencode-agent) и убедитесь, что приложение установлено на целевой репозиторий.

**2. Добавление workflow**

Добавьте в `.github/workflows/opencode.yml` репозитория:

```yaml
name: opencode

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  opencode:
    if: |
      contains(github.event.comment.body, ' /oc') ||
      startsWith(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, ' /opencode') ||
      startsWith(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
```

> **Обратите внимание**: условие if комбинирует `startsWith` и `contains(' /oc')`, чтобы триггерная фраза стояла в начале строки или после пробела — без ложных срабатываний на URL и содержимое кода.

**3. Хранение API-ключей**

В настройках организации или проекта **Settings** > **Secrets and variables** > **Actions** добавьте нужные API-ключи.

## Опции конфигурации

| Опция | Обязат. | По умолчанию | Описание |
|------|------|--------|------|
| `model` | **Да** | - | Используемая модель, формат `provider/model` |
| `agent` | Нет | `default_agent` из конфига или `"build"` | Используемый агент, только primary-агент |
| `share` | Нет | Публичные репозитории `true` | Делиться ли ссылкой на сессию |
| `prompt` | Нет | - | Свой промпт, перекрывает поведение по умолчанию (для событий `schedule`/`workflow_dispatch`/`issues` обязателен) |
| `use_github_token` | Нет | `false` | Использовать GITHUB_TOKEN вместо обмена токена OpenCode App, пропустить OIDC |
| `mentions` | Нет | `/opencode,/oc` | Свои триггерные фразы (через запятую, без учёта регистра) |
| `oidc_base_url` | Нет | `https://api.opencode.ai` | Свой адрес обмена OIDC-токенов, нужен только для приватного GitHub App |

Источник: `opencode/github/action.yml:7-35`

### Про источник токенов

По умолчанию OpenCode через обмен OIDC-токенов получает install access token от OpenCode GitHub App, и коммиты, комментарии и PR показываются от имени этого приложения.

**Альтернатива 1: использование GITHUB_TOKEN**

Задайте `use_github_token: true`, чтобы пропустить обмен OIDC-токенов и использовать напрямую встроенный GITHUB_TOKEN runner GitHub Action:

```yaml
- name: Run OpenCode
  uses: anomalyco/opencode/github@latest
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    model: anthropic/claude-sonnet-4-20250514
    use_github_token: true
```

В workflow выдайте права:

```yaml
permissions:
  id-token: write
  contents: write
  pull-requests: write
  issues: write
```

**Альтернатива 2: персональный токен доступа (PAT)**

Можно использовать и [персональный токен доступа](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

## Как это работает

### Классификация событий

OpenCode делит события GitHub на два класса с разной логикой обработки:

| Класс | Типы событий | Особенности |
|------|----------|------|
| **Пользовательские события** | `issue_comment`, `pull_request_review_comment`, `issues`, `pull_request` | Есть информация о триггерящем, можно добавлять комментарии и reaction в Issue/PR |
| **События репозитория** | `schedule`, `workflow_dispatch` | Нет контекста Issue/PR, вывод только в лог или созданием PR |

Источник: `opencode/packages/opencode/src/cli/cmd/github.ts:141-143`

### Процесс обработки

```
1. Срабатывание события
   ↓
2. Проверка триггерной фразы (/opencode или /oc)
   ↓
3. Получение токена доступа (обмен OIDC или GITHUB_TOKEN)
   ↓
4. Проверка прав (только пользовательские события, нужны права admin или write)
   ↓
5. Добавление reaction 👀 (только пользовательские события, знак «в работе»)
   ↓
6. Обработка по типу события:
   - Issue: новая ветка → выполнение задачи → коммит → создание PR
   - Локальный PR: checkout ветки → выполнение задачи → коммит в тот же PR
   - Fork PR: добавить fork remote → выполнение задачи → пуш в fork
   - События репозитория: новая ветка → выполнение задачи → создание PR
   ↓
7. Создание комментария и снятие reaction
```

### Правила именования веток

Автоматически создаваемые OpenCode ветки именуются по правилам:

| Сценарий | Формат имени ветки | Пример |
|------|-----------|------|
| Исправление Issue | `opencode/issue{ID}-{timestamp}` | `opencode/issue42-20250108120000` |
| Операции PR | `opencode/pr{ID}-{timestamp}` | `opencode/pr15-20250108120000` |
| Задачи по расписанию | `opencode/schedule-{hex}-{timestamp}` | `opencode/schedule-a1b2c3-20250108120000` |
| Ручной запуск | `opencode/dispatch-{hex}-{timestamp}` | `opencode/dispatch-d4e5f6-20250108120000` |

Источник: `github.ts:1047-1059`

### Атрибуция Co-author

В код, коммиченный OpenCode, автоматически добавляется информация Co-authored-by с указанием триггерящего как соавтора:

```
Fix authentication issue

Co-authored-by: username <username@users.noreply.github.com>
```

> **Обратите внимание**: у события `schedule` триггерящего нет, поэтому информация Co-author не добавляется.

Источник: `github.ts:1061-1100`

## Подробно о настройке прав

Под разные сценарии нужны разные уровни прав:

### Только чтение (ревью, анализ)

```yaml
permissions:
  id-token: write      # Обязателен для обмена OIDC-токенов
  contents: read       # Чтение кода
  pull-requests: read  # Чтение информации PR
  issues: read         # Чтение информации Issue
```

### Запись (исправления, реализация)

```yaml
permissions:
  id-token: write       # Обязателен для обмена OIDC-токенов
  contents: write       # Создание веток, коммиты кода
  pull-requests: write  # Создание и обновление PR
  issues: write         # Создание комментариев
```

> **Подсказка**: при использовании OpenCode GitHub App правами управляет App. При `use_github_token: true` права выдавайте явно в workflow.

## Поддерживаемые события

| Тип события | Способ срабатывания | Описание |
|----------|----------|------|
| `issue_comment` | Комментарий к Issue или PR | Упомяните `/opencode` или `/oc` в комментарии |
| `pull_request_review_comment` | Комментарий к конкретной строке кода PR | Упомяните триггерную фразу при ревью кода |
| `issues` | Создание или правка Issue | Нужен вход `prompt` |
| `pull_request` | Создание или обновление PR | Для авторевью |
| `schedule` | Задачи по cron-расписанию | Нужен вход `prompt`, без вывода в комментарии |
| `workflow_dispatch` | Ручной запуск из интерфейса GitHub | Нужен вход `prompt` |

### Пример задачи по расписанию

```yaml
name: Scheduled OpenCode Task

on:
  schedule:
    - cron: "0 9 * * 1" # Каждый понедельник 9:00 UTC

jobs:
  opencode:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review the codebase for any TODO comments and create a summary.
            If you find issues worth addressing, open an issue to track them.
```

> **Обратите внимание**: событиям по расписанию нужен вход `prompt`, потому что извлекать инструкции не из чего. Вывод пишется в лог Actions, изменения кода создают PR.

### Пример авторевью PR

```yaml
name: opencode-review

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - uses: actions/checkout@v6
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Suggest improvements
```

Для события `pull_request` без переданного `prompt` OpenCode по умолчанию ревьюит PR.

### Пример разбора Issue

Автоматический разбор новых Issue; пример фильтрует аккаунты старше 30 дней для снижения спама:

```yaml
name: Issue Triage

on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Check account age
        id: check
        uses: actions/github-script@v7
        with:
          script: |
            const user = await github.rest.users.getByUsername({
              username: context.payload.issue.user.login
            });
            const created = new Date(user.data.created_at);
            const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
            return days >= 30;
          result-encoding: string

      - uses: actions/checkout@v6
        if: steps.check.outputs.result == 'true'

      - uses: anomalyco/opencode/github@latest
        if: steps.check.outputs.result == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review this issue. If there's a clear fix or relevant docs:
            - Provide documentation links
            - Add error handling guidance for code examples
            Otherwise, do not comment.
```

## Свои триггерные фразы

Параметром `mentions` задайте свои триггерные фразы:

```yaml
- uses: anomalyco/opencode/github@latest
  with:
    model: anthropic/claude-sonnet-4-20250514
    mentions: "/ai,/bot,/help"
```

Теперь OpenCode срабатывает на `/ai`, `/bot` или `/help`.

> **Обратите внимание**: сопоставление триггерных фраз нечувствительно к регистру, несколько фраз — через запятую.

## Обработка Fork PR

OpenCode умеет обрабатывать PR из Fork-репозиториев. Логика немного отличается от локальных PR:

### Локальные PR vs Fork PR

| Критерий | Локальные PR | Fork PR |
|--------|---------|---------|
| Источник ветки | Тот же репозиторий | Fork-репозиторий |
| Способ checkout | `git fetch origin && git checkout` | `git remote add fork && git fetch fork` |
| Цель пуша | Исходная ветка | Ветка Fork-репозитория |
| Имя ветки | Сохраняется исходное имя ветки | Новая локальная ветка `opencode/pr{ID}-{timestamp}` |

### Процесс работы

1. Проверяется, отличается ли `headRepository` PR от `baseRepository`
2. Fork-репозиторий добавляется как remote
3. Подтягивается код Fork-ветки
4. Создаётся локальная ветка для выполнения задачи
5. Изменения пушатся обратно в исходную ветку Fork-репозитория

Источник: `github.ts:1035-1045`

> **Обратите внимание**: для Fork PR мейнтейнер Fork-репозитория должен разрешить пуш апстриму (галочка "Allow edits from maintainers" на странице PR).

## Команды CLI

### opencode pr

Быстрый checkout PR с запуском OpenCode:

```bash
opencode pr <номер-PR>
```

Процесс выполнения:
1. Автоматический fetch ветки PR
2. Создание локальной ветки `pr/<номер-PR>`
3. Checkout на эту ветку
4. Автозапуск OpenCode

**Пример**:

```bash
# Забрать PR #123
opencode pr 123
```

**Обработка Fork PR**:

Для PR из Fork команда автоматически:
1. Добавляет Fork как remote
2. Настраивает upstream-трекинг
3. Гарантирует пуш в верный репозиторий

**Импорт связанной сессии**:

Если в описании PR есть ссылка на сессию OpenCode (вроде `https://opncd.ai/s/abc123`), команда автоматически импортирует историю сессии — продолжите прошлый контекст диалога.

### opencode github install

Интерактивная установка GitHub Agent:

```bash
opencode github install
```

Процесс выполнения:
1. Определяет информацию Git-репозитория текущего каталога
2. Ведёт через установку OpenCode GitHub App
3. Выбор AI-провайдера и модели
4. Генерация файла `.github/workflows/opencode.yml`
5. Подсказки по настройке secrets

### opencode github run

Запуск Agent в GitHub Actions (вручную вызывать обычно не нужно):

```bash
opencode github run
```

#### Локальное тестирование

Для отладки при разработке — локальная эмуляция окружения GitHub Actions:

```bash
MODEL=anthropic/claude-sonnet-4-20250514 \
  ANTHROPIC_API_KEY=sk-ant-api03-xxxxx \
  GITHUB_RUN_ID=dummy \
  opencode github run \
    --token github_pat_xxxxx \
    --event '{"eventName":"issue_comment","repo":{"owner":"ваше-имя","repo":"имя-репо"},"actor":"имя-триггерящего","payload":{"issue":{"number":1},"comment":{"id":1,"body":"/opencode объясни эту проблему"}}}'
```

Описание параметров:

| Переменная окружения/параметр | Описание |
|--------------|------|
| `MODEL` | Используемая модель, формат `provider/model` |
| `ANTHROPIC_API_KEY` | API-ключ провайдера моделей |
| `GITHUB_RUN_ID` | Эмуляция окружения GitHub Actions, для локальных тестов годится `dummy` |
| `--token` | Персональный токен доступа GitHub для проверки прав и операций с репозиторием |
| `--event` | Эмулируемый JSON события GitHub |

#### Шаблоны JSON событий

**Событие комментария к Issue:**

```json
{
  "eventName": "issue_comment",
  "repo": {"owner": "owner", "repo": "repo-name"},
  "actor": "username",
  "payload": {
    "issue": {"number": 42},
    "comment": {"id": 1, "body": "/opencode объясни эту проблему"}
  }
}
```

**Событие комментария к PR:**

```json
{
  "eventName": "issue_comment",
  "repo": {"owner": "owner", "repo": "repo-name"},
  "actor": "username",
  "payload": {
    "issue": {"number": 15, "pull_request": {}},
    "comment": {"id": 1, "body": "/opencode оптимизируй этот код"}
  }
}
```

**Событие комментария к строке кода PR:**

```json
{
  "eventName": "pull_request_review_comment",
  "repo": {"owner": "owner", "repo": "repo-name"},
  "actor": "username",
  "payload": {
    "pull_request": {"number": 15},
    "comment": {
      "id": 1,
      "body": "/opencode добавь обработку ошибок",
      "path": "src/utils/api.ts",
      "diff_hunk": "@@ -10,6 +10,8 @@\n async function fetchData() {\n-  return fetch(url)\n+  const response = await fetch(url)\n+  return response.json()\n }",
      "line": 12,
      "original_line": 10,
      "position": 5,
      "commit_id": "abc123",
      "original_commit_id": "def456"
    }
  }
}
```

## Примеры использования

### Объяснение Issue

Добавьте комментарий в GitHub Issue:

```
/opencode explain this issue
```

OpenCode прочитает всю ветку (включая все комментарии) и ответит объяснением.

### Исправление Issue

В GitHub Issue:

```
/opencode fix this
```

OpenCode создаст ветку, внесёт изменения и откроет PR.

### Ревью PR с изменениями

Оставьте комментарий в GitHub PR:

```
Delete the attachment from S3 when the note is removed /oc
```

OpenCode внесёт запрошенные изменения и закоммитит в тот же PR.

### Ревью конкретной строки кода

На вкладке "Files" в PR оставьте комментарий прямо на строке кода. OpenCode автоматически определит файл, номер строки и diff-контекст:

```
[комментарий на конкретной строке на вкладке Files]
/oc add error handling here
```

При комментировании конкретных строк OpenCode получает:
- точный проверяемый файл
- конкретные строки кода
- окружающий diff-контекст
- информацию о номерах строк

Это даёт точные запросы без ручного указания путей файлов и номеров строк.

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Ошибка `Could not fetch an OIDC token` | В workflow нет права `id-token: write` | Добавьте `permissions: id-token: write` |
| `/opencode` не срабатывает | Неверный формат триггерной фразы в комментарии (например, внутри URL) | Триггерная фраза — в начале строки или после пробела |
| Fork PR не пушит изменения | Мейнтейнер Fork не разрешил пуш апстриму | Попросите мейнтейнера Fork включить "Allow edits from maintainers" |
| События Schedule без комментариев в выводе | У задач по расписанию нет контекста Issue/PR | Ожидаемо: вывод пишется в лог Actions |
| Ошибка `User xxx does not have write permissions` | У триггерящего нет прав записи в репозиторий | Триггерить могут только коллабораторы с правами admin или write |
| Свои mentions не работают | Несколько фраз неверно разделены запятыми | Формат `mentions: "/ai,/bot"` |
| Недостаточно прав при `use_github_token` | Не выданы нужные права workflow | Добавьте права `contents: write`, `pull-requests: write` и т. д. |

## Связанные разделы

- [5.15 Интеграция GitLab](./15-gitlab) — если пользуетесь GitLab, настройка там
- [5.16 Функция шаринга](./16-share) — шаринг сессий OpenCode
- [Шпаргалка/Справочник CLI](../appendix/cli) — полный список CLI-команд
