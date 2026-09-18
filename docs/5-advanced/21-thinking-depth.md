---
title: 5.21 Настройка глубины мышления
subtitle: Отдельный бюджет мышления для больших моделей
course: Практический курс OpenCode на русском языке
stage: Этап 5
lesson: "5.21"
duration: 18 минут
practice: 12 минут
level: Продвинутый
description: Научитесь задавать бюджет мышления отдельным моделям через opencode.json и переключаться между глубинами горячими клавишами Ctrl+T.
tags:
  - Конфигурация
  - Модели
  - Мышление
  - Горячие клавиши
prerequisite:
  - 5.1 Всё о конфигурации
---

# 5.21 Настройка глубины мышления

> Относитесь к «глубине мышления» как к передачам: нужна скорость — мелко, нужна надёжность — глубоко.

## Что вы сможете после урока

- Задавать отдельным моделям бюджет мышления (thinking budget)
- Понимать, как механизм «вариантов» управляет глубиной мышления
- Переключаться между глубинами мышления через <kbd>Ctrl</kbd>+<kbd>T</kbd>

---

## С какими трудностями вы столкнулись

- Одна и та же модель: иногда нужна скорость, иногда глубина — а как переключать, непонятно
- Записали конфигурацию в `opencode.json`, но не уверены, что применилась
- На моделях через транзит не уверены, управляется ли глубина мышления

---

## Когда это пригодится

- Когда нужно: сделать «глубину мышления» переключаемыми передачами
- И не хочется: каждый раз менять модель или править конфигурацию

---

## 🎒 Перед началом

- [ ] Пройден урок [5.1 Всё о конфигурации](./01a-config-basics)
- [ ] OpenCode нормально стартует

---

## Главная идея

1. OpenCode хранит разные глубины мышления **вариантами моделей (variants)**
2. Варианты — конфигурация уровня модели с приоритетом выше умолчаний
3. <kbd>Ctrl</kbd>+<kbd>T</kbd> циклично переключает варианты

::: info ℹ️ Что такое «глубина мышления»?
Это «доступный бюджет мышления» модели — например, `thinking.budgetTokens` у Anthropic.
Чем больше число, тем больше токенов модель тратит на рассуждения, но тем медленнее ответы и выше цена.
:::

---

## Повторите за мной

### Шаг 1: проверьте, поддерживает ли модель варианты мышления

**Зачем**  Варианты есть не у всех моделей — OpenCode сначала проверяет `capabilities.reasoning`.

**Как**  Выбирайте модели с поддержкой reasoning (вроде Anthropic, Gemini 3 и OpenAI).

**Вы должны увидеть**  В списке моделей появляются варианты `high` и `max`.

---

### Шаг 2: задайте бюджет мышления отдельной модели в opencode.json

**Зачем**  Конфигурация вариантов живёт в `provider.models.[modelID].variants` и перекрывает значения по умолчанию.

**Как**  Впишите нужные поля под вашего провайдера:

**Пример Anthropic** (thinking.budgetTokens)

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "claude-sonnet-4-5": {
          "variants": {
            "high": {
              "thinking": { "type": "enabled", "budgetTokens": 20000 }
            },
            "max": {
              "thinking": { "type": "enabled", "budgetTokens": 32000 }
            }
          }
        }
      }
    }
  }
}
```

**Пример Gemini 3** (thinkingConfig.thinkingBudget)

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "google": {
      "models": {
        "gemini-3-flash": {
          "variants": {
            "high": {
              "thinkingConfig": { "includeThoughts": true, "thinkingBudget": 16000 }
            },
            "max": {
              "thinkingConfig": { "includeThoughts": true, "thinkingBudget": 24576 }
            }
          }
        }
      }
    }
  }
}
```

**Вы должны увидеть**  После перезапуска числовые значения вариантов моделей применяются.

---

### Шаг 3: переключайте глубину мышления через Ctrl+T

**Зачем**  Когда варианты настроены, горячими клавишами переключаться удобнее.

**Как**  В поле ввода диалога нажимайте <kbd>Ctrl</kbd>+<kbd>T</kbd> для циклического переключения:

```
(нет) → high → max → (нет) → high → ...
```

**Вы должны увидеть**  В строке состояния — имя текущего варианта (например, `high`).

---

### Шаг 4: свои имена вариантов (необязательно)

**Зачем**  Имена вариантов не фиксированы — переименуйте хоть в «глубокое мышление» и «максимальная скорость».

**Как**  Используйте свои ключи в `variants`:

```jsonc
{
  "provider": {
    "anthropic": {
      "models": {
        "claude-sonnet-4-5": {
          "variants": {
            "быстро": { "thinking": { "type": "enabled", "budgetTokens": 8000 } },
            "глубоко": { "thinking": { "type": "enabled", "budgetTokens": 32000 } }
          }
        }
      }
    }
  }
}
```

**Вы должны увидеть**  <kbd>Ctrl</kbd>+<kbd>T</kbd> переключает «быстро» и «глубоко».

::: info ℹ️ Свои варианты «добавляются», а не «заменяют»
OpenCode **сливает** написанные вами в `opencode.json` варианты с вариантами по умолчанию.
Чтобы оставить только свои, явно отключите умолчательные `high` и `max`:

