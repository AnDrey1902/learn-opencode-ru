---
title: 5.11a Интеграция корпоративной аутентификации
subtitle: Свой единый вход и org-конфиги по умолчанию
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.11a"
duration: 30 минут
practice: 35 минут
level: Продвинутый
description: Подключите корпоративный единый вход, инжектите сохранённый при входе токен в подстановки переменных конфигурации и раздавайте org-конфиги по умолчанию (продление коротких токенов — через плагин).
tags:
  - Корпорация
  - Аутентификация
  - Конфигурация
  - Плагины
prerequisite:
  - 5.1 Всё о конфигурации
  - 5.11 Возможности Enterprise
---

# Интеграция корпоративной аутентификации

> 💡 **Коротко**: заведите корпоративный единый вход в OpenCode, чтобы команде не вводить ключи руками, а по умолчанию работать через внутреннюю модель.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/enterprise-auth-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.11a Интеграция корпоративной аутентификации"
     data-zoom-src="/images/5-advanced/enterprise-auth-notes.jpeg" />

---

Этот урок — про одно дело: **пусть OpenCode в корпоративном интранете работает «из коробки»**.

Урок даст 3 пути (от самого простого к самому гибкому):

1) Переменные окружения: сами инжектите токен, OpenCode его читает

2) well-known: вход выполняет `auth.command` и сохраняет токен; последующие старты инжектят сохранённый токен и грузят встроенный `config` или `remote_config` на отдельный JSON (без автопродления)

3) Плагин аутентификации: для OAuth, обновления, подписей и правки headers и params — через плагин

::: tip 💡 Как читать урок быстрее всего
- Сначала смотрите «сравнение 3 способов подключения» и выбирайте путь, похожий на вашу команду
- Затем прыгайте сразу к нужным шагам: способ A (переменные окружения), способ B (well-known) или способ C (плагин аутентификации)
:::

## Что вы сможете после урока

- Подключить токен корпоративного единого входа к OpenCode (без ручного ввода ключей каждым)
- Раздавать org-конфиги по умолчанию через `/.well-known/opencode` (например, принудительно только внутренний AI-шлюз)
- Различать: когда хватает переменных окружения, когда нужен well-known, а когда обязателен плагин аутентификации

<img src="/images/5-advanced/11a-auth-3ways.mini.jpeg"
     alt="Сравнение трёх способов подключения"
     data-zoom-src="/images/5-advanced/11a-auth-3ways.jpeg" />

---

## С какими трудностями вы столкнулись

- В компании единый вход (SSO и единый шлюз), а OpenCode по умолчанию настраивается ключами провайдеров
- Просить каждого копипастить токен: муторно, протухает и легко утекает
- Хочется: машины команды запускают OpenCode — и сразу с корпоративными credentials работают только через внутреннюю модель

---

## Когда это пригодится

- Одной командой получаете токен (например, `corpctl token`, `sso login --print-token`)
- Есть внутренний домен под `https://<host>/.well-known/opencode`
- Хочется централизованно управлять «моделью по умолчанию, провайдером по умолчанию, отключением внешних провайдеров»

---

## 🎒 Перед началом

- [ ] Прочитан [5.1 Всё о конфигурации](./01a-config-basics)
- [ ] Готов внутренний домен, например `https://ai.company.internal`
- [ ] Готова команда получения токена (рекомендуется неинтерактивная: сразу печатает токен в stdout без интерактива в stdin)

::: info ℹ️ Что здесь за «токен»?
Провайдеру OpenCode в итоге обычно нужна просто строка: API-ключ, Bearer-токен или временные credentials шлюза.

Цель урока: автоматически положить эту строку в некую переменную окружения, чтобы провайдер OpenCode её прочитал.
:::

---

## Главная идея

У OpenCode есть очень подходящая корпоративному интранету точка входа: `opencode auth login <url>`.

