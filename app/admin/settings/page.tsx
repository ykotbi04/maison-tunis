import Link from 'next/link'

export default function AdminSettingsPage() {
  return (
    <div className="p-8 text-center space-y-4">
      <p className="text-sm text-muted">Settings page is not yet implemented.</p>
      <Link href="/admin" className="text-sm text-[var(--color-accent)] hover:underline">
        Back to Dashboard
      </Link>
    </div>
  )
}
