---
title: Присоединиться к сообществу
description: "Присоединяйтесь к сообществу OpenCode на русском: общайтесь о программировании с AI, следите за обновлениями учебника и получайте полезные материалы."
---

# Присоединиться к сообществу

<div class="community-hero">
  <p class="community-tagline">Работайте с AI вместе с единомышленниками</p>
</div>

## Как присоединиться

<div class="qrcode-section">
  <div class="qrcode-card">
    <h3><a href="https://t.me/" target="_blank" rel="noopener noreferrer">Telegram</a></h3>
    <!-- TODO: ссылка владельца -->
    <p class="qrcode-hint">Присоединяйтесь к каналу или чату сообщества</p>
  </div>
  <div class="qrcode-card">
    <h3><a href="https://github.com/vbgate/learn-opencode/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a></h3>
    <p class="qrcode-hint">Задавайте вопросы и предлагайте улучшения в Issues</p>
  </div>
</div>

## Что вас ждёт в сообществе

<div class="benefits-grid">
  <div class="benefit-item">
    <span class="benefit-icon">💬</span>
    <h3>Ответы на вопросы</h3>
    <p>Задавайте вопросы — участники и автор помогут разобраться</p>
  </div>
  <div class="benefit-item">
    <span class="benefit-icon">📢</span>
    <h3>Новости без задержек</h3>
    <p>Узнавайте первыми о новых курсах, функциях и версиях</p>
  </div>
  <div class="benefit-item">
    <span class="benefit-icon">🎁</span>
    <h3>Полезные материалы</h3>
    <p>Шаблоны промптов, файлы конфигурации и примеры Agent для участников</p>
  </div>
  <div class="benefit-item">
    <span class="benefit-icon">🤝</span>
    <h3>Общение с единомышленниками</h3>
    <p>Авторы, разработчики и энтузиасты продуктивности найдут здесь своё окружение</p>
  </div>
</div>

## Правила сообщества

<div class="rules-section">

1. **Общайтесь уважительно**: уважайте каждого участника; личные оскорбления запрещены
2. **Соблюдайте тему**: обсуждайте OpenCode, программирование с AI и инструменты продуктивности
3. **Без рекламы**: не публикуйте рекламу и рекламные материалы без разрешения
4. **Формулируйте конкретные вопросы**: сначала изучите учебник, затем приходите с описанием проблемы
5. **Берегите приватность**: не публикуйте личные данные других людей

</div>

<style>
.community-hero {
  text-align: center;
  padding: 2rem 0 1rem;
}

.community-tagline {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.qrcode-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .qrcode-section {
    grid-template-columns: 1fr;
    max-width: 320px;
  }
}

.qrcode-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 320px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.qrcode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.qrcode-image {
  width: 240px;
  height: auto;
  border-radius: 8px;
}

.qrcode-hint {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
}

@media (max-width: 640px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}

.benefit-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.benefit-item:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}

.benefit-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.benefit-item h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.benefit-item p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.rules-section {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin: 1.5rem 0;
}

.rules-section ol {
  margin: 0;
  padding-left: 1.25rem;
}

.rules-section li {
  margin: 0.75rem 0;
  line-height: 1.6;
}

.rules-section strong {
  color: var(--vp-c-brand-1);
}
</style>
