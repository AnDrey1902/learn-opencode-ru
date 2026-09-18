---
title: Список провайдеров моделей
description: Полный список 75+ провайдеров моделей, поддерживаемых OpenCode
---

# Список провайдеров моделей

> OpenCode поддерживает 75+ провайдеров моделей через AI SDK и Models.dev

---

## 📝 Конспект урока

Ключевые идеи урока в сжатом виде:

<img src="/images/appendix/providers-notes.mini.jpeg"
     alt="Шпаргалка: список провайдеров моделей"
     data-zoom-src="/images/appendix/providers-notes.jpeg" />

---

## Способы настройки

Добавление провайдера — в два шага:

1. Командой `/connect` добавьте API-ключ (хранится в `~/.local/share/opencode/auth.json`)
2. Настройте провайдера в `opencode.json` (необязательно, для своих опций)

---

## OpenCode Zen (рекомендуем новичкам)

Официальный протестированный и проверенный список моделей OpenCode — работает из коробки.

```bash
# 1. В TUI выполните
/connect

# 2. Выберите opencode, получите API-ключ на opencode.ai/auth

# 3. Смотрите доступные модели
/models
```

**Получение API-ключа**: [opencode.ai/auth](https://opencode.ai/auth)

---

## Российские модели

<AdInArticle />

Доступные напрямую из России.

### DeepSeek

Прямое подключение, отличное соотношение цены и качества.

| Модель | Описание |
|------|------|
| `deepseek-chat` | Универсальный диалог |
| `deepseek-reasoner` | Рассуждающая модель (R1) |

**Шаги настройки**:
```bash
# 1. Выполните /connect, найдите DeepSeek
/connect

# 2. Введите API-ключ

# 3. Выберите модель
/models
```

**Получение API-ключа**: [platform.deepseek.com](https://platform.deepseek.com)

---

### Moonshot AI

Модели Kimi K2.

| Модель | Описание |
|------|------|
| `kimi-k2` | Свежая модель |

**Шаги настройки**:
```bash
/connect  # Найдите Moonshot AI
```

**Получение API-ключа**: [platform.moonshot.ai](https://platform.moonshot.ai)

---

### MiniMax

| Модель | Описание |
|------|------|
| `M2.7` | Свежая модель |

**Шаги настройки**:
```bash
/connect  # Найдите MiniMax
```

**Получение API-ключа**: [platform.minimax.io](https://platform.minimax.io)

---

### Z.AI

Модели серии GLM.

| Модель | Описание |
|------|------|
| `GLM-5` | Свежая модель |

**Шаги настройки**:
```bash
/connect  # Найдите Z.AI
# При подписке на GLM Coding Plan выберите Z.AI Coding Plan
```

**Получение API-ключа**: [z.ai](https://z.ai/manage-apikey/apikey-list)

---

## Международные модели

### Anthropic Claude

| Модель | Описание |
|------|------|
| `claude-sonnet-4-20250514` | Свежая сбалансированная (рекомендуется) |
| `claude-opus-4-20250514` | Самая сильная модель |
| `claude-3-5-haiku-20241022` | Быстрая модель |

**Способ настройки**:
```bash
/connect  # Выберите Anthropic

# Необязательно:
# - Claude Pro/Max (авторизация в браузере)
# - Create an API Key (создать новый ключ)
# - Manually enter API Key (ввести вручную)
```

**Получение API-ключа**: [console.anthropic.com](https://console.anthropic.com)

---

### OpenAI

| Модель | Описание |
|------|------|
| `gpt-4o` | Флагманская мультимодальная |
| `gpt-4o-mini` | Экономная версия |
| `o1` | Рассуждающая модель |
| `o3-mini` | Свежие рассуждения |

**Способ настройки**:
```bash
/connect  # Найдите OpenAI
```

**Получение API-ключа**: [platform.openai.com](https://platform.openai.com)

---

### Google Gemini

Использование через Vertex AI.

| Модель | Описание |
|------|------|
| `gemini-2.0-flash` | Свежая быстрая версия |
| `gemini-2.0-pro` | Профессиональная версия |
| `gemini-1.5-pro` | Длинный контекст |

**Способ настройки**:
```bash
# Задайте ID проекта Google Cloud (обязательно)
export GOOGLE_CLOUD_PROJECT=your-project-id
# Или GCP_PROJECT / GCLOUD_PROJECT тоже подойдут

# Задайте регион (необязательно, по умолчанию us-east5)
export VERTEX_LOCATION=us-east5
# Или GOOGLE_CLOUD_LOCATION тоже подойдёт
```

> Google Vertex AI требует аутентификации через `gcloud auth application-default login` или сервисный аккаунт, OpenCode сам использует Application Default Credentials.

---

### xAI Grok

| Модель | Описание |
|------|------|
| `grok-2` | Свежая версия |
| `grok-2-mini` | Экономная версия |

**Способ настройки**:
```bash
/connect  # Найдите xAI
```

**Получение API-ключа**: [console.x.ai](https://console.x.ai)

---

### Mistral

Лидер опенсорсных моделей: Mistral Large, Codestral и др.

| Модель | Описание |
|------|------|
| `mistral-large-latest` | Максимальные способности |
| `mistral-small-latest` | Быстрые ответы |
| `codestral-latest` | Оптимизация под код |

```bash
/connect  # Найдите Mistral
```

**Получение API-ключа**: [console.mistral.ai](https://console.mistral.ai)

---

### Cohere

Корпоративный NLP: Rerank, Embed и др.

```bash
/connect  # Найдите Cohere
```

**Получение API-ключа**: [dashboard.cohere.com](https://dashboard.cohere.com)

---

### Perplexity

Со встроенным поиском для свежих данных.

```bash
/connect  # Найдите Perplexity
```

**Получение API-ключа**: [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)

> Формат API-ключа: `pplx-...`

---

### GitHub Copilot

По подписке Copilot.

```bash
/connect  # Найдите GitHub Copilot
# Откройте github.com/login/device и введите код для авторизации
```

> Отдельным моделям нужна подписка Pro+, некоторые модели включаются вручную в настройках GitHub Copilot.

---

## Облачные платформы

### Amazon Bedrock

```bash
# Способ через переменные окружения
AWS_PROFILE=my-profile opencode

# Или файлом конфигурации
```

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile"
      }
    }
  }
}
```

---

### Azure OpenAI

```bash
/connect  # Найдите Azure OpenAI
```

> - При ошибке "I'm sorry, but I cannot assist" смените фильтр контента с DefaultV2 на Default.
> - Azure OpenAI настраивается через `/connect`, credentials сохраняются автоматически.

---

### Azure Cognitive Services

```bash
/connect  # Найдите Azure Cognitive Services

# Задайте имя ресурса
export AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=your-resource-name
```

---

### Cloudflare Workers AI

Периферийная сеть Cloudflare, низкие задержки по миру.

```bash
/connect  # Найдите Cloudflare Workers AI

# Или задайте переменные окружения
export CLOUDFLARE_API_KEY=your-api-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id
```

**Получение API-токена**: [dash.cloudflare.com](https://dash.cloudflare.com) → My Profile → API Tokens

---

### GitLab

GitLab Duo Chat с глубокой интеграцией GitLab.

```bash
/connect  # Найдите GitLab

# Для корпоративного инстанса задайте
export GITLAB_INSTANCE_URL=https://gitlab.company.com
```

**Получение токена**: [gitlab.com](https://gitlab.com) → Settings → Access Tokens

> Формат токена: `glpat-...`

---

## Платформы-агрегаторы

### OpenRouter

Один API-ключ для 100+ моделей.

```bash
/connect  # Найдите OpenRouter
```

**Свои модели**:
```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openrouter": {
      "models": {
        "moonshotai/kimi-k2": {
          "options": {
            "provider": {
              "order": ["baseten"],
              "allow_fallbacks": false
            }
          }
        }
      }
    }
  }
}
```

**Получение API-ключа**: [openrouter.ai](https://openrouter.ai)

---

### Groq

Сверхбыстрый инференс.

```bash
/connect  # Найдите Groq
```

**Получение API-ключа**: [console.groq.com](https://console.groq.com)

---

### Cerebras

Сверхбыстрый инференс с поддержкой Qwen3 Coder 480B.

```bash
/connect  # Найдите Cerebras
```

**Получение API-ключа**: [inference.cerebras.ai](https://inference.cerebras.ai)

---

### Fireworks AI

```bash
/connect  # Найдите Fireworks AI
```

**Получение API-ключа**: [app.fireworks.ai](https://app.fireworks.ai)

---

### Deep Infra

```bash
/connect  # Найдите Deep Infra
```

**Получение API-ключа**: [deepinfra.com/dash](https://deepinfra.com/dash)

---

### Together AI

```bash
/connect  # Найдите Together AI
```

**Получение API-ключа**: [api.together.ai](https://api.together.ai)

---

### Hugging Face

Опенсорсные модели 17+ провайдеров.

```bash
/connect  # Найдите Hugging Face
```

**Получение токена**: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained)

---

### Baseten

```bash
/connect  # Найдите Baseten
```

**Получение API-ключа**: [app.baseten.co](https://app.baseten.co)

---

### Cortecs

С поддержкой Kimi K2 Instruct.

```bash
/connect  # Найдите Cortecs
```

**Получение API-ключа**: [cortecs.ai](https://cortecs.ai)

---

### Nebius Token Factory

```bash
/connect  # Найдите Nebius Token Factory
```

**Получение API-ключа**: [tokenfactory.nebius.com](https://tokenfactory.nebius.com)

---

### IO.NET

17+ моделей.

```bash
/connect  # Найдите IO.NET
```

**Получение API-ключа**: [ai.io.net](https://ai.io.net)

---

### Venice AI

```bash
/connect  # Найдите Venice AI
```

**Получение API-ключа**: [venice.ai](https://venice.ai)

---

### OVHcloud AI Endpoints

```bash
/connect  # Найдите OVHcloud AI Endpoints
```

**Получение API-ключа**: [ovh.com/manager](https://ovh.com/manager) → Public Cloud → AI & Machine Learning → AI Endpoints

---

### SAP AI Core

Доступ к 40+ моделям (OpenAI, Anthropic, Google, Amazon, Meta и др.).

```bash
/connect  # Найдите SAP AI Core
```

Нужен Service Key JSON (с `clientid`, `clientsecret`, `url`, `serviceurls.AI_API_URL`).

---

### Cloudflare AI Gateway

Единый доступ к нескольким провайдерам через Cloudflare с единым биллингом.

```bash
# Задайте переменные окружения
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_GATEWAY_ID=your-gateway-id

/connect  # Найдите Cloudflare AI Gateway
```

---

### Vercel AI Gateway

Единый доступ к нескольким провайдерам через Vercel, цены по себестоимости без наценок.

```bash
/connect  # Найдите Vercel AI Gateway
```

**Настройка порядка роутинга**:
```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "vercel": {
      "models": {
        "anthropic/claude-sonnet-4": {
          "options": {
            "order": ["anthropic", "vertex"]
          }
        }
      }
    }
  }
}
```

---

### Helicone

LLM-платформа наблюдаемости: логи, мониторинг и разбор.

```bash
/connect  # Найдите Helicone
```

**Получение API-ключа**: [helicone.ai](https://helicone.ai)

**Свои заголовки запросов**:
```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "helicone": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Helicone",
      "options": {
        "baseURL": "https://ai-gateway.helicone.ai",
        "headers": {
          "Helicone-Cache-Enabled": "true",
          "Helicone-User-Id": "opencode"
        }
      }
    }
  }
}
```

---

### ZenMux

```bash
/connect  # Найдите ZenMux
```

**Получение API-ключа**: [zenmux.ai/settings/keys](https://zenmux.ai/settings/keys)

---

### Ollama Cloud

Облачный сервис Ollama.

```bash
/connect  # Найдите Ollama Cloud
```

> Перед использованием подтяните локально информацию о моделях: `ollama pull gpt-oss:20b-cloud`

**Получение API-ключа**: [ollama.com](https://ollama.com) → Settings → Keys

---

## Локальные модели

### Ollama

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama3.1": {
          "name": "Llama 3.1"
        }
      }
    }
  }
}
```

