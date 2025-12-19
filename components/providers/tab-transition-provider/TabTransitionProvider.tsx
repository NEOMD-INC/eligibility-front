import { AnimatePresence, motion } from 'motion/react'

const variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

const transition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
}

export function TabTransition({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={children?.type?.name || 'tab'}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
