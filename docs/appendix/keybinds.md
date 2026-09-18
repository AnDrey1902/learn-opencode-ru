---
title: Шпаргалка горячих клавиш
description: Полный справочник всех горячих клавиш OpenCode
---

# Шпаргалка горячих клавиш

> Распечатайте страницу и повесьте у монитора — за три дня войдёт в мышечную память

---

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/appendix/keybinds-notes.mini.jpeg"
     alt="Шпаргалка: горячие клавиши"
     data-zoom-src="/images/appendix/keybinds-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Leader по умолчанию Ctrl+X: нажать → отпустить → второй ключ.
2. База TUI: Enter — отправить, Shift+Enter — перенос, Tab — смена агента, Escape — стоп, Ctrl+C — очистка.
3. Leader-команды: n — новая сессия, l — список, m — модели, a — агенты, t — тема, c — compact, u/r — отмена/повтор.
4. Поле ввода (Emacs-стиль): Ctrl+A — начало строки, Ctrl+E — конец, Ctrl+K — удалить до конца, Ctrl+W — удалить слово.
5. IDE: Cmd+Esc — панель, Cmd+Shift+Esc — новая сессия.
6. Свои бинды — в `opencode.json`.
7. Мнемоника: «Tab — смена агента, Ctrl+C — очистка, Leader + буква — любая функция».

</details>

---

## Клавиша Leader

OpenCode использует **клавишу Leader** против конфликтов с клавишами терминала.

Leader по умолчанию: `Ctrl+X`

Использование: нажмите `Ctrl+X`, отпустите, затем нажмите вторую клавишу.

---

## Горячие клавиши TUI

### Базовые действия

| Сочетание | Функция | Описание |
|--------|------|------|
| `Enter` | Отправить сообщение | Отправляет текущий ввод |
| `Shift+Enter` | Новая строка | Перенос строки в поле ввода |
| `Tab` | Переключить Agent | Переключение между primary agent |
| `Shift+Tab` | Обратное переключение | Обратное переключение primary agent |
| `Escape` | Прервать | Остановить текущий ответ AI |
| `Ctrl+C` | Очистить ввод | Очистить содержимое поля ввода |
| `Ctrl+D` | Выйти | Закрыть OpenCode |
| `Ctrl+P` | Список команд | Открыть палитру команд |

### Действия Leader-клавиши

| Сочетание | Функция | Описание |
|--------|------|------|
| `Leader` → `n` | Новая сессия | Как /new |
| `Leader` → `l` | Список сессий | Как /sessions |
| `Leader` → `m` | Список моделей | Как /models |
| `Leader` → `a` | Список Agent | Выбрать Agent |
| `Leader` → `t` | Список тем | Как /themes |
| `Leader` → `e` | Редактор | Открыть внешний редактор |
| `Leader` → `c` | Сжать | Сжать контекст текущей сессии |
| `Leader` → `u` | Отменить | Отменить прошлую правку |
| `Leader` → `r` | Повторить | Повторить отменённую правку |
| `Leader` → `x` | Экспорт | Экспортировать текущую сессию |
| `Leader` → `s` | Статус | Открыть вид статуса |
| `Leader` → `b` | Боковая панель | Переключить показ боковой панели |
| `Leader` → `g` | Таймлайн | Таймлайн сессии |
| `Leader` → `y` | Копировать | Копировать сообщение |
| `Leader` → `h` | Скрыть детали | Переключить показ деталей |
| `Leader` → `q` | Выйти | Закрыть OpenCode |
| `Ctrl+B` | Фоновая работа | Увести синхронно работающего под-агента в фон |

### Просмотр Diff

Введите `/diff` или откройте просмотр diff из палитры команд; привязка `diff_open` по умолчанию не задана, но настраивается. Просмотр включён по умолчанию: дерево файлов, навигация по файлам и ханкам, одиночные и полные patch, единый и разделённый виды, а также рабочая область и последние правки AI; когда текущая ветка не дефолтная — сравнение с главной веткой.

| Сочетание | Функция |
|--------|------|
| `Esc` / `q` | Закрыть и вернуться на прошлый экран |
| `Tab` | Переключить фокус дерева файлов и зоны patch |
| `]` / `[` | Следующий или прошлый hunk |
| `n` / `p` | Следующий или прошлый файл |
| `b` | Показать или скрыть дерево файлов |
| `s` | Переключить одиночный или полный patch |
| `d` | Переключить источник diff |
| `v` | Переключить разделённый или единый вид |
| `m` | Отметить файл просмотренным или снять метку |
| `?` | Показать полную помощь |

### Навигация сессий

| Сочетание | Функция | Описание |
|--------|------|------|
| `→` | Дочерняя сессия | Переключиться на сессию под-агента |
| `←` | Обратная дочерняя сессия | Обратное переключение дочерних сессий |
| `↑` | Родительская сессия | Вернуться к родительской сессии |

