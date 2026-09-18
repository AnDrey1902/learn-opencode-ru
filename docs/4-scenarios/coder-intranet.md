---
title: B6 Интранет и офлайн
subtitle: OpenCode без внешнего интернета
course: Практический курс OpenCode на русском языке
stage: Этап 4
lesson: "4.B6"
duration: 25 минут
practice: 15 минут
level: Продвинутый
description: "Настройте OpenCode для корпоративного интранета или офлайн-окружения: отключите все внешние запросы, используйте локальный список моделей и внутренний AI-шлюз."
tags:
  - Интранет
  - Офлайн
  - Корпорация
  - Деплой
prerequisite:
  - 1.4 Подключение моделей
  - 5.1 Всё о конфигурации
---

# Интранет и офлайн

> 💡 **Коротко**: закройте 7 выключателями все внешние запросы — и OpenCode заработает в интранете.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/4-scenarios/coder-intranet-notes.mini.jpeg"
     alt="Шпаргалка урока: B6 Интранет и офлайн"
     data-zoom-src="/images/4-scenarios/coder-intranet-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Идея: отключить внешние запросы + доступ к списку моделей + доступ к шлюзу.
2. Два варианта списка моделей: A — полный офлайн (`OPENCODE_DISABLE_MODELS_FETCH=true` + `OPENCODE_MODELS_PATH`); B — зеркало внутри сети (`OPENCODE_MODELS_URL`).
3. Внешние запросы: models.dev → `DISABLE_MODELS_FETCH`, npm → `npm config set registry`, GitHub → `DISABLE_UPDATE_CHECK`, LSP → `DISABLE_LSP_DOWNLOAD`.
4. Ловушки: `@opencode-ai/plugin` зависает → `mkdir -p ~/.config/opencode/node_modules`; надолго → npm-зеркало или `DISABLE_PROJECT_CONFIG=true`.
5. Конфиг шлюза: `opencode.json` с `enabled_providers`, `api` (внутренний URL), `model` (например, `corp-gateway/qwen2.5-72b`).
6. Отладка: `opencode run "test" --print-logs --log-level DEBUG`, маркеры `service=bun`; 401/403 — проверить токен.

</details>

---

## Что вы сможете после урока

- Запускать OpenCode в полностью изолированном окружении
- Использовать локально закэшированный список моделей без models.dev
- Подключаться к внутреннему AI-шлюзу компании без единого внешнего запроса
- Разбирать типовые интранет-проблемы «зависание на старте» и «сетевые тайм-ауты»
- Решить самую частую интранет-проблему — «виснущую установку зависимостей» (`@opencode-ai/plugin`)

---

## С какими трудностями вы столкнулись

- Корпоративный интранет без внешнего интернета — OpenCode виснет на старте
- Выставили `OPENCODE_DISABLE_MODELS_FETCH=true`, но всё равно висит
- Непонятно, какие вообще внешние адреса запрашивает OpenCode
- Хотите использовать внутренний AI-шлюз компании, но непонятно как настроить
- **Главная проблема**: после старта нет никаких ошибок, но ничего не движется, и в логах нет строк про "loading plugin" (типичный симптом висящей установки SDK `@opencode-ai/plugin`)

---

## Когда это пригодится

- Корпоративный интранет: машины без доступа наружу
- Требования безопасности и комплаенс: данным запрещено покидать интранет
- Офлайн-разработка (самолёт, серверная без сети)
- CI/CD-окружение: ускорить старт и избежать сетевых флуктуаций

---

## 🎒 Перед началом

- [ ] Рабочий внутренний AI-шлюз (или локальная Ollama)
- [ ] Возможность скачать `https://models.dev/api.json` с машины с интернетом
- [ ] Знакомы с базовой настройкой из [1.4 Подключение моделей](../1-start/04-connect)
- [ ] **(Необязательно) Проверьте, установлен ли ripgrep**: `rg --version`

::: tip 💡 Проверка ripgrep
В интранете рекомендуем заранее проверить, установлен ли `rg`, — иначе функция grep у AI будет падать.
:::

---

## Основная идея

