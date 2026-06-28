import type { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = { title: 'Create Account — Rare Shades' }

export default function SignupPage() {
  return <SignupForm />
}
