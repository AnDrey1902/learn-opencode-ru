---
title: "LSP и кодовый интеллект: пусть AI по-настоящему понимает код"
subtitle: Кодовый интеллект LSP
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.19"
duration: 20 минут
practice: 10 минут
level: Продвинутый
description: "Изучите интеграцию LSP в OpenCode. В уроке: 30+ встроенных языковых серверов, 9 операций кодового интеллекта (переходы к определениям, поиск ссылок, ховеры и др.), свои настройки LSP и разбор частых проблем."
tags:
  - LSP
  - Языковые серверы
  - Кодовый интеллект
  - Переходы по символам
prerequisite:
  - 5.1a Основы конфигурации
---

# LSP и кодовый интеллект

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/lsp-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.19 LSP-серверы"
     data-zoom-src="/images/5-advanced/lsp-notes.jpeg" />

---

Когда AI правит код, он не знает: где определена функция, кто ссылается на переменную, какие реализации у интерфейса?

**LSP (Language Server Protocol)** решает эту проблему. Он ставит AI «мозг IDE»: AI переходит с «чтения текста» на «понимание структуры кода».

::: info 🤔 Что такое LSP?
LSP — стандартный протокол от Microsoft для общения редакторов и языковых серверов. «Перейти к определению» и «найти ссылки» в VS Code работают именно на LSP.

OpenCode принёс те же способности в терминального AI-помощника.
:::

## Что вы сможете после урока

::: info 🎯 Цели урока
- Понимать, как LSP даёт AI кодовый интеллект
- Пользоваться 9 операциями LSP: переходы к определениям, поиск ссылок, ховеры и др.
- Знать про 30+ встроенных языковых серверов OpenCode
- Настраивать свои LSP-серверы и отключать их
- Разбирать проблемы подключения LSP
:::

---

## С какими трудностями вы столкнулись

- «AI не знает, где определена эта функция, — только гадает»
- «Хочу знать, где используется переменная, но AI находит не всё»
- «AI правит код без понимания зависимостей и ошибается»
- «Хочется прыгать и смотреть определения быстро, как в IDE»

---

## Когда это пригодится

- Разобраться в структуре большой кодовой базы
- Найти определения и ссылки функций и переменных
- Оценить масштаб влияния перед рефакторингом
- Получить информацию о типах и doc-комментарии

---

## 🎒 Перед началом

- [ ] Пройден урок [5.1a Основы конфигурации](./01a-config-basics)
- [ ] OpenCode нормально стартует
- [ ] В проекте есть файлы кода (OpenCode сам определит языки)

---

## Основная идея

Процесс работы LSP прост:

1. OpenCode определяет тип открытых файлов (например, `.ts`, `.py`, `.go`)
2. Автоматически стартует подходящий языковой сервер
3. Когда AI нужно понять код — шлёт запрос языковому серверу
4. Языковой сервер возвращает точные данные кодового интеллекта

В большинстве случаев настраивать ничего не нужно — работает из коробки.

### LSP vs текстовый поиск

| Критерий | Текстовый поиск (grep) | Кодовый интеллект LSP |
|-------|-------------------|-------------|
| Способ поиска | Совпадение строк | Совпадение смысловых символов |
| Точность | Возможны ложные срабатывания (одноимённые переменные) | Точное позиционирование |
| Области видимости | Не понимает | Понимает области и связи импортов |
| Информация о типах | Нет | Полные сигнатуры типов |
| Различение перегрузок | Не различает | Различает перегрузки функций |

---

## Встроенные языковые серверы

В OpenCode встроено **более 30 языковых серверов** — работают из коробки.

### Главные языки

| LSP-сервер | Расширения | Требование |
|-----------|--------|------|
| typescript | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts | В проекте есть зависимость `typescript` |
| pyright | .py, .pyi | Автоустановка pyright |
| gopls | .go | Доступна команда `go` |
| rust (rust-analyzer) | .rs | Доступна команда `rust-analyzer` |
| jdtls | .java | Установлен Java SDK (21+) |
| kotlin-ls | .kt, .kts | Автоскачивание и установка |
| clangd | .c, .cpp, .cc, .cxx, .c++, .h, .hpp, .hh, .hxx, .h++ | Автоскачивание и установка |
| csharp (csharp-ls) | .cs | Установлен .NET SDK |
| fsharp (fsautocomplete) | .fs, .fsi, .fsx, .fsscript | Установлен .NET SDK |
| sourcekit-lsp | .swift, .objc, .objcpp | Установлен Swift (на macOS — Xcode) |
| dart | .dart | Доступна команда `dart` |

### Остальные языки

