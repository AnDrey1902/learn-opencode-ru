---
title: C1 Порядок в файлах
subtitle: Пакетное переименование, сортировка в архив
course: Практический курс OpenCode на русском языке
stage: Этап 4
lesson: "C1"
duration: 15 минут
practice: 20 минут
level: Начинающий
description: Пакетно переименовывайте с AI файлы, сортируйте в архив и ищите по содержимому — ускорьте ведение файлов.
tags:
  - Файлы
  - Порядок
  - Пакетная обработка
prerequisite:
  - 2.1 Интерфейс и основные операции
---

# C1 Порядок в файлах

> 💡 **Коротко**: пакетно переименовывайте, сортируйте в архив и ищите по содержимому с помощью AI.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/4-scenarios/office-files-notes.mini.jpeg"
     alt="Шпаргалка урока: C1 Порядок в файлах"
     data-zoom-src="/images/4-scenarios/office-files-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Три шага: анализ → правила → исполнение.
2. Инструменты: list (дерево, ≤100), glob (паттерн, ≤100), grep (regex, ≤100), bash (таймаут 2 мин).
3. Задачи: пакетное переименование, раскладка по папкам, поиск по содержимому, удаление дублей.
4. Анализ папки: list/glob + Plan-режим.
5. Переименование: формат `фото_ГГГГММДД_номер.расширение`, номер с 001.
6. Классификация: jpg/png/gif → картинки/, pdf/doc → документы/, mp4/mov → видео/, остальное → прочее/.
7. Поиск содержимого: grep с regex, сортировка по дате.
8. Подтверждение: итог переименованных/перемещённых файлов.
9. Ловушки: файл удалён без подтверждения; правила неполные; лимиты list/glob/grep ≤100; bash не в той папке.
10. Продвинутое: .gitignore по умолчанию, .ignore для исключений; встроенные исключения (.git, .svn, node_modules, __pycache__ и т.д.).

</details>

---

## Что вы сможете после урока

- Пакетно переименовывать файлы
- Сортировать в архив по правилам
- Искать по содержимому файлов
- Разбирать захламлённые папки

---

## С какими трудностями вы столкнулись

- Папка загрузок в хаосе — ничего не найти
- Хотите переименовать пакетно, а по одному — counters
- Помните, что файл с нужным содержимым где-то есть, а как называется — забыли

---

## Когда это пригодится

- Когда нужно: разобрать захламлённую папку
- И не хочется: вручную дёргать каждый файл

---

## 🎒 Перед началом

> Убедитесь, что выполнены следующие условия:

- [ ] Пройден урок [2.1 Интерфейс и основные операции](../2-daily/01-interface)
- [ ] Есть папка, требующая разбора

---

## Основная идея

### Разбор файлов в три шага

```
Анализ состояния → правила → пакетное выполнение
```

### Доступные инструменты (в уроке — только возможности OpenCode)

| Инструмент | Назначение | Ключевые параметры и поведение (проверяемо) |
|-----|------|----------------------|
| `list` | Список каталога (деревом) | `path` (абсолютный путь, можно опустить — текущий каталог), `ignore` (дополнительный список glob-игноров); возвращает максимум 100 файлов (исходники: `opencode/packages/opencode/src/tool/ls.ts:35`～`opencode/packages/opencode/src/tool/ls.ts:60`) |
| `glob` | Поиск файлов по шаблону (например, `**/*.jpg`) | `pattern`, `path` (необязательно); возвращает максимум 100 записей, сортировка по времени изменения (исходники: `opencode/packages/opencode/src/tool/glob.ts:33`～`opencode/packages/opencode/src/tool/glob.ts:63`) |
| `grep` | Поиск по содержимому файлов (regex) | `pattern`, `include`; возвращает максимум 100 совпадений, сортировка по времени изменения файлов (исходники: `opencode/packages/opencode/src/tool/grep.ts:88`～`opencode/packages/opencode/src/tool/grep.ts:92`) |
| `bash` | Выполнение команд | `workdir` (необязательно, избавляет от `cd && ...`), `timeout` (миллисекунды, по умолчанию 2 минуты: `opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80`); вывод по умолчанию — максимум 30000 символов (исходники: `opencode/packages/opencode/src/tool/bash.ts:19`～`opencode/packages/opencode/src/tool/bash.ts:36`) |