- Она запрашивает `<url>/.well-known/opencode`, читает `auth.command` и `auth.env`, затем локально выполняет `auth.command`, забирает токен и сохраняет (исходники: [`providers.ts:325-350`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/providers.ts#L325-L350)).
- При старте OpenCode обнаруживает сохранённые credentials типа `wellknown`, кладёт токен в служебное отображение окружения только для подстановок переменных конфигурации и сливает `config` из `<url>/.well-known/opencode`. Если ответ содержит `remote_config`, дополнительно тянет независимый JSON по его `url`; поля удалённого JSON перекрывают одноимённые поля встроенного `config` (исходники: [`config.ts:356-393`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L356-L393)).

Самые частые способы подключения в компаниях — 3 штуки (по росту «сколько менять»):

1. Переменные окружения: токен инжектите сами, OpenCode только читает
2. well-known: OpenCode забирает на себя «получение токена + инжект в env + раздачу org-конфигов»
3. Плагин аутентификации: для OAuth, обновления, подписей и правки headers и params — через плагин

::: info 🤔 Что такое well-known?
`/.well-known/` — общепринятый «фиксированный каталог», обычно для информации **обнаружения сервисов**: клиент обращается по фиксированному пути и получает машиночитаемую конфигурацию.

OpenCode для корпоративных сценариев договорился об эндпоинте: `/.well-known/opencode`.

Он возвращает JSON обычно из двух частей:

- `auth`: сообщает OpenCode, какой командой забрать токен (`auth.command`) и в какую переменную окружения его положить (`auth.env`)
- `config`: напрямую встроенная org-конфигурация по умолчанию
- `remote_config`: необязательно, объектом `{ "url": "...", "headers": { ... } }` указывает на независимый JSON конфигурации; значения URL и header поддерживают подстановки переменных конфигурации

Обратите внимание: OpenCode напрямую выполняет `auth.command`, а при старте тянет `config` / `remote_config` и сливает. Доверяйте только контролируемым корпоративным доменам.

В `config` при наличии `plugin` OpenCode может автоматически установить пакеты плагинов и выполнить `import()` (исходники: `packages/opencode/src/plugin/index.ts`).

Проще говоря: считайте `/.well-known/opencode` «точкой входа конфигурации, которую организация раздаёт машинам разработчиков», и разворачивайте её только на контролируемых доверенных интранет-доменах.
:::

::: details 📦 well-known раздаёт «значения по умолчанию», а не «принудительные политики»
Порядок слияния конфигурации загрузчика OpenCode v1 (от низкого к высокому):

1) Удалённый `/.well-known/opencode` (org-умолчания)

2) Глобальная конфигурация (по очереди читаются устаревший `config.json`, `opencode.json`, `opencode.jsonc`; новая глобальная конфигурация по умолчанию пишется в `opencode.jsonc`)

3) Пользовательский путь конфигурации (`OPENCODE_CONFIG`)

4) Конфигурация проекта (`opencode.json{,c}`)

5) Каталог `.opencode/` (включая `.opencode/opencode.json{,c}` и `.opencode/plugin/` и др.)

5.1) Через `OPENCODE_CONFIG_DIR` задаётся дополнительный каталог конфигурации (грузится как часть источников-каталогов)

6) Инлайн-конфигурация (`OPENCODE_CONFIG_CONTENT`)

(Корпоративная версия) Каталог managed config перекрывает все источники выше.

`remote_config` с встроенным `wellknown.config` грузятся раньше глобальных, проектных и `.opencode/`, поэтому дают org-значения по умолчанию, а последующие локальные источники всё равно перекрывают. Реализация — [`config.ts:356-429`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L356-L429); финальное слияние managed config — [`config.ts:525-534`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L525-L534).

Поэтому `wellknown.config` лучше подходит для «командного опыта из коробки по умолчанию».

Но есть исключение: поля-массивы вроде `plugin` и `instructions` при слиянии «сливаются с дедупликацией», а не просто перекрываются (исходники: логика merge в `packages/opencode/src/config/config.ts` — дедуплика `Set` по полному строковому значению).

Где `plugin` дополнительно дедуплицируется «по имени плагина», а высокоприоритетный источник перекрывает одноимённые плагины низкоприоритетного (исходники: `deduplicatePlugins()` в `packages/opencode/src/config/config.ts`).

