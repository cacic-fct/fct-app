interface Event {
  initDate: Date
  finishDate: Date
  title: string
  id: string
}

interface BigEvent {
  initDate: Date
  finishDate: Date
  events: Event[]
  id: string
}

export type { Event, BigEvent }