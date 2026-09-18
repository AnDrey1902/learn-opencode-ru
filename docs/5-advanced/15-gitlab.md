---
title: 5.15 Интеграция GitLab
subtitle: OpenCode в GitLab CI/CD
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.15"
duration: 15 минут
practice: 20 минут
level: Продвинутый
description: Подключайтесь через конвейеры GitLab CI/CD или GitLab Duo и используйте OpenCode на GitLab Runner.
tags:
  - GitLab
  - CI/CD
  - Автоматизация
prerequisite:
  - 5.14 Интеграция GitHub
---

# Интеграция GitLab

OpenCode встраивается в процессы GitLab через конвейеры GitLab CI/CD или GitLab Duo. В обоих вариантах OpenCode работает на вашем GitLab Runner.

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/5-advanced/gitlab-notes.mini.jpeg"
     alt="Шпаргалка урока: интеграция GitLab"
     data-zoom-src="/images/5-advanced/gitlab-notes.jpeg" />

<details>
<summary>📝 Текстовая версия шпаргалки</summary>

1. GitHub против GitLab: установка (авто против ручной), триггер (`/opencode` против `@opencode`), CI-компонент (встроенный против nagyv/gitlab-opencode@2).
2. GitLab CI: авторизация как File-переменная, `include` в `.gitlab-ci.yml`.
3. GitLab Duo: glab CLI, GitLab Runner, авто-создание ветки и MR.
4. Примеры: `@opencode explain this issue`, `fix this`, `review this merge request`.
5. Ошибки: тип переменной (File, не Variable), права glab (api, read/write_repository), git push отклонён, приватные инстансы (fork компонента).

</details>

## Чем отличается от интеграции GitHub

Прежде чем настраивать, важно понять разницу интеграций GitLab и GitHub:

| Возможность | Интеграция GitHub | Интеграция GitLab |
|------|------------|-------------|
| Способ установки | Официальная команда `opencode github install` | Ручная настройка или community-компонент |
| Официальная поддержка | Официальное GitHub App от OpenCode | CI-компонент от сообщества |
| Триггерное слово | `/opencode` или `/oc` | `@opencode` (настраивается) |
| Action/компонент | `anomalyco/opencode/github@latest` | `nagyv/gitlab-opencode@2` |

::: tip Совет по выбору
Если пользуетесь и GitHub, и GitLab — интеграция GitHub более «из коробки». Интеграция GitLab требует больше ручной настройки, но гибче. Процесс настройки GitHub — в разделе [5.14 Интеграция GitHub](./14-github).
:::

---

## GitLab CI

<AdInArticle />

