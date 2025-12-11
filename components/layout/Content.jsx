// Theme colors - Tailwind classes like bg-gray-100 use theme colors via CSS variables
import { themeColors } from '@/theme';

const Content = ({ 
  children, 
  containerType = 'none', // 'none' | 'fixed' | 'fluid'
  padding = 'p-6',
  background = 'bg-gray-100',
  isSidebarExpanded = false // Add this prop
}) => {

  const getContainerClass = () => {
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
        ${isSidebarExpanded ? 'ml-72' : 'ml-20'} // Dynamic margin based on sidebar state
        ${background}
        ${padding}
      `.trim()}
    >
      {containerType !== 'none' ? (
        <div className={getContainerClass()}>
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export {Content}