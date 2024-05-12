import { Metadata } from 'next'
import { AboutPage } from './AboutPage'


export const metadata: Metadata = {
  title: 'Sobre o FCT App',
}

export default function About() {
  return <AboutPage />
}