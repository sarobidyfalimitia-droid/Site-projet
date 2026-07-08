import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { authService } from '@/services/auth.service'
import type { AuthUser, AuthTokens } from '@/types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  initializeAuth: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (isLoading: boolean) => void
  logout: () => void
}

const cookieOptions = {
  sameSite: 'lax' as const,
  expires: 7,
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:' && process.env.NODE_ENV === 'production',
  path: '/',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      initializeAuth: async () => {
        set({ isLoading: true })
        const token = Cookies.get('accessToken')
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        try {
          const response = await authService.me()
          const userData = response as AuthUser
          set({ user: userData, isAuthenticated: true, isLoading: false })
        } catch {
          // Token invalid or expired, clear state
          Cookies.remove('accessToken', { path: '/' })
          Cookies.remove('refreshToken', { path: '/' })
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setTokens: (tokens) => {
        Cookies.set('accessToken', tokens.accessToken, { ...cookieOptions, expires: 7 })
        Cookies.set('refreshToken', tokens.refreshToken, { ...cookieOptions, expires: 30 })
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        Cookies.remove('accessToken', { path: '/' })
        Cookies.remove('refreshToken', { path: '/' })
        set({ user: null, isAuthenticated: false, isLoading: false })
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)