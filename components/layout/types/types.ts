import { LucideIcon } from 'lucide-react'

// content
export interface ContentProps {
  children: React.ReactNode
  containerType?: 'none' | 'fixed' | 'fluid'
  padding?: string
  background?: string
  isSidebarExpanded?: boolean
}

// footer

export interface FooterConfig {
  display?: boolean
  containerClass?: string
  fixed?: {
    desktop?: boolean
    mobile?: boolean
  }
}

export interface FooterProps {
  config?: {
    app?: {
      footer?: FooterConfig
    }
  }
}

// side bar
export interface MenuItemBase {
  name: string
  icon: LucideIcon
}

export interface LinkMenuItem extends MenuItemBase {
  type: 'link'
  path: string
}

export interface NestedSubMenuItem {
  name: string
  path: string
}

export interface NestedSubItem {
  type: 'nested'
  name: string
  nestedItems?: NestedSubMenuItem[]
}

export interface RegularSubItem {
  type?: 'link'
  name: string
  path: string
}

export type SubMenuItem = NestedSubItem | RegularSubItem

export interface MenuMenuItem extends MenuItemBase {
  type: 'menu'
  subItems: SubMenuItem[]
}

export interface SubheadingMenuItem {
  type: 'subheading'
  name: string
}

export type MenuItem = LinkMenuItem | MenuMenuItem | SubheadingMenuItem

export interface OpenMenus {
  [key: string]: boolean
}

export interface OpenNestedMenus {
  [key: string]: boolean
}