::: tip Приём
- В TUI команду можно выполнить и напрямую с `!` в начале (официально: `opencode/packages/web/src/content/docs/tui.mdx:46`～`opencode/packages/web/src/content/docs/tui.mdx:55`).
- Ссылка `@файл` подтягивает содержимое файла в контекст (официально: `opencode/packages/web/src/content/docs/tui.mdx:30`～`opencode/packages/web/src/content/docs/tui.mdx:43`).
:::

### Типичные задачи разбора

| Задача | Пример |
|-----|------|
| Пакетное переименование | Фото именовать по дате |
| Сортировка в архив | Раскладывать по типам в папки |
| Поиск по содержимому | Найти файлы с нужным словом |
| Чистка дублей | Удалить повторы (сначала советуем dry-run или список) |

---

## Повторите за мной

### Шаг 1: разберите текущую папку

<AdInArticle />

**Зачем**
Сначала понять, какие файлы есть, — потом задавать правила разбора.

Перейдите в целевую папку и запустите OpenCode:

```bash
cd ~/Downloads  # замените на разбираемый каталог
opencode
```

> Можно и сразу: `opencode /path/to/project` (официально: `opencode/packages/web/src/content/docs/tui.mdx:16`～`opencode/packages/web/src/content/docs/tui.mdx:20`).

#### Способ 1: дерево каталогов через list

```
Выведи файлы и подкаталоги текущего каталога (деревом) и расскажи мне:
1. Какие примерно есть подкаталоги
2. Распределение по типам файлов (картинки, документы, архивы и т. д.)
3. Какие имена выглядят однотипными
```

::: tip Приём
- `list.path` требует абсолютный путь (описание параметра: `opencode/packages/opencode/src/tool/ls.ts:39`～`opencode/packages/opencode/src/tool/ls.ts:42`).
- `list` возвращает максимум 100 файлов; для больших каталогов сначала сузьте область через `glob` (исходники: `opencode/packages/opencode/src/tool/ls.ts:35`～`opencode/packages/opencode/src/tool/ls.ts:60`).
:::

#### Способ 2: поиск по шаблону через glob

```
Найди все файлы картинок (например, jpg/png/gif) и выведи от новых к старым по времени изменения
```

```
Найди все PDF-файлы (**/*.pdf)
```

::: tip Приём
- Результаты `glob` сортируются по времени изменения (исходники: `opencode/packages/opencode/src/tool/glob.ts:54`～`opencode/packages/opencode/src/tool/glob.ts:55`).
- `glob` возвращает максимум 100 записей; если видите лишь часть — сработала обрезка (исходники: `opencode/packages/opencode/src/tool/glob.ts:40`～`opencode/packages/opencode/src/tool/glob.ts:63`).
:::

#### Способ 3: комплексный разбор (режим Plan)

Переключитесь в режим Plan:

```
Разбери состояние файлов в этом каталоге:
1. Сколько файлов и подкаталогов (если точное число недоступно — объясни почему)
2. Распределение по типам (картинки, документы, видео и т. д.)
3. Анализ закономерностей в именах
4. Предложи план разбора (сначала «правила», затем «шаги выполнения»)
```

### Шаг 2: пакетное переименование

**Зачем**
Единые имена упрощают ведение.

#### Рекомендация: сначала список переименований, потом выполнение

```
Переименуй все картинки в этом каталоге по правилам:
- Формат: Фото_ГГГГММДД_номер.расширение
- Дату брать из времени изменения файла
- Нумерацию с 001

Требования:
1. Сначала выведи только список «что будет переименовано (старое → новое)», не выполняй
2. Выполнишь после моего подтверждения
```

