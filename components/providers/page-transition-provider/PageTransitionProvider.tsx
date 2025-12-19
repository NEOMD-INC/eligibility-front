import { motion } from 'motion/react'

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

export function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
