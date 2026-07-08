'use client'

import { useState } from 'react'
import { X, Loader2, Plus, Minus } from 'lucide-react'
import { useCreateInvoice, useClients } from '@/hooks'
import type { InvoiceItem } from '@/types'

interface Props { onClose: () => void }

export default function InvoiceFormModal({ onClose }: Props) {
  const createInvoice = useCreateInvoice()
  const { data: clientsData } = useClients()
  const clients = clientsData?.data ?? []

  const [form, setForm] = useState({
    clientId: 0,
    dueDate: '',
    status: 'DRAFT' as const,
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[],
  })

  const updateItem = (i: number, key: keyof InvoiceItem, value: string | number) => {
    const items = [...form.items]
    items[i] = { ...items[i], [key]: value }
    if (key === 'quantity' || key === 'unitPrice') {
      items[i].total = Number(items[i].quantity) * Number(items[i].unitPrice)
    }
    setForm({ ...form, items })
  }

  const total = form.items.reduce((s, i) => s + i.total, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createInvoice.mutateAsync({ ...form, amount: total })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Nouvelle facture</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none">
                <option value={0}>Sélectionner…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date d&apos;échéance</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none" required />
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lignes de facturation</label>
            <div className="space-y-2">
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Description" className="col-span-5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:outline-none" />
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} min={1} placeholder="Qté" className="col-span-2 px-2 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:outline-none text-center" />
                  <input type="number" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))} min={0} placeholder="P.U." className="col-span-3 px-2 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:outline-none" />
                  <span className="col-span-1 flex items-center text-xs text-gray-600 dark:text-gray-400 font-medium">{item.total}€</span>
                  <button type="button" onClick={() => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })} className="col-span-1 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Minus size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }] })} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600">
                <Plus size={14} /> Ajouter une ligne
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-primary-500">{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Annuler</button>
            <button type="submit" disabled={createInvoice.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {createInvoice.isPending ? <><Loader2 size={15} className="animate-spin" /> Création…</> : 'Créer la facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