При старте OpenCode пытается выполнить следующие внешние запросы:

| Запрос | Назначение | Как отключить |
|-----|------|---------|
| `models.dev/api.json` | Получение списка моделей | Вариант A (полный офлайн): `OPENCODE_DISABLE_MODELS_FETCH=true` + `OPENCODE_MODELS_PATH=...`; вариант B (интранет-зеркало): только `OPENCODE_MODELS_URL=https://...` (без `OPENCODE_DISABLE_MODELS_FETCH=true`) |
| npm registry | Установка встроенных плагинов | `OPENCODE_DISABLE_DEFAULT_PLUGINS=true` |
| GitHub releases | Проверка обновлений | `OPENCODE_DISABLE_AUTOUPDATE=true` или `autoupdate: false` |
| Скачивание LSP-серверов | Языковые серверы | `OPENCODE_DISABLE_LSP_DOWNLOAD=true` |
| Загрузка удалённых skill | Внешние skill | `OPENCODE_DISABLE_EXTERNAL_SKILLS=true` |
| Загрузка конфигурации проекта | Сканирование .opencode/ | `OPENCODE_DISABLE_PROJECT_CONFIG=true` |
| Функция шаринга | Делиться сессиями | `OPENCODE_DISABLE_SHARE=true` |

::: info 📖 Два варианта списка моделей
- Полный офлайн: скачайте `models.json`, задайте `OPENCODE_MODELS_PATH` и включите `OPENCODE_DISABLE_MODELS_FETCH=true`
- Интранет-зеркало: интранет отдаёт `https://<host>/api.json`, задайте `OPENCODE_MODELS_URL=https://<host>` и НЕ задавайте `OPENCODE_DISABLE_MODELS_FETCH=true`

Если заданы одновременно `OPENCODE_MODELS_PATH` и `OPENCODE_MODELS_URL`, приоритет — у локального файла из `PATH`.
:::

**Закройте все 7 типов запросов — и OpenCode будет работать в чистом интранете.**

::: info 📋 Проверьте и файл конфигурации
Помимо переменных окружения убедитесь, что в `opencode.json` **нет** следующего (иначе внешние запросы всё равно пойдут):

```jsonc
{
  "skills": {
    "urls": ["https://..."]  // Удалить URL удалённых skill
  },
  "instructions": [
    "https://..."  // Удалить удалённые instruction
  ],
  "auth": {
    "example.com": {
      "type": "wellknown"  // Удалить wellknown-аутентификацию
    }
  }
}
```

**`.well-known/opencode`** — механизм загрузки удалённой конфигурации: даже с выставленными переменными окружения `wellknown`-аутентификация в конфиге всё равно вызовет внешние запросы.
:::

---

## Повторите за мной

### Шаг 1: скачайте файл списка моделей

**Зачем**
OpenCode должен знать, какие модели доступны. Скачайте файл на машине с интернетом и перенесите на интранет-машину.

На машине **с доступом наружу** выполните:

```bash
curl -o models.json https://models.dev/api.json
```

**Вы должны увидеть**: в текущем каталоге появится `models.json` (около 500KB).

### Шаг 2: положите список моделей на интранет-машину

**Зачем**
Интранет-машине нужен этот файл, чтобы знать возможности моделей (лимиты контекста, поддержка tool_call и т. д.).

Скопируйте `models.json` в фиксированное место интранет-машины:

```bash
# Рекомендуем каталог ~/.cache/opencode/
mkdir -p ~/.cache/opencode
cp models.json ~/.cache/opencode/models.json
```

### Шаг 3: задайте переменные окружения

**Зачем**
Главный шаг. После этих переменных OpenCode не сделает ни одного внешнего запроса.

::: code-group
```bash [macOS/Linux — до конца сессии]
export OPENCODE_DISABLE_MODELS_FETCH=true
export OPENCODE_MODELS_PATH=~/.cache/opencode/models.json
export OPENCODE_DISABLE_DEFAULT_PLUGINS=true
export OPENCODE_DISABLE_AUTOUPDATE=true
export OPENCODE_DISABLE_LSP_DOWNLOAD=true
export OPENCODE_DISABLE_EXTERNAL_SKILLS=true
export OPENCODE_DISABLE_PROJECT_CONFIG=true
export OPENCODE_DISABLE_SHARE=true
```

