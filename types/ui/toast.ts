export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

export interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}