| LSP-сервер | Расширения | Требование |
|-----------|--------|------|
| ruby-lsp (rubocop) | .rb, .rake, .gemspec, .ru | Доступны команды `ruby` и `gem` |
| elixir-ls | .ex, .exs | Доступна команда `elixir` |
| zls | .zig, .zon | Доступна команда `zig` |
| lua-ls | .lua | Автоскачивание и установка |
| php intelephense | .php | Автоустановка intelephense |
| ocaml-lsp | .ml, .mli | Доступна команда `ocamllsp` |
| gleam | .gleam | Доступна команда `gleam` |
| clojure-lsp | .clj, .cljs, .cljc, .edn | Доступна команда `clojure-lsp` |
| nixd | .nix | Доступна команда `nixd` |
| haskell-language-server | .hs, .lhs | Доступна команда `haskell-language-server-wrapper` |
| deno | .ts, .tsx, .js, .jsx, .mjs | Доступна команда `deno` (автоопределение deno.json) |

### Фронтенд-фреймворки

| LSP-сервер | Расширения | Требование |
|-----------|--------|------|
| vue | .vue | Автоустановка vue-language-server |
| svelte | .svelte | Автоустановка svelte-language-server |
| astro | .astro | Автоустановка astro-language-server |

### Инструменты и конфиги

| LSP-сервер | Расширения | Назначение |
|-----------|--------|------|
| eslint | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue | Проверка стиля кода |
| oxlint | .ts, .tsx, .js, .jsx и др. + .vue, .astro, .svelte | Быстрый линтер |
| biome | .ts, .tsx, .js, .jsx, .json, .css, .vue, .astro, .svelte и др. | Форматирование + линтер |
| yaml-ls | .yaml, .yml | Поддержка YAML |
| bash | .sh, .bash, .zsh, .ksh | Shell-скрипты |
| terraform | .tf, .tfvars | IaC-конфиги |
| prisma | .prisma | Схемы баз данных |
| texlab | .tex, .bib | LaTeX-документы |
| tinymist | .typ, .typc | Вёрстка Typst |
| dockerfile | .dockerfile, Dockerfile | Конфиги Docker |

::: tip Пояснение автоустановки
Большинство серверов скачиваются и ставятся при первом использовании в каталог `~/.local/share/opencode/bin/`.

Отдельные серверы (rust-analyzer, dart, sourcekit-lsp) требуют заранее установленный тулчейн.

Переменная окружения `OPENCODE_DISABLE_LSP_DOWNLOAD=true` отключает автоскачивание.
:::

---

## 9 операций LSP

<AdInArticle />

OpenCode предоставляет 9 операций LSP — AI вызывает их сам по необходимости. Можно просить и явно в диалоге.

### 1. goToDefinition: переход к определению

Найти место определения функции, класса, переменной.

```
Вы: найди определение функции formatDate в src/utils/format.ts, строка 15
```

AI вызовет LSP-операцию `goToDefinition` и вернёт файл и номер строки определения.

### 2. findReferences: поиск ссылок

Найти все места использования символа в проекте. Особенно полезно перед рефакторингом.

```
Вы: найди, где используется тип User из src/api/user.ts, строка 20
```

### 3. hover: всплывающая информация

Получить сигнатуру типа, doc-комментарии и другую информацию о символе.

```
Вы: покажи сигнатуру типа функции login в src/services/auth.ts, строка 45
```

### 4. documentSymbol: символы документа

Список всех символов файла (функции, классы, переменные и т. д.) — быстрый обзор структуры файла.

```
Вы: перечисли все функции и классы в src/controllers/user.ts
```

### 5. workspaceSymbol: поиск символов по рабочей области

Поиск символов по всему проекту. Результаты фильтруются по типам: классы, функции, методы, интерфейсы, переменные, константы, структуры, перечисления — максимум 10 штук.

```
Вы: найди в проекте все классы со словом "UserService"
```

### 6. goToImplementation: переход к реализации

Найти конкретные реализации интерфейса или абстрактного класса.

```
Вы: найди все реализации интерфейса Repository из src/interfaces/Repository.ts, строка 10
```

### 7. prepareCallHierarchy: подготовка иерархии вызовов

Получить информацию об иерархии вызовов в позиции для последующего анализа входящих и исходящих вызовов.

### 8. incomingCalls: входящие вызовы

Найти все места вызова текущей функции. Перед изменением функции — оценка масштаба влияния.

```
Вы: найди, где вызывается функция validateEmail из src/utils/validator.ts, строка 20
```

### 9. outgoingCalls: исходящие вызовы

Найти все функции, вызываемые текущей, — разбор зависимостей.

```
Вы: посмотри, какие ещё функции вызывает processPayment из src/services/payment.ts, строка 50
```

::: details Параметры инструментов LSP
Все операции LSP требуют три параметра:
- `filePath`: путь к файлу (абсолютный или относительный)
- `line`: номер строки (с 1, как видно в редакторе)
- `character`: смещение символа (с 1)

