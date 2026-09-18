---
title: 5.6b Горячие клавиши
subtitle: Мышечная память эффективных действий
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.6b"
duration: 10 минут
practice: 15 минут
level: Продвинутый
description: Настройте 60+ горячих клавиш под себя для удобной работы и роста эффективности.
tags:
  - Горячие клавиши
  - Эффективность
  - TUI
prerequisite:
  - 5.1 Всё о конфигурации
---

# 5.6b Горячие клавиши

> 60+ горячих клавиш полностью настраиваются — работа как удобно.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/06b-keybinds-notes.mini.jpeg" alt="Шпаргалка урока: горячие клавиши" data-zoom-src="/images/5-advanced/06b-keybinds-notes.jpeg" />

---

## Что вы сможете после урока

- Владеть механизмом Leader-клавиши
- Настраивать любые горячие клавиши
- Отключать ненужные клавиши
- Решать конфликты клавиш терминала

---

## Клавиша Leader

OpenCode использует **клавишу Leader**, чтобы не конфликтовать с клавишами терминала.

Leader по умолчанию: <kbd>Ctrl</kbd>+<kbd>X</kbd>

**Как пользоваться**: нажмите Leader, отпустите, затем нажмите вторую клавишу.

```
Ctrl+X → n    # Новая сессия
Ctrl+X → l    # Список сессий
Ctrl+X → m    # Список моделей
```

---

## Настройка клавиш

Клавиши TUI задаются плоским отображением `keybinds` в отдельном `tui.json` или `tui.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    // Смена Leader-клавиши
    "leader": "ctrl+x",

    // Свои клавиши
    "session_new": "<leader>n",
    "model_list": "<leader>m",

    // Несколько кнопок на одну функцию (через запятую)
    "app_exit": "ctrl+c,ctrl+d,<leader>q",

    // Отключение клавиши
    "session_compact": false
  }
}
```

Обычные места конфигурации ниже, позже загруженное перекрывает ранее загруженное:

1. `tui.json` / `tui.jsonc` в глобальном каталоге конфигурации
2. Пользовательский файл, на который указывает `OPENCODE_TUI_CONFIG`
3. Обнаруженные от текущего открытого каталога к корню файловой системы `tui.json` / `tui.jsonc`, применяемые от корневой стороны к текущему каталогу
4. Встречные `.opencode/tui.json` / `.opencode/tui.jsonc`
5. TUI-конфигурация из `OPENCODE_CONFIG_DIR`

Обычные файлы проекта применяются от корневой стороны к текущему каталогу, чем ближе к текущему — тем приоритетнее; несколько каталогов `.opencode` сливаются от текущей стороны к корневой, при конфликте побеждает позже загруженный (более корневой). `OPENCODE_CONFIG_DIR` грузится последним.

При обновлении со старой версии старт TUI проверяет старые главные конфиги в глобальном, встречных проектных, каталоге конфигурации и указанном `OPENCODE_CONFIG` и переносит оттуда поля `theme`, `keybinds` и старый `tui` в `tui.json` того же каталога. Существующий целевой `tui.json` пропускает каталог; одинокий `tui.jsonc` миграции не мешает. После успешной записи нового файла и создания (или переиспользования) бэкапа `.tui-migration.bak` старые поля удаляются из исходного конфига. Главный конфиг эти TUI-поля больше не читает.

### Отключение клавиш

Значения `"none"` и `false` оба отключают:

```jsonc
{
  "keybinds": {
    "session_compact": "none",
    "sidebar_toggle": false
  }
}
```

### Несколько привязок

Несколько кнопок через запятую:

```jsonc
{
  "keybinds": {
    "input_newline": "shift+return,ctrl+return,alt+return,ctrl+j"
  }
}
```

---

## Частые настраиваемые клавиши

### Управление приложением

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `leader` | `ctrl+x` | Клавиша Leader |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | Выход из приложения |
| `diff_open` | `none` | Открыть diff viewer (по умолчанию через `/diff` или палитру команд) |
| `terminal_suspend` | `ctrl+z` | Приостановить терминал |
| `terminal_title_toggle` | `none` | Переключить заголовок терминала |

### Управление интерфейсом

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `editor_open` | `<leader>e` | Открыть внешний редактор |
| `theme_list` | `<leader>t` | Список тем |
| `sidebar_toggle` | `<leader>b` | Переключить боковую панель |
| `scrollbar_toggle` | `none` | Переключить полосу прокрутки |
| `status_view` | `<leader>s` | Вид статуса |
| `tool_details` | `none` | Переключить детали инструментов |
| `tips_toggle` | `<leader>h` | Переключить подсказки главной |