OpenCode работает в обычных конвейерах GitLab. Его можно встроить в конвейер как [CI-компонент](https://docs.gitlab.com/ee/ci/components/).

Здесь используется community-компонент CI/CD: [nagyv/gitlab-opencode](https://gitlab.com/nagyv/gitlab-opencode).

### Возможности

- **Кастомная конфигурация**: каждый job включает или отключает функции своим каталогом конфигурации (например, `./config/#custom-directory`)
- **Минимум настроек**: CI-компонент фоном настраивает OpenCode — вам остаётся создать конфиг и стартовый промпт
- **Гибкость**: компонент поддерживает разнообразные входные параметры поведения

### Настройка

**1. Сохраните credentials**

Храните аутентификационный JSON OpenCode как переменную окружения CI **типа File**:

- Откройте **Settings** > **CI/CD** > **Variables**
- Добавьте переменную, тип — **File**
- Обязательно включите **Masked and hidden**

Пример auth JSON (выбирайте по своему провайдеру моделей):

```jsonc
// Anthropic
{
  "anthropic": {
    "type": "api",
    "key": "sk-ant-api03-xxx..."
  }
}

// OpenAI
{
  "openai": {
    "type": "api",
    "key": "sk-xxx..."
  }
}

// Несколько провайдеров
{
  "anthropic": {
    "type": "api",
    "key": "sk-ant-api03-xxx..."
  },
  "openai": {
    "type": "api",
    "key": "sk-xxx..."
  }
}
```

**2. Настройте .gitlab-ci.yml**

Добавьте в `.gitlab-ci.yml`:

```yaml
include:
  - component: $CI_SERVER_FQDN/nagyv/gitlab-opencode/opencode@2
    inputs:
      config_dir: ${CI_PROJECT_DIR}/opencode-config
      auth_json: $OPENCODE_AUTH_JSON  # имя переменной из прошлого шага
      command: optional-custom-command
      message: "Your prompt here"
```

::: tip Версия компонента
`@2` — текущая мажорная версия. Свежие версии и полный список входных параметров — в [каталоге компонентов](https://gitlab.com/explore/catalog/nagyv/gitlab-opencode).
:::

---

## GitLab Duo

OpenCode встраивается в процессы GitLab. Упомяните `@opencode` в комментарии — OpenCode выполнит задачу в конвейере GitLab CI.

### Возможности

- **Разбор вопросов**: пусть OpenCode посмотрит Issue и объяснит
- **Исправления и реализация**: пусть OpenCode чинит Issue или реализует функцию — он создаст ветку и коммитом откроет Merge Request
- **Безопасность**: OpenCode работает на вашем GitLab Runner

### Настройка

OpenCode выполняется в конвейере GitLab CI/CD, шаги настройки:

::: tip Официальная документация
Свежие инструкции — в [официальной документации GitLab](https://docs.gitlab.com/user/duo_agent_platform/agent_assistant/).
:::

1. Настройте окружение GitLab
2. Настройте CI/CD
3. Получите API-ключ провайдера AI-моделей
4. Создайте сервисный аккаунт
5. Настройте переменные CI/CD
6. Создайте flow-файл конфигурации

### glab CLI

В flow-конфигурации используется [glab](https://gitlab.com/gitlab-org/cli) — официальный CLI-инструмент GitLab. Он умеет работать с GitLab API, включая:

- список, создание и ведение Issue
- действия с Merge Request
- просмотр статуса CI/CD

OpenCode читает данные GitLab и выполняет действия через glab.

<details>
<summary>Пример flow-конфигурации</summary>

```yaml
image: node:22-slim
commands:
  - echo "Installing opencode"
  - npm install --global opencode-ai
  - echo "Installing glab"
  - export GITLAB_TOKEN=$GITLAB_TOKEN_OPENCODE
  - apt-get update --quiet && apt-get install --yes curl wget gpg git && rm --recursive --force /var/lib/apt/lists/*
  - curl --silent --show-error --location "https://raw.githubusercontent.com/upciti/wakemeops/main/assets/install_repository" | bash
  - apt-get install --yes glab
  - echo "Configuring glab"
  - echo $GITLAB_HOST
  - echo "Creating OpenCode auth configuration"
  - mkdir --parents ~/.local/share/opencode
  - |
    cat > ~/.local/share/opencode/auth.json << EOF
    {
      "anthropic": {
        "type": "api",
        "key": "$ANTHROPIC_API_KEY"
      }
    }
    EOF
  - echo "Configuring git"
  - git config --global user.email "opencode@gitlab.com"
  - git config --global user.name "OpenCode"
  - echo "Testing glab"
  - glab issue list
  - echo "Running OpenCode"
  - |
    opencode run "
    You are an AI assistant helping with GitLab operations.

    Context: $AI_FLOW_CONTEXT
    Task: $AI_FLOW_INPUT
    Event: $AI_FLOW_EVENT

    Please execute the requested task using the available GitLab tools.
    Be thorough in your analysis and provide clear explanations.

    <important>
    Please use the glab CLI to access data from GitLab. The glab CLI has already been authenticated. You can run the corresponding commands.

    If you are asked to summarize an MR or issue or asked to provide more information then please post back a note to the MR/Issue so that the user can see it.
    You don't need to commit or push up changes, those will be done automatically based on the file changes you make.
    </important>
    "
  - git checkout --branch $CI_WORKLOAD_REF origin/$CI_WORKLOAD_REF
  - echo "Checking for git changes and pushing if any exist"
  - |
    if ! git diff --quiet || ! git diff --cached --quiet || [ --not --zero "$(git ls-files --others --exclude-standard)" ]; then
      echo "Git changes detected, adding and pushing..."
      git add .
      if git diff --cached --quiet; then
        echo "No staged changes to commit"
      else
        echo "Committing changes to branch: $CI_WORKLOAD_REF"
        git commit --message "OpenCode changes"
        echo "Pushing changes up to $CI_WORKLOAD_REF"
        git push https://gitlab-ci-token:$GITLAB_TOKEN@$GITLAB_HOST/$CI_PROJECT_PATH.git $CI_WORKLOAD_REF
        # Примечание: официальный пример использует захардкоженный путь, здесь универсальнее через переменную $CI_PROJECT_PATH
        echo "Changes successfully pushed"
      fi
    else
      echo "No git changes detected, skipping push"
    fi
variables:
  - ANTHROPIC_API_KEY
  - GITLAB_TOKEN_OPENCODE
  - GITLAB_HOST
```

</details>

::: info Пояснения к конфигурации
- `$AI_FLOW_CONTEXT`, `$AI_FLOW_INPUT`, `$AI_FLOW_EVENT` — переменные окружения, инжектируемые GitLab Duo
- `$CI_PROJECT_PATH` — предопределённая переменная GitLab вида `<namespace>/<project>`
- Больше предопределённых переменных GitLab — в [документации переменных GitLab CI/CD](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
:::

Подробности — в [документации агентов GitLab CLI](https://docs.gitlab.com/user/duo_agent_platform/agent_assistant/).

---

## Примеры использования

::: tip Своё триггерное слово
Можно настроить триггерное слово, отличное от `@opencode`.
:::

### Объяснение Issue

Добавьте комментарий в GitLab Issue:

```
@opencode explain this issue
```

OpenCode прочитает Issue и ответит объяснением.

### Исправление Issue

В GitLab Issue:

```
@opencode fix this
```

OpenCode создаст ветку, внесёт изменения и откроет Merge Request.

### Ревью Merge Request

Оставьте комментарий в GitLab Merge Request:

```
@opencode review this merge request
```

OpenCode проверит Merge Request и даст обратную связь.

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| CI-компонент не находится | Приватный инстанс GitLab может не видеть компонент на gitlab.com | Форкните компонент в свой инстанс GitLab или скачайте и сошлитесь локально |
| `OPENCODE_AUTH_JSON` недействителен | Неверный тип переменной (нужен File, а не Variable) | Удалите и пересоздайте в CI/CD Variables, выбрав тип **File** |
| Ошибка аутентификации glab | У `GITLAB_TOKEN` не хватает прав | Убедитесь, что у токена есть права `api`, `read_repository`, `write_repository` |
| git push отклонён | Правила защиты веток | В Settings > Repository > Protected Branches разрешите пуш боту |
| OpenCode не отвечает | Проблемы сети Runner или недействительный API-ключ | Проверьте логи Runner, убедитесь в правильности API-ключа |

---

## Связанные разделы

- [5.14 Интеграция GitHub](./14-github) — интеграция через GitHub Actions
- [5.1a Основы конфигурации](./01a-config-basics) — формат конфигов OpenCode