### Прокрутка сообщений

| Сочетание | Функция |
|--------|------|
| `Page Up` | Страница вверх |
| `Page Down` | Страница вниз |
| `Ctrl+Alt+U` | Полстраницы вверх |
| `Ctrl+Alt+D` | Полстраницы вниз |
| `Ctrl+G` / `Home` | К самому верху |
| `Ctrl+Alt+G` / `End` | К самому низу |

### Действия поля ввода

| Сочетание | Функция |
|--------|------|
| `Ctrl+A` | Курсор в начало строки |
| `Ctrl+E` | Курсор в конец строки |
| `Ctrl+B` | Курсор на символ назад |
| `Ctrl+F` | Курсор на символ вперёд |
| `Alt+B` | Курсор на слово назад |
| `Alt+F` | Курсор на слово вперёд |
| `Ctrl+K` | Удалить до конца строки |
| `Ctrl+U` | Удалить до начала строки |
| `Ctrl+W` | Удалить прошлое слово |
| `Alt+D` | Удалить следующее слово |
| `Ctrl+D` | Удалить текущий символ |
| `↑` / `↓` | Листать историю ввода |

### Переключение моделей

| Сочетание | Функция |
|--------|------|
| `F2` | Переключить недавние модели |
| `Shift+F2` | Обратное переключение |
| `Ctrl+T` | Переключить вариант модели |

### Подтверждение прав

| Сочетание | Функция |
|--------|------|
| `y` | Разрешить |
| `n` | Отклонить |
| `a` | Разрешать всегда (в этой сессии) |

---

## Горячие клавиши расширений IDE

<AdInArticle />

### VS Code / Cursor

| Сочетание (macOS) | Сочетание (Win/Linux) | Функция |
|----------------|---------------------|------|
| `Cmd+Esc` | `Ctrl+Esc` | Открыть панель OpenCode |
| `Cmd+Shift+Esc` | `Ctrl+Shift+Esc` | Новая сессия |
| `Cmd+Option+K` | `Alt+Ctrl+K` | Вставить ссылку на файл |

---

## Горячие клавиши ввода Desktop

Поле ввода десктопного приложения OpenCode поддерживает клавиши в стиле Readline и Emacs, они встроены и через `opencode.json` не настраиваются:

| Сочетание | Функция |
|--------|------|
| `Ctrl+A` | В начало текущей строки |
| `Ctrl+E` | В конец текущей строки |
| `Ctrl+B` | Курсор на символ назад |
| `Ctrl+F` | Курсор на символ вперёд |
| `Alt+B` | Курсор на слово назад |
| `Alt+F` | Курсор на слово вперёд |
| `Ctrl+D` | Удалить символ под курсором |
| `Ctrl+K` | Удалить до конца строки |
| `Ctrl+U` | Удалить до начала строки |
| `Ctrl+W` | Удалить прошлое слово |
| `Alt+D` | Удалить следующее слово |

---

## Свои горячие клавиши

Плоское отображение `keybinds` настраивается в отдельном `tui.json` или `tui.jsonc`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n",
    "session_list": "<leader>l",
    "model_list": "<leader>m"
  }
}
```

### Отключение горячих клавиш

Значения `"none"` или `false` отключают:

```json
{
  "keybinds": {
    "session_compact": false
  }
}
```

### Привязка нескольких кнопок

Несколько кнопок через запятую:

```json
{
  "keybinds": {
    "app_exit": "ctrl+c,ctrl+d,<leader>q"
  }
}
```

---

### Места конфигурации и миграция

Порядок загрузки: глобальный каталог конфигурации, `OPENCODE_TUI_CONFIG`, обычные проектные `tui.json` / `tui.jsonc`, встречные `.opencode`, `OPENCODE_CONFIG_DIR` — позже загруженное приоритетнее. Обычные проектные файлы применяются от корневой стороны к текущему каталогу, чем ближе к текущему — тем приоритетнее; несколько каталогов `.opencode` сливаются от текущей стороны к корневой, при конфликтах побеждает более корневой, загруженный позже. `OPENCODE_CONFIG_DIR` грузится последним.

При обновлении старт TUI проверяет старые главные конфиги в глобальном, встречных проектных, каталоге конфигурации и указанном `OPENCODE_CONFIG` и переносит оттуда поля `theme`, `keybinds` и `tui` в `tui.json` того же каталога. Существующий целевой `tui.json` пропускается; одинокий `tui.jsonc` миграции не мешает. После успешной записи и создания (или переиспользования) бэкапа `.tui-migration.bak` старые поля удаляются из исходной конфигурации. Главная конфигурация эти поля больше не читает.

### Вид курсора

`cursor` — рядом с `keybinds`; `style` поддерживает `block`, `underline`, `line`, `default`, `blinking` управляет миганием. `default` сохраняет настройки терминала и игнорирует `blinking`.

## Частые настраиваемые привязки

> Источник: [v1.18.22 `keybind.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L45-L75)
>
> Новое: [фоновые сессии](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L86-L98),[Skill](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L153-L159),[cursor](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L33-L40)

