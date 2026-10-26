import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Container, Skeleton } from '@/shared/ui'
import { DemoNotice } from '@/widgets/demo-notice'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'

import styles from './AppLayout.module.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageFallback() {
  return (
    <Container style={{ paddingTop: 80 }}>
      <Skeleton height={320} radius={24} />
    </Container>
  )
}

export function AppLayout() {
  return (
    <div className={styles.app}>
      <a className={styles.skip} href="#main">
        Перейти к содержанию
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <DemoNotice />
    </div>
  )
}
