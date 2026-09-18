---
title: OpenCode Zen
description: Отборные модельные сервисы от команды OpenCode
---

# OpenCode Zen

OpenCode Zen — отобранные и проверенные командой OpenCode модельные сервисы.

> OpenCode Zen сейчас в стадии Beta.

Zen работает как остальные провайдеры в OpenCode. Войдите в OpenCode Zen и получите API-ключ. Он **полностью необязателен** — без него OpenCode работает как обычно.

## Фон

Моделей на рынке море, но лишь немногие хорошо работают программистскими агентами. К тому же настройки провайдеров сильно различаются — отсюда разброс производительности и качества.

> Мы протестировали набор моделей, хорошо работающих с OpenCode, и обсудили с командами, как их лучше подавать.

Если пользуетесь моделями через сервисы вроде OpenRouter — неясно, лучшую ли версию получаете.

Поэтому мы сделали несколько вещей:

1. Протестировали набор отобранных моделей и обсудили с командами лучший способ подачи
2. Договорились с несколькими провайдерами о корректной подаче
3. Прогнали бенчмарки пар «модель и провайдер» и вывели рекомендованный список

OpenCode Zen — AI-шлюз к этим моделям.

## Как пользоваться

<AdInArticle />

OpenCode Zen работает как остальные провайдеры:

