import { Metadata } from 'next'
import { PrivacyPage } from './PrivacyPage'


export const metadata: Metadata = {
  title: 'Políticas de privacidade do FCT App',
}

export default function Privacy() {
  return <PrivacyPage />
}