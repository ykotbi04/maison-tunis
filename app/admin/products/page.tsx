import Link from 'next/link'

export default function ManageProductsPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-6xl text-accent">✦</div>
        <h1 className="font-serif text-4xl text-foreground tracking-wider">Manage Products</h1>
        <p className="text-muted max-w-md mx-auto">
          Product management interface is coming soon. You will be able to edit, archive, and organize your product catalog.
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
