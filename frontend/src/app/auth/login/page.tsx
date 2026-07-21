'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
})

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setTokens, user, isAuthenticated } = useAuthStore()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') ?? undefined

  const [form, setForm] = useState({ email: '', password: '' })
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPwd, setShowPwd] = useState(false)
  const [showRegisterPwd, setShowRegisterPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '', company: '', phonePrefix: '+33', phoneNumber: '' })
  const [otpStep, setOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')

  const resetForms = () => {
    setForm({ email: '', password: '' })
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', company: '', phonePrefix: '+33', phoneNumber: '' })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setErrors({ general: 'Trop de tentatives. Réessayez dans quelques secondes.' })
      return
    }
    setErrors({})
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const data = await authService.login({ ...form, email: form.email.trim().toLowerCase() })
      setTokens(data.tokens)
      setUser(data.user)
      resetForms()
      toast.success(`Bienvenue, ${data.user.name || data.user.email} !`)
      router.push(redirect ?? (data.user.role === 'admin' ? '/admin' : '/client'))
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.response?.data?.message || 'Email ou mot de passe incorrect'
      const nextAttempts = loginAttempts + 1
      setLoginAttempts(nextAttempts)
      if (nextAttempts >= 5) {
        const until = Date.now() + 30000
        setLockoutUntil(until)
        setErrors({ general: 'Trop de tentatives. Réessayez dans 30 secondes.' })
      } else {
        setErrors({ general: message })
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation du mot de passe
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrors({ password: 'Les mots de passe ne correspondent pas' })
      return
    }

    setLoading(true)
    try {
      // Ne pas envoyer confirmPassword au serveur
      const { confirmPassword, ...registerData } = registerForm
      const normalizedRegisterData = {
        ...registerData,
        email: registerData.email.trim().toLowerCase(),
        name: registerData.name.trim(),
        company: registerData.company?.trim() || undefined,
      }
      await authService.register({
        ...normalizedRegisterData,
        phonePrefix: registerData.phonePrefix,
        phoneNumber: registerData.phoneNumber?.trim() || undefined,
        company: normalizedRegisterData.company,
      })
      setRegisteredEmail(normalizedRegisterData.email)
      setOtpStep(true)
      toast.success('Code de vérification envoyé par email.')
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Erreur lors de la création du compte'
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedEmail = registeredEmail.trim().toLowerCase()
    const normalizedOtpCode = otpCode.trim()
    if (!normalizedEmail) return setErrors({ general: 'Email manquant' })
    if (!normalizedOtpCode || normalizedOtpCode.length !== 6) return setErrors({ general: 'Code OTP invalide' })
    setLoading(true)
    try {
      const data = await authService.verifyRegister(normalizedEmail, normalizedOtpCode)
      setTokens(data.tokens)
      setUser(data.user)
      resetForms()
      setOtpStep(false)
      setRegisteredEmail('')
      setOtpCode('')
      toast.success('Inscription confirmée — bienvenue !')
      router.push(redirect ?? '/client')
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Code OTP invalide'
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    resetForms()
  }, [])

  useEffect(() => {
    resetForms()
    setErrors({})
    setShowPwd(false)
    setShowRegisterPwd(false)
    setShowConfirmPwd(false)
  }, [mode])

  // Note: La redirection est gérée dans handleLogin et handleRegister après succès
  // Pas besoin de rediriger automatiquement ici car l'utilisateur vient de se connecter/créer un compte

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 left-0 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            <span className="gradient-text">Techno</span>-logia
          </Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {mode === 'login' ? 'Connectez-vous à votre espace' : 'Créez votre compte client'}
          </p>
        </div>

        <div className="card p-8 shadow-xl">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-8">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Créer un compte
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all`}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-24 py-2.5 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <p className="text-right text-sm mt-2"><Link href="/auth/forgot-password" className="text-primary-500">Mot de passe oublié ?</Link></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion…</> : 'Se connecter'}
              </button>
            </form>
          ) : !otpStep ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Entreprise</label>
                  <input
                    type="text"
                    value={registerForm.company}
                    onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                    placeholder="Ma Société"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Téléphone</label>
                <div className="flex gap-2">
                  <select
                    value={registerForm.phonePrefix}
                    onChange={(e) => setRegisterForm({ ...registerForm, phonePrefix: e.target.value })}
                    className="w-36 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                  >
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+261">🇲🇬 +261</option>
                  </select>
                  <input
                    type="tel"
                    value={registerForm.phoneNumber}
                    onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
                    placeholder="6 12 34 56 78"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showRegisterPwd ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pr-24 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPwd(!showRegisterPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={showRegisterPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showRegisterPwd ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirmer le mot de passe *</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pr-24 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={showConfirmPwd ? 'Masquer le mot de passe de confirmation' : 'Afficher le mot de passe de confirmation'}
                  >
                    {showConfirmPwd ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Création…</> : 'Créer mon compte'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
              <p className="text-sm text-gray-600">Un code a été envoyé à <strong>{registeredEmail}</strong>. Entrez-le pour confirmer votre compte.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Code OTP</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Vérification…' : 'Vérifier le code'}</button>
                <button type="button" onClick={async () => {
                  setLoading(true)
                  try {
                    await authService.register({
                      name: registerForm.name.trim(),
                      email: registerForm.email.trim().toLowerCase(),
                      password: registerForm.password,
                      company: registerForm.company.trim() || undefined,
                      phonePrefix: registerForm.phonePrefix,
                      phoneNumber: registerForm.phoneNumber.trim() || undefined,
                    })
                    toast.success('Code renvoyé')
                  } catch (err) {
                    toast.error('Erreur lors du renvoi')
                  } finally { setLoading(false) }
                }} className="btn-outline">Renvoyer</button>
              </div>
              <p className="text-center text-sm"><button type="button" onClick={() => { setOtpStep(false); setRegisteredEmail('') }} className="text-sm text-gray-500">Annuler</button></p>
            </form>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/" className="hover:text-primary-500 transition-colors">← Retour au site</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}