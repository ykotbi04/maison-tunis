import Link from 'next/link'

const sections = [
  {
    icon: '🎨',
    title: 'Brand Identity',
    description: 'Configure logos, color palettes, and typography across all customer touchpoints.',
  },
  {
    icon: '🔒',
    title: 'Security & Access',
    description: 'Manage user roles, permissions, and authentication policies for your team.',
  },
  {
    icon: '📧',
    title: 'Notifications',
    description: 'Customize email templates, order confirmations, and marketing automations.',
  },
  {
    icon: '🌍',
    title: 'Regional Settings',
    description: 'Set currencies, languages, tax rules, and shipping zones for global operations.',
  },
]

export default function AdminSettingsPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--color-accent)]/3 rounded-full blur-3xl" />
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
              Settings
            </h1>
            <p className="text-muted max-w-lg mx-auto leading-relaxed">
              Store configuration is coming soon. Manage brand identity, security policies, and
              regional preferences from one centralized hub.
            </p>
          </div>

          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {sections.map((section) => (
              <div
                key={section.title}
                className="premium-card p-6 text-left space-y-3 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-2xl">{section.icon}</div>
                <h3 className="font-serif text-lg font-light text-foreground tracking-wide">
                  {section.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{section.description}</p>
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
