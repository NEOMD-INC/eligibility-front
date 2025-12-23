interface QuickLinkItem {
  name: string
  path: string
  icon: React.ReactNode
  description?: string
}

export interface QuickLinkCategory {
  title: string
  items: QuickLinkItem[]
}