```bash [macOS/Linux — навсегда]
# Добавьте в ~/.bashrc или ~/.zshrc
cat >> ~/.zshrc << 'EOF'
# Конфигурация OpenCode для интранета
export OPENCODE_DISABLE_MODELS_FETCH=true
export OPENCODE_MODELS_PATH=~/.cache/opencode/models.json
export OPENCODE_DISABLE_DEFAULT_PLUGINS=true
export OPENCODE_DISABLE_AUTOUPDATE=true
export OPENCODE_DISABLE_LSP_DOWNLOAD=true
export OPENCODE_DISABLE_EXTERNAL_SKILLS=true
export OPENCODE_DISABLE_PROJECT_CONFIG=true
export OPENCODE_DISABLE_SHARE=true
EOF

source ~/.zshrc
```

```powershell [Windows PowerShell — до конца сессии]
$env:OPENCODE_DISABLE_MODELS_FETCH = "true"
$env:OPENCODE_MODELS_PATH = "$env:USERPROFILE\.cache\opencode\models.json"
$env:OPENCODE_DISABLE_DEFAULT_PLUGINS = "true"
$env:OPENCODE_DISABLE_AUTOUPDATE = "true"
$env:OPENCODE_DISABLE_LSP_DOWNLOAD = "true"
$env:OPENCODE_DISABLE_EXTERNAL_SKILLS = "true"
$env:OPENCODE_DISABLE_PROJECT_CONFIG = "true"
$env:OPENCODE_DISABLE_SHARE = "true"
```
:::

### Шаг 4: решите проблему висящей установки зависимостей (критично для интранета ⚠️)

::: warning ⚠️ Важность
Это **самая частая** причина виснущего старта в интранете! Даже с `OPENCODE_DISABLE_DEFAULT_PLUGINS=true` OpenCode пытается установить SDK `@opencode-ai/plugin`, и эта установка **не управляется никакими переменными окружения**.

**Причина**: логика установки в `src/config/config.ts:237-257` выполняет `bun add` и `bun install` — в интранете виснет.

**Решение (рекомендуем вариант 1)**:
```bash
# Создайте пустой каталог node_modules — проверка установки пропустится
mkdir -p ~/.config/opencode/node_modules

# Проверьте, что каталог создан
ls -la ~/.config/opencode/
# Вы должны увидеть каталог node_modules
```

::: tip 💡 Другие решения
Если вариант 1 не подходит, выбирайте:
- **Вариант 2**: настройте интранет-зеркало npm (`~/.bunfig.toml` или `.npmrc`)
- **Вариант 3**: предустановите зависимости на машине с сетью, затем скопируйте `~/.config/opencode/` (и проектный `.opencode/`) на интранет-машину
- **Вариант 4**: временно отключите сканирование конфигурации проекта: `OPENCODE_DISABLE_PROJECT_CONFIG=true`

Подробности ниже, в «Типичных проблемах → Виснущая установка зависимостей (@opencode-ai/plugin)».
:::

### Шаг 5: настройте внутренний AI-шлюз

**Зачем**
Отключив внешнюю сеть, нужно сказать OpenCode, какую внутреннюю модель использовать.

Создайте или отредактируйте `~/.config/opencode/opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // Отключить автообновление (двойная страховка, переменная уже задана)
  "autoupdate": false,

  // Включить только внутренний провайдер
  "enabled_providers": ["corp-gateway"],

  // Настройка внутреннего AI-шлюза
  "provider": {
    "corp-gateway": {
      "name": "Корпоративный AI-шлюз",
      "env": ["CORP_AI_TOKEN"],
      "api": "https://ai-gateway.company.internal/v1",
      "npm": "@ai-sdk/openai-compatible",
      "models": {
        "qwen2.5-72b": {
          "name": "Qwen 2.5 72B",
          "tool_call": true,
          "reasoning": true,
          "temperature": true,
          "limit": { "context": 128000, "output": 8192 }
        },
        "glm-4": {
          "name": "GLM-4",
          "tool_call": true,
          "temperature": true,
          "limit": { "context": 128000, "output": 4096 }
        }
      }
    }
  },

  // Модель по умолчанию — внутренняя
  "model": "corp-gateway/qwen2.5-72b"
}
```

