'use client'

import React, { useEffect, useState } from 'react'

import type { Toast } from '@/types/ui'
import { toastManager } from '@/utils/toast'

import ToastContainer from './ToastContainer'

const GlobalToast: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(newToasts => {
      setToasts(newToasts)
    })
    return unsubscribe
  }, [])

  const removeToast = (id: string) => {
    toastManager.remove(id)
  }

  return <ToastContainer toasts={toasts} onRemove={removeToast} />
}

export default GlobalToast