Чтобы заставить всех ходить только во внутренний шлюз, обычно нужны централизованное управление корпоративной версии либо ограничение локальных точек перекрытия политиками IT, зеркал и прав.
:::

---

## Повторите за мной

### Шаг 1: выберите способ подключения

**Зачем**
Верный выбор способа избавит от кривых дорог дальше.

| Ваша ситуация | Какой выбрать |
|---|---|
| Уже есть фиксированный ключ (или удобно инжектить токен в K8s и CI) | Переменные окружения |
| Одна команда выдаёт токен, а org-конфиги хочется раздавать централизованно | well-known |
| Нужны OAuth, коды устройств, автообновление, подписи и правки headers и params | Плагин аутентификации |

### Шаг 2 (способ A): только переменные окружения (проще всего)

**Зачем**  
Если токен уже кладётся в окружение (своими силами, K8s или CI), OpenCode не нужны дополнительные механизмы аутентификации.

1) В `opencode.json` настройте внутреннего провайдера и явно укажите, из какой переменной окружения читать ключ:

```jsonc
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "corp-gateway": {
      "name": "Company AI Gateway",
      "env": ["COMPANY_AI_TOKEN"],
      "api": "https://ai-gateway.company.internal/v1",
      "npm": "@ai-sdk/openai-compatible",
      "models": {
        "qwen2.5-72b": {
          "name": "Qwen 2.5 72B",
          "tool_call": true,
          "reasoning": true,
          "temperature": true,
          "limit": { "context": 128000, "output": 8192 }
        }
      }
    }
  },
  "model": "corp-gateway/qwen2.5-72b"
}
```

2) Перед запуском инжектите переменную окружения и проверяйте:

::: code-group
```bash [macOS/Linux]
export COMPANY_AI_TOKEN="<your-token>"
opencode run -m corp-gateway/qwen2.5-72b "ping"
```

```powershell [Windows PowerShell]
$env:COMPANY_AI_TOKEN = "<your-token>"
opencode run -m corp-gateway/qwen2.5-72b "ping"
```
:::

**Вы должны увидеть**: `opencode run` возвращает вывод модели.

::: tip 💡 Подходит для K8s и CI
`COMPANY_AI_TOKEN` оформите K8s-секретом или CI-секретом для инжекта — никому не нужно входить на машинах вручную.
:::

### Шаг 3 (способ B): well-known как «единый вход + раздача org-конфигов»

**Зачем**
well-known сводит «получение токена + org-конфиги по умолчанию» в одну org-точку входа: `https://<host>/.well-known/opencode`.

::: warning ⚠️ Границы продления токена
`auth.command` у well-known выполняется лишь раз — когда вы выполняете `opencode auth login <url>`, и сохраняет токен локально.

При последующих стартах OpenCode лишь инжектит этот «сохранённый токен» и не обновляет его автоматически.

При короткоживущих токенах (например, протухание за час) лучше подойдёт способ C: реализовать продление и подписи плагином.

Если защищённый SSO well-known или `remote_config` возвращает HTML-страницу входа вместо JSON, OpenCode распознает отсутствие или протухание аутентификации и предложит заново выполнить `opencode auth login <url>`. URL-путь входа этой команды не грузит заранее инстанс проекта со старым токеном, поэтому переаутентификация проходит напрямую.
:::

<img src="/images/5-advanced/11a-auth-wellknown-flow.mini.jpeg"
     alt="Процесс well-known"
     data-zoom-src="/images/5-advanced/11a-auth-wellknown-flow.jpeg" />

#### 3.1 Подготовьте ответ `/.well-known/opencode`

**Зачем**
Поведение `opencode auth login <url>` полностью определяется этим JSON: он сообщает OpenCode, какой командой забрать токен, в какую переменную окружения его положить и какие org-конфиги раздать по умолчанию.

Ниже минимальный рабочий пример (ваш `https://ai.company.internal/.well-known/opencode` обязан его отдавать):

