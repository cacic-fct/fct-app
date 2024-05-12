"use client"
import React, { useState } from "react"

import { IconType } from "react-icons"
import {  IoChevronDownOutline } from "react-icons/io5"

import { BaseIcon } from "../BaseIcon"
import { Card } from "../Card"
import { Typography } from "../Typography"

import styles from './Panel.module.scss'

interface Props {
  children: React.ReactNode
  title: string
  icon: IconType
}

export const Panel = ({children, title, icon}: Props) => {
  const [opened, setOpened] = useState(false)

  return (
      <div className={styles.wrapper}>
        <Card onClick={() => setOpened(prev => !prev)} style={opened ? {borderRadius: '8px 8px 0 0'} : {}}>
          <BaseIcon IconComponent={icon} fill="darkTint" />
          <div style={{flex: 1}}>
            <Typography type="body">{title}</Typography>
          </div>
          <BaseIcon size={18} IconComponent={IoChevronDownOutline} fill="darkTint" className={opened ? styles.close : styles.open} />
        </Card>
        {opened && (
          <div className={styles.childWrapper}>
            {children}
          </div>
        )}
      </div>
  )
}