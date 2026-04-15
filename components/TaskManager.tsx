'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface TaskItem {
  id: string
  text: string
  completed: boolean
  time?: string // HH:mm format
  notified?: boolean
}

const STORAGE_KEY = 'smart-utility-tasks'
const NOTIFICATION_SOUNDS = [
  { name: 'Bell', id: 'bell', freq: 800 },
  { name: 'Chime', id: 'chime', freq: 1000 },
  { name: 'Alert', id: 'alert', freq: 600 },
]

function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TaskItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveTasks(tasks: TaskItem[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function playNotificationSound(soundId: string = 'bell') {
  // Use Web Audio API to create a simple sound
  if (typeof window === 'undefined') return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Set frequency based on sound type
    const frequencies: Record<string, number> = {
      bell: 800,
      chime: 1000,
      alert: 600,
    }

    oscillator.frequency.value = frequencies[soundId] || 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (err) {
    console.error('Failed to play notification sound:', err)
  }
}

function showNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined') return

  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('Notifications not supported')
    return
  }

  // Request permission if not granted
  if (Notification.permission === 'granted') {
    new Notification(title, options)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options)
      }
    })
  }
}

export function TaskManager() {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [draft, setDraft] = useState('')
  const [draftTime, setDraftTime] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedSound, setSelectedSound] = useState('bell')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTasks(loadTasks())
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // Check for due tasks every minute
  useEffect(() => {
    const checkDueTasks = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      tasks.forEach((task) => {
        if (task.time && !task.completed && !task.notified && task.time === currentTime) {
          // Trigger notification
          playNotificationSound(selectedSound)
          showNotification('Task Reminder', {
            body: task.text,
            icon: '📝',
            tag: task.id,
          })

          // Mark as notified
          setTasks((current) =>
            current.map((t) => (t.id === task.id ? { ...t, notified: true } : t))
          )
        }
      })
    }

    const timer = setInterval(checkDueTasks, 60000) // Check every minute
    checkDueTasks() // Check immediately on mount

    return () => clearInterval(timer)
  }, [tasks, selectedSound])

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  )

  const tasksWithTime = useMemo(
    () => tasks.filter((task) => task.time).length,
    [tasks],
  )

  const handleSaveTask = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    if (editingId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? { ...task, text: trimmed, time: draftTime || undefined }
            : task,
        ),
      )
      setEditingId(null)
    } else {
      setTasks((current) => [
        { id: generateId(), text: trimmed, completed: false, time: draftTime || undefined },
        ...current,
      ])
    }

    setDraft('')
    setDraftTime('')
  }

  const handleToggleCompleted = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const handleEditTask = (id: string) => {
    const task = tasks.find((task) => task.id === id)
    if (!task) return

    setDraft(task.text)
    setDraftTime(task.time || '')
    setEditingId(id)
  }

  const handleDeleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setDraft('')
      setDraftTime('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setDraft('')
    setDraftTime('')
  }

  const handleTestNotification = () => {
    playNotificationSound(selectedSound)
    showNotification('Test Notification', {
      body: 'This is a test notification from your task manager',
      icon: '📝',
    })
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
      </div>

      <div className="relative px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="glass-button-secondary flex h-10 w-10 items-center justify-center p-0 text-lg"
            >
              ←
            </Link>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Productivity</p>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            </div>
          </div>

          <div className="glass-card p-6 space-y-5">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Your checklist</h2>
              <p className="text-xs text-muted-foreground">Create tasks with time-based reminders and notifications.</p>
            </div>

            {/* Sound selector */}
            {mounted && (
              <div className="glass-card p-3 space-y-2 border-white/20">
                <label className="text-xs font-medium text-muted-foreground">Notification Sound</label>
                <div className="flex gap-2 items-center flex-col sm:flex-row">
                  <select
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(e.target.value)}
                    className="glass-input text-sm flex-1 w-full sm:w-auto"
                  >
                    {NOTIFICATION_SOUNDS.map((sound) => (
                      <option key={sound.id} value={sound.id}>
                        {sound.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleTestNotification}
                    className="glass-button-secondary rounded-lg px-3 py-2 text-xs w-full sm:w-auto"
                  >
                    Test 🔔
                  </button>
                </div>
              </div>
            )}

            {/* Task input */}
            <div className="space-y-3">
              <label className="sr-only" htmlFor="task-input">
                Task description
              </label>
              <input
                id="task-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add a new task"
                className="glass-input w-full"
              />
              {mounted && (
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                  <label className="sr-only" htmlFor="task-time">
                    Task time
                  </label>
                  <input
                    id="task-time"
                    type="time"
                    value={draftTime}
                    onChange={(event) => setDraftTime(event.target.value)}
                    className="glass-input text-sm w-full sm:w-auto"
                    placeholder="HH:mm"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    {editingId ? (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="glass-button-secondary rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none"
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleSaveTask}
                      className="glass-button rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none whitespace-nowrap"
                    >
                      {editingId ? 'Update' : 'Add'} Task
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Task stats */}
            {tasks.length > 0 && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{tasks.length} task{tasks.length === 1 ? '' : 's'}</span>
                <span>{completedCount} complete</span>
                {tasksWithTime > 0 && <span>⏰ {tasksWithTime} with reminders</span>}
              </div>
            )}

            {/* Task list */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-xs text-muted-foreground">
                  No tasks yet. Start by adding one above.
                </div>
              ) : (
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="glass-card flex items-center gap-3 p-4"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCompleted(task.id)}
                        className="h-5 w-5 rounded-full border-2 border-white/30 bg-white/5 flex-shrink-0 flex items-center justify-center transition hover:border-white/50"
                        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {task.completed ? '✓' : ''}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-6 break-words ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                        >
                          {task.text}
                        </p>
                        {task.time && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ⏰ {task.time}
                            {task.notified && ' (notified)'}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditTask(task.id)}
                          className="glass-button-secondary rounded-lg px-2 py-1 text-xs hover:bg-white/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded-lg border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs text-destructive hover:border-destructive/50 hover:bg-destructive/20"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
