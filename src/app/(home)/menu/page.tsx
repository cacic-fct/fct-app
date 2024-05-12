import { Metadata } from 'next'
import { MenuPage } from './MenuPage'

export const metadata: Metadata = {
  title: 'Recursos FCT App',
}

export default function Menu() {
  return <MenuPage />
}
