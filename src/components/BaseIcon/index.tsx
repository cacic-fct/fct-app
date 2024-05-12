import { IconType } from 'react-icons'
import styles from './BaseIcon.module.scss'
import variables from '../../styles/variables.module.scss'
import { ColorsType } from '@/types/colors'

interface Props {
  IconComponent: IconType
  fill: ColorsType
  size?: number
  className?: string
}

export const BaseIcon = ({ IconComponent, fill, size=22, className}: Props) => {
  return (
    <IconComponent
      size={size}
      style={{fill: variables[fill], stroke: variables[fill]}}
      className={styles.icon + " " + className}
    />
  )
}