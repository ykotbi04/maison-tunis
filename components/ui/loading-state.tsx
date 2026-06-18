// Loading State Components

import { ProductCardSkeleton, CartItemSkeleton, OrderSummarySkeleton } from './skeleton'

export interface LoadingStateProps {
  loading: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  errorMessage?: string
  children: React.ReactNode
  skeleton?: React.ReactNode
}

export function LoadingState({
  loading,
  error,
  empty,
  emptyMessage = 'No items found',
  errorMessage = 'Something went wrong',
  children,
  skeleton,
}: LoadingStateProps) {
  if (loading) {
    return <>{skeleton || <DefaultSkeleton />}</>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error text-lg mb-4">{errorMessage}</p>
        <p className="text-muted text-sm">{error}</p>
      </div>
    )
  }

  if (empty) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 bg-background-secondary animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-background-secondary animate-pulse rounded-lg" />
            <div className="h-6 w-3/4 bg-background-secondary animate-pulse rounded" />
            <div className="h-5 w-1/2 bg-background-secondary animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export { ProductCardSkeleton, CartItemSkeleton, OrderSummarySkeleton }
