import { cn, getStatusColor, getStatusLabel } from '@/lib/utils'

interface Props {
  status: string
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({ status, size = 'sm', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-lg',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
