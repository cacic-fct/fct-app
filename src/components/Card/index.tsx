import React from "react"

import styles from './Card.module.scss'

interface Props {
  onClick?: () => void
  style?: React.CSSProperties
  children: React.ReactNode
  className?: string
}

export const Card = ({onClick, children, style, className}: Props) => {
  return (
    <div style={style} onClick={onClick} className={styles.item + " " + className}>
      {children}
    </div>
  )
}