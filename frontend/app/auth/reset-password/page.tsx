'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const emailFromQuery = searchParams?.get('email') ?? ''

    const [email, setEmail] = useState(emailFromQuery)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (emailFromQuery) setEmail(emailFromQuery)
    }, [emailFromQuery])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirm) return toast.error('Les mots de passe ne correspondent pas')
        setLoading(true)
        try {
            await authService.resetPassword(email.trim().toLowerCase(), code.trim(), newPassword)
            toast.success('Mot de passe réinitialisé. Vous pouvez vous connecter.')
            router.push('/auth/login')
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Erreur lors de la réinitialisation')
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-2">Réinitialiser le mot de passe</h2>
                    <p className="text-sm text-gray-500 mb-4">Entrez le code reçu par email et choisissez un nouveau mot de passe.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Code reçu par email"
                            required
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Confirmer le mot de passe"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800"
                        />
                        <button type="submit" className="w-full btn-primary" disabled={loading}>{loading ? 'En cours…' : 'Réinitialiser le mot de passe'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