::: warning ⚠️ Напоминание о безопасности
Спрашивает ли OpenCode подтверждение, решает `permission`.

- `permission` поддерживает `allow/ask/deny` (официально: `opencode/packages/web/src/content/docs/permissions.mdx:14`～`opencode/packages/web/src/content/docs/permissions.mdx:18`).
- Право `edit` покрывает операции записи, изменения и patch над файлами (официально: `opencode/packages/web/src/content/docs/permissions.mdx:86`～`opencode/packages/web/src/content/docs/permissions.mdx:88`).

Чтобы каждое изменение файла требовало подтверждения, задайте в конфиге `ask`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask"
  }
}
```
:::

#### Вариант: bash + workdir (контролируемее)

Если хочется «скрипт + возможность отката», попросите AI сначала создать скрипт и выполнить его через `bash` в указанном каталоге.

::: tip Приём
- `bash.workdir` задаёт рабочий каталог, избавляет от `cd && ...` (параметры: `opencode/packages/opencode/src/tool/bash.ts:62`～`opencode/packages/opencode/src/tool/bash.ts:67`).
- Единица `bash.timeout` — миллисекунды, по умолчанию 2 минуты (исходники: `opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80`).
:::

### Шаг 3: сортировка в архив

**Зачем**
Сортировка по типам упрощает поиск.

```
Разложи файлы этого каталога по типам в подкаталоги:
- Картинки (jpg, png, gif) → Картинки/
- Документы (pdf, doc, docx, txt) → Документы/
- Видео (mp4, mov, avi) → Видео/
- Остальное → Остальное/

