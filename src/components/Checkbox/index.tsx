import { useState } from "react"

import { BaseIcon } from "../BaseIcon"
import { Typography } from "../Typography"

import { ColorsType } from "@/types/colors"
import { IoCheckbox, IoSquareOutline } from "react-icons/io5"

import styles from './Checkbox.module.scss'

interface Props {
  children: string
  color?: ColorsType
  onCheck?: (checked: boolean) => void
}

export const Checkbox = ({children, color="primary", onCheck}: Props) => {
  const [checked, setChecked] = useState(false)
  
  return(
    <div 
      onClick={() => {
        setChecked(prev => !prev)
        if(onCheck){
          onCheck(!checked)
        }
      }}
      className={styles.wrapper}
    >
      {!checked ? 
        <BaseIcon fill='darkTint' IconComponent={IoSquareOutline} /> :
        <BaseIcon fill={color} IconComponent={IoCheckbox} />
      }
      <Typography type="body">{children}</Typography>
    </div>
  )
}