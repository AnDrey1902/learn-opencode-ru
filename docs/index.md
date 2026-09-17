---
layout: home
title: Русский учебник OpenCode
titleTemplate: Практическое руководство по AI-помощнику для программирования
description: "Официальный сайт русского учебника OpenCode. От основ до продвинутых приёмов: пошагово учимся писать код, исправлять ошибки и автоматизировать работу с помощью AI-помощника. Поддерживаются модели GLM, DeepSeek и другие."

hero:
  name: OpenCode
  text: Практический курс на русском
  tagline: Полностью бесплатно · Освойте AI для реальной работы с нуля
  actions:
    - theme: brand
      text: Начать обучение
      link: /1-start/
    - theme: alt
      text: Практика по сценариям
      link: /4-scenarios/
    - theme: alt
      text: Присоединиться к сообществу
      link: /community

features:
  - icon:
      src: /icons/rocket.svg
    title: Быстрый старт за 30 минут
    details: Установите всё в один шаг, настройте сеть и подключите модель — первый диалог за 30 минут
    link: /1-start/
    linkText: Начать установку
  - icon:
      src: /icons/globe.svg
    title: Удобно для пользователей из России и СНГ
    details: Нативная поддержка GLM, DeepSeek, MiniMax и других моделей с прямым подключением
    link: /1-start/04-connect
    linkText: Настроить модели
  - icon:
      src: /icons/heart.svg
    title: Бесплатно и с открытым исходным кодом
    details: Курс и инструменты открыты для всех — учитесь без ограничений и помогайте улучшать проект
    link: https://github.com/vbgate/learn-opencode
    linkText: Репозиторий на GitHub
  - icon:
      src: /icons/code.svg
    title: Разбор на основе исходного кода
    details: "Это не случайный набор советов: каждая функция разобрана по официальному исходному коду OpenCode"
  - icon:
      src: /icons/files.svg
    title: Контекст нескольких файлов
    details: Читайте проект целиком и понимайте связи между файлами — больше не нужно загружать их по одному
    link: /3-workflow/03-init
    linkText: Инициализация проекта
  - icon:
      src: /icons/wrench.svg
    title: Глубокая настройка
    details: Настраивайте Agent, Skill, команды и темы, создавая свой собственный AI-инструмент
    link: /5-advanced/
    linkText: Руководство для продвинутых
---

## Выберите свой путь обучения

<div class="learning-paths">
  <a href="/1-start/" class="path-card">
    <span class="path-icon">🚀</span>
    <h3>Полный новичок</h3>
    <p class="path-duration">Около 3 часов</p>
    <p class="path-desc">Пройдите обязательные этапы 1–3 и освоите основные возможности OpenCode</p>
    <span class="path-cta">Начать обучение →</span>
  </a>
  <a href="/4-scenarios/writer-workflow" class="path-card">
    <span class="path-icon">✍️</span>
    <h3>Автор контента</h3>
    <p class="path-duration">Около 6–7 часов</p>
    <p class="path-desc">Обязательная часть + трек создания контента (A1–A9) для эффективного рабочего процесса</p>
    <span class="path-cta">Начать обучение →</span>
  </a>
  <a href="/4-scenarios/coder-daily" class="path-card">
    <span class="path-icon">💻</span>
    <h3>Разработчик</h3>
    <p class="path-duration">Около 5–6 часов</p>
    <p class="path-desc">Обязательная часть + трек разработки (B1–B5), чтобы повысить эффективность с помощью AI</p>
    <span class="path-cta">Начать обучение →</span>
  </a>
  <a href="/4-scenarios/office-files" class="path-card">
    <span class="path-icon">📊</span>
    <h3>Энтузиаст продуктивности</h3>
    <p class="path-duration">Около 4–5 часов</p>
    <p class="path-desc">Обязательная часть + трек продуктивности (C1–C4), чтобы поручить AI рутинные задачи</p>
    <span class="path-cta">Начать обучение →</span>
  </a>
</div>

## Что вы получите

<div class="stats-grid">
  <div class="stat-item">
    <span class="stat-number">{{ (stats.wordCount / 1000).toFixed(0) }} тыс.</span>
    <span class="stat-label">тыс. слов в учебнике</span>
    <span class="stat-desc">Подробные объяснения и максимум практики</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">{{ stats.notesCount }}</span>
    <span class="stat-label">шпаргалок-скриншотов</span>
    <span class="stat-desc">Главное из каждого урока — на одной картинке</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">18</span>
    <span class="stat-label">практических проектов</span>
    <span class="stat-desc">Практическое задание в каждом уроке</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">20+</span>
    <span class="stat-label">шаблонов промптов</span>
    <span class="stat-desc">Копируйте и сразу применяйте в работе</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">800+</span>
    <span class="stat-label">примеров кода</span>
    <span class="stat-desc">Пошаговое обучение — и вы сразу сможете применять знания</span>
  </div>
</div>

<script setup>
import stats from './data/stats.json'
</script>

## Готовы начать?

<div class="final-cta">
  <p class="cta-highlight">Весь материал полностью бесплатен</p>
  <p class="cta-subtitle">Вам понадобятся только компьютер и 30 минут</p>
  <a href="/1-start/" class="cta-button">Начать обучение сейчас</a>
</div>


