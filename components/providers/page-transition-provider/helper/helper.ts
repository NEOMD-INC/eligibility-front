export const pageVariants = {
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

export const pageTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1], // smooth ease-out
}
