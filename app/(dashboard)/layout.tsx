import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 px-4 py-6 lg:px-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  )
}