::: tip 💡 Если используете локальную Ollama
Поменяйте `api` на `http://localhost:11434/v1`, подробности — [1.4g Настройка Ollama](../1-start/04g-ollama).
:::

### Шаг 6: задайте API-токен

**Зачем**
Внутренний шлюз обычно требует аутентификации.

```bash
export CORP_AI_TOKEN="your-internal-token"
```

### Шаг 7: проверьте конфигурацию

**Зачем**
Убедиться, что всё применяется и OpenCode нормально стартует.

```bash
opencode run -m corp-gateway/qwen2.5-72b "1+1=?" --print-logs
```

**Вы должны увидеть**:
- Никаких ошибок сетевых тайм-аутов
- Модель нормально возвращает результат (например, `2`)

Если всё равно виснет — добавьте `--log-level DEBUG` для подробных логов:

```bash
opencode run -m corp-gateway/qwen2.5-72b "1+1=?" --print-logs --log-level DEBUG
```

---

## Контрольные пункты ✅

> Продолжайте, только когда всё выполнено; любой провал — вернитесь к нужному шагу

- [ ] Есть рабочий внутренний AI-шлюз (или локальная Ollama)
- [ ] Умеете скачать `https://models.dev/api.json` с машины с интернетом
- [ ] Знакомы с базовой настройкой из [1.4 Подключение моделей](../1-start/04-connect)
- [ ] Список моделей готов: `~/.cache/opencode/models.json` существует, и `OPENCODE_MODELS_PATH` указывает на него (или используете интранет-зеркало `OPENCODE_MODELS_URL`)
- [ ] Переменные окружения заданы (проверка: `env | grep OPENCODE`)
- [ ] Создан `~/.config/opencode/node_modules` (а если в текущем проекте есть `.opencode/` — и `./.opencode/node_modules`)
- [ ] В `opencode.json` настроен внутренний provider
- [ ] `opencode run` нормально возвращает результат без сетевых ошибок
- [ ] (Необязательно) Установлен ripgrep (`rg --version` выводит версию)

---

## Типичные проблемы

| Симптом | Возможная причина | Решение |
|---|---|---|
| Старт виснет, логов больше нет | Виснущая установка зависимостей в интранете (`@opencode-ai/plugin`) | Сначала читайте «Виснущая установка зависимостей (@opencode-ai/plugin)» |
| Ругается "model not found" | Неверный путь или содержимое `models.json` | Проверьте, что `OPENCODE_MODELS_PATH` указывает на правильный файл |
| Ругается "provider not found" | Несогласованность `enabled_providers` и id провайдера | Проверьте `enabled_providers`, ключ `provider` и префикс `model` |
| Вызов модели отвечает 401/403 | Токен не подставлен или просрочен | Проверьте правильность и экспорт `CORP_AI_TOKEN` |
| Инструмент grep падает | ripgrep не установлен и не скачивается | Установите `rg` вручную (ниже «Особый случай инструмента grep») |

### Виснущая установка зависимостей (@opencode-ai/plugin)

**Почему виснет**

При сканировании каталога конфигурации OpenCode запускает установку зависимостей (исходники: `src/config/config.ts:157-159` и `src/config/config.ts:237-257`). В каталоге выполняется:

```bash
bun add @opencode-ai/plugin@<version> --exact
bun install
```

Если в каком-то каталоге **нет `node_modules/`**, OpenCode дождётся конца этой установки и только потом продолжит; в интранете без доступа к npm registry это выглядит как «вис».

**Сначала определите, виснет ли именно здесь**

Прогоните раз с DEBUG-логом:

```bash
opencode run "test" --print-logs --log-level DEBUG
```

