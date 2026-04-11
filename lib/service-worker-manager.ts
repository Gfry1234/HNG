// Service Worker registration and management
'use client'

export async function registerServiceWorker(): Promise<ServiceWorkerContainer['controller'] | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[SW] Service Workers not supported in this browser')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    })

    console.log('[SW] Registered successfully:', registration)

    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60000) // Check every minute

    return registration.active || null
  } catch (error) {
    console.error('[SW] Registration failed:', error)
    return null
  }
}

export function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(false)
  }

  return navigator.serviceWorker.getRegistrations().then((registrations) => {
    return Promise.all(registrations.map((reg) => reg.unregister())).then(() => true)
  })
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') {
    return true
  }
  return navigator.onLine
}
