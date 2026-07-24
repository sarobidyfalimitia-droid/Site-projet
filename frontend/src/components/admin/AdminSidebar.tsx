'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FolderKanban, Users, Tag, Star, FileText,
  Receipt, Briefcase, Calendar, Image, MessageSquare, Settings,
  ChevronLeft, ChevronRight, LogOut, BookOpen, UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projets', icon: FolderKanban },
  { href: '/admin/categories', label: 'Catégories', icon: Tag },
  { href: '/admin/team', label: 'Équipe', icon: UserCog },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/quotes', label: 'Devis', icon: FileText },
  { href: '/admin/invoices', label: 'Factures', icon: Receipt },
  { href: '/admin/contracts', label: 'Contrats', icon: Briefcase },
  { href: '/admin/appointments', label: 'Rendez-vous', icon: Calendar },
  { href: '/admin/testimonials', label: 'Témoignages', icon: Star },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/media', label: 'Médias', icon: Image },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    logout()
    router.push('/')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn('h-16 flex items-center border-b border-gray-200 dark:border-gray-800', collapsed ? 'justify-center px-2' : 'px-5 justify-between')}>
        {!collapsed && (
          <Link href="/admin" className="font-display text-base font-bold text-gray-900 dark:text-white">
            <span className="gradient-text">Techno</span>-logia
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={collapsed ? 'Déplier' : 'Replier'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              onClick={() => onMobileClose?.()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && 'Déconnexion'}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 md:hidden flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
