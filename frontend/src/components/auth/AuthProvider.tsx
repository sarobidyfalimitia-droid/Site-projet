'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Toujours vérifier l'authentification au chargement
    // Mais ne pas bloquer les pages publiques comme /auth/login
    if (pathname?.startsWith('/auth')) return
    initializeAuth()
  }, [initializeAuth, pathname])

  // Afficher un loader uniquement sur les pages protégées pendant la vérification
  // Les pages publiques affichent leur contenu normalement
  if (isLoading && !pathname?.startsWith('/auth') && !pathname?.startsWith('/admin') && !pathname?.startsWith('/client')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
