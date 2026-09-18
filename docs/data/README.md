# Автогенерация статистики

## Что это

При каждой сборке или запуске dev-сервера автоматически выполняется `scripts/stats.sh`: считает слова учебника и число 4K-шпаргалок, генерирует файл `docs/data/stats.json`.

## Правила подсчёта

- **Подсчёт слов** (в стиле Word):
  - Китайский: каждый иероглиф — 1 слово
  - Русский/английский: каждое слово — 1
  - Охват: все `.md` в `docs/` (кроме каталога `.vitepress`)

- **Подсчёт шпаргалок**:
  - Считаются файлы `*-notes.jpeg` в `docs/public/images`
  - Миниатюры `*.mini.jpeg` исключаются

## Формат данных

```json
{
  "wordCount": 138188,
  "notesCount": 66
}
```

## Использование

На главной `docs/index.md` подключается Vue-скриптом:

```vue
<script setup>
import stats from './data/stats.json'
</script>

<span class="stat-number">{{ (stats.wordCount / 1000).toFixed(0) }} тыс.</span>
<span class="stat-number">{{ stats.notesCount }}</span>
```

## Автозапуск

```json
"scripts": {
  "dev": "bash scripts/stats.sh && vitepress dev docs",
  "build": "bash scripts/stats.sh && vitepress build docs"
}
```