```jsonc
{
  "auth": {
    "command": ["corpctl", "ai", "token", "--format=plain"],
    "env": "COMPANY_AI_TOKEN"
  },

  // Необязательно: орг-конфигурация на отдельном сервисе. Удалённый JSON перекрывает одноимённые поля config ниже
  "remote_config": {
    "url": "https://config.company.internal/opencode.json",
    "headers": {
      "Authorization": "Bearer {env:COMPANY_AI_TOKEN}"
    }
  },

  "config": {
    "$schema": "https://opencode.ai/config.json",

    // Необязательно: принудительно отключить внешние провайдеры (пример)
    "disabled_providers": ["openai", "anthropic", "openrouter"],

    // Настроить корпоративный AI-шлюз компании (OpenAI Compatible)
    "provider": {
      "corp-gateway": {
        "name": "Company AI Gateway",
        "api": "https://ai-gateway.company.internal/v1",
        "npm": "@ai-sdk/openai-compatible",
        "options": {
          "apiKey": "{env:COMPANY_AI_TOKEN}"
        },
        "models": {
          "qwen2.5-72b": {
            "name": "Qwen 2.5 72B",
            "tool_call": true,
            "reasoning": true,
            "temperature": true,
            "limit": { "context": 128000, "output": 8192 }
          }
        }
      }
    },

    // Пусть команда по умолчанию работает на внутренней модели
    "model": "corp-gateway/qwen2.5-72b"
  }
}
```

**Вы должны увидеть**: браузер по `https://ai.company.internal/.well-known/opencode` отдаёт JSON выше.

::: warning ⚠️ Главные моменты
- `auth.command` обязана выполняться на машинах и в контейнерах разработчиков; её stdout трактуется как токен.
- `auth.env` — имя переменной конфигурации. При старте OpenCode кладёт сохранённый токен в виртуальное отображение окружения для подстановок переменных конфигурации; `process.env` текущего процесса и системный shell не меняются.
:::

#### 3.2 Запишите credentials локально через `opencode auth login`

**Зачем**
Этот шаг положит credentials типа `wellknown` в локальный `auth.json`. Дальше при каждом старте OpenCode отдаёт токен подстановкам переменных конфигурации и тянет удалённые `config` и `remote_config`.

```bash
opencode auth login https://ai.company.internal
```

**Вы должны увидеть**: в терминале примерно такое:

- `Running \`corpctl ai token --format=plain\``
- `Logged into https://ai.company.internal`

#### 3.3 Убедитесь, что credentials уже есть

**Зачем**
Сначала убедитесь, что OpenCode правда сохранил well-known credentials, иначе дальше «конфигурация никак не применяется».

```bash
opencode auth list
```

**Вы должны увидеть**: в списке строка `https://ai.company.internal wellknown` (имя провайдера может отобразиться прямо URL).

#### 3.4 Проверьте, что org-конфиги по умолчанию применились (прогоните `run`)

**Зачем**
Быстрейшая проверка: напрямую прогоните `opencode run` — работает ли внутренняя модель команды.

```bash
opencode run -m corp-gateway/qwen2.5-72b "Тремя предложениями объясни суть этого абзаца: …"
```

**Вы должны увидеть**: нормальный вывод модели; при сбое обычно ругается на аутентификацию, отсутствие модели или сеть.

### Шаг 4 (способ C): плагин для единого входа (гибче всего)

**Зачем**
Когда у вас не «команда печатает токен», а нужны OAuth, автопродление, подписи запросов, динамические правки headers и params — надёжнее всего плагин.

