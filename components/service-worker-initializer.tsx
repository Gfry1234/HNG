'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker-manager'

export function ServiceWorkerInitializer() {
  useEffect(() => {
    // Register service worker on client-side only
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker().catch((error) => {
        console.error('Failed to register service worker:', error)
      })
    }
  }, [])

  return null
}
