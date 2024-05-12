import React, { CSSProperties } from "react"
import { IconType } from "react-icons"

import { BaseIcon } from "../BaseIcon"
import { Typography } from "../Typography"

import variables from "@/styles/variables.module.scss"
import styles from './Button.module.scss'

type VariantType = "default" | "text" | "outlined"

interface Props {
  children?: string
  iconLeft?: IconType
  iconRight?: IconType
  onClick?: () => void
  disabled?: boolean
  className?: string
  style?: CSSProperties
  variant?: VariantType
}

const getStyle = (variant: VariantType) => {
  switch(variant){
    case "text":
      return {
        backgroundColor: "transparent",
        padding: 0
      }
    case "outlined":
      return {
        backgroundColor: "transparent",
        border: `0.1px solid ${variables.medium}`
      }
      case "default":
      default:
        return {
          backgroundColor: variables.primary,
        }
  }
}

const getFillColor = (variant: VariantType) => {
  switch(variant){
    case "text":
      return "medium"
    case "outlined":
      return "darkTint"
    case "default":
    default:
      return "primaryContrast"
  }
}

export const Button = ({
  children, 
  iconLeft, 
  iconRight, 
  onClick, 
  className,
  style,
  variant="default",
  disabled=false}: Props) => {
    return (
      <button 
        style={{...getStyle(variant), ...style}}
        disabled={disabled} onClick={onClick} className={`${styles.button} ${className}`}
      >
        {iconLeft && <BaseIcon size={18} IconComponent={iconLeft} fill={(getFillColor(variant))} />}
        {children && <Typography type="button" color={(getFillColor(variant))}>{children}</Typography>}
        {iconRight && <BaseIcon size={18} IconComponent={iconRight} fill={(getFillColor(variant))} />}
      </button>
    )
}