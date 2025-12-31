'use client'

import React from 'react'

import type { ToastContainerProps } from '@/types/ui/toast'

import ToastComponent from './Toast'

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 top-15 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
