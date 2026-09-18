---
title: 5.6a Система тем
subtitle: Настройте визуал под себя
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.6a"
duration: 10 минут
practice: 10 минут
level: Продвинутый
description: Используйте 33 встроенные JSON-темы, автогенерацию темы system или свои цвета — создайте личный визуал терминала.
tags:
  - Темы
  - Внешний вид
  - TUI
prerequisite:
  - 5.1 Всё о конфигурации
---

# 5.6a Система тем

> 33 встроенные JSON-темы переключаются свободно, а при доступных цветах терминала ещё и генерируется тема `system`.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/06a-themes-notes.mini.jpeg" alt="Шпаргалка урока: система тем" data-zoom-src="/images/5-advanced/06a-themes-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Терминал обязан поддерживать truecolor (24 бит) — проверка через `$COLORTERM`.
2. Переключение тем: команда `/theme` или `Ctrl+X → T`.
3. 32+ встроенных тем: opencode (по умолчанию), tokyonight, catppuccin, gruvbox, nord, dracula, github, cursor.
4. Тема по умолчанию: `"theme": "tokyonight"` в `opencode.jsonc`.
5. Ключ — `theme` (не `tui.theme`!).
6. Свои темы: `.opencode/themes/my-theme.json` (primary, diffRemoved, syntaxKeyword; тёмная/светлая).
7. TUI: `scroll_speed`, `scroll_acceleration` (macOS), `diff_style` (auto/stacked).
8. Редактор: переменная `EDITOR` с `--wait` для GUI-редакторов (VS Code, Cursor, Vim).
9. Ловушки: нет truecolor → 256 цветов; `tui.theme` вместо `theme`; неверный путь своей темы; нет `--wait`.

</details>

---

## Что вы сможете после урока

- Переключать и задавать темы
- Понимать приоритет загрузки тем
- Создавать свои темы
- Настраивать прокрутку TUI и стиль Diff

---

## Требования к терминалу

Темам нужен терминал с поддержкой **truecolor** (24-битный цвет):

```bash
# Проверка поддержки
echo $COLORTERM  # должно вывести truecolor или 24bit

# Если не поддерживается — добавьте в конфиг shell
export COLORTERM=truecolor
```

**Совместимость**:
- Поддерживают: iTerm2, Alacritty, Kitty, Windows Terminal, GNOME Terminal (новые версии)
- Без truecolor темы деградируют до 256-цветных приближений

---

## Переключение тем

```
/themes
```

Или горячими клавишами: <kbd>Ctrl</kbd>+<kbd>X</kbd> → <kbd>T</kbd>

---

## Встроенные темы

В OpenCode **33** статичные JSON-темы. При доступных цветах терминала дополнительно генерируется тема `system`:

