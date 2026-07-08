'use client'

import { motion } from 'framer-motion'
import { FolderKanban, Users, FileText, Receipt, TrendingUp, MessageSquare, Clock, CheckCircle2 } from 'lucide-react'
import { useDashboardStats } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Fév', revenue: 19000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Avr', revenue: 28000 },
  { month: 'Mai', revenue: 22000 },
  { month: 'Jun', revenue: 35000 },
]

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  const statCards = [
    { label: 'Projets', value: stats?.projects ?? 0, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', change: '+3 ce mois' },
    { label: 'Clients', value: stats?.clients ?? 0, icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', change: '+5 ce mois' },
    { label: 'Devis en attente', value: stats?.pendingQuotes ?? 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', change: 'À traiter' },
    { label: 'Revenus', value: formatCurrency(stats?.revenue ?? 0), icon: Receipt, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', change: '+12% ce mois', isString: true },
    { label: 'Messages', value: stats?.unreadMessages ?? 0, icon: MessageSquare, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', change: 'Non lus' },
    { label: 'Taux de conversion', value: '68%', icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20', change: '+5% vs mois dernier', isString: true },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bienvenue dans votre espace d&apos;administration</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
              <span className="text-xs text-gray-400">{card.change}</span>
            </div>
            <div className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /> : card.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Revenus mensuels</h3>
          <p className="text-sm text-gray-500 mb-6">6 derniers mois</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k€`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Activité récente</h3>
          <p className="text-sm text-gray-500 mb-6">Dernières actions</p>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, label: 'Projet "E-commerce Pro" livré', time: 'il y a 2h', color: 'text-green-500' },
              { icon: FileText, label: 'Nouveau devis de Jean Martin', time: 'il y a 4h', color: 'text-blue-500' },
              { icon: MessageSquare, label: '3 nouveaux messages reçus', time: 'il y a 5h', color: 'text-violet-500' },
              { icon: Users, label: 'Client Dupont SA ajouté', time: 'Hier', color: 'text-amber-500' },
              { icon: Receipt, label: 'Facture #F-2024-045 payée', time: 'Hier', color: 'text-green-500' },
              { icon: Clock, label: 'RDV avec startup X confirmé', time: 'Avant-hier', color: 'text-pink-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.label}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
