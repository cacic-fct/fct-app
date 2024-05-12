"use client"
import { useMemo, useState } from "react"
import Lottie from 'react-lottie'

import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Checkbox"
import { MenuPopover } from "@/components/MenuPopover"
import { TopBar } from "@/components/TopBar"
import { Typography } from "@/components/Typography"
import { Center } from "@/components/Center"
import { WeeklyCalendar } from "@/components/WeeklyCalendar"

import { 
  IoCalendarOutline, 
  IoChevronBackOutline, 
  IoChevronForwardOutline, 
  IoFilter, 
  IoTodayOutline 
} from "react-icons/io5"

import * as animationData from '../../../../public/assets/lotties/emptyBox.json'
import { weekTimestamp } from "@/utils/date"

import variables from "@/styles/variables.module.scss"
import { Metadata } from 'next/types'

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

export const metadata: Metadata = {
  title: 'Calendário de eventos da FCT',
}

export default function Calendar() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const actions = useMemo(() => {
    let response = [
      <MenuPopover 
        menuIcon={IoFilter}
        itens={[
          <Checkbox>Ciência da computação</Checkbox>, 
          <Checkbox>Para todos os cursos</Checkbox>, 
          <Checkbox>Movimento estudantil</Checkbox>, 
        ]} 
      />
    ]

    if(showCalendar) {
      response = [...response,
        <Button
          iconLeft={IoCalendarOutline} 
          onClick={() => setShowCalendar(prev => !prev)}
        />, 
        <Button 
          variant="text" 
          iconLeft={IoChevronBackOutline} 
          onClick={() => setCurrentDate(prev => new Date(prev.getTime() + weekTimestamp))} 
        />,
        <Button 
          variant="text"
          iconLeft={IoTodayOutline} 
          onClick={() => setCurrentDate(new Date())}
        />,
        <Button 
          variant="text" 
          iconLeft={IoChevronForwardOutline} 
          onClick={() => setCurrentDate(prev => new Date(prev.getTime() + weekTimestamp))} 
        />
      ]
    }
    else {
      response.push(
        <Button
        style={{backgroundColor: variables.lightShade}} 
        iconLeft={IoCalendarOutline} 
        onClick={() => setShowCalendar(prev => !prev)}
      />)
    }

    return response
  }, [showCalendar])

  return (
    <>
      <TopBar title="Calendário" actions={actions} />
      { showCalendar && (
        <WeeklyCalendar 
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate} 
          onClickDate={(date) => console.log(date)} 
        />
      )}
      <Center>
        <Lottie 
          options={defaultOptions}
          height={250}
          width={250}
        />
        <Typography type="body" color="medium">Nenhum evento encontrado</Typography>
      </Center>
    </>
  )
}
