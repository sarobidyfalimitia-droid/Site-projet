import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

const sizeMap = { sm: 16, md: 24, lg: 40 }

export function LoadingSpinner({ size = 'md', className, fullScreen }: Props) {
  const spinner = (
    <Loader2
      size={sizeMap[size]}
      className={cn('animate-spin text-primary-500', className)}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center py-12">{spinner}</div>
}
