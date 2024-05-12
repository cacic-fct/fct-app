import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Button } from "../Button"
import { Typography } from "../Typography"

import styles from './WeeklyCalendar.module.scss'
import { formatDate, weeks } from "@/utils/date"

interface DayProps {
  selected: boolean
  date: Date
  onClick: (date: Date) => void
  setSelectedDate: Dispatch<SetStateAction<Date>>
  week: string
}

const Day = ({selected, date, setSelectedDate, onClick, week}: DayProps) => {
  return (
    <div className={styles.dayWrapper}>
      <Typography type="body" color="darkTint">{week}</Typography>
      <Button style={{backgroundColor: selected ? '#fc3d39' : 'transparent'}} className={styles.dayButton} variant={selected ? 'default' : 'text'} onClick={() =>{setSelectedDate(date); onClick(date)}}>
        {date.getDate().toString()}
      </Button>
    </div>
  );
}

interface WeeklyCalendarProps {
  onClickDate: (date: Date) => void
  currentDate: Date
  setCurrentDate: Dispatch<SetStateAction<Date>>
}

export const WeeklyCalendar = ({ onClickDate, currentDate, setCurrentDate }: WeeklyCalendarProps) => {
  const [weekDates, setWeekDates] = useState<Date[]>([])

  useEffect(() => {
    const startDate = new Date(currentDate)
    const currentDayOfWeek = currentDate.getDay()
    startDate.setDate(currentDate.getDate() - currentDayOfWeek)

    const newCurrentDates = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      newCurrentDates.push(date)
    }

    setWeekDates(newCurrentDates)
  }, [currentDate])

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.row}>
      </div>
      <div className={styles.daysWrapper}>
        {weekDates.map((date, index) => (
          <Day 
            key={index}
            setSelectedDate={setCurrentDate}
            date={date}
            week={weeks[index]} 
            selected={currentDate.getDate() == date.getDate()} 
            onClick={onClickDate}
          />
        ))}
      </div>
      <Typography type="body" color="darkTint">{formatDate(currentDate)}</Typography>
    </div>
  )
}
