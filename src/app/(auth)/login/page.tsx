import { Metadata } from 'next'
import { LoginPage } from './LoginPage'

export const metadata: Metadata = {
  title: 'Login FCT App',
}

export default function Login() {
  return <LoginPage />
}