AI заполняет параметры сам — описывайте задачу естественным языком.
:::

---

## Использование LSP в диалоге

### AI использует сам

Чаще всего специально упоминать LSP не нужно — AI сам решает, когда применять:

```
Вы: где определена эта функция formatDate?

AI: [автоматически вызывает lsp goToDefinition]
    formatDate определена в src/utils/date.ts, строка 42...
```

### Явные запросы

Можно прямо просить AI использовать LSP:

```
Вы: через LSP найди все ссылки на класс UserService
Вы: через LSP выведи список символов файла config.ts
Вы: через LSP разбери связи вызовов функции processOrder
```

---

## Повторите за мной: настройка LSP

### Шаг 1: проверьте, работает ли LSP

**Зачем**
В большинстве случаев LSP работает из коробки — сначала убедитесь.

В диалоге OpenCode введите:

```
Покажи информацию о символах в src/index.ts, строка 1
```

**Вы должны увидеть**: AI вернул информацию о типах или doc-комментарии — значит, LSP работает.

Увидели `No LSP server available for this file type` — сервер языка не стартовал, проверьте условия из столбца «Требование».

---

### Шаг 2: отключите ненужные серверы

**Зачем**
Отдельные проекты могут дёргать сразу несколько серверов (например, TypeScript и Deno) — возникнет конфликт.

Отключите отдельные серверы в `opencode.json`:

```json
{
  "lsp": {
    "deno": {
      "disabled": true
    }
  }
}
```

Чтобы глобально отключить все LSP (например, при отладке производительности):

```json
{
  "lsp": false
}
```

**Вы должны увидеть**: отключённые серверы больше не стартуют, в логах будет `LSP server xxx is disabled`.

---

### Шаг 3: добавьте свой LSP-сервер

**Зачем**
Если для вашего языка нет встроенной поддержки — настройте сами.

```json
{
  "lsp": {
    "my-lang": {
      "command": ["my-lsp-server", "--stdio"],
      "extensions": [".myl"],
      "env": {
        "MY_ENV": "value"
      }
    }
  }
}
```

Описание полей конфигурации:

| Поле | Тип | Обязат. | Описание |
|------|------|------|------|
| `command` | string[] | ✅ (при включении обязательно) | Команда запуска и параметры. Только для отключения можно опустить — достаточно `{ "disabled": true }` |
| `extensions` | string[] | ✅ (свои серверы) | Список расширений файлов |
| `disabled` | boolean | ❌ | Отключён ли (по умолчанию `false`) |
| `env` | object | ❌ | Переменные окружения |
| `initialization` | object | ❌ | Параметры инициализации LSP |

::: warning Обратите внимание
Свои LSP-серверы обязаны задавать поле `extensions`, иначе валидация конфигурации упадёт с ошибкой: `For custom LSP servers, 'extensions' array is required.`

Встроенные серверы `extensions` опускают — значения по умолчанию уже есть.
:::

**Вы должны увидеть**: при открытии `.myl`-файлов AI умеет пользоваться операциями LSP.

---

## Контрольные пункты ✅

- [ ] Понимаете роль LSP: AI переходит с «чтения текста» на «понимание структуры кода»
- [ ] Знаете: в OpenCode встроено 30+ языковых серверов, большинство работает из коробки
- [ ] Назовёте хотя бы 3 операции LSP (переходы к определениям, поиск ссылок, ховеры...)
- [ ] Знаете, как отключить отдельный LSP-сервер
- [ ] Знаете, как добавить свой LSP-сервер

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| `No LSP server available for this file type` | Сервер языка не установлен или не выполнены условия | Проверьте столбец «Требование», установите нужный тулчейн |
| LSP-сервер стартует не в том каталоге | Неверно определяется корень проекта | Убедитесь, что в корне проекта есть маркерный файл (вроде `package.json`, `go.mod`) |
| `File not found: /path/to/file.ts` | Ошибка в пути к файлу | Используйте путь относительно корня проекта |
| Первое использование долго ждёт | Первый старт сервера — инициализация и построение индекса | Нормально, дальше будет намного быстрее |
| Конфликт серверов TypeScript и Deno | Оба сервера обрабатывают `.ts`-файлы | Отключите ненужный в `opencode.json` |
| Высокое потребление памяти LSP | Индекс больших проектов ест память | Отключите ненужные серверы или задайте `"lsp": false` |
| Свой сервер не стартует | Нет переменных окружения или неверный путь команды | Добавьте поле `env` в конфиг, используйте абсолютные пути |

---

## Дополнительная информация

### Лицензия PHP Intelephense

PHP Intelephense открывает продвинутые функции по лицензионному ключу. Ключ положите текстовым файлом:

- macOS/Linux: `$HOME/intelephense/licence.txt`
- Windows: `%USERPROFILE%/intelephense/licence.txt`

Файл содержит только лицензионный ключ, без прочего содержимого.

### Экспериментальная функция: Python-сервер ty

Переменная окружения `OPENCODE_EXPERIMENTAL_LSP_TY=1` включает экспериментальный Python-сервер ty вместо pyright по умолчанию. После включения pyright автоматически отключается.

::: warning Экспериментальная функция
Сервер ty пока экспериментальный и может меняться с версиями. Для production рекомендуем pyright.
:::

---

## Итоги урока

| Главная концепция | Описание |
|---------|------|
| Роль LSP | Даёт AI IDE-уровень кодового интеллекта и понимание семантики кода |
| Автодетект | По расширению файлов автоматически стартует нужный сервер |
| Встроенная поддержка | 30+ языковых серверов, большинство работает из коробки |
| 9 операций | Переходы к определениям, поиск ссылок, ховеры, поиск символов, переходы к реализациям, иерархии вызовов и др. |
| Способы настройки | Поле `lsp` в `opencode.json`, поддерживаются отключение и свои серверы |

Запомните: в большинстве случаев настраивать ничего не нужно — LSP работает сам. Конфиг нужен лишь при проблемах и своей настройке.

---

## Анонс следующего урока

> В следующем уроке изучим **[сжатие контекста](./20-compaction)**.
>
> Вы узнаете:
> - Механизм срабатывания сжатия контекста
> - Что означают проценты Context
> - Как сжимать вручную
> - Как сжатие влияет на качество диалога

---

## Связанные уроки

- [Форматтеры кода](18-formatters) — автоматическое форматирование кода
- [Встроенные инструменты](17-tools) — обзор всех встроенных инструментов
- [Руководство по отладке](22-debugging) — диагностика проблем командой `debug lsp`
- [Справочник конфигурации](../appendix/config-ref) — все опции конфигурации

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> Дата обновления: 2026-02-14

| Функция | Путь к файлу | Строки |
|-----|---------|------|
| Пространство имён LSP и главная логика | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L14-L485) | 14-485 |
| Получение LSP-клиента и старт серверов | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L177-L262) | 177-262 |
| Реализация goToDefinition | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L386-L395) | 386-395 |
| Реализация findReferences | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L397-L407) | 397-407 |
| Реализация hover | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L303-L317) | 303-317 |
| Реализация workspaceSymbol (фильтрация и лимит 10 штук) | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L359-L369) | 359-369 |
| Реализация documentSymbol | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L371-L384) | 371-384 |
| Реализация goToImplementation | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L409-L418) | 409-418 |
| Реализация prepareCallHierarchy | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L420-L429) | 420-429 |
| Реализация incomingCalls | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L431-L442) | 431-442 |
| Реализация outgoingCalls | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L444-L455) | 444-455 |
| Диагностическая информация | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L291-L301) | 291-301 |
| Определение инструментов LSP (9 операций) | [`src/tool/lsp.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/lsp.ts#L10-L96) | 10-96 |
| Текст описания инструментов LSP | [`src/tool/lsp.txt`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/lsp.txt#L1-L20) | 1-20 |
| Schema конфигурации LSP | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L1115-L1150) | 1115-1150 |
| Определение интерфейса LSPServer | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L53-L59) | 53-59 |
| Сервер TypeScript | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L89-L116) | 89-116 |
| Сервер Python (pyright) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L505-L557) | 505-557 |
| Сервер Go (gopls) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L358-L398) | 358-398 |
| Сервер Rust (rust-analyzer) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L847-L891) | 847-891 |
| Экспериментальный Python-сервер ty | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L441-L503) | 441-503 |
| Логика фильтрации экспериментальных серверов | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L64-L77) | 64-77 |
| Фильтрация SymbolKind (workspaceSymbol) | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L319-L357) | 319-357 |

**Ключевые типы**:
- `LSP.Range`: диапазон кода (позиции начала и конца)
- `LSP.Symbol`: информация о символе (имя, тип, позиция)
- `LSP.DocumentSymbol`: символ документа (с дочерними символами)
- `LSP.Status`: статус LSP-сервера (id, имя, корень, статус)
- `LSPServer.Info`: определение сервера (id, расширения, корень, spawn)

**Ключевые константы**:
- `operations`: перечисление 9 операций LSP (`src/tool/lsp.ts`, строки 10–20)
- `kinds`: фильтруемые типы символов workspaceSymbol (Class, Function, Method, Interface, Variable, Constant, Struct, Enum)

**Переменные окружения**:
- `OPENCODE_DISABLE_LSP_DOWNLOAD`: отключить автоскачивание LSP-серверов
- `OPENCODE_EXPERIMENTAL_LSP_TY`: включить экспериментальный Python-сервер ty

</details>
