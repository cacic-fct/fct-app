import { Metadata } from 'next'
import { SupportPage } from './SupportPage'

export const metadata: Metadata = {
  title: 'Suporte FCT App',
}

export default function Support() {
  return <SupportPage />
}