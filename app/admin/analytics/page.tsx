import Link from 'next/link'

const metrics = [
  {
    icon: '📈',
    title: 'Sales Trends',
    description: 'Track revenue patterns, seasonal fluctuations, and growth trajectories over time.',
  },
  {
    icon: '👥',
    title: 'Customer Insights',
    description: 'Understand your audience with demographics, purchase behavior, and lifetime value data.',
  },
  {
    icon: '⚡',
    title: 'Performance Metrics',
    description: 'Monitor conversion rates, cart abandonment, and page engagement in real-time.',
  },
  {
    icon: '🎯',
    title: 'Campaign Tracking',
    description: 'Measure marketing effectiveness across channels with attribution and ROI analysis.',
  },
]

export default function AnalyticsPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[var(--color-accent)]/3 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, var(--color-foreground) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-3xl w-full text-center space-y-12">
          {/* Accent line */}
          <div className="flex justify-center">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
          </div>

          {/* Icon */}
          <div className="text-6xl">✦</div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-light text-foreground tracking-wider">
              Analytics
            </h1>
            <p className="text-muted max-w-lg mx-auto leading-relaxed">
              Analytics dashboard is coming soon. Gain deep visibility into sales trends, customer
              insights, and performance metrics to drive informed decisions.
            </p>
          </div>

          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {metrics.map((metric) => (
              <div
                key={metric.title}
                className="premium-card p-6 text-left space-y-3 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-2xl">{metric.icon}</div>
                <h3 className="font-serif text-lg font-light text-foreground tracking-wide">
                  {metric.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Back link */}
          <div className="pt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-[var(--color-accent-foreground)] font-medium text-sm tracking-wide rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
