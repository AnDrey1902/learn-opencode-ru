import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenCode на русском',
  titleTemplate: ':title — практическое руководство по AI-помощнику',
  description: 'Бесплатный учебник для начинающих по OpenCode — AI-помощнику в терминале. Изучайте DeepSeek, Qwen, MiniMax, GLM и Ollama: от первых шагов до продвинутых сценариев.',
  lang: 'ru-RU',
  ignoreDeadLinks: false,

  sitemap: {
    hostname: 'https://learn-opencode-ru.vercel.app', // TODO: заменить на итоговый домен
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { name: 'author', content: 'Сообщество OpenCode' }],
    ['meta', { name: 'keywords', content: 'OpenCode, AI, AI-помощник, учебник OpenCode, DeepSeek, Qwen, MiniMax, GLM, Ollama' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'ru_RU' }],
    ['meta', { property: 'og:site_name', content: 'OpenCode на русском' }],
    ['meta', { property: 'og:title', content: 'OpenCode на русском — практическое руководство по AI-помощнику' }],
    ['meta', { property: 'og:description', content: 'Бесплатный учебник для начинающих по OpenCode — AI-помощнику в терминале. DeepSeek, Qwen, MiniMax, GLM и Ollama.' }],
    ['meta', { property: 'og:image', content: 'https://learn-opencode-ru.vercel.app/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'OpenCode на русском — практическое руководство по AI-помощнику' }],
    ['meta', { name: 'twitter:description', content: 'Бесплатный учебник для начинающих по OpenCode — AI-помощнику в терминале.' }],
    ['meta', { name: 'twitter:image', content: 'https://learn-opencode-ru.vercel.app/og-image.png' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'OpenCode на русском',
      alternateName: 'Практический курс OpenCode',
      url: 'https://learn-opencode-ru.vercel.app',
      description: 'Бесплатный учебник для начинающих по OpenCode — AI-помощнику в терминале. Модели DeepSeek, Qwen, MiniMax, GLM и Ollama.',
      inLanguage: 'ru-RU',
      publisher: {
        '@type': 'Organization',
        name: 'Сообщество OpenCode',
        logo: {
          '@type': 'ImageObject',
          url: 'https://learn-opencode-ru.vercel.app/logo.svg',
        },
      },
    })],
  ],

  transformHead({ pageData }) {
    const canonicalUrl = `https://learn-opencode-ru.vercel.app/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html')
    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['link', { rel: 'alternate', hreflang: 'ru', href: canonicalUrl }],
    ]
  },

  markdown: {
    config(md) {
      const originalFence = md.renderer.rules.fence
      md.renderer.rules.fence = (...args) => {
        const html = originalFence ? originalFence(...args) : ''
        return html
          .replace(/<div class="language-/g, '<div v-pre class="language-')
          .replace(/<code(?![^>]*v-pre)/g, '<code v-pre')
      }
      const originalInline = md.renderer.rules.code_inline
      md.renderer.rules.code_inline = (...args) => {
        const html = originalInline ? originalInline(...args) : ''
        return html.replace(/<code(?![^>]*v-pre)/g, '<code v-pre')
      }
    },
  },

  themeConfig: {
    logo: {
      light: '/logo-light.png',
      dark: '/logo-dark.png',
    },
    nav: [
      { text: 'Начать обучение', link: '/1-start/' },
      { text: 'Сценарии', link: '/4-scenarios/' },
      { text: 'Продвинутый уровень', link: '/5-advanced/' },
      { text: 'Справочник', link: '/appendix/' },
      { text: 'Сообщество', link: '/community' },
    ],
    sidebar: [
      {
        text: '🚀 Быстрый старт', collapsed: false, items: [
          { text: 'Обзор этапа', link: '/1-start/' },
          { text: '1.1 Что это такое', link: '/1-start/01-intro' },
          { text: '1.2 Установка', collapsed: true, items: [
            { text: 'Установка за 5 минут', link: '/1-start/02-install' },
            { text: 'Альтернативные способы', link: '/1-start/02a-install-alternatives' },
            { text: 'Что делать, если не устанавливается?', link: '/1-start/02b-install-troubleshoot' },
          ] },
          { text: '1.3 Настройка сети', link: '/1-start/03-network' },
          { text: '1.4 Подключение моделей', collapsed: true, items: [
            { text: 'Обзор: первый диалог', link: '/1-start/04-connect' },
            { text: '[Рекомендуется] MiniMax (M2.7)', link: '/1-start/04d-minimax' },
            { text: 'Бесплатные модели (OpenCode Zen)', link: '/1-start/04a-free-models' },
            { text: 'Zhipu GLM-5', link: '/1-start/04c-zhipu' },
            { text: 'DeepSeek', link: '/1-start/04b-deepseek' },
            { text: 'Claude (Anthropic)', link: '/1-start/04e-claude' },
            { text: 'Ретранслятор Claude Code', link: '/1-start/04f-claudecode-relay' },
            { text: 'Ollama (локально)', link: '/1-start/04g-ollama' },
            { text: 'OpenAI (GPT / Codex)', link: '/1-start/04h-openai' },
            { text: 'Qwen', link: '/1-start/04i-alibaba' },
            { text: 'GitHub Copilot', link: '/1-start/04j-github-copilot' },
          ] },
          { text: '1.5 Автоматическое обновление', link: '/1-start/05-update' },
        ],
      },
      {
        text: '💪 Ежедневное использование', collapsed: false, items: [
          { text: 'Обзор этапа', link: '/2-daily/' },
          { text: '2.1 Интерфейс и управление', link: '/2-daily/01-interface' },
          { text: '2.1b Как копировать содержимое', link: '/2-daily/01b-copy-paste' },
          { text: '2.1c Основные инструменты AI', link: '/2-daily/01c-basic-tools' },
          { text: '2.1d Диалог с AI по изображениям', link: '/2-daily/01d-images' },
          { text: '2.2 Управление диалогами', link: '/2-daily/02-sessions' },
          { text: '2.3 Сочетания клавиш', link: '/2-daily/03-shortcuts' },
          { text: '2.4 Глобальные инструкции', link: '/2-daily/04-global-rules' },
          { text: '2.5 Управление окружением', link: '/2-daily/05-env-management' },
          { text: '2.6 Основы Git', link: '/2-daily/06-git-basics' },
        ],
      },
      {
        text: '⚡ Эффективный рабочий процесс', collapsed: false, items: [
          { text: 'Обзор этапа', link: '/3-workflow/' },
          { text: '3.1 Plan vs Build', link: '/3-workflow/01-plan-build' },
          { text: '3.2 Знакомство с агентами', link: '/3-workflow/02-agents' },
          { text: '3.3 Инициализация проекта', link: '/3-workflow/03-init' },
        ],
      },
      {
        text: '🎯 Практические сценарии', collapsed: false, items: [
          { text: 'Выберите свой путь', link: '/4-scenarios/' },
          { text: '✍️ Создание контента', collapsed: false, items: [
            { text: 'A1 Рабочий процесс автора', link: '/4-scenarios/writer-workflow' },
            { text: 'A2 Публикации в WeChat', link: '/4-scenarios/writer-wechat' },
            { text: 'A3 Ведение Xiaohongshu', link: '/4-scenarios/writer-xiaohongshu' },
            { text: 'A4 Маркетинговые тексты', link: '/4-scenarios/writer-copywriting' },
            { text: 'A5 Перевод и редактура', link: '/4-scenarios/writer-translate' },
            { text: 'A6 Написание романов', link: '/4-scenarios/writer-novel' },
            { text: 'A7 Написание сценариев', link: '/4-scenarios/writer-script' },
            { text: 'A8 Веб-романы', link: '/4-scenarios/writer-webnovel' },
            { text: 'A9 Рабочая станция автора', link: '/4-scenarios/writer-workstation' },
          ] },
          { text: '💻 Я разработчик', collapsed: false, items: [
            { text: 'B1 Ежедневная разработка', link: '/4-scenarios/coder-daily' },
            { text: 'B2 Рефакторинг и тестирование', link: '/4-scenarios/coder-refactor' },
            { text: 'B3 Документация и Git', link: '/4-scenarios/coder-docs-git' },
            { text: 'B4 Интеграция CI/CD', link: '/4-scenarios/coder-cicd' },
            { text: 'B5 Специализированные агенты', link: '/4-scenarios/coder-agents' },
            { text: 'B6 Изолированное/офлайн-развёртывание', link: '/4-scenarios/coder-intranet' },
          ] },
          { text: '📊 Повышение эффективности', collapsed: false, items: [
            { text: 'C1 Организация файлов', link: '/4-scenarios/office-files' },
            { text: 'C2 Обработка данных', link: '/4-scenarios/office-data' },
            { text: 'C3 Изучение программирования с AI', link: '/4-scenarios/office-learn' },
            { text: 'C4 Скрипты автоматизации', link: '/4-scenarios/office-automation' },
            { text: 'C5 Автоматизация рисования на веб-страницах', link: '/4-scenarios/mcp-web-image-gen' },
          ] },
        ],
      },
      {
        text: '🔧 Продвинутый уровень', collapsed: false, items: [
          { text: 'Обзор этапа', link: '/5-advanced/' },
          { text: '5.1 Полная настройка', collapsed: true, items: [
            { text: '5.1a Основы настройки', link: '/5-advanced/01a-config-basics' },
            { text: '5.1b Продвинутая настройка', link: '/5-advanced/01b-config-advanced' },
          ] },
          { text: '5.2 Система агентов', collapsed: true, items: [
            { text: '5.2a Быстрый старт', link: '/5-advanced/02a-agent-quickstart' },
            { text: '5.2b Шаблоны проектирования', link: '/5-advanced/02b-agent-patterns' },
            { text: '5.2c Разрешения и безопасность', link: '/5-advanced/02c-agent-permissions' },
            { text: '5.2d Продвинутые приёмы', link: '/5-advanced/02d-agent-advanced' },
          ] },
          { text: '5.3 Навыки (Skill)', collapsed: true, items: [
            { text: '5.3a Основы навыков', link: '/5-advanced/03a-skills-basics' },
            { text: '5.3b Продвинутые навыки', link: '/5-advanced/03b-skills-advanced' },
            { text: '5.3c Продвинутые шаблоны', link: '/5-advanced/03c-skills-patterns' },
          ] },
          { text: '5.4 Слэш-команды', link: '/5-advanced/04-commands' },
          { text: '5.5 Управление разрешениями', link: '/5-advanced/05-permissions' },
          { text: '5.6 Темы и сочетания клавиш', collapsed: true, items: [
            { text: '5.6a Система тем', link: '/5-advanced/06a-themes' },
            { text: '5.6b Сочетания клавиш', link: '/5-advanced/06b-keybinds' },
          ] },
          { text: '5.7 Расширения MCP', collapsed: true, items: [
            { text: '5.7a Основы MCP', link: '/5-advanced/07a-mcp-basics' },
            { text: '5.7b Продвинутый MCP', link: '/5-advanced/07b-mcp-advanced' },
            { text: '5.7c Управление браузером с AI', link: '/5-advanced/07c-mcp-chrome-devtools' },
          ] },
          { text: '5.8 Интеграция с IDE', collapsed: true, items: [
            { text: '5.8a Расширение VS Code', link: '/5-advanced/08a-ide-vscode' },
            { text: '5.8b Протокол ACP', link: '/5-advanced/08b-acp' },
          ] },
          { text: '5.9 Удалённый режим', collapsed: true, items: [
            { text: '5.9a Основы удалённого режима', link: '/5-advanced/09a-remote-basics' },
            { text: '5.9b Справочник API', link: '/5-advanced/09b-remote-api' },
          ] },
          { text: '5.10 Разработка с SDK', collapsed: true, items: [
            { text: '5.10a Основы SDK', link: '/5-advanced/10a-sdk-basics' },
            { text: '5.10b Справочник API', link: '/5-advanced/10b-sdk-reference' },
            { text: '5.10c API следующего поколения SDK V2', link: '/5-advanced/10c-sdk-v2' },
          ] },
          { text: '5.11 Корпоративная версия', link: '/5-advanced/11-enterprise' },
          { text: '5.11a Интеграция корпоративной аутентификации', link: '/5-advanced/11a-enterprise-auth' },
          { text: '5.12 Разработка плагинов', collapsed: true, items: [
            { text: '5.12a Основы плагинов', link: '/5-advanced/12a-plugins-basics' },
            { text: '5.12b Продвинутые плагины', link: '/5-advanced/12b-plugins-advanced' },
            { text: '5.12c Руководство по хукам', link: '/5-advanced/12c-hooks' },
          ] },
          { text: '5.13 Пользовательские инструменты', link: '/5-advanced/13-custom-tools' },
          { text: '5.14 Интеграция с GitHub', link: '/5-advanced/14-github' },
          { text: '5.15 Интеграция с GitLab', link: '/5-advanced/15-gitlab' },
          { text: '5.16 Обмен сессиями', link: '/5-advanced/16-share' },
          { text: '5.17 Встроенные инструменты', link: '/5-advanced/17-tools' },
          { text: '5.18 Форматтеры кода', link: '/5-advanced/18-formatters' },
          { text: '5.19 Интеллект LSP', link: '/5-advanced/19-lsp' },
          { text: '5.20 Сжатие контекста', link: '/5-advanced/20-compaction' },
          { text: '5.21 Настройка глубины рассуждений', link: '/5-advanced/21-thinking-depth' },
          { text: '5.22 Отладка и диагностика', link: '/5-advanced/22-debugging' },
          { text: '5.23 Поиск и получение данных из сети', link: '/5-advanced/23-web-search' },
          { text: '5.24 Автоматизация CLI', link: '/5-advanced/24-cli-automation' },
          { text: '5.25 Git Worktree', link: '/5-advanced/25-git-worktree' },
        ],
      },
      {
        text: '📚 Справочник', collapsed: false, items: [
          { text: 'Обзор справочника', link: '/appendix/' },
          { text: 'A. Сочетания клавиш', link: '/appendix/keybinds' },
          { text: 'B. Слэш-команды', link: '/appendix/commands' },
          { text: 'C. Справочник CLI', link: '/appendix/cli' },
          { text: 'D. Параметры конфигурации', link: '/appendix/config-ref' },
          { text: 'E. Провайдеры моделей', link: '/appendix/providers' },
          { text: 'F. Библиотека промптов', link: '/appendix/prompts' },
          { text: 'G. Частые вопросы', link: '/appendix/faq' },
          { text: 'H. Устранение неполадок', link: '/appendix/troubleshoot' },
          { text: 'I. Экосистема', link: '/appendix/ecosystem' },
          { text: 'J. Руководство по миграции', link: '/appendix/migration' },
          { text: 'K. OpenCode Zen', link: '/appendix/zen' },
          { text: 'L. Экспериментальные функции', link: '/appendix/experimental-features' },
        ],
      },
      {
        text: '📝 Журнал обновлений OpenCode', collapsed: true, items: [
          { text: 'Журнал обновлений', link: '/changelog/' },
          ...[
            'v1.18.22', 'v1.18.21', 'v1.18.20', 'v1.18.19', 'v1.18.18', 'v1.18.17', 'v1.18.16', 'v1.18.15', 'v1.18.14', 'v1.18.13', 'v1.18.12', 'v1.18.11', 'v1.18.10', 'v1.18.9', 'v1.18.8', 'v1.18.7', 'v1.18.6', 'v1.18.5', 'v1.18.4', 'v1.18.3', 'v1.18.2', 'v1.18.1', 'v1.18.0',
            'v1.17.20', 'v1.17.19', 'v1.17.18', 'v1.17.17', 'v1.17.16', 'v1.17.15', 'v1.17.14', 'v1.17.13', 'v1.17.12', 'v1.17.11', 'v1.17.10', 'v1.17.9', 'v1.17.8', 'v1.17.7', 'v1.17.6', 'v1.17.5', 'v1.17.4', 'v1.17.3', 'v1.17.2', 'v1.17.1', 'v1.17.0',
            'v1.16.2', 'v1.16.0',
            'v1.15.13', 'v1.15.12', 'v1.15.11', 'v1.15.10', 'v1.15.9', 'v1.15.7', 'v1.15.6', 'v1.15.5', 'v1.15.4', 'v1.15.3', 'v1.15.2', 'v1.15.1', 'v1.15.0',
            'v1.14.51', 'v1.14.50', 'v1.14.49', 'v1.14.48', 'v1.14.47', 'v1.14.46', 'v1.14.45', 'v1.14.44', 'v1.14.43', 'v1.14.42', 'v1.14.41', 'v1.14.40', 'v1.14.39', 'v1.14.38', 'v1.14.37', 'v1.14.35', 'v1.14.34', 'v1.14.33', 'v1.14.32', 'v1.14.31', 'v1.14.30', 'v1.14.29', 'v1.14.28', 'v1.14.27', 'v1.14.26', 'v1.14.25', 'v1.14.24', 'v1.14.23', 'v1.14.22', 'v1.14.21', 'v1.14.20', 'v1.14.19', 'v1.14.18', 'v1.14.17',
            'v1.4.11', 'v1.4.10', 'v1.4.9', 'v1.4.8', 'v1.4.7', 'v1.4.6', 'v1.4.5', 'v1.4.4', 'v1.4.3', 'v1.4.2', 'v1.4.1', 'v1.4.0',
            'v1.3.17', 'v1.3.16', 'v1.3.15', 'v1.3.14', 'v1.3.13', 'v1.3.12', 'v1.3.11', 'v1.3.10', 'v1.3.9', 'v1.3.8', 'v1.3.7', 'v1.3.6', 'v1.3.5', 'v1.3.4', 'v1.3.3', 'v1.3.2', 'v1.3.1', 'v1.3.0',
            'v1.2.27', 'v1.2.26', 'v1.2.25', 'v1.2.24', 'v1.2.23', 'v1.2.22', 'v1.2.21', 'v1.2.20', 'v1.2.19', 'v1.2.18', 'v1.2.17', 'v1.2.16', 'v1.2.15', 'v1.2.14', 'v1.2.13', 'v1.2.12', 'v1.2.11', 'v1.2.10', 'v1.2.9', 'v1.2.8', 'v1.2.7', 'v1.2.6', 'v1.2.5', 'v1.2.4', 'v1.2.3', 'v1.2.2', 'v1.2.1', 'v1.2.0',
            'v1.1.65', 'v1.1.64', 'v1.1.63', 'v1.1.62', 'v1.1.61', 'v1.1.60', 'v1.1.59', 'v1.1.58', 'v1.1.57', 'v1.1.56', 'v1.1.55', 'v1.1.54', 'v1.1.53', 'v1.1.52', 'v1.1.51', 'v1.1.50', 'v1.1.49', 'v1.1.48', 'v1.1.47', 'v1.1.46', 'v1.1.45', 'v1.1.44', 'v1.1.43', 'v1.1.42', 'v1.1.41', 'v1.1.40', 'v1.1.39', 'v1.1.38', 'v1.1.37', 'v1.1.36', 'v1.1.35', 'v1.1.34', 'v1.1.33', 'v1.1.32', 'v1.1.31', 'v1.1.30', 'v1.1.29', 'v1.1.28', 'v1.1.27', 'v1.1.26', 'v1.1.25', 'v1.1.24', 'v1.1.23', 'v1.1.21', 'v1.1.20', 'v1.1.19', 'v1.1.18', 'v1.1.17', 'v1.1.16', 'v1.1.15', 'v1.1.14', 'v1.1.13', 'v1.1.12', 'v1.1.11', 'v1.1.10', 'v1.1.8', 'v1.1.7', 'v1.1.6', 'v1.1.4', 'v1.1.3', 'v1.1.2', 'v1.1.1',
          ].map(version => ({ text: version, link: `/changelog/${version}` })),
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/vbgate/learn-opencode' }],
    footer: {
      message: `Перевод материалов «OpenCode 中文实战课» (github.com/vbgate/learn-opencode) по лицензии <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a> | <a href="/privacy">Политика конфиденциальности</a> | © ${new Date().getFullYear()} LearnOpenCode`,
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Поиск по документации', buttonAriaLabel: 'Поиск по документации' },
              modal: {
                noResultsText: 'Ничего не найдено',
                resetButtonTitle: 'Очистить запрос',
                footer: { selectText: 'Выбрать', navigateText: 'Перейти' },
              },
            },
          },
        },
      },
    },
    docFooter: { prev: 'Назад', next: 'Далее' },
    outline: { label: 'На этой странице', level: [2, 3] },
    lastUpdated: { text: 'Последнее обновление' },
    editLink: {
      pattern: 'https://github.com/vbgate/learn-opencode/edit/main/docs/:path',
      text: 'Редактировать страницу на GitHub',
    },
  },
})
