---
title: 5.18 Форматтеры кода
subtitle: Автонастройка форматирования кода
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.18"
duration: 10 минут
level: Продвинутый
description: Настройте OpenCode на использование форматтеров Prettier, Biome, gofmt и других для автоматического форматирования кода.
tags:
  - Форматирование
  - Стиль кода
  - Prettier
prerequisite:
  - 5.1 Всё о конфигурации
---

# Форматтеры кода

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/formatters-notes.mini.jpeg"
     alt="Шпаргалка урока: 5.18 Форматтеры кода"
     data-zoom-src="/images/5-advanced/formatters-notes.jpeg" />

После записи или правки файлов OpenCode автоматически форматирует их форматтерами под каждый язык. Так созданный код следует стилю проекта.

## Встроенные форматтеры

В OpenCode встроены форматтеры популярных языков и фреймворков:

| Форматтер | Расширения | Требование |
|----------|--------|------|
| gofmt | .go | Доступна команда `gofmt` |
| mix | .ex, .exs, .eex, .heex, .leex, .neex, .sface | Доступна команда `mix` |
| prettier | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml и др. | В `package.json` есть зависимость `prettier` |
| biome | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml и др. | Существует конфиг `biome.json(c)` |
| zig | .zig, .zon | Доступна команда `zig` |
| clang-format | .c, .cpp, .h, .hpp, .ino и др. | Существует конфиг `.clang-format` |
| ktlint | .kt, .kts | Доступна команда `ktlint` |
| ruff | .py, .pyi | Доступна команда `ruff` и есть конфиг |
| rustfmt | .rs | Доступна команда `rustfmt` |
| uv | .py, .pyi | Доступна команда `uv` |
| rubocop | .rb, .rake, .gemspec, .ru | Доступна команда `rubocop` |
| standardrb | .rb, .rake, .gemspec, .ru | Доступна команда `standardrb` |
| htmlbeautifier | .erb, .html.erb | Доступна команда `htmlbeautifier` |
| air | .R | Доступна команда `air` |
| dart | .dart | Доступна команда `dart` |
| ocamlformat | .ml, .mli | Доступна команда `ocamlformat` и есть `.ocamlformat` |
| terraform | .tf, .tfvars | Доступна команда `terraform` |
| gleam | .gleam | Доступна команда `gleam` |
| nixfmt | .nix | Доступна команда `nixfmt` |
| shfmt | .sh, .bash | Доступна команда `shfmt` |
| oxfmt (экспериментальный) | .js, .jsx, .ts, .tsx | В `package.json` есть зависимость `oxfmt` и включена экспериментальная переменная окружения |

Если в `package.json` проекта есть `prettier`, OpenCode использует его автоматически.

## Как это работает
<AdInArticle />

Когда OpenCode пишет или правит файл:

1. По расширению файла проверяет все включённые форматтеры
2. Запускает подходящую команду форматирования
3. Автоматически применяет изменения форматирования

Процесс идёт в фоне — стиль кода поддерживается без ручной работы.

## Настройка

Свои форматтеры задаются разделом `formatter` в конфиге:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {}
}
```

Каждая настройка форматтера поддерживает опции:

| Свойство | Тип | Описание |
|------|------|------|
| `disabled` | boolean | `true` отключает форматтер |
| `command` | string[] | Команда форматирования |
| `environment` | object | Переменные окружения при запуске форматтера |
| `extensions` | string[] | Расширения файлов, обрабатываемые форматтером |

### Отключение форматтеров

Глобально отключить **все** форматтеры:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": false
}
```

Отключить **конкретный** форматтер:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "disabled": true
    }
  }
}
```

### Свои форматтеры

Можно переопределить встроенные или добавить новые:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-markdown-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

Плейсхолдер **`$FILE`** в команде заменяется путём форматируемого файла.

## Связанные материалы

- [LSP-серверы](19-lsp.md) — поддержка интеллекта кода
- [Справочник конфигурации](../appendix/config-ref.md) — все опции конфигурации
