import React, { CSSProperties } from "react"

import styles from "./Center.module.scss"

interface Props {
  children: React.ReactNode
  style?: CSSProperties
}

export const Center = ({children, style}: Props) => {
  return(
    <div style={style} className={styles.wrapper}>
      {children}
    </div>
  )
}