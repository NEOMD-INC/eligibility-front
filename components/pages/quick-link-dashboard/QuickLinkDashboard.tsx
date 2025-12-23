'use client'

import { useRouter } from 'next/navigation'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { TitleTransitionButton } from '@/components/providers/title-transition-provider/TittleTransitionProvider'
import { QuickLinkCategory } from './types/type'
import { getCategories } from './components/quick-link-dashboard.config'

export default function QuickLinkDashboard() {
  const router = useRouter()

  const categories: QuickLinkCategory[] = getCategories()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <PageTransition>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Quick access Dashboard</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-8">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded"></div>
                    {category.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <TitleTransitionButton
                        key={itemIndex}
                        onClick={() => handleNavigation(item.path)}
                        className="cursor-pointer group relative p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
                      >
                        <div className="flex flex-col items-start">
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <div className="text-blue-600">{item.icon}</div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-500">{item.description}</p>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </TitleTransitionButton>
                    ))}
                  </div>

                  {categoryIndex < categories.length - 1 && (
                    <div className="mt-8 border-b border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
