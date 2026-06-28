import type { Metadata } from 'next'
import ForgotPasswordForm from './ForgotPasswordForm'

export const metadata: Metadata = { title: 'Reset Password — Rare Shades' }

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
