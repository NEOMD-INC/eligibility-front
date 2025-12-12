import Sidebar from '@/components/layout/SideBar'
import Header from '@/components/layout/Header'
import { Content } from '@/components/layout/Content'
import { Footer } from '@/components/layout/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Sidebar /> */}

      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <Header />

        <Content>{children}</Content>

        <Footer />
      </div>
    </div>
  )
}