### Управление сессиями

<AdInArticle />

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `session_new` | `<leader>n` | Новая сессия |
| `session_list` | `<leader>l` | Список сессий |
| `session_export` | `<leader>x` | Экспорт сессии |
| `session_timeline` | `<leader>g` | Таймлайн сессии |
| `session_interrupt` | `escape` | Прервать ответ |
| `session_background` | `ctrl+b` | Увести синхронно работающего под-агента в фон |
| `session_compact` | `<leader>c` | Сжать контекст |
| `session_fork` | `none` | Форкнуть от сообщения |
| `session_rename` | `ctrl+r` | Переименовать сессию |
| `session_share` | `none` | Поделиться сессией |
| `session_unshare` | `none` | Отменить шаринг |

### Навигация сессий

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `session_child_cycle` | `right` | Переключить дочернюю сессию |
| `session_child_cycle_reverse` | `left` | Обратное переключение дочерних сессий |
| `session_parent` | `up` | Вернуться к родительской сессии |

### Действия с сообщениями

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `messages_copy` | `<leader>y` | Копировать сообщение |
| `messages_undo` | `<leader>u` | Отменить сообщение |
| `messages_redo` | `<leader>r` | Повторить сообщение |
| `messages_toggle_conceal` | `<leader>h` | Переключить сворачивание блоков кода |

Здесь `messages_undo` / `messages_redo` — отмена и повтор уровня сессии: отмена откатывает к выбранному сообщению вместе со связанными файловыми патчами после него; повтор восстанавливает отменённое состояние. При `"snapshot": false` в главном `opencode.json` / `opencode.jsonc` сообщения всё равно откатываются, но правки файлов не отменяются и не восстанавливаются. Они отличаются от `input_undo` / `input_redo` поля ввода.

### Diff viewer

Diff viewer включён по умолчанию, вход — через `/diff`, палитру команд или свою клавишу `diff_open`. В нём дерево файлов, переключение между изменениями рабочей области и последним кругом правок AI; когда текущая ветка не дефолтная — ещё и сравнение с главной веткой. Поддерживаются навигация по файлам и ханкам, одиночные patch на файл, единый и разделённый виды, метки просмотренности.

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `diff_close` | `escape,q` | Закрыть и вернуться на прошлый экран |
| `diff_toggle` | `enter,space` | Развернуть каталог или выбрать файл |
| `diff_expand` / `diff_collapse` | `right` / `left` | Развернуть или свернуть пункт дерева файлов |
| `diff_expand_all` | `E` | Развернуть все каталоги |
| `diff_switch_focus` | `tab` | Переключение между деревом файлов и зоной patch |
| `diff_next_hunk` / `diff_previous_hunk` | `]` / `[` | К следующему или прошлому ханку |
| `diff_next_file` / `diff_previous_file` | `n` / `p` | К следующему или прошлому файлу |
| `diff_toggle_file_tree` | `b` | Показать или скрыть дерево файлов |
| `diff_single_patch` | `s` | Переключение одиночного и полного patch |
| `diff_switch_source` | `d` | Переключить источник diff |
| `diff_toggle_view` | `v` | Переключить разделённый или единый вид |
| `diff_help` | `?` | Показать полную помощь по клавишам diff |

Клавиша `m` — встроенная в diff viewer «метка просмотренности», не пункт настройки `keybinds`.

### Прокрутка сообщений

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `messages_page_up` | `pageup,ctrl+alt+b` | Страница вверх |
| `messages_page_down` | `pagedown,ctrl+alt+f` | Страница вниз |
| `messages_half_page_up` | `ctrl+alt+u` | Полстраницы вверх |
| `messages_half_page_down` | `ctrl+alt+d` | Полстраницы вниз |
| `messages_first` | `ctrl+g,home` | К первому сообщению |
| `messages_last` | `ctrl+alt+g,end` | К последнему сообщению |
| `messages_next` | `none` | Следующее сообщение |
| `messages_previous` | `none` | Прошлое сообщение |
| `messages_last_user` | `none` | Последнее сообщение пользователя |

### Модели и Agent

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `model_list` | `<leader>m` | Список моделей |
| `model_cycle_recent` | `f2` | Переключить недавние модели |
| `model_cycle_recent_reverse` | `shift+f2` | Обратное переключение |
| `model_cycle_favorite` | `none` | Переключить избранные модели |
| `model_cycle_favorite_reverse` | `none` | Обратное переключение избранного |
| `variant_cycle` | `ctrl+t` | Переключить вариант модели |
| `agent_list` | `<leader>a` | Список Agent |
| `agent_cycle` | `tab` | Переключить Agent |
| `agent_cycle_reverse` | `shift+tab` | Обратное переключение Agent |
| `command_list` | `ctrl+p` | Палитра команд |
| `prompt_skills` | `none` | Открыть выбор Skill |

