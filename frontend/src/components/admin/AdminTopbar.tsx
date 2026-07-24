'use client'

import { Bell, Moon, Sun, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/lib/utils'

interface AdminTopbarProps {
  onMenuClick?: () => void
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Search */}
      <div className="relative hidden md:block w-72">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Rechercher…"
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name || user?.email || 'A')}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 mt-0.5">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  )
}
