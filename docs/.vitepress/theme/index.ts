// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// Пользовательские компоненты
import PromptCard from './components/PromptCard.vue'
import AsciinemaPlayer from './components/AsciinemaPlayer.vue'
import VideoEmbed from './components/VideoEmbed.vue'
import NotFound from './components/NotFound.vue'
import HeroCarousel from './components/HeroCarousel.vue'
import AdSupport from './components/AdSupport.vue'
import AdInArticle from './components/AdInArticle.vue'
import AiChat from './components/AiChat.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'not-found': () => h(NotFound),
      'home-hero-image': () => h(HeroCarousel),
      'layout-bottom': () => h(AiChat)
    })
  },
  setup() {
    const route = useRoute()

    // Инициализация масштабирования
    const initZoom = () => {
      // Масштабирование изображений основного содержимого
      mediumZoom('.main img', {
        background: 'var(--vp-c-bg)'
      })
    }

    onMounted(() => {
      initZoom()
    })

    // Повторная привязка при переходе по маршрутам SPA
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
  enhanceApp({ app, router, siteData }) {
    // Регистрация глобальных компонентов
    app.component('PromptCard', PromptCard)
    app.component('AsciinemaPlayer', AsciinemaPlayer)
    app.component('VideoEmbed', VideoEmbed)
    app.component('AdSupport', AdSupport)
    app.component('AdInArticle', AdInArticle)
  }
} satisfies Theme
