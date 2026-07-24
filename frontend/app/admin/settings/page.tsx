'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, User, Lock, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [loading, setLoading] = useState(false)
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [notificationPrefs, setNotificationPrefs] = useState({ quote: true, message: true, appointment: true, invoice: true })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('notification-preferences')
      if (saved) setNotificationPrefs(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  const togglePreference = (key: keyof typeof notificationPrefs) => {
    const next = { ...notificationPrefs, [key]: !notificationPrefs[key] }
    setNotificationPrefs(next)
    localStorage.setItem('notification-preferences', JSON.stringify(next))
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (pwdForm.newPassword.length < 6) { toast.error('Le mot de passe doit faire au moins 6 caractères'); return }
    setLoading(true)
    try {
      await authService.changePassword(pwdForm.currentPassword, pwdForm.newPassword)
      toast.success('Mot de passe modifié')
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Impossible de modifier le mot de passe'
      toast.error(message)
    } finally { setLoading(false) }
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: User },
    { id: 'security' as const, label: 'Sécurité', icon: Lock },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Paramètres</h1></div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Informations du profil</h3>
          <div className="space-y-4">
            {[{ label: 'Nom', value: user?.name ?? '' }, { label: 'Email', value: user?.email ?? '' }].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input defaultValue={value} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button type="button" disabled className="btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed"><Save size={15} /> Enregistrer</button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Changer le mot de passe</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Mot de passe actuel' },
              { key: 'newPassword', label: 'Nouveau mot de passe' },
              { key: 'confirmPassword', label: 'Confirmer le nouveau mot de passe' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input
                  type="password"
                  value={pwdForm[key as keyof typeof pwdForm]}
                  onChange={e => setPwdForm({ ...pwdForm, [key]: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            ))}
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Modification…</> : <><Lock size={15} /> Modifier le mot de passe</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Préférences de notifications</h3>
          <div className="space-y-4">
            {[
              { key: 'quote' as const, label: 'Nouveau devis reçu', desc: 'Notifier par email lors d\'une nouvelle demande' },
              { key: 'message' as const, label: 'Nouveau message', desc: 'Notifier par email lors d\'un nouveau message' },
              { key: 'appointment' as const, label: 'Rendez-vous confirmé', desc: 'Notifier par email lors de la confirmation' },
              { key: 'invoice' as const, label: 'Facture payée', desc: 'Notifier par email lors du paiement d\'une facture' },
            ].map(({ key, label, desc }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button type="button" onClick={() => togglePreference(key)} className={`relative w-10 h-6 rounded-full transition-colors ${notificationPrefs[key] ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notificationPrefs[key] ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
