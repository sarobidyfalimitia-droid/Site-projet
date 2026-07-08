import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
        <Icon size={28} className="text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
      {action && (
        action.href ? (
          <Link href={action.href} className="btn-primary">{action.label}</Link>
        ) : (
          <button type="button" onClick={() => action.onClick?.()} className="btn-primary">{action.label}</button>
        )
      )}
    </div>
  )
}
