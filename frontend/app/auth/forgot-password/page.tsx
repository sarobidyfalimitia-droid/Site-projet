'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authService.forgotPassword(email.trim().toLowerCase())
            setSent(true)
            toast.success('Si ce compte existe, un code a été envoyé.')
            // optionally redirect user to reset page with email prefilled
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Erreur lors de l\'envoi')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-2">Réinitialiser le mot de passe</h2>
                    <p className="text-sm text-gray-500 mb-4">Entrez votre adresse email pour recevoir un code de réinitialisation.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800"
                        />
                        <button type="submit" className="w-full btn-primary" disabled={loading}>{loading ? 'Envoi…' : 'Envoyer le code'}</button>
                    </form>
                    {sent && <p className="text-sm text-green-600 mt-3">Code envoyé — vérifiez votre boîte mail.</p>}
                </div>
            </div>
        </div>
    )
}