```jsonc
{
  "provider": {
    "anthropic": {
      "models": {
        "claude-sonnet-4-5": {
          "variants": {
            "high": { "disabled": true },
            "max": { "disabled": true },
            "быстро": { "thinking": { "type": "enabled", "budgetTokens": 8000 } },
            "глубоко": { "thinking": { "type": "enabled", "budgetTokens": 32000 } }
          }
        }
      }
    }
  }
}
```
:::

**Как настроен транзит**

Если ваш транзит — `openai-compatible`, по умолчанию используется `reasoningEffort`. Пример:

```jsonc
{
  "provider": {
    "relay": {
      "options": {
        "baseURL": "https://your-relay.example.com/v1",
        "apiKey": "{env:RELAY_API_KEY}"
      },
      "models": {
        "gpt-5": {
          "variants": {
            "low": { "reasoningEffort": "low" },
            "high": { "reasoningEffort": "high" }
          }
        }
      }
    }
  }
}
```

Если транзит на самом деле проксирует интерфейс Anthropic (но едет через SDK `openai-compatible`), прямо перекрывайте полями Anthropic:

```jsonc
{
  "provider": {
    "relay": {
      "options": {
        "baseURL": "https://your-relay.example.com/v1",
        "apiKey": "{env:RELAY_API_KEY}"
      },
      "models": {
        "claude-sonnet-4-5": {
          "variants": {
            "high": {
              "thinking": { "type": "enabled", "budgetTokens": 20000 }
            },
            "max": {
              "thinking": { "type": "enabled", "budgetTokens": 32000 }
            }
          }
        }
      }
    }
  }
}
```

Условие: серверная сторона вашего транзита пробрасывает поле `thinking` в Anthropic как есть.

---

## Контрольные пункты ✅

- [ ] В `opencode.json` есть `provider.models.[modelID].variants`
- [ ] После старта имена вариантов видны в строке состояния
- [ ] <kbd>Ctrl</kbd>+<kbd>T</kbd> циклично переключает варианты

---

## Типичные проблемы

| Симптом | Причина | Решение |
|-----|-----|-----|
| <kbd>Ctrl</kbd>+<kbd>T</kbd> не реагирует | У текущей модели нет вариантов | Смените модель на поддерживающую reasoning или добавьте variants |
| Варианты есть, но не видны | Ещё не переключились ни на один вариант | Нажмите <kbd>Ctrl</kbd>+<kbd>T</kbd> раз |
| Конфигурация не применяется | Неверный ID модели | Скопируйте полный ID из списка моделей |
| Транзит без изменений | Используется `openai-compatible` с одним reasoningEffort | Вручную перекройте параметры во variants |

---

## Итоги урока

Вы научились:

1. Варианты — это «передачи глубины мышления», настраиваются в `provider.models.[modelID].variants`
2. Варианты по умолчанию автогенерирует ProviderTransform, конфигурация их перекрывает
3. <kbd>Ctrl</kbd>+<kbd>T</kbd> циклично переключает варианты

---

## Анонс следующего урока

> В следующем уроке изучим **[инструменты отладки и диагностики](./22-debugging)**.
>
> Вы узнаете:
> - Как пользоваться командами серии `opencode debug`
> - Диагностику проблем LSP, конфигурации и поиска
> - Как разбирать OpenCode словно разработчик

---

## Приложение: ссылки на исходники

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходников</strong></summary>

> Дата обновления: 2026-01-16

| Функция | Путь к файлу | Строки |
|-----|---------|------|
| Точка входа генерации вариантов | [`src/provider/transform.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/provider/transform.ts#L297-L477) | 297-477 |
| Фильтрация и исключения reasoning | [`src/provider/transform.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/provider/transform.ts#L298-L301) | 298-301 |
| Умолчания бюджета мышления Anthropic | [`src/provider/transform.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/provider/transform.ts#L371-L385) | 371-385 |
| Умолчания бюджета мышления Gemini 3 | [`src/provider/transform.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/provider/transform.ts#L421-L439) | 421-439 |
| Schema конфигурации вариантов | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L818-L833) | 818-833 |
| Слияние конфигурации вариантов | [`src/provider/provider.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/provider/provider.ts#L929-L936) | 929-936 |
| Горячие клавиши Ctrl+T по умолчанию | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L632-L688) | 632-688 |
| Привязка команды Ctrl+T | [`src/cli/cmd/tui/app.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/cli/cmd/tui/app.tsx#L393-L399) | 393-399 |
| Логика цикла вариантов | [`src/cli/cmd/tui/context/local.tsx`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/tui/context/local.tsx#L310-L346) | 310-346 |
| Логика отображения вариантов | [`src/cli/cmd/tui/component/prompt/index.tsx`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx#L696-L700) | 696-700 |
| Рендер имён вариантов | [`src/cli/cmd/tui/component/prompt/index.tsx`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx#L946-L950) | 946-950 |
| Применение вариантов к параметрам LLM | [`src/session/llm.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/llm.ts#L96-L109) | 96-109 |
| Конфигурация keybind вариантов | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L632-L688) | 632-688 |

**Ключевые константы**:
- `WIDELY_SUPPORTED_EFFORTS = ["low", "medium", "high"]`
- `OPENAI_EFFORTS = ["none", "minimal", "low", "medium", "high", "xhigh"]`

</details>