| Тема | Стиль | Источник |
|-----|------|------|
| `opencode` | Тема по умолчанию, оранжевые тона | Оригинал OpenCode |
| `system` | Адаптация под палитру терминала | Особая |
| `tokyonight` | Тёмная, сине-фиолетовые тона | [tokyonight.nvim](https://github.com/folke/tokyonight.nvim) |
| `catppuccin` | Тёмная, мягкие розовые тона | [Catppuccin](https://github.com/catppuccin) |
| `catppuccin-macchiato` | Тёмная, вариант Macchiato | [Catppuccin](https://github.com/catppuccin) |
| `catppuccin-frappe` | Тёмная, вариант Frappe | [Catppuccin](https://github.com/catppuccin) |
| `gruvbox` | Тёмная, ретро-тёплая | [Gruvbox](https://github.com/morhetz/gruvbox) |
| `nord` | Тёмная, скандинавские холодные тона | [Nord](https://github.com/nordtheme/nord) |
| `everforest` | Тёмная, природная зелень | [Everforest](https://github.com/sainnhe/everforest) |
| `ayu` | Тёмная, в стиле Ayu | [Ayu](https://github.com/ayu-theme) |
| `carbonfox` | Тёмная, в стиле Carbonfox | Nightfox |
| `kanagawa` | Тёмная, японская тушь | [Kanagawa](https://github.com/rebelot/kanagawa.nvim) |
| `one-dark` | Тёмная, в стиле Atom | [Atom One](https://github.com/Th3Whit3Wolf/one-nvim) |
| `dracula` | Тёмная, фиолетовые тона | Dracula |
| `matrix` | Хакерская зелень | Классика |
| `monokai` | Тёмная, классический Monokai | Monokai |
| `material` | Тёмная, Material Design | Material |
| `solarized` | Тёмная/светлая, Solarized | Solarized |
| `palenight` | Тёмная, фиолетово-синие тона | Palenight |
| `nightowl` | Тёмная, для ночи | Night Owl |
| `rosepine` | Тёмная, розовые тона | Rose Pine |
| `synthwave84` | Ретро-неон | Synthwave '84 |
| `cobalt2` | Тёмная, кобальтово-синие тона | Cobalt2 |
| `github` | В стиле GitHub | GitHub |
| `vercel` | Тёмная, в стиле Vercel | Vercel |
| `cursor` | Тёмная, в стиле Cursor | Cursor |
| `vesper` | Тёмная, мягкая | Vesper |
| `aura` | Тёмная, фиолетовые тона | Aura |
| `flexoki` | Тёмная, мягкие чернильные тона | Flexoki |
| `zenburn` | Тёмная, низкоконтрастная, бережёт глаза | Zenburn |
| `mercury` | Тёмная, серебристо-серые тона | Mercury |
| `orng` | Тёмная, оранжевые тона | OpenCode |
| `lucent-orng` | Тёмная, яркие оранжевые тона | OpenCode |
| `osaka-jade` | Тёмная, нефритово-зелёные тона | OpenCode |

> Команда `/themes` показывает живой предпросмотр доступных тем.

---

## Тема System

`system` — особая тема, автоматически подстраивается под палитру терминала:

- **Автогенерация серого**: по фону терминала подбирается серая шкала с лучшим контрастом
- **Цвета ANSI**: используются стандартные ANSI-цвета (0–15), следуют палитре терминала
- **Натив терминала**: текст и фон — `none`, сохраняется родной вид терминала

**Кому подойдёт**:

- тем, кто хочет совпадения OpenCode с видом терминала
- тем, у кого своя цветовая схема терминала
- тем, кто хочет единый стиль всех терминальных программ

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "system"
}
```

---

## Тема по умолчанию

<AdInArticle />

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight"
}
```

> **Обратите внимание**: сохраняйте это как `tui.json` или `tui.jsonc`. Рекомендуем писать `theme` прямо в корне TUI-конфигурации. Не пишите `tui.theme` в главный `opencode.json`; отдельная TUI-конфигурация обратно совместима со старым вложенным написанием, но продолжать так не рекомендуем.

При обновлении со старой версии старт TUI попытается перенести старый `theme` из главной конфигурации в новый `tui.json` в том же каталоге. При существующем `tui.json` в том же каталоге — пропустит; иначе после успешной записи нового файла и создания (или переиспользования) `<старый-главный-конфиг>.tui-migration.bak` удалит из старой главной конфигурации `theme`, `keybinds` и `tui`. Одинокий `tui.jsonc` пропуск не вызывает.

---

## Свои темы

### Порядок загрузки тем

Приоритет снизу вверх (позже загруженное перекрывает ранее загруженное):

1. **Встроенные темы** — зашиты в бинарник
2. **Каталог пользовательской конфигурации** — `~/.config/opencode/themes/*.json` или `$XDG_CONFIG_HOME/opencode/themes/*.json`
3. **Встречные `.opencode/themes`** — обход от текущего каталога к родительским с загрузкой

Одноимённые темы перекрываются. Например, создание `~/.config/opencode/themes/tokyonight.json` перекрывает встроенную тему. При одноимённых темах в нескольких встречных `.opencode/themes` побеждает позже загруженный (более родительский) каталог — не считайте, что текущий каталог всегда приоритетнее.

### Создание темы

**Глобальная тема пользователя**:

```bash
mkdir -p ~/.config/opencode/themes
vim ~/.config/opencode/themes/my-theme.json
```

**Тема только для проекта**:

```bash
mkdir -p .opencode/themes
vim .opencode/themes/my-theme.json
```

### Формат JSON темы

```jsonc
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    // Определения цветов (необязательно), для переиспользования
    "bg": "#1a1b26",
    "fg": "#c0caf5",
    "blue": "#7aa2f7",
    "green": "#9ece6a",
    "red": "#f7768e"
  },
  "theme": {
    // Обязательные свойства цветов
    "primary": { "dark": "blue", "light": "#3b7dd8" },
    "text": { "dark": "fg", "light": "#1a1a1a" },
    "background": { "dark": "bg", "light": "#ffffff" }
    // ... остальные свойства
  }
}
```

### Форматы цветов

| Формат | Пример | Описание |
|------|------|------|
| Hex | `"#ffffff"` | Стандартный hex-цвет |
| ANSI | `3` | Код цвета ANSI 0–255 |
| Ссылка | `"primary"` | Ссылка на цвет из `defs` |
| Варианты свет/тьма | `{"dark": "#000", "light": "#fff"}` | Отдельно для тёмного и светлого режимов |
| Без цвета | `"none"` | Цвет терминала по умолчанию (прозрачность) |

### Все свойства темы

Тема включает следующие свойства цветов. Каждое обязательное свойство требует разрешимого значения, но объект `dark/light` не обязателен: можно писать одиночный цвет, ссылку или ANSI-значение, а также `{ dark, light }` для двух режимов отдельно.

**Базовые цвета**:

| Свойство | Описание |
|------|------|
| `primary` | Главный цвет для акцентов |
| `secondary` | Вторичный цвет |
| `accent` | Цвет изюминки |
| `error` | Цвет ошибок |
| `warning` | Цвет предупреждений |
| `success` | Цвет успеха |
| `info` | Цвет информации |

**Текст и фон**:

| Свойство | Описание |
|------|------|
| `text` | Главный цвет текста |
| `textMuted` | Вторичный и серый текст |
| `background` | Главный фон |
| `backgroundPanel` | Фон панелей |
| `backgroundElement` | Фон элементов |

**Рамки**:

| Свойство | Описание |
|------|------|
| `border` | Обычные рамки |
| `borderActive` | Рамки в активном состоянии |
| `borderSubtle` | Мягкие рамки |

**Вид Diff**:

| Свойство | Описание |
|------|------|
| `diffAdded` | Цвет текста добавленных строк |
| `diffRemoved` | Цвет текста удалённых строк |
| `diffContext` | Цвет текста контекстных строк |
| `diffHunkHeader` | Цвет текста заголовков ханков |
| `diffHighlightAdded` | Подсветка добавленного |
| `diffHighlightRemoved` | Подсветка удалённого |
| `diffAddedBg` | Фон добавленных строк |
| `diffRemovedBg` | Фон удалённых строк |
| `diffContextBg` | Фон контекста |
| `diffLineNumber` | Цвет номеров строк |
| `diffAddedLineNumberBg` | Фон номеров добавленных строк |
| `diffRemovedLineNumberBg` | Фон номеров удалённых строк |

**Рендер Markdown**:

| Свойство | Описание |
|------|------|
| `markdownText` | Основной текст |
| `markdownHeading` | Заголовки |
| `markdownLink` | Ссылки URL |
| `markdownLinkText` | Текст ссылок |
| `markdownCode` | Инлайн-код |
| `markdownBlockQuote` | Цитаты |
| `markdownEmph` | Курсив |
| `markdownStrong` | Жирный |
| `markdownHorizontalRule` | Горизонтальные линии |
| `markdownListItem` | Маркеры списков |
| `markdownListEnumeration` | Номера упорядоченных списков |
| `markdownImage` | Ссылки картинок |
| `markdownImageText` | Подписи картинок |
| `markdownCodeBlock` | Текст блоков кода |

**Подсветка синтаксиса**:

| Свойство | Описание |
|------|------|
| `syntaxComment` | Комментарии |
| `syntaxKeyword` | Ключевые слова |
| `syntaxFunction` | Имена функций |
| `syntaxVariable` | Переменные |
| `syntaxString` | Строки |
| `syntaxNumber` | Числа |
| `syntaxType` | Типы |
| `syntaxOperator` | Операторы |
| `syntaxPunctuation` | Пунктуация |

### Полный пример

На примере темы Nord:

```jsonc
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "nord0": "#2E3440",
    "nord1": "#3B4252",
    "nord4": "#D8DEE9",
    "nord8": "#88C0D0",
    "nord11": "#BF616A",
    "nord14": "#A3BE8C"
  },
  "theme": {
    "primary": { "dark": "nord8", "light": "#5E81AC" },
    "secondary": { "dark": "#81A1C1", "light": "#81A1C1" },
    "error": { "dark": "nord11", "light": "nord11" },
    "success": { "dark": "nord14", "light": "nord14" },
    "text": { "dark": "nord4", "light": "nord0" },
    "background": { "dark": "nord0", "light": "#ECEFF4" },
    "diffAdded": { "dark": "nord14", "light": "nord14" },
    "diffRemoved": { "dark": "nord11", "light": "nord11" },
    "syntaxKeyword": { "dark": "#81A1C1", "light": "#81A1C1" },
    "syntaxString": { "dark": "nord14", "light": "nord14" }
    // ... остальные свойства
  }
}
```

---

## Настройки TUI

Кроме цветов темы настраивается поведение TUI:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  // Скорость прокрутки (минимум 0.001)
  "scroll_speed": 3,

  // Ускорение прокрутки (включённое перекрывает scroll_speed)
  "scroll_acceleration": {
    "enabled": true
  },

  // Стиль рендера Diff
  // "auto": адаптация под ширину терминала
  // "stacked": всегда одноколоночный вид
  "diff_style": "auto"
}
```

**Описание параметров**:

| Параметр | Тип | По умолчанию | Описание |
|------|------|--------|------|
| `scroll_speed` | number | 3 | Скорость прокрутки, минимум 0.001 |
| `scroll_acceleration.enabled` | boolean | false | Ускорение прокрутки в стиле macOS |
| `diff_style` | `"auto"` \| `"stacked"` | `"auto"` | Стиль рендера Diff |

> **Обратите внимание**: при включённом `scroll_acceleration` настройка `scroll_speed` игнорируется.

Поля выше, как и `theme`, пишутся прямо в корне `tui.json`. Исходники — Schema TUI в v1.18.22: [конфиг TUI](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L61-L75).

---

## Настройки редактора

OpenCode умеет открывать внешний редактор для длинных текстов:

```bash
# Задать редактор (добавьте в ~/.zshrc или ~/.bashrc)
export EDITOR="code --wait"  # VS Code
export EDITOR="cursor --wait" # Cursor
export EDITOR="vim"          # Vim
export EDITOR="nano"         # Nano
```

Использование в OpenCode:

```
/editor
```

Или горячими клавишами: <kbd>Ctrl</kbd>+<kbd>X</kbd> → <kbd>E</kbd>

> **Обратите внимание**: GUI-редакторы (VS Code, Cursor и др.) требуют параметра `--wait`, чтобы OpenCode дожидался закрытия редактора.

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Цвета неверные или деградировали | Терминал без truecolor | Задайте `COLORTERM=truecolor` |
| Команды `/theme` нет | Ошибка в имени команды | Используйте `/themes` (с s) |
| Настройка темы не применяется | Записана в главный `opencode.json` или старым вложенным способом | Используйте `theme` в корне `tui.json` |
| Своя тема не подхватилась | Неверный путь | Проверьте `.opencode/themes/` или `~/.config/opencode/themes/` |
| Редактор не открывается | Неверная переменная EDITOR | Убедитесь, что команда редактора доступна, GUI-редакторам добавьте `--wait` |
| Прокрутка слишком быстрая или медленная | Неподходящая скорость по умолчанию | Настройте `scroll_speed` в корне `tui.json` или включите ускорение |

---

## Итоги урока

Вы научились:

1. Переключать командой `/themes` 33 встроенные JSON-темы и генерируемую при доступности тему `system`
2. Понимать механизм адаптации темы `system`
3. Задавать тему по умолчанию через `theme` в `tui.json`
4. Создавать файлы собственных JSON-тем
5. Настраивать прокрутку TUI и стиль Diff
6. Настраивать внешний редактор

---

## Анонс следующего урока

> В следующем уроке займёмся настройкой горячих клавиш.

→ [5.6b Горячие клавиши](./06b-keybinds)
