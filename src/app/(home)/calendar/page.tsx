import { Metadata } from 'next'
import { CalendarPage } from './CalendarPage'


export const metadata: Metadata = {
  title: 'Calendário de eventos da FCT',
}

export default function Calendar() {
  return <CalendarPage />
}