Если видите в логах что-то вроде `service=bun` с `cmd=[..., "add", "@opencode-ai/plugin@..."]` — почти наверняка висит установка зависимостей.

**Быстрая остановка (больше не ждём установку)**

Добавьте `node_modules/` во все каталоги, которые может сканировать OpenCode:

```bash
# Глобальный каталог конфигурации
mkdir -p ~/.config/opencode/node_modules

# Если запускаетесь в каталоге проекта с .opencode/ — добавьте и туда
mkdir -p ./.opencode/node_modules
```

Смысл приёма: избавиться от ожидания `await installDependencies(...)` при старте.

::: warning ⚠️ Но это не «лечение»
`installDependencies(dir)` всё равно будет вызываться (просто не будет блокировать старт). Чтобы установка реально завершалась, всё равно нужны интранет-зеркало npm или предустановленные зависимости.
:::

**Долгосрочное решение (рекомендуется)**

1) Настройте интранет-зеркало npm (Bun подхватит вашу конфигурацию)

`~/.bunfig.toml`:

```toml
[install]
registry = "http://your-internal-npm-registry/"
```

2) Предустановите зависимости и скопируйте

На машине с сетью доведите `~/.config/opencode/` и проектный `.opencode/` до завершённой установки зависимостей, затем скопируйте оба каталога на интранет-машину.

3) Временно отключите сканирование конфигурации проекта

Если проектный `.opencode/` не нужен (достаточно глобальной конфигурации), можно:

```bash
export OPENCODE_DISABLE_PROJECT_CONFIG=true
```

### Особый случай инструмента grep

**Симптом**: AI падает при использовании инструмента grep — жалуется, что не находит бинарник `rg`.

**Причина**: инструмент grep зависит от ripgrep (`rg`). Если `rg` нет в системе, OpenCode пытается скачать его с GitHub (в интранете обычно безуспешно).

**Решение**:

```bash
# macOS
brew install ripgrep

# Linux
apt install ripgrep  # Ubuntu/Debian
yum install ripgrep  # CentOS/RHEL

# Windows
scoop install ripgrep
# или
choco install ripgrep

rg --version
```

### Как проверить, применяются ли переменные окружения?

```bash
env | grep OPENCODE
```

### Как найти, что ещё ходит наружу?

```bash
opencode run "test" --print-logs --log-level DEBUG
```

Частые ключевые слова:
- `service=models.dev`: тянет список моделей
- `service=bun`: выполняет bun add/install (установка зависимостей или плагинов)

---

## Полная шпаргалка по конфигурации

### Список переменных окружения

| Переменная | Назначение | Значение |
|---------|------|-----|
| `OPENCODE_DISABLE_MODELS_FETCH` | (Полный офлайн) запретить получение списка моделей | `true` |
| `OPENCODE_MODELS_PATH` | (Полный офлайн) путь к локальному файлу списка моделей | Абсолютный путь к файлу |
| `OPENCODE_MODELS_URL` | (Режим интранет-зеркала) направить models.dev на внутренний адрес (нужен `/api.json`) | `https://models-mirror.company.internal` |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS` | Запретить установку встроенных плагинов | `true` |
| `OPENCODE_DISABLE_AUTOUPDATE` | Запретить проверку автообновлений | `true` |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | Запретить скачивание LSP-серверов | `true` |
| `OPENCODE_DISABLE_EXTERNAL_SKILLS` | Запретить загрузку удалённых skill | `true` |
| `OPENCODE_DISABLE_PROJECT_CONFIG` | Запретить сканирование проектного `.opencode/` | `true` |
| `OPENCODE_DISABLE_SHARE` | Запретить функцию шаринга | `true` |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | Запретить Claude Code-совместимые навыки | `true` |

::: tip 💡 О приоритетах
- Если заданы одновременно `OPENCODE_MODELS_PATH` и `OPENCODE_MODELS_URL`, читается локальный файл из `OPENCODE_MODELS_PATH`
- В режиме «интранет-зеркало» НЕ задавайте `OPENCODE_DISABLE_MODELS_FETCH=true`, иначе получение не запустится
:::

### Скрипт настройки в один шаг

**Базовый скрипт (полный офлайн: models.json скачиваем вручную)**:
```bash
#!/bin/bash
# save as: setup-intranet.sh

