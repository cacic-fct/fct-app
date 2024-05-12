import React from "react"

import styles from "./Center.module.scss"

interface Props {
  children: React.ReactNode
}

export const Center = ({children}: Props) => {
  return(
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}