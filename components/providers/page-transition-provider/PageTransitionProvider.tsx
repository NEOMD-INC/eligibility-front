import { motion } from 'motion/react'
import React from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -12,
  },
}

const pageTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1], // smooth ease-out
}

export interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition as any}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
