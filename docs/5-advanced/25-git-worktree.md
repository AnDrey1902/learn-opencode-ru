---
title: "Git Worktree: элегантные параллели нескольких веток"
subtitle: Прощай, stash — несколько веток в одном репозитории сразу
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.25"
duration: 15 минут
practice: 20 минут
level: Продвинутый
description: Изучите Git Worktree для параллельного checkout нескольких веток в одном репозитории — конец частым переключениям и конфликтам stash, а с /workspaces OpenCode — эффективная параллельная разработка.
tags:
  - Git
  - worktree
  - Параллельная разработка
  - Ведение веток
prerequisite:
  - 2.2 Управление сессиями
  - Базовые операции Git
---

# Git Worktree: параллельная разработка нескольких веток

> 💡 **Коротко**: `git worktree` держит в одном репозитории сразу несколько веток — переключение сводится к `cd`, без stash.

---

## Что вы сможете после урока

- Переключаться на другую ветку для срочной задачи, не прерывая текущую работу
- Вести параллельно несколько функциональных веток без помех друг другу
- Быстро переключать рабочие области через `/workspaces` OpenCode
- Понимать разницу worktree, stash и clone — и выбирать подходящее решение

---

## С какими трудностями вы столкнулись

Вы разрабатываете функцию в ветке `feature/new-api`, код наполовину готов. Вдруг:

- В production баг — нужно прыгнуть в `hotfix` и срочно чинить
- Коллега прислал PR — нужно локально запустить и посмотреть
- Хочется сверить деталь реализации в старой версии

Традиционный путь:

```bash
git stash          # Отложить текущие правки
git checkout hotfix  # Переключить ветку
# ... чиним баг ...
git checkout feature  # Переключаемся обратно
git stash pop      # Возвращаем правки (возможен конфликт!)
```

**Проблемы**:
- stash может конфликтовать
- Контекст теряется, дорого восстанавливать ход мыслей
- Каждое переключение требует заново входить в состояние

---

## Когда это пригодится

- Когда нужно: вести задачи нескольких веток одновременно
- И не хочется: бесконечно делать stash, переключаться и восстанавливаться

---

## 🎒 Перед началом

> Убедитесь, что выполнены следующие условия:

- [ ] Знакомы с базовыми операциями веток Git
- [ ] Версия Git >= 2.5 (вышел в 2015 году, есть почти везде)

```bash
git --version
# git version 2.43.0 (ok)
```

---

## Главные понятия

### Что такое Git Worktree?

**Git Worktree** (рабочее дерево) — функция Git 2.5, позволяющая **одному репозиторию** иметь **несколько рабочих каталогов**, в каждом — своя ветка.

```
# Традиционно: один каталог — одна ветка за раз
my-project/        ← либо main, либо feature, но не сразу

# С worktree: несколько каталогов — параллельные ветки
my-project/        ← ветка main
my-project-hotfix/ ← ветка hotfix (отдельный каталог)
my-project-review/ ← ветка PR (отдельный каталог)
```

### Почему лучше остальных решений?

| Критерий | git stash | git clone | git worktree |
|--------|-----------|-----------|--------------|
| Место на диске | Нет | Много (полная копия) | Мало (общий .git) |
| Параллельность веток | ❌ Последовательно | ✅ Параллельно | ✅ Параллельно |
| Сохранение контекста | ❌ Теряется | ✅ Независимо | ✅ Независимо |
| Цена синхронизации | Нет | Высокая (отдельный fetch) | Низкая (общие данные) |
| Сценарии | Быстрые переключения (на минуты) | Нужна полная изоляция | Долгая параллельная разработка |

### Как это работает

Когда выполняете `git worktree add ../hotfix hotfix-branch`:

1. **Создаётся каталог**: `../hotfix/`
2. **Выезжает ветка**: файлы `hotfix-branch` кладутся в этот каталог
3. **Создаётся связь**: `.git` нового каталога — это **файл**, указывающий на главный репозиторий

