'use client'

import { Content } from '@/components/layout/Content'
import { Footer } from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { RouteProtection } from '@/components/providers/route-protection/RouteProtection'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteProtection>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <Header />

          <Content>{children}</Content>

          <Footer />
        </div>
      </div>
    </RouteProtection>
  )
}