Требования:
1. Сначала покажи результат сортировки мне на подтверждение
2. Затем выполняй перемещение
```

### Шаг 4: поиск по содержимому файлов

**Зачем**
Найти файлы с нужным содержимым.

#### Поиск содержимого через grep

```
Найди все txt- и md-файлы со словом «счёт»
```

::: tip Приём
- `grep` использует регулярные выражения (параметры: `opencode/packages/opencode/src/tool/grep.ts:12`～`opencode/packages/opencode/src/tool/grep.ts:16`).
- Результатов максимум 100, сортировка по времени изменения файлов (исходники: `opencode/packages/opencode/src/tool/grep.ts:88`～`opencode/packages/opencode/src/tool/grep.ts:92`).
:::

### Шаг 5: подтверждение итогов разбора

**Зачем**
Убедиться, что разбор соответствует ожиданиям.

```
Подведи итог только что выполненного разбора:
1. Сколько файлов переименовано
2. Сколько файлов перемещено
3. Итоговая структура каталогов
```

---

## Контрольные пункты ✅

> Продолжайте, только когда всё выполнено

- [ ] Разобрали состояние папки
- [ ] Выполнили пакетное переименование
- [ ] Выполнили сортировку в архив
- [ ] Умеете искать по содержимому

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Файлы случайно удалены или изменены | Не сделали список и подтверждение | Сначала просите AI вывести «список операций», затем выполняйте |
| Правила переименования неверные | В правилах не хватает исполнимых деталей | Допишите детали «формат/источник/нумерация/политика перезаписи» |
| Видна лишь часть результатов `list/glob/grep` | У инструментов лимит выдачи (100 записей) | Сузьте область: конкретнее `path/pattern/include` |
| `glob/grep` не находят заведомо существующий файл | ripgrep по умолчанию уважает `.gitignore` | Смотрите механизм `.ignore` в официальной документации (официально: `opencode/packages/web/src/content/docs/tools.mdx:348`～`opencode/packages/web/src/content/docs/tools.mdx:364`) |
| `list` не видит некоторые каталоги | У `list` есть встроенный список частых игноров | Находите напрямую через `glob/grep`; или смотрите встроенный список игноров `list` (исходники: `opencode/packages/opencode/src/tool/ls.ts:8`～`opencode/packages/opencode/src/tool/ls.ts:33`) |
| Команда bash выполнилась не в том каталоге | Не задан `workdir` | Указывайте каталог через `workdir` (исходники: `opencode/packages/opencode/src/tool/bash.ts:62`～`opencode/packages/opencode/src/tool/bash.ts:67`) |

---

## Продвинутые приёмы

### 1) Откуда берутся «правила игнора»

Внутри `glob/grep/list` OpenCode использует ripgrep (официально: `opencode/packages/web/src/content/docs/tools.mdx:348`～`opencode/packages/web/src/content/docs/tools.mdx:352`), поэтому соблюдается `.gitignore`.

Кроме того, инструмент `list` дополнительно игнорирует ряд частых каталогов (исходники: `opencode/packages/opencode/src/tool/ls.ts:8`～`opencode/packages/opencode/src/tool/ls.ts:33`), включая (без дублей):

- `node_modules/`
- `__pycache__/`
- `.git/`
- `dist/`, `build/`, `target/`
- `vendor/`
- `bin/`, `obj/`
- `.idea/`, `.vscode/`
- `.zig-cache/`, `zig-out`
- `.coverage`, `coverage/`
- `tmp/`, `temp/`
- `.cache/`, `cache/`, `logs/`
- `.venv/`, `venv/`, `env/`

### 2) Когда нужно искать ripgrep'ом по «игнорируемым каталогам»

В официальной документации описан приём: создать в корне проекта файл `.ignore`, явно разрешающий нужные пути (официально: `opencode/packages/web/src/content/docs/tools.mdx:354`～`opencode/packages/web/src/content/docs/tools.mdx:364`).

```text
!node_modules/
!dist/
!build/
```

---

## Индекс доказательств (поведение OpenCode в уроке)

| Тема | Вывод | Доказательство |
|---|---|---|
| Лимит выдачи `list` | Максимум 100 файлов | `opencode/packages/opencode/src/tool/ls.ts:35`～`opencode/packages/opencode/src/tool/ls.ts:60` |
| Встроенные игноры `list` | Есть захардкоженный список ignore | `opencode/packages/opencode/src/tool/ls.ts:8`～`opencode/packages/opencode/src/tool/ls.ts:33` |
| Лимит и сортировка `glob` | Максимум 100, сортировка по mtime | `opencode/packages/opencode/src/tool/glob.ts:33`～`opencode/packages/opencode/src/tool/glob.ts:63` |
| Лимит и сортировка `grep` | Максимум 100, сортировка по mtime файлов | `opencode/packages/opencode/src/tool/grep.ts:88`～`opencode/packages/opencode/src/tool/grep.ts:92` |
| Тайм-аут `bash` по умолчанию | По умолчанию 2 минуты | `opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80` |
| Обрезка вывода `bash` | По умолчанию максимум 30000 символов | `opencode/packages/opencode/src/tool/bash.ts:19`～`opencode/packages/opencode/src/tool/bash.ts:36` |
| `.gitignore/.ignore` | ripgrep по умолчанию уважает `.gitignore`; `.ignore` умеет явный include | `opencode/packages/web/src/content/docs/tools.mdx:348`～`opencode/packages/web/src/content/docs/tools.mdx:364` |
| Поведение `permission` | `allow/ask/deny`; `edit` покрывает запись/изменение/patch | `opencode/packages/web/src/content/docs/permissions.mdx:14`～`opencode/packages/web/src/content/docs/permissions.mdx:18`; `opencode/packages/web/src/content/docs/permissions.mdx:86`～`opencode/packages/web/src/content/docs/permissions.mdx:88` |

---

## Итоги урока

Вы научились:

1. Разбирать состояние папки
2. Пакетно переименовывать файлы
3. Сортировать в архив по правилам
4. Искать по содержимому файлов

---

## Анонс следующего урока

> В следующем уроке займёмся обработкой данных: анализ CSV и JSON с AI и генерация отчётов.
