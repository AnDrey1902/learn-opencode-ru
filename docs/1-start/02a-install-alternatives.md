---
title: Альтернативные способы установки
subtitle: Другие варианты помимо официального скрипта
course: Практический курс OpenCode на русском языке
stage: Этап 1
lesson: "1.2a"
duration: 5 минут
level: Новичок
description: "Различные способы установки OpenCode: npm, Homebrew, Chocolatey, Scoop, Docker, ручное скачивание и другие."
tags:
  - Установка
  - npm
  - Homebrew
  - Docker
prerequisite:
  - 1.2 Установка
---

# Альтернативные способы установки

> Официальный скрипт `curl ... | bash` вам не подходит? Здесь есть другие варианты.

---

## Когда обращаться к этой странице

- Официальный скрипт установки завершается по тайм-ауту
- Вы привыкли к менеджеру пакетов (npm, Homebrew, Scoop и др.)
- На рабочем компьютере есть ограничения на установку
- Вы хотите попробовать Docker, не устанавливая программу в систему

---

## macOS / Linux

### Homebrew (рекомендуется)

```bash
brew install anomalyco/tap/opencode
```

::: warning Внимание
Официальная формула Homebrew — `anomalyco/tap/opencode`. Поддерживаемая сообществом команда `brew install opencode` обновляется медленнее и не рекомендуется.
:::

### npm / pnpm / bun / yarn

Требуется Node.js 18+ (рекомендуется 22+).

::: code-group

```bash [npm]
npm install -g opencode-ai
```

```bash [pnpm]
pnpm install -g opencode-ai
```

```bash [bun]
bun install -g opencode-ai
```

```bash [yarn]
yarn global add opencode-ai
```

:::

### Arch Linux

```bash
sudo pacman -S opencode    # стабильная (рекомендуется)
paru -S opencode-bin       # последняя версия AUR
```

---

## Windows
<AdInArticle />

### Chocolatey

Запустите PowerShell с правами администратора:

```powershell
choco install opencode
```

### Scoop (рекомендуется)

Рекомендуется запускать с обычными правами пользователя:

```powershell
scoop bucket add extras
scoop install extras/opencode
```

::: details Scoop не установлен?
**Выполните по очереди** следующие команды:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

```powershell
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

```powershell
scoop install git
```

Если PowerShell запущен **от имени администратора**, при установке Scoop используйте:

```powershell
iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
```
:::

### npm

Требуется Node.js 18+:

```powershell
npm install -g opencode-ai
```

### Mise

```powershell
mise use -g github:anomalyco/opencode
```

---

## Docker (для знакомства)

Не хотите устанавливать программу в систему? Попробуйте Docker:

```bash
docker run -it --rm ghcr.io/anomalyco/opencode
```

::: warning Ограничение
По умолчанию OpenCode в Docker может обращаться только к файлам внутри контейнера. Чтобы разрешить чтение и запись файлов компьютера, смонтируйте каталог:

```bash
docker run -it --rm -v $(pwd):/workspace -w /workspace ghcr.io/anomalyco/opencode
```

Для новичков этот способ не слишком удобен; сначала рекомендуется использовать однострочный скрипт или менеджер пакетов.
:::

---

## Ручное скачивание

Скачайте бинарный файл для своей платформы из [GitHub Releases](https://github.com/anomalyco/opencode/releases), распакуйте его и поместите в каталог из PATH.

---

## Дополнительные параметры скрипта установки

Официальный скрипт установки `curl -fsSL https://opencode.ai/install | bash` поддерживает следующие параметры:

```bash
# Установка указанной версии
curl -fsSL https://opencode.ai/install | bash -s -- --version 1.1.6

# Не меняем конфиг shell (не добавляем в PATH автоматически)
curl -fsSL https://opencode.ai/install | bash -s -- --no-modify-path

# Установка из локального бинаря
./install --binary /path/to/opencode
```

### Каталог установки

По умолчанию официальный скрипт устанавливает программу в `$HOME/.opencode/bin`. Чтобы выбрать другой каталог, после установки переместите бинарный файл вручную:

```bash
# После установки переносим в /usr/local/bin
sudo mv ~/.opencode/bin/opencode /usr/local/bin/opencode
```

---

## Расположение файлов

| Способ установки | Расположение бинарного файла | Расположение файла конфигурации |
|---------|-----------|-------------|
| Официальный скрипт | `~/.opencode/bin/opencode` | `~/.config/opencode/opencode.json` |
| npm/pnpm/bun/yarn | Глобальный node_modules | То же |
| Homebrew | `/opt/homebrew/bin/opencode` или `/usr/local/bin/opencode` | То же |
| Scoop | `~/scoop/apps/opencode/current/opencode.exe` | То же |
| Chocolatey | `C:\ProgramData\chocolatey\bin\opencode.exe` | То же |

---

## Как запустить программу, если её нет в PATH?

Если команда `opencode` сообщает, что файл «не найден», каталог установки отсутствует в PATH. Запустить программу можно по абсолютному пути:

### Windows

```powershell
# PowerShell (официальный скрипт)
C:\Users\<имя пользователя>\.opencode\bin\opencode.exe

# Коротко (через переменные окружения)
$env:USERPROFILE\.opencode\bin\opencode.exe

# Установка через Scoop
C:\Users\<имя пользователя>\scoop\apps\opencode\current\opencode.exe

# Установка через Chocolatey
C:\ProgramData\chocolatey\bin\opencode.exe
```

```cmd
:: CMD (официальный скрипт)
%USERPROFILE%\.opencode\bin\opencode.exe
```

### macOS / Linux

```bash
# Официальный скрипт
~/.opencode/bin/opencode

# Или подробно:
/Users/<имя пользователя>/.opencode/bin/opencode    # macOS
/home/<имя пользователя>/.opencode/bin/opencode      # Linux
```

::: tip Рекомендация
При длительном использовании добавьте каталог установки в PATH, чтобы не вводить полный путь каждый раз. См. раздел «Ручное добавление в PATH» в [1.2b Не устанавливается?](./02b-install-troubleshoot).
:::

---

## Следующий шаг

После установки вернитесь к шагу «Проверка установки» в разделе [1.2 Установка](./02-install) и убедитесь, что `opencode --version` выводит результат.

Если возникли проблемы, см. [1.2b Не устанавливается?](./02b-install-troubleshoot)
