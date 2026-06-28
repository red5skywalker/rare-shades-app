import type { Metadata } from 'next'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = { title: 'New Password — Rare Shades' }

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
