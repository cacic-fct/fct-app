import React from "react"

import styles from './Card.module.scss'

type VariantType = 'default' | 'warning'

interface Props {
  onClick?: () => void
  style?: React.CSSProperties
  children: React.ReactNode
  className?: string
  variant?: VariantType
}

export const Card = ({onClick, children, style, className, variant='default'}: Props) => {
  return (
    <div 
      style={style} 
      onClick={onClick} 
      className={styles.item + " " + className + " " + (variant == 'warning' ? styles.warningOption : "")}
    >
      {children}
    </div>
  )
}