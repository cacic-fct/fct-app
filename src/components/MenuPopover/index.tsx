"use client"
import { ColorsType } from "@/models/colors"
import { useEffect, useRef, useState } from "react"
import { IconType } from "react-icons"
import { Button } from "../Button"
import variables from "@/styles/variables.module.scss"

import styles from "./MenuPopover.module.scss"
import { Typography } from "../Typography"
import { IoCloseOutline } from "react-icons/io5"

interface Props {
  itens: React.ReactNode[]
  color?: ColorsType
  menuIcon: IconType
}

export const MenuPopover = ({itens, menuIcon, color="darkTint"}: Props) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu: any = menuRef.current
      const target = event.target
      
      if (menu && !menu.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div ref={menuRef} className={styles.menu}>
      <Button style={!open ? {backgroundColor: variables.lightShade}: {}} iconLeft={menuIcon} onClick={() => setOpen(prev => !prev)}></Button>
      <div  className={`${styles.menuItens} ${open ? styles.open : styles.close}`}>
        <div className={styles.filterHeader}>
          <Typography type="subtitle">Filtros</Typography>
          <Button iconLeft={IoCloseOutline} onClick={() => setOpen(false)} variant="text"/>
        </div>

        <ul>
          {itens.map((item, index) => (
            <li key={index} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}