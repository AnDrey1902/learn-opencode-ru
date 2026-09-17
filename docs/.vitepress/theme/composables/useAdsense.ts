const ALLOWED_HOSTS = new Set(['learnopencode.com', 'www.learnopencode.com'])
const MOUNT_DEBOUNCE_MS = 300
const PUSH_COOLDOWN_MS = 1000

let pendingElements = new Set<HTMLElement>()
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let cooldownTimer: ReturnType<typeof setTimeout> | null = null
let lastPushAt = 0
let isFlushing = false

type FlushStats = {
  queued: number
  pushed: number
  failed: number
  skippedDetached: number
  skippedInitialized: number
  cooldownRemaining: number
}

const isDev = () => import.meta.env.DEV

const logEnqueue = () => {
  if (!isDev()) return

  console.log('[AdScheduler:enqueue]', {
    queued: pendingElements.size,
    at: Date.now(),
  })
}

const logFlush = (stats: FlushStats) => {
  if (!isDev()) return

  console.log('[AdScheduler:flush]', {
    ...stats,
    at: Date.now(),
  })
}

const logPushFailure = (element: HTMLElement, error: unknown) => {
  const slot = element.getAttribute('data-ad-slot')
  const client = element.getAttribute('data-ad-client')
  const host = typeof window === 'undefined' ? 'unknown' : window.location.hostname

  console.error('AdSense push failed', {
    slot,
    client,
    host,
    error,
  })
}

const isElementInitialized = (element: HTMLElement) => {
  return Boolean(
    element.getAttribute('data-adsbygoogle-status') ||
      element.getAttribute('data-ad-status'),
  )
}

const clearDebounceTimer = () => {
  if (!debounceTimer) return
  clearTimeout(debounceTimer)
  debounceTimer = null
}

const clearCooldownTimer = () => {
  if (!cooldownTimer) return
  clearTimeout(cooldownTimer)
  cooldownTimer = null
}

const flushPending = () => {
  if (isFlushing) {
    return
  }

  const now = Date.now()
  const cooldownRemaining = Math.max(0, PUSH_COOLDOWN_MS - (now - lastPushAt))

  if (cooldownRemaining > 0) {
    clearCooldownTimer()
    cooldownTimer = setTimeout(() => {
      cooldownTimer = null
      flushPending()
    }, cooldownRemaining)

    logFlush({
      queued: pendingElements.size,
      pushed: 0,
      failed: 0,
      skippedDetached: 0,
      skippedInitialized: 0,
      cooldownRemaining,
    })
    return
  }

  isFlushing = true
  clearCooldownTimer()

  let pushed = 0
  let failed = 0
  let skippedDetached = 0
  let skippedInitialized = 0
  const queued = pendingElements.size

  try {
    const globalWindow = window as Window & { adsbygoogle?: unknown[] }
    const queue = globalWindow.adsbygoogle || []
    if (!globalWindow.adsbygoogle) {
      globalWindow.adsbygoogle = queue
    }

    for (const element of pendingElements) {
      pendingElements.delete(element)

      if (!document.contains(element)) {
        skippedDetached += 1
        continue
      }

      if (isElementInitialized(element)) {
        skippedInitialized += 1
        continue
      }

      try {
        queue.push({})
        pushed += 1
      } catch (error) {
        failed += 1
        logPushFailure(element, error)
      }
    }

    if (pushed > 0) {
      lastPushAt = Date.now()
    }

    logFlush({
      queued,
      pushed,
      failed,
      skippedDetached,
      skippedInitialized,
      cooldownRemaining: 0,
    })
  } finally {
    isFlushing = false
  }
}

export const isAdHostAllowed = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return ALLOWED_HOSTS.has(window.location.hostname)
}

export const scheduleAdPush = (element: HTMLElement) => {
  if (!isAdHostAllowed()) {
    return
  }

  pendingElements.add(element)
  logEnqueue()

  clearDebounceTimer()
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    flushPending()
  }, MOUNT_DEBOUNCE_MS)
}

export const cancelAdPush = (element: HTMLElement) => {
  pendingElements.delete(element)

  if (pendingElements.size > 0) {
    return
  }

  clearDebounceTimer()
  clearCooldownTimer()
}