# Создать каталоги
mkdir -p ~/.cache/opencode

# Проверить файл списка моделей
if [ ! -f ~/.cache/opencode/models.json ]; then
    echo "❌ Сначала скачайте models.json в ~/.cache/opencode/models.json"
    exit 1
fi

# Решить проблему виснущей установки SDK (критичный шаг!)
mkdir -p ~/.config/opencode/node_modules
echo "✅ Каталог ~/.config/opencode/node_modules создан"

# Если в текущем каталоге есть .opencode/ — добавить и туда (чтобы не ждать установку на уровне проекта)
if [ -d ./.opencode ]; then
  mkdir -p ./.opencode/node_modules
  echo "✅ Каталог ./.opencode/node_modules создан"
fi

# Добавить переменные окружения в конфиг shell
SHELL_RC="$HOME/.$(basename $SHELL)rc"
cat >> "$SHELL_RC" << 'EOF'

# Конфигурация OpenCode для интранета
export OPENCODE_DISABLE_MODELS_FETCH=true
export OPENCODE_MODELS_PATH=~/.cache/opencode/models.json
export OPENCODE_DISABLE_DEFAULT_PLUGINS=true
export OPENCODE_DISABLE_AUTOUPDATE=true
export OPENCODE_DISABLE_LSP_DOWNLOAD=true
export OPENCODE_DISABLE_EXTERNAL_SKILLS=true
export OPENCODE_DISABLE_PROJECT_CONFIG=true
export OPENCODE_DISABLE_SHARE=true
EOF

echo "✅ Переменные окружения добавлены в $SHELL_RC"
echo "Выполните: source $SHELL_RC"
```

**Продвинутый скрипт (интранет-зеркало: список моделей подтягивается сам)**:
```bash
#!/bin/bash
# save as: setup-intranet-advanced.sh

# Внутренний сервер models.dev компании
MODELS_MIRROR="https://models-mirror.company.internal"

# Добавить переменные окружения в конфиг shell
SHELL_RC="$HOME/.$(basename $SHELL)rc"
cat >> "$SHELL_RC" << EOF

# Конфигурация OpenCode для интранета (через внутреннее зеркало)
unset OPENCODE_DISABLE_MODELS_FETCH
export OPENCODE_MODELS_URL="$MODELS_MIRROR"
export OPENCODE_DISABLE_DEFAULT_PLUGINS=true
export OPENCODE_DISABLE_AUTOUPDATE=true
export OPENCODE_DISABLE_LSP_DOWNLOAD=true
export OPENCODE_DISABLE_EXTERNAL_SKILLS=true
export OPENCODE_DISABLE_PROJECT_CONFIG=true
export OPENCODE_DISABLE_SHARE=true
EOF

# Решить проблему виснущей установки SDK
mkdir -p ~/.config/opencode/node_modules
echo "✅ Каталог ~/.config/opencode/node_modules создан"

