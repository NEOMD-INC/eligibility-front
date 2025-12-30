'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import React from 'react'

import { themeColors } from '@/theme'

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonClass?: string
  isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm transition-opacity"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: themeColors.border.default }}
            >
              <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: themeColors.gray[400] }}
                onMouseEnter={e => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.color = themeColors.gray[600]
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.color = themeColors.gray[400]
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p style={{ color: themeColors.gray[700] }}>{message}</p>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-end gap-3 p-4 border-t"
              style={{ borderColor: themeColors.border.default }}
            >
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-white border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  color: themeColors.gray[700],
                  borderColor: themeColors.border.default,
                }}
                onMouseEnter={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = themeColors.gray[50]
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = themeColors.white
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: themeColors.red[600] }}
                onMouseEnter={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = themeColors.red[700]
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = themeColors.red[600]
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmationModal
