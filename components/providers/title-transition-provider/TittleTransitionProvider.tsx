import { motion } from 'motion/react'
import React from 'react'

interface TitleTransitionButtonProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  hoverScale?: number
  tapScale?: number
}

export function TitleTransitionButton({
  onClick,
  children,
  className = '',
  hoverScale = 1.05,
  tapScale = 0.98,
}: TitleTransitionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={onClick}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}
