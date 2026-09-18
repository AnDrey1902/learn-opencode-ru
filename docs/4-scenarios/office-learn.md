---
title: C3 Учим программирование с AI
subtitle: Пусть AI станет вашим наставником
course: Практический курс OpenCode на русском языке
stage: Этап 4
lesson: "C3"
duration: 20 минут
practice: 25 минут
level: Начинающий
description: "Пусть AI будет вашим наставником по программированию: учитесь с нуля, практикуйтесь по ходу и быстро осваивайте навыки программирования."
tags:
  - Обучение
  - Программирование
  - Уроки
prerequisite:
  - 2.1 Интерфейс и основные операции
---

# C3 Учим программирование с AI

> 💡 **Коротко**: учитесь программированию с AI как с личным репетитором — с нуля и сразу с практикой.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/4-scenarios/office-learn-notes.mini.jpeg"
     alt="Шпаргалка урока: C3 Учим программирование с AI"
     data-zoom-src="/images/4-scenarios/office-learn-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Плюсы AI-обучения: пассив → интерактив, фиксированный темп → персональный, долгое решение → мгновенная помощь, нет фидбэка → детальные советы.
2. Методы: концепция → практика → вопросы → проект.
3. Инструменты: `@explore` (поиск), `skill` (шаблоны SKILL.md), `/editor` (внешний редактор), `/details` (детали инструментов), `codesearch` (API/библиотеки), `lsp` (определения/ссылки).
4. Первый концепт: с основ, пошагово, каждый — с примерами.
5. Написание кода: `/editor` для длинного кода, Build-режим, `/details` от шума.
6. Решение проблем: спросить AI при зависании, дать понятную ошибку, объяснить причину.
7. Проекты: делать, сложность постепенно, с реальным применением.
8. Хорошие вопросы: плохо — «почему не работает»; хорошо — «получаю IndexError, ожидаю…».
9. codesearch: поиск API/библиотек, tokensNum 1000–50000, нужен providerID = opencode.
10. Ловушки: непонятно — попросить объяснить проще; практика сложна — начать с простого; codesearch не работает — нужен провайдер.

</details>

---

## Что вы сможете после урока

- Учить с AI новые языки программирования
- Просить AI объяснить принципы кода
- Выполнять учебные проекты
- Выстроить правильный метод изучения программирования

---

## С какими трудностями вы столкнулись

- Хотите учить программирование, но непонятно с чего начать
- Уроки смотрятся легко, а руки при написании встают
- Спросить о проблеме некого

---

## Когда это пригодится

- Когда нужно: выучить программирование с нуля под крылом терпеливого наставника
- И не хочется: засыпать над самоучителями в одиночку

---

## 🎒 Перед началом

> Убедитесь, что выполнены следующие условия:

- [ ] Пройден урок [2.1 Интерфейс и основные операции](../2-daily/01-interface)
- [ ] Учебный настрой готов

---

## Основная идея

### Преимущества учёбы с AI

| Традиционная учёба | Учёба с AI |
|---------|-----------|
| Смотришь уроки, пишешь конспекты | Спрашиваешь по ходу, ответы сразу |
| Застрял — идёшь искать | Спрашиваешь AI напрямую |
| Задачи без обратной связи | AI проверяет и советует |
| Темп фиксированный | Темп свой собственный |

### Метод обучения

```
Изучение концепций → практика руками → разбор вопросов → проектная практика
```

### Доступные инструменты и команды (OpenCode)

