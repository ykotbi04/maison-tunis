'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthSession } from '@/hooks/useAuthSession'
import { accountApi } from '@/lib/api'

export default function AccountProfilePage() {
  const { user } = useAuthSession()
  const { update: updateSession } = useSession()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg(null)
    setSaveError(null)
    try {
      await accountApi.updateProfile({ name, email })
      await updateSession()
      setSaveMsg('Profile updated successfully')
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to update'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPw(true)
    setPwMsg(null)
    setPwError(null)

    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match')
      setChangingPw(false)
      return
    }

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters')
      setChangingPw(false)
      return
    }

    try {
      await accountApi.changePassword({ currentPassword, newPassword })
      setPwMsg('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to change password'
      setPwError(msg)
    } finally {
      setChangingPw(false)
    }
  }

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="font-serif text-3xl text-foreground tracking-wider">Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your account information</p>
      </div>

      {/* Profile Form */}
      <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
        <h2 className="font-serif text-lg text-foreground tracking-wide">Account Details</h2>

        {saveMsg && (
          <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg p-3">
            <p className="text-sm text-[var(--color-success)]">{saveMsg}</p>
          </div>
        )}
        {saveError && (
          <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg p-3">
            <p className="text-sm text-[var(--color-error)]">{saveError}</p>
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required="true"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
          <div className="flex justify-end">
            <Button variant="primary" size="sm" type="submit" isLoading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
        <h2 className="font-serif text-lg text-foreground tracking-wide">Change Password</h2>

        {pwMsg && (
          <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg p-3">
            <p className="text-sm text-[var(--color-success)]">{pwMsg}</p>
          </div>
        )}
        {pwError && (
          <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg p-3">
            <p className="text-sm text-[var(--color-error)]">{pwError}</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            aria-required="true"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            aria-required="true"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-required="true"
          />
          <div className="flex justify-end">
            <Button variant="primary" size="sm" type="submit" isLoading={changingPw}>
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