### Базовые привязки

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `leader` | `ctrl+x` | Клавиша Leader |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | Выход |
| `diff_open` | `none` | Открыть просмотр diff |

### Управление сессиями

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `session_new` | `<leader>n` | Новая сессия |
| `session_list` | `<leader>l` | Список сессий |
| `session_export` | `<leader>x` | Экспорт сессии |
| `session_interrupt` | `escape` | Прервать ответ |
| `session_background` | `ctrl+b` | Увести синхронного под-агента в фон |
| `session_compact` | `<leader>c` | Сжать контекст |
| `session_timeline` | `<leader>g` | Таймлайн |
| `session_child_cycle` | `right` | Переключить дочернюю сессию |
| `session_child_cycle_reverse` | `left` | Обратное переключение дочерних сессий |
| `session_parent` | `up` | Вернуться к родительской сессии |
| `session_fork` | `none` | Форкнуть сессию |
| `session_rename` | `ctrl+r` | Переименовать сессию |
| `session_delete` | `ctrl+d` | Удалить сессию |
| `session_share` | `none` | Поделиться сессией |
| `session_unshare` | `none` | Отменить шаринг |

### Модели и Agent

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `model_list` | `<leader>m` | Список моделей |
| `model_cycle_recent` | `f2` | Переключить недавние модели |
| `model_cycle_recent_reverse` | `shift+f2` | Обратное переключение недавних моделей |
| `model_cycle_favorite` | `none` | Переключить избранные модели |
| `model_cycle_favorite_reverse` | `none` | Обратное переключение избранного |
| `variant_cycle` | `ctrl+t` | Переключить вариант модели |
| `agent_list` | `<leader>a` | Список Agent |
| `agent_cycle` | `tab` | Переключить Agent |
| `agent_cycle_reverse` | `shift+tab` | Обратное переключение Agent |
| `prompt_skills` | `none` | Открыть выбор Skill |

### Просмотр Diff

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `diff_close` | `escape,q` | Закрыть просмотр |
| `diff_toggle` | `enter,space` | Развернуть или выбрать пункт |
| `diff_expand` / `diff_collapse` | `right` / `left` | Развернуть или свернуть пункт |
| `diff_expand_all` | `E` | Развернуть все каталоги |
| `diff_switch_focus` | `tab` | Переключить фокус |
| `diff_next_hunk` / `diff_previous_hunk` | `]` / `[` | Следующий или прошлый hunk |
| `diff_next_file` / `diff_previous_file` | `n` / `p` | Следующий или прошлый файл |
| `diff_toggle_file_tree` | `b` | Переключить дерево файлов |
| `diff_single_patch` | `s` | Переключить одиночный или полный patch |
| `diff_switch_source` | `d` | Переключить источник |
| `diff_toggle_view` | `v` | Переключить разделённый или единый вид |
| `diff_help` | `?` | Показать помощь |

### Управление интерфейсом

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `theme_list` | `<leader>t` | Список тем |
| `editor_open` | `<leader>e` | Открыть редактор |
| `sidebar_toggle` | `<leader>b` | Переключить боковую панель |
| `scrollbar_toggle` | `none` | Переключить полосу прокрутки |
| `status_view` | `<leader>s` | Вид статуса |
| `tool_details` | `none` | Детали инструментов |
| `command_list` | `ctrl+p` | Палитра команд |
| `tips_toggle` | `<leader>h` | Переключить показ подсказок |

### Действия с сообщениями

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `messages_undo` | `<leader>u` | Отменить |
| `messages_redo` | `<leader>r` | Повторить |
| `messages_copy` | `<leader>y` | Копировать |
| `messages_toggle_conceal` | `<leader>h` | Переключить скрытие деталей |
| `messages_next` | `none` | Следующее сообщение |
| `messages_previous` | `none` | Прошлое сообщение |
| `messages_last_user` | `none` | Перейти к последнему сообщению пользователя |
| `messages_page_up` | `pageup,ctrl+alt+b` | Страница вверх |
| `messages_page_down` | `pagedown,ctrl+alt+f` | Страница вниз |
| `messages_half_page_up` | `ctrl+alt+u` | Полстраницы вверх |
| `messages_half_page_down` | `ctrl+alt+d` | Полстраницы вниз |
| `messages_first` | `ctrl+g,home` | К самому верху |
| `messages_last` | `ctrl+alt+g,end` | К самому низу |