| Инструмент/команда | Назначение | Ключевые пояснения (проверяемо) |
|-----------|------|------------------|
| Под-агент `@explore` | Быстрое исследование кодовой базы, поиск файлов и реализаций | Explore — встроенный subagent, вызывается вручную через `@` (официально: `opencode/packages/web/src/content/docs/agents.mdx:35`～`opencode/packages/web/src/content/docs/agents.mdx:40`; `opencode/packages/web/src/content/docs/agents.mdx:91`～`opencode/packages/web/src/content/docs/agents.mdx:97`) |
| Инструмент `skill` | Загрузка переиспользуемых учебных шаблонов (`SKILL.md`) | Поддерживает пути `.opencode/skill/*/SKILL.md` и `.claude/skills/*/SKILL.md` и др. (официально: `opencode/packages/web/src/content/docs/skills.mdx:16`～`opencode/packages/web/src/content/docs/skills.mdx:20`; исходники: `opencode/packages/opencode/src/skill/skill.ts:69`～`opencode/packages/opencode/src/skill/skill.ts:113`) |
| `/editor` | Длинный контент и код — во внешнем редакторе | Использует переменную окружения `EDITOR` (официально: `opencode/packages/web/src/content/docs/tui.mdx:74`～`opencode/packages/web/src/content/docs/tui.mdx:115`) |
| `/details` | Переключение детализации вывода инструментов | Встроенная TUI-команда (официально: `opencode/packages/web/src/content/docs/tui.mdx:94`～`opencode/packages/web/src/content/docs/tui.mdx:103`) |
| `codesearch` | Поиск «контекста использования» API и библиотек | Возвращаемые токены настраиваются (1000–2000+, по умолчанию 2000+) (исходники: `opencode/packages/opencode/src/tool/codesearch.ts:43`～`opencode/packages/opencode/src/tool/codesearch.ts:50`); доступность зависит от провайдера и переменных окружения (исходники: `opencode/packages/opencode/src/tool/registry.ts:122`～`opencode/packages/opencode/src/tool/registry.ts:127`) |
| `lsp` | Определения, ссылки, ховеры и др. на базе LSP | Инструмент регистрируется только при `OPENCODE_EXPERIMENTAL_LSP_TOOL` (исходники: `opencode/packages/opencode/src/tool/registry.ts:107`～`opencode/packages/opencode/src/tool/registry.ts:109`), список операций фиксирован — 9 штук (исходники: `opencode/packages/opencode/src/tool/lsp.ts:9`～`opencode/packages/opencode/src/tool/lsp.ts:19`) |

::: tip Приём
- Ссылка на файл в TUI: `@path/to/file` (официально: `opencode/packages/web/src/content/docs/tui.mdx:30`～`opencode/packages/web/src/content/docs/tui.mdx:43`).
- Булевы переменные окружения вида `OPENCODE_ENABLE_EXA` исходники распознают как истину по `"true"` или `"1"` (исходники: `opencode/packages/opencode/src/flag/flag.ts:35`～`opencode/packages/opencode/src/flag/flag.ts:38`).
:::

---

## Повторите за мной

### Шаг 1: выберите язык для изучения

**Зачем**
Пусть AI поможет оценить, с чего начать.

#### Быстрая оценка проекта через @explore

```
@explore быстро разбери этот проект на интенсивности «quick»:
1. Главные языки и фреймворки
2. Структура каталогов (точки входа, ключевые модули)
3. 3 файла, которые новичку стоит прочитать первыми
```

> Пояснение: Explore — под-агент для «быстро найти и посмотреть структуру» (официально: `opencode/packages/web/src/content/docs/agents.mdx:79`～`opencode/packages/web/src/content/docs/agents.mdx:84`).

#### Спросите рекомендацию AI (полный ноль)

```
Я полный ноль в программировании и хочу учить его для эффективности на работе. Проанализируй, пожалуйста:
1. Что мне учить первым: Python, JavaScript или Go
2. Особенности и применение каждого языка
3. Рекомендуемый учебный маршрут
```

### Шаг 2: изучите первую концепцию

<AdInArticle />

**Зачем**
Начинайте с самых основ, постепенно.

Допустим, выбран Python:

```
Начинаю учить Python, учи меня с самых основ:
1. Что такое переменные
2. Дай простой пример
3. Дай мне маленькое упражнение
```

### Шаг 3: пишите код руками

