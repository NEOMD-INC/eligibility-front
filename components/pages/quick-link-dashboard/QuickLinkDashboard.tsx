'use client'

import { useRouter } from 'next/navigation'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { TitleTransitionButton } from '@/components/providers/title-transition-provider/TittleTransitionProvider'
import { themeColors } from '@/theme'

import { getCategories } from './components/quick-link-dashboard.config'
import { QuickLinkCategory } from './types/type'

export default function QuickLinkDashboard() {
  const router = useRouter()

  const categories: QuickLinkCategory[] = getCategories()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <PageTransition>
      <div className="p-6 min-h-screen" style={{ backgroundColor: themeColors.gray[50] }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
              Dashboard
            </h1>
            <p style={{ color: themeColors.gray[600] }}>Quick access Dashboard</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-8">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2
                    className="text-xl font-semibold mb-4 flex items-center gap-2"
                    style={{ color: themeColors.text.secondary }}
                  >
                    <div
                      className="w-1 h-6 rounded"
                      style={{ backgroundColor: themeColors.blue[600] }}
                    ></div>
                    {category.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <TitleTransitionButton
                        key={itemIndex}
                        onClick={() => handleNavigation(item.path)}
                        className="cursor-pointer group relative p-6 bg-white border-2 rounded-lg hover:shadow-md transition-all duration-200 text-left"
                        style={{ borderColor: themeColors.border.default }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = themeColors.blue[500]
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = themeColors.border.default
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <div
                            className="mb-4 p-3 rounded-lg transition-colors"
                            style={{ backgroundColor: themeColors.blue[100] }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.backgroundColor = themeColors.blue[200])
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.backgroundColor = themeColors.blue[100])
                            }
                          >
                            <div style={{ color: themeColors.blue[600] }}>{item.icon}</div>
                          </div>
                          <h3
                            className="text-lg font-semibold mb-1 transition-colors"
                            style={{ color: themeColors.text.primary }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.color = themeColors.blue[600])
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.color = themeColors.text.primary)
                            }
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm" style={{ color: themeColors.text.muted }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-5 h-5"
                            style={{ color: themeColors.blue[600] }}
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
                    <div
                      className="mt-8 border-b"
                      style={{ borderColor: themeColors.border.default }}
                    ></div>
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
