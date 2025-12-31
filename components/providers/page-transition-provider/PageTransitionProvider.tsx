import { motion } from 'motion/react'
import React from 'react'

import { pageTransition, pageVariants } from './helper/helper'
import { PageTransitionProps } from './types/types'

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
