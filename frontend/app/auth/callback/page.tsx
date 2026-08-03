'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setTokens } = useAuthStore()

  useEffect(() => {
    const token = searchParams?.get('token')
    const refresh = searchParams?.get('refresh')
    const error = searchParams?.get('error')

    if (error) {
      toast.error('Connexion Google échouée')
      router.push('/auth/login')
      return
    }

    if (token && refresh) {
      // Décoder le token pour récupérer les infos utilisateur
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({
          id: payload.id,
          email: payload.email,
          name: payload.name || payload.email, // Use name if available, otherwise email
          role: payload.role,
        })
        setTokens({ accessToken: token, refreshToken: refresh })
        toast.success('Connexion réussie avec Google')
        router.push(payload.role === 'admin' ? '/admin' : '/client')
      } catch (err) {
        toast.error('Erreur lors de la connexion')
        router.push('/auth/login')
      }
    } else {
      router.push('/auth/login')
    }
  }, [searchParams, router, setUser, setTokens])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Connexion en cours...</p>
      </div>
    </div>
  )
}