echo "✅ Переменные окружения добавлены в $SHELL_RC"
echo "Настроено внутреннее зеркало models.dev: $MODELS_MIRROR"
echo "Выполните: source $SHELL_RC"
```

::: tip 💡 Сравнение двух вариантов списка моделей
| Вариант | Плюсы | Минусы |
|-----|------|------|
| `OPENCODE_MODELS_PATH` | Полный офлайн, контроль версий | Нужно вручную обновлять `models.json` |
| `OPENCODE_MODELS_URL` | Автообновление, синхронизация fleet | Зависимость от внутреннего сервера-зеркала |
:::

---

## Итоги урока

Вы научились:

1. **7 главным выключателям**: полный офлайн (`OPENCODE_DISABLE_MODELS_FETCH` + `OPENCODE_MODELS_PATH`) или интранет-зеркало (`OPENCODE_MODELS_URL`), плюс отключение встроенных плагинов, автообновлений, скачивания LSP, удалённых skill, конфигурации проекта и шаринга
2. **Локальному списку моделей**: скачать `models.json` снаружи и положить на интранет-машину (или указывать `OPENCODE_MODELS_URL` на внутреннее зеркало)
3. **Конфигурации внутреннего провайдера**: через `enabled_providers` включать только внутренний шлюз
4. **Проблеме установки главного SDK**: обход созданием пустого каталога `node_modules` и другие решения
5. **Проверке конфигов**: убедиться, что в `opencode.json` нет `skills.urls`, URL в `instructions` и `wellknown`-аутентификации в `auth`
6. **Приёмам диагностики**: локализация места зависания через `--print-logs --log-level DEBUG`

::: tip 💡 Дополнительная подсказка
Если в компании есть внутренний сервер mirrors.dev, используйте `OPENCODE_MODELS_URL` вместо `OPENCODE_MODELS_PATH`:
```bash
export OPENCODE_MODELS_URL=https://models-mirror.company.internal
```
Так OpenCode будет забирать список моделей с вашего внутреннего сервера — вручную скачивать `models.json` не нужно.
:::

---

## Анонс следующего урока

> Для централизованного управления аутентификацией (чтобы команде не настраивать токены вручную) изучите **[5.11a Интеграция корпоративной аутентификации](../5-advanced/11a-enterprise-auth)**.
>
> Там описан механизм `/.well-known/opencode`: «одна команда на вход + автоматическая выдача конфигурации организации».

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> Дата обновления: 2026-02-05

| Функция | Путь к файлу | Строки |
|-----|---------|------|
| Определения переменных окружения (все флаги `OPENCODE_*`) | [`src/flag/flag.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/flag/flag.ts#L12-L50) | 12-50 |
| Логика загрузки списка моделей (`OPENCODE_DISABLE_MODELS_FETCH`, `OPENCODE_MODELS_PATH`, `OPENCODE_MODELS_URL`) | [`src/provider/models.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/provider/models.ts#L83-L99) | 83-99 |
| Сканирование каталога конфигурации и ожидание установки зависимостей (проверка `node_modules`) | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L157-L160) | 157-160 |
| Команды установки зависимостей (`bun add` + `bun install`) | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L236-L257) | 236-257 |
| Загрузка плагинов (список встроенных, проверка `OPENCODE_DISABLE_DEFAULT_PLUGINS`) | [`src/plugin/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/plugin/index.ts#L18-L49) | 18-49 |
| Логика установки Bun-пакетов (возможная причина виснущего старта) | [`src/bun/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/bun/index.ts#L64-L133) | 64-133 |
| Логика скачивания ripgrep (в интранете часто падает) | [`src/file/ripgrep.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/file/ripgrep.ts#L125-L199) | 125-199 |
| Проверка автообновлений (`OPENCODE_DISABLE_AUTOUPDATE`) | [`src/cli/upgrade.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/upgrade.ts#L6-L25) | 6-25 |
| Проверка скачивания LSP-серверов (`OPENCODE_DISABLE_LSP_DOWNLOAD`) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts) | 135, 177, 372... |
**Ключевые константы**:
- `BUILTIN = ["opencode-anthropic-auth@0.0.13", "@gitlab/opencode-gitlab-auth@1.3.2"]`: список встроенных плагинов
- `Flag.OPENCODE_DISABLE_MODELS_FETCH`: запретить получение списка моделей
- `Flag.OPENCODE_MODELS_PATH`: путь к локальному файлу списка моделей
- `Flag.OPENCODE_MODELS_URL`: URL внутреннего сервера models.dev
- `Flag.OPENCODE_DISABLE_DEFAULT_PLUGINS`: запретить установку встроенных плагинов

**Приоритеты сетевых запросов**:
1. `OPENCODE_MODELS_PATH`: если задан — приоритет выше, чем у `OPENCODE_MODELS_URL`
2. `OPENCODE_MODELS_URL`: указывает на внутренний сервер models.dev
3. `https://models.dev`: адрес по умолчанию (когда оба выше не заданы и `OPENCODE_DISABLE_MODELS_FETCH=false`)
</details>