**Зачем**
Программирование без практики не учится.

#### Длинный код — через команду /editor

```
/editor
```

> `/editor` откроет редактор, указанный переменной окружения `EDITOR` (официально: `opencode/packages/web/src/content/docs/tui.mdx:104`～`opencode/packages/web/src/content/docs/tui.mdx:115`).

#### Переключитесь в Build и попросите AI создать файл упражнения

```
Создай файл упражнения learn/01_hello.py:
- напечатать "Hello, World!"
- создать переменную с моим именем
- напечатать приветствие

После создания научи меня его запускать
```

#### Шум вывода инструментов — через /details

```
/details
```

### Шаг 4: разбирайте возникшие проблемы

**Зачем**
Застряли — спрашивайте AI.

```
Запустил код и получил ошибку:
SyntaxError: invalid syntax

Что это значит? Как исправить?
```

### Шаг 5: выполните учебный проект

**Зачем**
По-настоящему учит только проект.

```
Я уже выучил переменные, условия и циклы. Дай подходящий учебный проект:
- умеренной сложности
- на выученном материале
- с практической пользой

Затем веди меня по шагам до готовности
```

---

## Учебные приёмы

### Правильные вопросы

```
# ❌ Плохой вопрос
Почему этот код не работает

# ✅ Хороший вопрос
Этот код падает с IndexError, а я жду печать первого элемента списка,
но получаю ошибку. Код:
print(my_list[1])
```

### Проверка кода через AI (со ссылкой @ на файл)

```
@learn/my_code.py проверь этот код:
1. Есть ли баги
2. Что можно улучшить
3. Соответствует ли лучшим практикам Python
```

---

## Контрольные пункты ✅

> Продолжайте, только когда всё выполнено

- [ ] Разобрались с AI, какой язык учить
- [ ] Изучили хотя бы одну базовую концепцию
- [ ] Сами написали и запустили код
- [ ] Выполнили маленькое упражнение

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Концепции непонятны | Объяснение слишком профессиональное | Явно требуйте «объясни словами новичка + пример + упражнение» |
| Упражнения слишком сложные | Пропустили шаги | Начинайте с самого простого, постепенно |
| `codesearch` не находится или недоступен | Не выполнены условия провайдера или переменных | Смотрите ниже «Условия включения codesearch» |

---

## Продвинутое: больше возможностей

### 1) codesearch: контекст использования API и библиотек

```
Найди через codesearch: React useState hook examples
```

::: tip Приём
- Диапазон `codesearch.tokensNum` — 1000–2000+, по умолчанию 2000+ (исходники: `opencode/packages/opencode/src/tool/codesearch.ts:43`～`opencode/packages/opencode/src/tool/codesearch.ts:50`).
- Условия включения: при providerID `opencode` или истинной переменной окружения `OPENCODE_ENABLE_EXA` `codesearch/websearch` появляются в списке инструментов (исходники: `opencode/packages/opencode/src/tool/registry.ts:122`～`opencode/packages/opencode/src/tool/registry.ts:127`; `opencode/packages/opencode/src/flag/flag.ts:26`～`opencode/packages/opencode/src/flag/flag.ts:28`).
- В официальной документации модели OpenCode Zen пишутся в форме `opencode/...` (официально: `opencode/packages/web/src/content/docs/agents.mdx:334`～`opencode/packages/web/src/content/docs/agents.mdx:335`).
:::

### 2) Инструмент LSP (экспериментальный)

> Пояснение: инструмент `lsp` доступен только при `OPENCODE_EXPERIMENTAL_LSP_TOOL=true` (или `OPENCODE_EXPERIMENTAL=true`) (официально: `opencode/packages/web/src/content/docs/tools.mdx:216`～`opencode/packages/web/src/content/docs/tools.mdx:235`; исходники: `opencode/packages/opencode/src/tool/registry.ts:107`～`opencode/packages/opencode/src/tool/registry.ts:109`).

