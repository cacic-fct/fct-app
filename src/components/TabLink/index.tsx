import React from "react"
import Link from "next/link"

import { IconType } from 'react-icons'
import { BaseIcon } from "../BaseIcon"

import styles from './TabLink.module.scss'

interface Props {
  icon: IconType
  route: string
  active: boolean
  onClick?: () => void
}

export const TabLink = ({route, icon, active, onClick}: Props) => {
  return (
    <Link onClick={onClick} href={route} className={styles.wrapper}>
      <BaseIcon IconComponent={icon} fill={active ? "primary" : "darkTint"} />
    </Link> 
  )
}