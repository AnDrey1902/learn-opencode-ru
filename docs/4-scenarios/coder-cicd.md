---
title: B4 CI/CD-интеграция
subtitle: OpenCode в конвейере
course: Практический курс OpenCode на русском языке
stage: Этап 4
lesson: "B4"
duration: 20 минут
practice: 25 минут
level: Продвинутый
description: "Подключите OpenCode к репозиторию через GitHub Agent: вызывайте его из комментариев к Issue и PR командами /oc или /opencode — задачи автоматически выполняются на GitHub Actions runner."
tags:
  - CI/CD
  - GitHub Actions
  - Автоматизация
prerequisite:
  - B1 Повседневная разработка
---

# B4 CI/CD-интеграция

> 💡 **Коротко**: подключите OpenCode к репозиторию через GitHub Agent и вызывайте его из комментариев командами `/oc` или `/opencode`.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/4-scenarios/coder-cicd-notes.mini.jpeg"
     alt="Шпаргалка урока: B4 CI/CD-интеграция"
     data-zoom-src="/images/4-scenarios/coder-cicd-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. Идея: GitHub-агент вместо ручного кода; триггер через `/oc` или `/opencode` в комментариях; API-ключи через GitHub Secrets.
2. Установка одной командой: `opencode github install` → установка App, генерация `.github/workflows/opencode.yml`, подсказка по Secrets.
3. Коммит и пуш workflow: `git add .github/workflows/opencode.yml && commit && push`.
4. Триггеры из Issue/PR: `/oc summarize`, `/opencode review`, `/oc test`.
5. Secrets: Settings → Secrets → Actions; ключ `OPENCODE_API_KEY`.
6. Ловушки: не сработало — нужен `/oc` или `/opencode`; нет API Key — проверить Secrets; слишком широкие права — настроить по документации.

</details>

---

## Что вы сможете после урока

- Установить GitHub Agent в один шаг (workflow сгенерируется сам)
- Вызывать автоматическое выполнение задач OpenCode из комментариев к Issue/PR
- Хранить API-ключи в GitHub Secrets (без хардкода)

---

## Основная идея (лучшая практика)
<AdInArticle />

- **Используйте GitHub Agent**: не пишите вручную клей между «установить CLI + запустить скрипт + ответить комментарием» в workflow.
- **Единый способ вызова**: пишите `/oc` или `/opencode` в комментарии — выполнение берёт на себя Actions runner.

Официальная документация: https://opencode.ai/docs/github

---

## Повторите за мной

### Шаг 1: запустите мастер установки

В корне вашего GitHub-репозитория выполните:

```bash
opencode github install
```

Мастер установки проведёт вас через шаги: установка GitHub App, генерация workflow-файла, подскажет, какие secrets настроить.

### Шаг 2: закоммитьте и запушьте workflow

Закоммитьте и запушьте сгенерированный workflow-файл в репозиторий (обычно `.github/workflows/opencode.yml`).

### Шаг 3: вызывайте через комментарий

Напишите комментарий к Issue или PR (пример):

```text
/oc summarize
```

Или:

```text
/opencode summarize
```

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| Написали комментарий, но ничего не запустилось | Не использовали `/oc` или `/opencode` | Добавьте триггерную фразу в комментарий (например, `/oc summarize`) |
| Action запустился, но ругается на отсутствие API-ключа | API-ключ провайдера не добавлен в GitHub Secrets | По подсказкам мастера установки добавьте ключ в Secrets репозитория или организации и повторите |
| Беспокоят слишком широкие права | Нечёткая настройка прав workflow | Сначала настройте по примеру из официальной документации, затем ужесточите под политику вашего репозитория |

---

## Куда дальше

- Официальная документация по GitHub-интеграции: https://opencode.ai/docs/github
- CLI-команда `opencode run` (скриптовая автоматизация вне GitHub): [Приложение/Справочник CLI](../appendix/cli)

---

## Анонс следующего урока

> В следующем уроке научимся создавать собственных Agent для разработки — например, Code Reviewer и Security Auditor.
