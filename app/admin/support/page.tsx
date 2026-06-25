import Link from 'next/link'

const features = [
  {
    icon: '🎫',
    title: 'Ticket Management',
    description: 'Centralized inbox for all customer inquiries with priority routing and SLA tracking.',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    description: 'Real-time customer communications with instant response capabilities.',
  },
  {
    icon: '📋',
    title: 'Knowledge Base',
    description: 'Self-service FAQ and guides to reduce support volume and improve resolution times.',
  },
  {
    icon: '📈',
    title: 'Support Analytics',
    description: 'Track response times, satisfaction scores, and team performance metrics.',
  },
]

export default function SupportPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-80 h-80 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[var(--color-accent)]/3 rounded-full blur-3xl" />
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
              Customer Support
            </h1>
            <p className="text-muted max-w-lg mx-auto leading-relaxed">
              Customer support interface is coming soon. Manage inquiries, tickets, and customer
              communications from one premium workspace.
            </p>
          </div>

          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="premium-card p-6 text-left space-y-3 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-2xl">{feature.icon}</div>
                <h3 className="font-serif text-lg font-light text-foreground tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
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