1. Войдите в [консоль OpenCode Zen](https://console.opencode.ai), добавьте платёжные данные и скопируйте API-ключ
2. В TUI выполните команду `/connect`, выберите OpenCode Zen и вставьте API-ключ
3. В TUI выполните `/models` для списка рекомендуемых моделей

Оплата по запросам, на счёт добавляется баланс.

## Эндпоинты API

К моделям доступен и прямой доступ через API-эндпоинты:

| Модель | ID модели | Эндпоинт | Пакет AI SDK |
|------|---------|------|-----------|
| GPT 5.2 | gpt-5.2 | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 | gpt-5.1 | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex | gpt-5.1-codex | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex Max | gpt-5.1-codex-max | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex Mini | gpt-5.1-codex-mini | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 | gpt-5 | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 Codex | gpt-5-codex | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 Nano | gpt-5-nano | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| Claude Sonnet 4.5 | claude-sonnet-4-5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Sonnet 4 | claude-sonnet-4 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Haiku 4.5 | claude-haiku-4-5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Haiku 3.5 | claude-3-5-haiku | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Opus 4.5 | claude-opus-4-5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Opus 4.1 | claude-opus-4-1 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| MiniMax M2.7 | minimax-m2.7-free | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Gemini 3 Pro | gemini-3-pro | `https://opencode.ai/zen/v1/models/gemini-3-pro` | `@ai-sdk/google` |
| Gemini 3 Flash | gemini-3-flash | `https://opencode.ai/zen/v1/models/gemini-3-flash` | `@ai-sdk/google` |
| GLM 4.6 | glm-4.6 | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| GLM 4.7 | glm-4.7-free | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2 | kimi-k2 | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2 Thinking | kimi-k2-thinking | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Qwen3 Coder 480B | qwen3-coder | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Grok Code Fast 1 | grok-code | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Big Pickle | big-pickle | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |

В конфигурации OpenCode ID моделей используются в формате `opencode/<model-id>`. Например, для GPT 5.1 Codex — `opencode/gpt-5.1-codex`.

### Список моделей

Список доступных моделей и их метаданные:

```
https://opencode.ai/zen/v1/models
```

## Цены

Оплата по запросам. Ниже цены **за 1 млн токенов**:

| Модель | Вход | Выход | Чтение кэша | Запись кэша |
|------|------|------|----------|----------|
| Big Pickle | бесплатно | бесплатно | бесплатно | - |
| Grok Code Fast 1 | бесплатно | бесплатно | бесплатно | - |
| MiniMax M2.7 | бесплатно | бесплатно | бесплатно | - |
| GLM 5 | бесплатно | бесплатно | бесплатно | - |
| GLM 4.6 | $0.60 | $2.20 | $0.10 | - |
| Kimi K2 | $0.40 | $2.50 | - | - |
| Kimi K2 Thinking | $0.40 | $2.50 | - | - |
| Qwen3 Coder 480B | $0.45 | $1.50 | - | - |
| Claude Sonnet 4.5 (≤ 200K токенов) | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Sonnet 4.5 (> 200K токенов) | $6.00 | $22.50 | $0.60 | $7.50 |
| Claude Sonnet 4 (≤ 200K токенов) | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Sonnet 4 (> 200K токенов) | $6.00 | $22.50 | $0.60 | $7.50 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $1.25 |
| Claude Haiku 3.5 | $0.80 | $4.00 | $0.08 | $1.00 |
| Claude Opus 4.5 | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Opus 4.1 | $15.00 | $75.00 | $1.50 | $18.75 |
| Gemini 3 Pro (≤ 200K токенов) | $2.00 | $12.00 | $0.20 | - |
| Gemini 3 Pro (> 200K токенов) | $4.00 | $18.00 | $0.40 | - |
| Gemini 3 Flash | $0.50 | $3.00 | $0.05 | - |
| GPT 5.2 | $1.75 | $14.00 | $0.175 | - |
| GPT 5.1 | $1.07 | $8.50 | $0.107 | - |
| GPT 5.1 Codex | $1.07 | $8.50 | $0.107 | - |
| GPT 5.1 Codex Max | $1.25 | $10.00 | $0.125 | - |
| GPT 5.1 Codex Mini | $0.25 | $2.00 | $0.025 | - |
| GPT 5 | $1.07 | $8.50 | $0.107 | - |
| GPT 5 Codex | $1.07 | $8.50 | $0.107 | - |
| GPT 5 Nano | бесплатно | бесплатно | бесплатно | - |

В истории встречается _Claude Haiku 3.5_ — недорогая модель для генерации заголовков сессий.

> Комиссии карт передаются по себестоимости (4.4% + $0.30 за транзакцию), накруток нет.

Бесплатные модели — пояснения:

- **Grok Code Fast 1**: временно бесплатно, команда xAI собирает отзывы для улучшения Grok Code
- **GLM 5**: временно бесплатно, команда собирает отзывы для улучшения модели
- **MiniMax M2.7**: временно бесплатно, команда собирает отзывы для улучшения модели
- **Big Pickle**: скрытая модель, временно бесплатно, команда собирает отзывы для улучшения модели

### Автопополнение

При балансе ниже $5 Zen автоматически пополняет на $20.

Сумму автопополнения меняйте, автопополнение отключайте полностью.

### Месячные лимиты

Месячные лимиты задаются на всё рабочее пространство и на каждого участника команды.

Например, при месячном лимите $20 Zen не потратит за месяц больше $20. Но при включённом автопополнении баланс ниже $5 может пополниться сверх $20.

## Приватность

Все модели хостятся в США. Провайдеры придерживаются политики нулевого хранения и не используют ваши данные для обучения моделей, за исключениями:

- **Grok Code Fast 1**: данные бесплатного периода могут использоваться для улучшения Grok Code
- **GLM 5**: данные бесплатного периода могут использоваться для улучшения модели
- **MiniMax M2.7**: данные бесплатного периода могут использоваться для улучшения модели
- **Big Pickle**: данные бесплатного периода могут использоваться для улучшения модели
- **OpenAI API**: запросы хранятся 30 дней по [политике данных OpenAI](https://platform.openai.com/docs/guides/your-data)
- **Anthropic API**: запросы хранятся 30 дней по [политике данных Anthropic](https://docs.anthropic.com/en/docs/claude-code/data-usage)

## Командные функции

Zen отлично подходит командам. Приглашайте коллег, распределяйте роли, управляйте моделями команды и т. д.

> В период Beta управление рабочими пространствами бесплатно.

### Роли

Приглашайте коллег и распределяйте роли:

- **Admin**: управляет моделями, участниками, API-ключами и биллингом
- **Member**: управляет только своими API-ключами

Администраторы задают месячные лимиты трат каждого участника.

### Контроль доступа к моделям

Администраторы включают и отключают отдельные модели для рабочего пространства. Запросы к отключённым моделям возвращают ошибку.

Удобно для запрета моделей, собирающих данные.

### Свои ключи

Используйте свои API-ключи OpenAI или Anthropic с доступом к остальным моделям Zen.

Со своими ключами токены считает провайдер напрямую, а не Zen.

Например, у организации уже есть ключи OpenAI или Anthropic — используйте их вместо ключей Zen.

## Цели

Мы создали OpenCode Zen чтобы:

1. **Протестировать бенчмарками** лучшие пары «модель и провайдер» для программирования агентами
2. Дать доступ к опциям **наивысшего качества** без деградации производительности и роутинга на дешёвых провайдеров
3. **Передавать снижение цен** по себестоимости, единственная наценка — комиссия обработки
4. **Без привязки**: работает с любыми другими программистскими агентами, а в OpenCode работают любые другие провайдеры
