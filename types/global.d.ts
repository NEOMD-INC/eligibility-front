// Global type declarations

interface KTDrawerInstance {
  show: () => void
  hide: () => void
  getInstance: (element: HTMLElement) => KTDrawerInstance | null
  createInstance: (element: HTMLElement) => KTDrawerInstance
}

interface KTDrawer {
  getInstance: (element: HTMLElement) => KTDrawerInstance | null
  createInstance: (element: HTMLElement) => KTDrawerInstance
}

declare global {
  interface Window {
    KTDrawer?: KTDrawer
  }
}

export {}

