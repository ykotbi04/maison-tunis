import Link from 'next/link'

interface PlaceholderPageProps {
  params: Promise<{ slug: string }>
}

export default async function PlaceholderPage({ params }: PlaceholderPageProps) {
  const { slug } = await params
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="text-6xl text-accent">✦</div>
        <h1 className="font-serif text-4xl text-foreground tracking-wider">{title}</h1>
        <p className="text-muted">
          This page is under construction and will be available soon.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-accent text-accent-foreground font-medium text-sm tracking-wide hover:bg-accent-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