### Основы поля ввода

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `input_submit` | `return` | Отправить сообщение |
| `input_newline` | `shift+return,ctrl+return,alt+return,ctrl+j` | Новая строка |
| `input_clear` | `ctrl+c` | Очистить ввод |
| `input_paste` | `ctrl+v` | Вставить |
| `input_undo` | `ctrl+-,super+z` | Отменить ввод |
| `input_redo` | `ctrl+.,super+shift+z` | Повторить ввод |

### Движение курсора в поле ввода

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `input_move_left` | `left,ctrl+b` | На символ влево |
| `input_move_right` | `right,ctrl+f` | На символ вправо |
| `input_move_up` | `up` | На строку вверх |
| `input_move_down` | `down` | На строку вниз |
| `input_word_forward` | `alt+f,alt+right,ctrl+right` | На слово вперёд |
| `input_word_backward` | `alt+b,alt+left,ctrl+left` | На слово назад |
| `input_line_home` | `ctrl+a` | В начало строки |
| `input_line_end` | `ctrl+e` | В конец строки |
| `input_visual_line_home` | `alt+a` | В начало видимой строки |
| `input_visual_line_end` | `alt+e` | В конец видимой строки |
| `input_buffer_home` | `home` | В начало буфера |
| `input_buffer_end` | `end` | В конец буфера |

### Вид курсора

Вид курсора — не привязка клавиш, настраивается рядом с `keybinds`:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "cursor": {
    "style": "line",
    "blinking": true
  }
}
```

`style` бывает `block`, `underline`, `line` или `default`; `default` сохраняет настройки терминала, тогда `blinking` не действует.

### Выделение в поле ввода

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `input_select_left` | `shift+left` | Выделить влево |
| `input_select_right` | `shift+right` | Выделить вправо |
| `input_select_up` | `shift+up` | Выделить вверх |
| `input_select_down` | `shift+down` | Выделить вниз |
| `input_select_word_forward` | `alt+shift+f,alt+shift+right` | Выделить следующее слово |
| `input_select_word_backward` | `alt+shift+b,alt+shift+left` | Выделить прошлое слово |
| `input_select_line_home` | `ctrl+shift+a` | Выделить до начала строки |
| `input_select_line_end` | `ctrl+shift+e` | Выделить до конца строки |
| `input_select_visual_line_home` | `alt+shift+a` | Выделить до начала видимой строки |
| `input_select_visual_line_end` | `alt+shift+e` | Выделить до конца видимой строки |
| `input_select_buffer_home` | `shift+home` | Выделить до начала |
| `input_select_buffer_end` | `shift+end` | Выделить до конца |

### Удаление в поле ввода

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `input_backspace` | `backspace,shift+backspace` | Стереть назад |
| `input_delete` | `ctrl+d,delete,shift+delete` | Удалить символ |
| `input_delete_line` | `ctrl+shift+d` | Удалить целую строку |
| `input_delete_to_line_end` | `ctrl+k` | Удалить до конца строки |
| `input_delete_to_line_start` | `ctrl+u` | Удалить до начала строки |
| `input_delete_word_forward` | `alt+d,alt+delete,ctrl+delete` | Удалить следующее слово |
| `input_delete_word_backward` | `ctrl+w,ctrl+backspace,alt+backspace` | Удалить прошлое слово |

### История

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `history_previous` | `up` | Прошлая запись истории |
| `history_next` | `down` | Следующая запись истории |

---

## Горячие клавиши десктопной версии

Поле ввода десктопной версии OpenCode поддерживает клавиши в стиле Readline и Emacs (встроенные, через конфиг не меняются):

| Сочетание | Функция |
|--------|------|
| `Ctrl+A` | В начало строки |
| `Ctrl+E` | В конец строки |
| `Ctrl+B` | На символ назад |
| `Ctrl+F` | На символ вперёд |
| `Alt+B` | На слово назад |
| `Alt+F` | На слово вперёд |
| `Ctrl+D` | Удалить текущий символ |
| `Ctrl+K` | Удалить до конца строки |
| `Ctrl+U` | Удалить до начала строки |
| `Ctrl+W` | Удалить прошлое слово |
| `Alt+D` | Удалить следующее слово |
| `Ctrl+T` | Поменять символы местами |
| `Ctrl+G` | Закрыть попап и прервать ответ |

---

## Совместимость терминалов

### Проблема Shift+Enter

Отдельные терминалы по умолчанию не отправляют модификатор `Shift+Enter`.

**Симптом**: `Shift+Enter` не переносит строку, а отправляет сообщение.

### Настройка Windows Terminal

Отредактируйте `settings.json` (путь: `%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json`):

В массив `actions` добавьте:

```json
{
  "command": {
    "action": "sendInput",
    "input": "\u001b[13;2u"
  },
  "id": "User.sendInput.ShiftEnterCustom"
}
```

В массив `keybindings` добавьте:

```json
{
  "keys": "shift+enter",
  "id": "User.sendInput.ShiftEnterCustom"
}
```

Сохраните и перезапустите Windows Terminal.

### Другие терминалы

- **iTerm2**: поддерживается по умолчанию, настраивать не нужно
- **Alacritty**: поддерживается по умолчанию
- **Kitty**: поддерживается по умолчанию
- **GNOME Terminal**: возможно, нужно обновиться до новой версии

---

## Частые сценарии настройки

### Стиль Vim

```jsonc
{
  "keybinds": {
    "leader": "space",
    "messages_page_up": "ctrl+u",
    "messages_page_down": "ctrl+d",
    "messages_first": "gg",
    "messages_last": "G"
  }
}
```

### Минималистичный режим

Отключите неиспользуемые клавиши:

```jsonc
{
  "keybinds": {
    "sidebar_toggle": "none",
    "scrollbar_toggle": "none",
    "session_fork": "none",
    "session_share": "none",
    "session_unshare": "none",
    "tips_toggle": "none"
  }
}
```

### Одноручное управление

Соберите частые действия под левую руку:

```jsonc
{
  "keybinds": {
    "session_new": "ctrl+n",
    "session_list": "ctrl+l",
    "model_list": "ctrl+m",
    "agent_cycle": "ctrl+tab"
  }
}
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Клавиши не работают | Клавишу перехватывает терминал | Проверьте настройки терминала или смените клавишу |
| Shift+Enter не переносит | Терминал не отправляет модификатор | Настройте терминал (см. выше) |
| Настроили, но не реагирует | Использовали `keybind` (в единственном числе) | Нужно `keybinds` (во множественном) |
| Отключение через `null` не работает | Ошибка синтаксиса | Используйте `"none"` или `false` |
| Конфликт Leader-клавиши | Конфликт с другой программой | Смените Leader, например `ctrl+space` |
| Ctrl+C не чистит ввод | Перехватывает SIGINT терминала | Используйте другую клавишу или примите поведение по умолчанию |

