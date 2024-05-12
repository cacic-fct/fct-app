"use client"
import { useState } from 'react'
import { IconType } from 'react-icons'
import { IoCalendar, IoMap, IoMenu,  IoPerson, IoSettings } from 'react-icons/io5'
import { TabLink } from '../TabLink'

import styles from './Navbar.module.scss'

type RouteType = {
  path: string
  icon: IconType
}

export const NavBar = () => {
  const [currentPath, setCurrentPath] = useState('')

  const configRoute: RouteType[] = [
    {
      path: '/calendar',
      icon: IoCalendar
    },
    {
      path: '/map',
      icon: IoMap
    },
    {
      path: '/manage',
      icon: IoSettings
    },
    {
      path: '/menu',
      icon: IoMenu
    },
    {
      path: '/profile',
      icon: IoPerson
    },
  ]

  return (
    <nav className={styles.nav}>
      {configRoute.map((config) => (
        <TabLink 
          key={config.path} 
          active={currentPath.includes(config.path)} 
          route={config.path} 
          icon={config.icon} 
          onClick={() => setCurrentPath(config.path)}
        />
      ))}
    </nav>
  )
}