### Действия поля ввода

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `input_submit` | `return` | Отправить |
| `input_newline` | `shift+return,ctrl+return,alt+return,ctrl+j` | Новая строка |
| `input_clear` | `ctrl+c` | Очистить ввод |
| `input_paste` | `ctrl+v` | Вставить |
| `input_move_left` | `left,ctrl+b` | Курсор влево |
| `input_move_right` | `right,ctrl+f` | Курсор вправо |
| `input_move_up` | `up` | Курсор вверх |
| `input_move_down` | `down` | Курсор вниз |
| `input_select_left` | `shift+left` | Выделить влево |
| `input_select_right` | `shift+right` | Выделить вправо |
| `input_select_up` | `shift+up` | Выделить вверх |
| `input_select_down` | `shift+down` | Выделить вниз |
| `input_line_home` | `ctrl+a` | В начало строки |
| `input_line_end` | `ctrl+e` | В конец строки |
| `input_select_line_home` | `ctrl+shift+a` | Выделить до начала строки |
| `input_select_line_end` | `ctrl+shift+e` | Выделить до конца строки |
| `input_visual_line_home` | `alt+a` | Видимое начало строки |
| `input_visual_line_end` | `alt+e` | Видимый конец строки |
| `input_select_visual_line_home` | `alt+shift+a` | Выделить до видимого начала строки |
| `input_select_visual_line_end` | `alt+shift+e` | Выделить до видимого конца строки |
| `input_buffer_home` | `home` | В начало буфера |
| `input_buffer_end` | `end` | В конец буфера |
| `input_select_buffer_home` | `shift+home` | Выделить до начала буфера |
| `input_select_buffer_end` | `shift+end` | Выделить до конца буфера |
| `input_delete_line` | `ctrl+shift+d` | Удалить строку |
| `input_delete_to_line_end` | `ctrl+k` | Удалить до конца строки |
| `input_delete_to_line_start` | `ctrl+u` | Удалить до начала строки |
| `input_backspace` | `backspace,shift+backspace` | Стереть назад |
| `input_delete` | `ctrl+d,delete,shift+delete` | Удалить |
| `input_undo` | `ctrl+-,super+z` | Отменить ввод |
| `input_redo` | `ctrl+.,super+shift+z` | Повторить ввод |
| `input_word_forward` | `alt+f,alt+right,ctrl+right` | Следующее слово |
| `input_word_backward` | `alt+b,alt+left,ctrl+left` | Прошлое слово |
| `input_select_word_forward` | `alt+shift+f,alt+shift+right` | Выделить следующее слово |
| `input_select_word_backward` | `alt+shift+b,alt+shift+left` | Выделить прошлое слово |
| `input_delete_word_forward` | `alt+d,alt+delete,ctrl+delete` | Удалить следующее слово |
| `input_delete_word_backward` | `ctrl+w,ctrl+backspace,alt+backspace` | Удалить прошлое слово |

### История и терминал

| Имя клавиши | По умолчанию | Описание |
|------|--------|------|
| `history_previous` | `up` | Прошлая запись истории |
| `history_next` | `down` | Следующая запись истории |
| `terminal_suspend` | `ctrl+z` | Приостановить терминал |
| `terminal_title_toggle` | `none` | Переключить заголовок терминала |

---

## Настройка Shift+Enter

Отдельные терминалы по умолчанию не отправляют `Shift+Enter`.

### Настройка Windows Terminal

Отредактируйте `settings.json`:

```json
{
  "actions": [
    {
      "command": {
        "action": "sendInput",
        "input": "\u001b[13;2u"
      },
      "id": "User.sendInput.ShiftEnterCustom"
    }
  ],
  "keybindings": [
    {
      "keys": "shift+enter",
      "id": "User.sendInput.ShiftEnterCustom"
    }
  ]
}
```

---

## Запоминалка горячих клавиш

```
Tab переключает Agent, Ctrl+C чистит
Leader плюс буква — функции на выбор
n — новый, l — список, m — модели
u — отмена, r — повтор, не горюй
Стрелки влево-вправо — по дочерним сессиям гуляй
```

---

## Связанные материалы

- [Загрузка конфига TUI v1.18.22](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui.ts#L171-L209) — места конфигурации и приоритеты
- [Миграция конфига TUI v1.18.22](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui-migrate.ts#L24-L67) — автомиграция и условия пропуска
- [Просмотр diff v1.18.22](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/feature-plugins/system/diff-viewer.tsx#L563-L704) — текущие навигация, виды и источники
- [Справочник опций конфигурации](./config-ref) — полные пояснения конфигурации
- [5.6b Горячие клавиши](../5-advanced/06b-keybinds) — урок настройки горячих клавиш
- [5.6a Система тем](../5-advanced/06a-themes) — урок настройки тем
