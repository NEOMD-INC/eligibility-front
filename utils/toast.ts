// Simple toast utility that can be called from anywhere (including axios interceptors)

import type { Toast, ToastType } from '@/types/ui'

export type { Toast, ToastType }

type ToastListener = (toasts: Toast[]) => void

class ToastManager {
  private toasts: Toast[] = []
  private listeners: ToastListener[] = []

  subscribe(listener: ToastListener) {
    this.listeners.push(listener)
    // Return initial state
    listener([...this.toasts])

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  show(message: string, type: ToastType, duration: number = 5000) {
    const id = `toast-${Date.now()}-${Math.random()}`
    const toast: Toast = { id, message, type, duration }

    this.toasts.push(toast)
    this.notify()

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notify()
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration)
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration)
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration)
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration)
  }
}

export const toastManager = new ToastManager()
