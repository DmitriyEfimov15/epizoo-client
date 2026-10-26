import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { routes, SERVICE_NAME } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Button, Container, Drawer, Icon } from '@/shared/ui'

import styles from './Header.module.css'

const NAV = [
  { to: routes.map(), label: 'Карта', end: true },
  { to: routes.farm(), label: 'Моё хозяйство' },
  { to: routes.feed(), label: 'Лента событий' },
  { to: routes.routeCheck(), label: 'Перевозка' },
  { to: routes.diseases(), label: 'Болезни' },
]

function NavLinks() {
  return NAV.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) => cn(styles.link, isActive && styles.active)}
    >
      {item.label}
    </NavLink>
  ))
}

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [path, setPath] = useState(location.pathname)
  // Закрываем меню при переходе на другую страницу.
  if (path !== location.pathname) {
    setPath(location.pathname)
    setOpen(false)
  }

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link to={routes.map()} className={styles.logo} aria-label={`${SERVICE_NAME} — на главную`}>
          <span className={styles.mark}>
            <Icon name="shield" size={24} />
          </span>
          <span className={styles.wordmark}>
            <span>{SERVICE_NAME}</span>
            <small>болезни животных по регионам</small>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Разделы сервиса">
          <NavLinks />
        </nav>
        <Button
          className={styles.burger}
          variant="ghost"
          iconOnly
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Icon name="list" />
        </Button>
      </Container>
      <Drawer open={open} title="Меню" onClose={() => setOpen(false)}>
        <nav className={styles.mobileNav} aria-label="Разделы сервиса">
          <NavLinks />
        </nav>
      </Drawer>
    </header>
  )
}