```bash
# .git главного репозитория — каталог
ls -la project/.git
drwxr-xr-x  .git/

# .git worktree — файл
ls -la ../hotfix/.git
-rw-r--r--  .git  # содержимое: gitdir: /path/to/project/.git/worktrees/hotfix
```

Все worktree делят одну базу объектов Git:
- коммит в любом worktree сразу виден остальным
- один `git fetch` обновляет всех

---

## Повторите за мной

### Шаг 1: посмотрите текущий worktree

**Зачем**
Понять состояние рабочих деревьев репозитория.

```bash
cd your-project
git worktree list
```

**Вы должны увидеть**:

```
/path/to/your-project  abc1234 [main]
```

Одна строка — один рабочий каталог (по умолчанию).

---

### Шаг 2: создайте новый worktree

**Зачем**
Вести другую ветку параллельно, не трогая текущую работу.

Допустим, вы на ветке `main` и нужно чинить баг в `hotfix/login`:

```bash
# Синтаксис: git worktree add <путь> <имя-ветки>
git worktree add ../my-project-hotfix hotfix/login
```

**Вы должны увидеть**:

```
Preparing worktree (checking out 'hotfix/login')
HEAD is now at abc1234 Fix login validation
```

::: tip Совет по расположению каталогов
Кладите worktree в **соседний каталог** (`../проект-ветка`), а не внутрь проекта.

❌ Не надо: `git worktree add ./hotfix`
✅ Рекомендуем: `git worktree add ../my-project-hotfix`
:::

---

### Шаг 3: работайте в worktree

**Зачем**
Ощутить независимое окружение разработки без помех.

```bash
# Переходим в новый каталог
cd ../my-project-hotfix

# Теперь вы на ветке hotfix/login
git branch
# * hotfix/login

# Обычная разработка и коммиты
git add .
git commit -m "Fix login validation bug"
git push
```

А **исходный каталог** при этом совершенно не затронут:

```bash
cd ../your-project
git status
# Всё как было, незакоммиченные правки на месте
```

---

### Шаг 4: посмотрите все worktree

**Зачем**
Проверить список рабочих деревьев.

```bash
git worktree list
```

**Вы должны увидеть**:

```
/path/to/your-project       abc1234 [main]
/path/to/my-project-hotfix  def5678 [hotfix/login]
```

---

### Шаг 5: удалите worktree

**Зачем**
Убирать за собой после задачи, чтобы деревья не копились.

```bash
# Вернитесь в главный каталог
cd /path/to/your-project

# Удалите worktree
git worktree remove ../my-project-hotfix
```

**Вы должны увидеть**: каталог удалён, в списке worktree осталась одна строка.

При незакоммиченных изменениях нужно принудительное удаление:

```bash
git worktree remove --force ../my-project-hotfix
```

---

### Шаг 6: рабочие области в OpenCode

**Зачем**
В связке с экспериментальной функцией рабочих областей OpenCode быстро переключаться в TUI. В `v1.18.22` workspace уже на архитектуре adapter, встроенный adapter — `worktree`; команда `/workspaces` управляет workspace, созданными или обнаруженными adapter, а не отдельным независимым механизмом клонирования.

Сначала включите экспериментальную функцию:

```bash
# Добавьте в ~/.zshrc или ~/.bashrc
export OPENCODE_EXPERIMENTAL_WORKSPACES=1

# Перезагрузите
source ~/.zshrc
```

Перезапустите `opencode` и введите:

```
/workspaces
```

**Вы должны увидеть**: диалог списка рабочих областей с текущим проектом и всеми worktree.

| Действие | Описание |
|------|------|
| Выбор рабочей области | Переход в каталог соответствующего worktree |
| + New workspace | Создание нового worktree |
| Клавиша Delete | Удаление выбранного worktree |

