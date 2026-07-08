'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Calendar, Bell, FileText, Receipt, Briefcase, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

const navItems = [
  { href: '/client', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/client/projects', label: 'Mes projets', icon: FolderKanban },
  { href: '/client/quotes', label: 'Mes devis', icon: FileText },
  { href: '/client/invoices', label: 'Mes factures', icon: Receipt },
  { href: '/client/contracts', label: 'Mes contrats', icon: Briefcase },
  { href: '/client/appointments', label: 'Rendez-vous', icon: Calendar },
  { href: '/client/notifications', label: 'Notifications', icon: Bell },
]

export default function ClientSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    logout()
    router.push('/')
  }

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="h-16 flex items-center px-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="font-display text-base font-bold text-gray-900 dark:text-white">
          <span className="gradient-text">Techno</span>-logia
        </Link>
      </div>
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 mb-1">Espace client</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || user?.email}</p>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/client' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white')}>
              <Icon size={17} className="shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <LogOut size={17} className="shrink-0" /> Déconnexion
        </button>
      </div>
    </aside>
  )
}