::: info Границы аутентификации Provider v1 и коннектора v2
Совместимый интерфейс по-прежнему заявляет способы `api` и `oauth` через `auth.methods` плагина, `oauth` выбирает автоколбэк или ручной ввод кода авторизации; `loader` конвертирует сохранённые credentials в конфигурацию провайдера. Определения типов: [`packages/plugin/src/index.ts:88-180`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/index.ts#L88-L180).

В `v1.18.22` параллельно есть коннектор интеграции v2: integration регистрирует способы `key`, `env`, `oauth`, слой подключений хранит и резолвит credentials, а при скором протухании OAuth-credentials вызывает `refresh`. Это интерфейс плагинов v2 — не смешивайте примеры `context.integration` в v1-скелет `Plugin` ниже. Интерфейсы: [`packages/plugin/src/v2/effect/integration.ts:15-62`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/v2/effect/integration.ts#L15-L62), процессы подключения и обновления: [`packages/core/src/integration.ts:380-457`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/integration.ts#L380-L457).
:::

#### 4.1 Скелет плагина аутентификации

Положите файл в `.opencode/plugin/corp-auth.ts`:

```ts
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = async () => {
  return {
    auth: {
      // Обязано совпадать с id вашего провайдера из конфигурации
      provider: "corp-gateway",
      methods: [
        {
          type: "api",
          label: "Login with Company SSO",
          async authorize() {
            // Подставьте свою логику получения токена: команда, HTTP, локальный кэш и т. д.
            const token = "<replace-me>"
            return { type: "success", key: token }
          },
        },
      ],
      async loader(getAuth) {
        const auth = await getAuth()
        if (!auth || auth.type !== "api") return {}
        return {
          apiKey: auth.key,
          // headers: { "X-Tenant": "..." },
        }
      },
    },

    // Правки headers, params и подписей прямее делать этими хуками
    // "chat.headers": async (_input, output) => { output.headers["X-Sign"] = "..." },
    // "chat.params": async (_input, output) => { output.options["seed"] = 1 },
  }
}

export default plugin
```

#### 4.2 Пусть OpenCode загрузит ваш плагин

**Рекомендуемый способ**: положите файл плагина в каталог `.opencode/plugin/` — OpenCode автоматически сканирует и грузит (дописывать `opencode.json` не нужно).

::: details 📦 Хочу именно в opencode.json
Пишите относительный путь — OpenCode при загрузке конфигурации резолвит его в импортируемый `file://...`-URL:

```jsonc
// opencode.json
{
  "plugin": ["./.opencode/plugin/corp-auth.ts"]
}
```
:::

#### 4.3 Вход через `opencode auth login` с плагином

```bash
opencode auth login
```

**Вы должны увидеть**:

- Селектор провайдеров берётся из списка models.dev; вашего собственного провайдера (например, `corp-gateway`) там обычно нет
- Поэтому обычно так: сначала выбираете `Other`, вводите id провайдера `corp-gateway`, затем входите в процесс входа из `methods` вашего плагина

---

## Контрольные пункты ✅

- [ ] Способ A: после инжекта переменных окружения `opencode run -m corp-gateway/qwen2.5-72b ...` прогоняется
- [ ] Способ B: `https://<host>/.well-known/opencode` отдаёт JSON, а `opencode auth login <url>` успешен
- [ ] Способ C: после включения плагина `opencode auth login` идёт через вход плагина и сохраняет credentials
- [ ] Модель команды по умолчанию указывает на внутренний провайдер (`model: "corp-gateway/..."`)

---

## Типичные проблемы

| Симптом | Причина | Решение |
|---|---|---|
| После входа в другом терминале `echo $COMPANY_AI_TOKEN` пуст | well-known токен попадает лишь в отображение подстановок переменных конфигурации, а не в `process.env` и не в `.zshrc` или `.bashrc` | В конфигурации провайдера используйте `options.apiKey: "{env:COMPANY_AI_TOKEN}"`; проверяйте через `opencode run -m corp-gateway/...` |
| `opencode auth login` сразу ругается 404 или 2000+ | `/.well-known/opencode` недоступен | Сначала проверьте доступность URL браузером или curl |
| Ругается `Failed` или нет `Logged into ...` | Ненулевой код выхода `auth.command` | Убедитесь, что команда выполняется на текущей машине и печатает токен в stdout |
| Подсказка про страницу входа вместо данных | well-known или `remote_config` за SSO, сохранённый токен отсутствует или протух | По подсказке ошибки выполните `opencode auth login <url>` заново |
| При старте OpenCode ругается другими ошибками удалённой конфигурации | well-known или `remote_config` недоступен, вернул не JSON или конфиг недействителен | Проверьте удалённые эндпоинты и JSON; при необходимости удалите credentials этого URL через `opencode auth logout` и разбирайтесь |
| `opencode auth login` не находит вашего провайдера | Вашего провайдера нет в списке models.dev | Выберите `Other` и введите id провайдера вручную (например, `corp-gateway`) |
| Вход успешен, но конфигурация не применяется | Сохранён только токен, `config` не вернулся | Допишите поле `config` в well-known JSON |
| В контейнере вход проходит, локально — нет (или наоборот) | Различия команд и цепочек сертификатов | Убедитесь, что корневой сертификат компании стоит везде и `auth.command` доступна в обоих местах |
| Шлюз интранета отвечает 401 | Токен не дошёл до провайдера или протух | Проверьте совпадение имён в `auth.env`; перепроверьте шагом 4 через `opencode run -m ...`; при необходимости заново `opencode auth login <url>` |
| Плагин в `.opencode/plugin/` не подхватился | Не готова зависимость: OpenCode вызывает `installDependencies(dir)` для сканируемых каталогов. Без `package.json` и `.gitignore` в каталоге допишет их; попытается выполнить `bun add @opencode-ai/plugin@<version> --exact` и `bun install` (обе команды `bun` при сбое молча глотаются; запись файлов без catch). Ждать процесса установки будет, только если `<dir>/node_modules` отсутствует; при наличии установка уйдёт в фон без ожидания | Убедитесь в доступе к npm или интранет-зеркалу; при необходимости вручную выполните `bun install` в нужном каталоге или заранее запеките зависимости в образ или кэш (исходники: `installDependencies()` в `packages/opencode/src/config/config.ts`) |
| Опасаетесь небезопасного well-known | Удалённый JSON раздаёт и `auth.command` (выполнится локально), и `config` (потянется при старте и сольётся; `plugin` в нём может вызвать установку и выполнение плагинов) | Считайте `/.well-known/opencode` «точкой входа конфигурации организации»: разворачивайте лишь на доверенных интранет-доменах; ограничивайте доступ; аудируйте возвращаемое содержимое; без нужды не раздавайте `plugin` в удалённом конфиге |

---

## Итоги урока

Вы научились:

1. Переменным окружения: проще всего, подходят для K8s и CI
2. well-known: лучше всего для продвижения в команде, единый вход и раздача org-конфигов
3. Плагинам аутентификации: гибче всего, подходят для OAuth, обновления, подписей и правок headers и params

---

## Анонс следующего урока

> В следующем уроке сделаем возможности аутентификации и шлюза гибче: освоив систему плагинов, вы напишете по-настоящему «корпоративные» процессы входа и переписывания запросов.
>
> Далее: **[5.12a Основы плагинов](./12a-plugins-basics)**.

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> Базовая версия: OpenCode `v1.18.22`

| Функция | Путь к файлу | Строки |
|---|---|---|
| Schema `config` и `remote_config` у well-known | [`packages/core/src/v1/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L22-L25) | 22-25 |
| URL входа: выполнение `auth.command` и сохранение well-known credentials | [`packages/opencode/src/cli/cmd/providers.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/providers.ts#L325-L350) | 325-350 |
| Подстановки переменных в URL и headers у `remote_config` | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L64-L98) | 64-98 |
| Загрузка и порядок слияния удалённой well-known конфигурации | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L356-L429) | 356-429 |
| Подсказка переаутентификации при странице входа вместо данных | [`packages/opencode/src/cli/error.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/error.ts#L97-L106) | 97-106 |
| Совместимость старых глобальных конфигов и `opencode.jsonc` по умолчанию | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L139-L147) | 139-147 |
| Хуки аутентификации `auth` в плагинах: типы (`methods` и `loader`) | [`packages/plugin/src/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/index.ts#L88-L180) | 88-180 |
| Методы и интерфейсы подключений коннектора интеграции v2 | [`packages/plugin/src/v2/effect/integration.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/v2/effect/integration.ts#L15-L62) | 15-62 |

**Ключевые типы**:
- `Auth.WellKnown`: `{ type: "wellknown", key: string, token: string }`
- `AuthHook`: интерфейс аутентификации плагинов с методами `api` и `oauth`

</details>
