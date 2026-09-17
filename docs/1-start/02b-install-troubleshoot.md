---
title: Не устанавливается?
subtitle: Руководство по диагностике проблем установки
course: Практический курс OpenCode на русском языке
stage: Этап 1
lesson: "1.2b"
duration: 10 минут
level: Новичок
description: "Решение распространённых проблем при установке OpenCode: command not found, сетевые тайм-ауты, нехватка прав, настройка PATH и другие."
tags:
  - Установка
  - Диагностика
  - Устранение неполадок
prerequisite:
  - 1.2 Установка
---

# Не устанавливается?

> Возникли проблемы при установке? Здесь приведён системный способ их диагностировать.

---

## Проблема 1: `command not found` / `opencode не является внутренней или внешней командой`

**Симптомы:**

```bash
zsh: command not found: opencode
# 或 Windows 上
'opencode' is not recognized as an internal or external command
```

**Шаги диагностики:**

### 1. Убедитесь, что терминал перезапущен

Вы действительно закрыли окно и открыли его снова? Нужно закрыть всё окно, а не создать новую вкладку.

### 2. Проверьте, куда установлен OpenCode

**macOS/Linux (установка официальным скриптом):**

```bash
ls -la ~/.opencode/bin/opencode
```

Если файл существует, установка прошла успешно — просто неправильно настроен PATH.

**Проверьте, содержит ли PATH каталог установки:**

```bash
echo $PATH | tr ':' '\n' | grep opencode
```

Если вывода нет, PATH настроен неправильно.

### 3. Добавьте каталог в PATH вручную

**macOS/Linux (zsh)：**

```bash
echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**macOS/Linux (bash)：**

```bash
echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (установка через Scoop):**

Scoop настраивает PATH автоматически; если изменения не применились, перезапустите PowerShell.

---

## Проблема 2: ошибка сети / тайм-аут скачивания

<AdInArticle />

**Симптомы:**

```
curl: (7) Failed to connect to opencode.ai port 443
# 或
Error: connect ETIMEDOUT
```

**Шаги диагностики:**

### 1. Убедитесь, что сеть работает

```bash
curl -I https://www.baidu.com
```

Если не открывается даже Baidu, проблема в сети, а не в OpenCode.

### 2. Проверьте, нужен ли прокси

В корпоративной или учебной сети может потребоваться прокси. См. [1.3 Настройка сети](./03-network).

### 3. Попробуйте другой способ установки

Официальный скрипт скачивает файлы с GitHub. Если GitHub работает нестабильно, попробуйте:

- **Установку через npm** (у npm есть китайские зеркала):
  ```bash
  npm install -g opencode-ai
  ```

- **Установку через Homebrew** (у brew есть китайские зеркала):
  ```bash
  brew install anomalyco/tap/opencode
  ```

Другие способы установки см. в разделе [1.2a Альтернативные способы установки](./02a-install-alternatives).

---

## Проблема 3: ограничение GitHub API

**Симптомы:**

```
error: rate limit exceeded
```

**Причина:**

GitHub API ограничивает частоту анонимных запросов (60 запросов в час).

**Решение:**

1. Подождать около часа и повторить попытку
2. Использовать другой способ установки (npm, Homebrew и т. д.)

---

## Проблема 4: скрипт установки сообщает об отсутствующих инструментах

**Симптомы:**

```
Error: 'tar' is required but not installed.
# 或
Error: 'unzip' is required but not installed.
```

**Решение:**

Установите недостающие инструменты:

```bash
# macOS（一般自带）
# 如果没有，安装 Xcode 命令行工具：
xcode-select --install

# Ubuntu/Debian
sudo apt install -y tar unzip

# CentOS/RHEL
sudo yum install -y tar unzip
```

---

## Проблема 5: ограничение политики выполнения Windows

**Симптомы (при установке Scoop):**

```
Running scripts is disabled on this system
```

**Решение:**

Выполните следующую команду (один раз):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Если политика компании запрещает изменять политику выполнения, используйте Chocolatey (требуются права администратора) или скачайте бинарный файл напрямую.

---

## Проблема 6: нужно найти расположение бинарного файла

```bash
# macOS/Linux
which opencode

# Windows PowerShell
Get-Command opencode | Select-Object Source
```

---

## Проблема 7: настольное приложение macOS не запускается

**Симптомы:**

При двойном щелчке по OpenCode.app ничего не происходит или появляется сообщение «Невозможно открыть, так как не удаётся проверить разработчика».

**Причины:**

Обычно это происходит в следующих случаях:
- установщик скачан из неофициального источника (например, со стороннего сайта)
- используется самостоятельно собранная версия для разработки
- из-за проблем с сетью файл скачан не полностью

Официальное настольное приложение подписано и нотариально заверено Apple, поэтому в нормальных условиях проблема не возникает. Если приложение, скачанное из официального источника, всё же блокируется, выполните:

```bash
xattr -cr /Applications/OpenCode.app
```

Затем снова откройте приложение двойным щелчком.

::: tip Подсказка
Эта команда удаляет атрибут изоляции приложения (quarantine flag), сообщая macOS, что вы доверяете приложению. Выполнить её нужно только один раз.
:::

---

## Проблема 8: нужна полная переустановка

В OpenCode есть команда удаления:

```bash
opencode uninstall
```

Она предложит выбрать, что удалить (конфигурацию, данные, кэш и т. д.).

Если не запускается даже команда `opencode`, удалите файлы вручную:

**macOS/Linux (установка официальным скриптом):**

```bash
# 删除二进制
rm -rf ~/.opencode/bin

# 删除配置
rm -rf ~/.config/opencode

# 删除数据、缓存和状态
rm -rf ~/.local/share/opencode
rm -rf ~/.cache/opencode
rm -rf ~/.local/state/opencode
```

**Установка через Homebrew:**

```bash
brew uninstall opencode
```

**Установка через npm/pnpm/Yarn:**

```bash
# npm
npm uninstall -g opencode-ai

# pnpm
pnpm uninstall -g opencode-ai

# Yarn
yarn global remove opencode-ai
```

**Установка через Scoop:**

```powershell
scoop uninstall opencode
```

**Установка через Chocolatey:**

```powershell
choco uninstall opencode
```

---

## Всё ещё не получается?

1. См. [официальную документацию по устранению неполадок](https://opencode.ai/docs/troubleshooting/)
2. Поискать решение или задать вопрос в [GitHub Issues](https://github.com/anomalyco/opencode/issues)

---

## Следующий шаг

После устранения проблемы вернитесь к разделу [1.2 Установка](./02-install) и проверьте успешность установки.

::: tip Всё ещё не получается?
[Присоединяйтесь к сообществу](/community), чтобы общаться с более чем 2000 пользователями и получать ответы в реальном времени.
:::