---

## Запоминалка клавиш

```
Tab переключает Agent, Ctrl+C чистит
Leader плюс буква — функции на выбор
n — новый, l — список, m — модели
u — отмена, r — повтор, не горюй
Стрелки влево-вправо — по дочерним сессиям гуляй
```

---

## Итоги урока

Вы научились:

1. Механизму Leader-клавиши против конфликтов
2. Своим клавишам в `keybinds`
3. Отключению ненужных клавиш через `"none"` или `false`
4. Привязке нескольких кнопок через запятую
5. Решению проблемы совместимости Shift+Enter в терминале

---

## Связанные материалы

- [Определения клавиш v1.18.22](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L28-L75) — плоские привязки, значения отключения и клавиши diff по умолчанию
- [v1.18.22 фон сессий и привязки Skill](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L86-L98) / [Skill](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L153-L159) — новые привязки и значения по умолчанию
- [v1.18.22 конфиг курсора](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L33-L40) — форма курсора и мигание
- [v1.18.22 порядок загрузки конфига TUI](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui.ts#L171-L209) — глобальный, пользовательский, проектный конфиги и `.opencode`
- [v1.18.22 миграция конфига TUI](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui-migrate.ts#L24-L67) — поведение переноса из `opencode.json` в `tui.json`
- [v1.18.22 diff viewer](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/feature-plugins/system/diff-viewer.tsx#L563-L704) — навигация, виды и смена источников
- [v1.18.22 отмена сессии](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L98) — revert и unrevert с восстановлением файловых патчей
- [v1.18.22 конфиг snapshot](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55) — границы восстановления файлов при `snapshot:false`
- [Шпаргалка/Таблица клавиш](../appendix/keybinds) — печатная шпаргалка
- [5.6a Система тем](./06a-themes) — настройка внешнего вида
- [5.1 Всё о конфигурации](./01a-config-basics) — полные пояснения конфигурации
