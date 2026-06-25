'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  _prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || '/collections'

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' }
        default:
          return { error: 'Something went wrong.' }
      }
    }
    throw error
  }
}