::: warning Границы текущей реализации и исторических релизов
В релизе v1.16.0 добавляли managed workspace cloning с рекламой сохранения грязных файлов и неотслеживаемых. К `v1.18.22` пути создания и обнаружения уже идут через workspace adapter + встроенный worktree adapter; при перемещении сессий можно выбрать копирование Git-патчей через `copyChanges`, но это не равно продолжению всего поведения исторического managed clone — в частности, не обещайте копирование неотслеживаемых файлов.
:::

> Текущая реализация: [`adapters/index.ts:5-18`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18),[`adapters/worktree.ts:28-95`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/worktree.ts#L28-L95),[`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620),[`workspace.ts:728-739`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739). Исторические доказательства: [`релиз v1.16.0`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0),коммит `5661af203487b90cf9ee0844b198b03cce26c412`.

---

## Контрольные пункты ✅

- [ ] Понимаете, что такое worktree и почему он лучше stash и clone
- [ ] Умеете создавать новое рабочее дерево через `git worktree add`
- [ ] Умеете смотреть все рабочие деревья через `git worktree list`
- [ ] Умеете удалять рабочее дерево через `git worktree remove`
- [ ] Включили функцию рабочих областей OpenCode и переключаетесь через `/workspaces`

---

## Продвинутое: лучшие практики

### 1. Паттерн голого репозитория (Bare Repo Pattern)

При долгой работе с несколькими worktree рекомендуем режим «голого репозитория»:

```bash
# Клонируйте как голый репозиторий (без рабочей области)
git clone --bare git@github.com:user/repo.git repo.git

cd repo.git

# Создавайте worktree (имя ветки как имя каталога)
git worktree add main main
git worktree add ../feature feature-branch
git worktree add ../hotfix hotfix-branch
```

Структура каталогов:

```
code/
├── repo.git/       # Голый репозиторий (только данные .git)
│   └── main/       # worktree: ветка main
├── feature/        # worktree: ветка feature
└── hotfix/         # worktree: ветка hotfix
```

**Преимущества**:
- Все ветки равноправны, нет главных и побочных
- Ясная структура каталогов: имя ветки = имя каталога
- Один `fetch` обновляет все worktree

### 2. Соглашения об именах

| Стиль | Пример | Сценарии |
|------|------|---------|
| проект-ветка | `my-project-hotfix` | Временные worktree |
| Имя ветки как есть | `feature/login` | Режим голого репозитория |
| Проект + назначение | `my-project-review` | Отдельно для ревью PR |

### 3. Регулярная чистка

Возьмите за правило: смержили ветку — сразу удаляйте worktree.

```bash
# Удалить worktree смерженной ветки
git worktree remove ../feature-done
git branch -d feature-done

# Почистить осиротевшие записи worktree (например, каталог снесли через rm -rf вручную)
git worktree prune
```

### 4. В связке с IDE

Каждый worktree открывается как **независимый проект**:

```bash
# VS Code
code ../my-project-hotfix

# IntelliJ
# Open → выбрать каталог
```

Так у каждой ветки свои:
- конфигурации запуска
- точки останова
- открытые файлы

---

## Типичные проблемы

### ⚠️ Одна ветка не может быть выписана дважды

```bash
# Допустим, main уже выписан в главном каталоге
git worktree add ../another-main main
# fatal: 'main' is already checked out at '/path/to/project'
```

**Решение**: создайте новую ветку

```bash
git worktree add -b hotfix/from-main ../hotfix main
```

### ⚠️ Не кладите каталог worktree внутрь проекта

```bash
# ❌ Неверно: создаст каталог внутри проекта
git worktree add ./hotfix branch-name

# ✅ Верно: соседний каталог
git worktree add ../project-hotfix branch-name
```

Внутренность ведёт к:
- бардаку в правилах игнора Git
- неверным путям в скриптах инструментов
- ощущению «это не часть проекта» психологически

### ⚠️ node_modules задвоится

Каждый worktree — независимый рабочий каталог, зависимости ставятся **отдельно**:

```bash
cd ../project-hotfix
npm install  # или pnpm install
```

В больших проектах это главные затраты времени.

**Смягчение**:
- Глобальный store pnpm (жёсткие ссылки, экономия места)
- Общий каталог кэша в настройках

### ⚠️ stash — общий

Все worktree делят один список stash:

```bash
# Заstashили в worktree A
git stash push -m "WIP feature"

# Видно и в worktree B
git stash list
```

Возможна путаница. Рекомендация: **с worktree не пользуйтесь stash**.

---

## Реальные сценарии применения

### Сценарий 1: срочный фикс бага

```
Разрабатываете функцию в feature/new-api
→ Продакт: «продакшн лёг!»
→ git worktree add ../hotfix hotfix/urgent
→ cd ../hotfix, чините, деплоите
→ cd ../feature, продолжаете разработку
```

### Сценарий 2: ревью PR

```
Коллега: «заревьюь мой PR»
→ git fetch origin
→ git worktree add ../review origin/their-branch
→ cd ../review, запускаете тесты, смотрите код
→ ревью готово, удаляете worktree
```

### Сценарий 3: параллельное сравнительное тестирование

```
Хотите сравнить эффекты старой и новой реализации
→ git worktree add ../old-version v1.0.0
→ git worktree add ../new-version v2.0.0
→ Запускаете оба каталога одновременно, сравниваете результаты
```

---

## Шпаргалка частых команд

| Команда | Назначение |
|------|------|
| `git worktree add <path> <branch>` | Создание worktree |
| `git worktree add -b <new-branch> <path>` | Новая ветка + worktree |
| `git worktree list` | Список всех worktree |
| `git worktree remove <path>` | Удаление worktree |
| `git worktree remove --force <path>` | Принудительное удаление (есть незакоммиченные правки) |
| `git worktree prune` | Чистка осиротевших записей |
| `git worktree lock <path>` | Блокировка (защита от случайного удаления) |
| `git worktree move <path> <new-path>` | Перемещение worktree |

---

## Итоги урока

| Понятие | Главное |
|------|------|
| **Что это** | Один репозиторий, несколько рабочих каталогов, общие данные .git |
| **Что решает** | Дорогие переключения веток, риски stash, трата места на clone |
| **Когда использовать** | Срочные фиксы, параллельная разработка, ревью PR, сравнительные тесты |
| **Лучшие практики** | Режим голого репозитория, соглашения об именах, регулярная чистка |
| **Интеграция OpenCode** | Быстрое переключение через `/workspaces` |

---

## Анонс следующего урока

> В следующем уроке изучим **[приложение: сводка экспериментальных функций](../appendix/experimental-features)**.
>
> Вы узнаете:
> - Полный список всех экспериментальных функций
> - Какие функции включать под задачи
> - Приёмы настройки переменных окружения

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> Целевая версия: v1.18.22 (2026-08-24)

| Функция | Путь к файлу | Строки |
|-----|---------|------|
| Регистрация Adapter (встроенный worktree) | [`src/control-plane/adapters/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18) | 5-18 |
| Adapter Worktree | [`src/control-plane/adapters/worktree.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/worktree.ts#L28-L95) | 28-95 |
| Создание Workspace | [`src/control-plane/workspace.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538) | 492-538 |
| Обнаружение и регистрация Adapter | [`src/control-plane/workspace.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739) | 728-739 |
| Маршрутизация с учётом Workspace | [`workspace-routing.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts#L148-L185) | 148-185 |
| Экспериментальный флаг | [`src/effect/runtime-flags.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L43-L50) | 43-50 |
| Команда TUI `/workspaces` | [`packages/tui/src/app.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/app.tsx#L610-L618) | 610-618 |

**Ключевая переменная окружения**:
- `OPENCODE_EXPERIMENTAL_WORKSPACES=1`: включает поддержку рабочих областей TUI

</details>
