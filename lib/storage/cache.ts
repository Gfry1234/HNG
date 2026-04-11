// Client-side cache service for storing data locally with IndexedDB

const DB_NAME = 'ConverterDB'
const DB_VERSION = 1
const STORE_NAME = 'cache'

export interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
}

class CacheService {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('IndexedDB error:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' })
        }
      }
    })

    return this.initPromise
  }

  async set<T>(key: string, data: T, ttlMinutes: number = 60): Promise<void> {
    await this.init()

    if (!this.db) throw new Error('IndexedDB not initialized')

    const transaction = this.db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    }

    return new Promise((resolve, reject) => {
      const request = store.put(entry)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async get<T>(key: string): Promise<T | null> {
    await this.init()

    if (!this.db) throw new Error('IndexedDB not initialized')

    const transaction = this.db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined

        if (!entry) {
          resolve(null)
          return
        }

        // Check if expired
        if (entry.expiresAt < Date.now()) {
          // Delete expired entry
          const deleteRequest = store.delete(key)
          deleteRequest.onerror = () => reject(deleteRequest.error)
          resolve(null)
          return
        }

        resolve(entry.data)
      }
    })
  }

  async remove(key: string): Promise<void> {
    await this.init()

    if (!this.db) throw new Error('IndexedDB not initialized')

    const transaction = this.db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clear(): Promise<void> {
    await this.init()

    if (!this.db) throw new Error('IndexedDB not initialized')

    const transaction = this.db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const cacheService = new CacheService()
