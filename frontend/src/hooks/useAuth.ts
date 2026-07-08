'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'
import type { LoginCredentials, RegisterData } from '@/types'

export function useAuth() {
  const router = useRouter()
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    setUser, 
    setTokens, 
    logout: storeLogout 
  } = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials)
    setTokens(data.tokens)
    setUser(data.user)
    toast.success(`Bienvenue, ${data.user.name || data.user.email} !`)
    router.push(data.user.role === 'admin' ? '/admin' : '/client')
    return data
  }

  const register = async (payload: RegisterData) => {
    const data = await authService.register(payload)
    setTokens(data.tokens)
    setUser(data.user)
    toast.success('Compte créé avec succès !')
    router.push('/client')
    return data
  }

  const logout = async () => {
    await authService.logout()
    storeLogout()
    toast.success('Déconnecté avec succès')
    router.push('/')
  }

  return { user, isAuthenticated, isLoading, login, register, logout }
}
