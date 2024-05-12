"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

import { IoArrowBackOutline } from 'react-icons/io5'

import { Button } from '../Button'
import { Typography } from '../Typography'

import styles from './TopBar.module.scss'

interface Props  {
  title: string
  actions? :React.ReactNode[]
  backButton?: boolean
}

export const TopBar = ({title, actions, backButton}: Props) => {
  const router = useRouter()

  return(
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        {backButton && (
          <Button iconLeft={IoArrowBackOutline} variant="text" onClick={() => {router.back()}} />
        )}
        <Typography color="darkTint" type="subtitle" >
          {title}
        </Typography>
      </div>
      <div className={styles.actions}>
        {actions && actions.map((action, index) => <div key={index}>{action}</div>)}
      </div>
    </div>
  )
}