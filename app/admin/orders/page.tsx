import Link from 'next/link'

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-6xl text-accent">✦</div>
        <h1 className="font-serif text-4xl text-foreground tracking-wider">All Orders</h1>
        <p className="text-muted max-w-md mx-auto">
          Complete order management is coming soon. You will be able to view, filter, and manage all customer orders.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-2 bg-accent text-accent-foreground font-medium text-sm tracking-wide hover:bg-accent-dark transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
