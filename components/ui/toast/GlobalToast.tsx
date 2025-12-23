'use client'

import React, { useState, useEffect } from 'react'
import ToastContainer from './ToastContainer'
import { toastManager, Toast } from '@/utils/toast'

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
