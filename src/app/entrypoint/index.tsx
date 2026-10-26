import '../styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from '../routes/router'
import { ErrorBoundary } from './ErrorBoundary'
import { QueryProvider } from './QueryProvider'

const root = document.getElementById('root')
if (!root) throw new Error('Не найден контейнер #root')

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
)
