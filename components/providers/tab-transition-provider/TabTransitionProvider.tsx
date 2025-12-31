import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

import { transition, variants } from './helper/helper'
import { TabTransitionProps } from './types/types'

export function TabTransition({ children }: TabTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={children?.type?.name || 'tab'}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition as any}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
