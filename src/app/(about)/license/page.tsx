import { Metadata } from 'next'
import { LicensePage } from './LicensePage'

export const metadata: Metadata = {
  title: 'Licenças FCT App',
}

export default function License(){
  return <LicensePage />
}