Можно просить AI выполнить эти операции (9 на выбор):

- `goToDefinition`
- `findReferences`
- `hover`
- `documentSymbol`
- `workspaceSymbol`
- `goToImplementation`
- `prepareCallHierarchy`
- `incomingCalls`
- `outgoingCalls`

(исходники: `opencode/packages/opencode/src/tool/lsp.ts:9`～`opencode/packages/opencode/src/tool/lsp.ts:19`)

Подробная настройка LSP-серверов: [5.19 LSP-серверы](../5-advanced/19-lsp).

### 3) skill: учебный процесс как переиспользуемый шаблон

Создайте файл навыка (пример):

**Создание `.opencode/skill/python-basics/SKILL.md`**:

```markdown
---
name: python-basics
description: Обучение основам Python
---

## What I do

- Объясняю базовые концепции Python
- Даю упражнения и примеры кода
- Помогаю разбирать типовые ошибки

## When to use me

Использовать при изучении базового синтаксиса Python, типов данных и управляющих конструкций.
```

Пути обнаружения навыков:

- `.opencode/skill/<name>/SKILL.md`
- `~/.config/opencode/skill/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`

(официально: `opencode/packages/web/src/content/docs/skills.mdx:16`～`opencode/packages/web/src/content/docs/skills.mdx:20`)

### 4) Подстановка переменных в конфиге (env/file)

OpenCode поддерживает подстановки переменных `{env:VAR}` и `{file:path}` (официально: `opencode/packages/web/src/content/docs/config.mdx:75`～`opencode/packages/web/src/content/docs/config.mdx:95`; исходники: `opencode/packages/opencode/src/config/config.ts:1023`～`opencode/packages/opencode/src/config/config.ts:1026`).

Пример (для `provider.openai.options.apiKey`, обратите внимание: `apiKey` — внутри `options`):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}"
      }
    }
  }
}
```

---

## Индекс доказательств (поведение OpenCode в уроке)

| Тема | Вывод | Доказательство |
|---|---|---|
| Встроенный subagent | Explore вызывается через `@` | `opencode/packages/web/src/content/docs/agents.mdx:35`～`opencode/packages/web/src/content/docs/agents.mdx:40` |
| Диапазон tokens в `codesearch` | 1000–2000+, по умолчанию 2000+ | `opencode/packages/opencode/src/tool/codesearch.ts:43`～`opencode/packages/opencode/src/tool/codesearch.ts:50` |
| Условия включения `codesearch` | providerID=opencode или `OPENCODE_ENABLE_EXA` | `opencode/packages/opencode/src/tool/registry.ts:122`～`opencode/packages/opencode/src/tool/registry.ts:127` |
| Истинные значения `OPENCODE_ENABLE_EXA` | Распознаются `true`/`1` | `opencode/packages/opencode/src/flag/flag.ts:35`～`opencode/packages/opencode/src/flag/flag.ts:38` |
| Операции инструмента `lsp` | Фиксированные 9 operations | `opencode/packages/opencode/src/tool/lsp.ts:9`～`opencode/packages/opencode/src/tool/lsp.ts:19` |
| Пути Skills | Совместимые каталоги `.opencode` и `.claude` | `opencode/packages/web/src/content/docs/skills.mdx:16`～`opencode/packages/web/src/content/docs/skills.mdx:20` |
| Подстановка `{env:...}` | Незаданная переменная заменяется пустой строкой | `opencode/packages/web/src/content/docs/config.mdx:94`～`opencode/packages/web/src/content/docs/config.mdx:95` |

---

## Итоги урока

Вы научились:

1. Планировать с AI маршрут изучения программирования
2. Учиться постепенно, спрашивая по ходу
3. Просить AI проверять и объяснять код
4. Закреплять знания проектами

---

## Анонс следующего урока

> В следующем уроке научимся писать скрипты автоматизации — пусть AI пишет скрипты и освобождает от рутины.
