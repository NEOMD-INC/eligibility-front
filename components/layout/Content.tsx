'use client'

import React from 'react'

import type { ContentProps } from './types/types'

const Content: React.FC<ContentProps> = ({
  children,
  containerType = 'none',
  padding = 'p-6',
  background = 'bg-gray-100',
  isSidebarExpanded = false,
}) => {
  const getContainerClass = (): string => {
    switch (containerType) {
      case 'fixed':
        return 'container mx-auto px-4 max-w-7xl'
      case 'fluid':
        return 'w-full px-4'
      default:
        return 'w-full'
    }
  }

  return (
    <div
      className={`
        flex-1 overflow-x-hidden overflow-y-auto min-h-0
        transition-all duration-500 ease-in-out
        ${isSidebarExpanded ? 'ml-72' : 'ml-0'}
        ${background}
        ${padding}
      `.trim()}
    >
      {containerType !== 'none' ? (
        <div className={getContainerClass()}>{children}</div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
export { Content }