> Если не работают вызовы инструментов — увеличьте `num_ctx` у Ollama, рекомендуем 16k–32k.

**Установка**: [ollama.ai](https://ollama.ai)

---

### LM Studio

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {
        "google/gemma-3n-e4b": {
          "name": "Gemma 3n-e4b (local)"
        }
      }
    }
  }
}
```

**Установка**: [lmstudio.ai](https://lmstudio.ai)

---

### llama.cpp

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "llama.cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "llama-server (local)",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1"
      },
      "models": {
        "qwen3-coder:a3b": {
          "name": "Qwen3-Coder: a3b-30b (local)",
          "limit": {
            "context": 128000,
            "output": 65536
          }
        }
      }
    }
  }
}
```

---

## Свои провайдеры

Добавьте любого OpenAI-совместимого провайдера:

```bash
# 1. Выполните /connect, выберите Other
/connect

# 2. Введите ID провайдера (например, myprovider)

# 3. Введите API-ключ
```

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Provider",
      "options": {
        "baseURL": "https://api.myprovider.com/v1"
      },
      "models": {
        "my-model": {
          "name": "My Model",
          "limit": {
            "context": 200000,
            "output": 65536
          }
        }
      }
    }
  }
}
```

**Опции конфигурации**:
- `npm` — имя npm-пакета AI SDK, для OpenAI-совместимых — `@ai-sdk/openai-compatible`
- `name` — отображаемое имя в интерфейсе
- `options.baseURL` — эндпоинт API
- `options.apiKey` — API-ключ (необязательно, без auth задавать не нужно)
- `options.headers` — свои заголовки запросов
- `models` — список доступных моделей
- `limit.context` — максимум входных токенов
- `limit.output` — максимум выходных токенов

---

## Свой Base URL

Свой эндпоинт любому провайдеру (например, прокси-сервису):

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://my-proxy.com/v1"
      }
    }
  }
}
```

---

## Гид по выбору моделей

| Задача | Рекомендация | Почему |
|------|------|------|
| Проще всего использовать из России | DeepSeek | Прямое подключение, отличный русский |
| Сильнейшие рассуждения | Claude Opus 4 | Сильнейший в отрасли |
| Лучшее соотношение цены и качества | DeepSeek | Дёшево и сердито |
| Сильнейший в коде | Claude Sonnet 4 | Профессиональное программирование |
| Обработка длинных документов | Gemini 1.5 Pro | Сверхдлинный контекст |
| Полный офлайн | Ollama + Llama3.1 | Локальный запуск |
| Переключение моделей | OpenRouter | Один ключ на всё |

---

## Диагностика неполадок

1. **Проверка аутентификации**: выполните `opencode auth list` для просмотра настроенных credentials

2. **Проблемы своих провайдеров**:
   - Убедитесь, что ID провайдера в `/connect` совпадает с конфигом
   - Используйте верный npm-пакет (вроде `@ai-sdk/openai-compatible`)
   - Проверьте корректность `options.baseURL`

---

## Связанные материалы

- [Подключение моделей](../1-start/04-connect) — руководство по настройке
- [Справочник опций конфигурации](./config-ref) — подробности файлов конфигурации
