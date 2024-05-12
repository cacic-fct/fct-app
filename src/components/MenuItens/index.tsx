import Link from "next/link"
import { IconType } from "react-icons"
import { BaseIcon } from "../BaseIcon"
import { Card } from "../Card"
import { Typography } from "../Typography"

import styles from './MenuItens.module.scss'

type ItemType = {
  title: string 
  link: string
  icon: IconType
  intern?: boolean
}

interface Props {
  fullWidth?: boolean
  itens: ItemType[]
}

export const MenuItens = ({itens, fullWidth}: Props) => {
  return(
    <ul style={fullWidth ? {display: 'flex', flexDirection: 'column'} : {}} className={styles.wrapper}>
      {itens.map(item => (
        <li key={item.title}>
          <Link style={{textDecoration: 'none'}} target={!item.intern ? "_blank" : "_self"} href={item.link}>
            <Card>
                <BaseIcon IconComponent={item.icon} fill="darkTint" />
                <Typography type='body'>{item.title}</Typography>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}