import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { routePatterns } from '@/shared/config'

import { AppLayout } from '../layout/AppLayout'

const page = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(async () => ({ default: (await load())[name] }))

const MapPage = page(() => import('@/pages/map'), 'MapPage')
const RegionPage = page(() => import('@/pages/region'), 'RegionPage')
const FarmPage = page(() => import('@/pages/farm'), 'FarmPage')
const FeedPage = page(() => import('@/pages/feed'), 'FeedPage')
const DiseasesPage = page(() => import('@/pages/diseases'), 'DiseasesPage')
const DiseasePage = page(() => import('@/pages/disease'), 'DiseasePage')
const RouteCheckPage = page(() => import('@/pages/route-check'), 'RouteCheckPage')
const NotFoundPage = page(() => import('@/pages/not-found'), 'NotFoundPage')

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: routePatterns.map, element: <MapPage /> },
      { path: routePatterns.region, element: <RegionPage /> },
      { path: routePatterns.farm, element: <FarmPage /> },
      { path: routePatterns.feed, element: <FeedPage /> },
      { path: routePatterns.diseases, element: <DiseasesPage /> },
      { path: routePatterns.disease, element: <DiseasePage /> },
      { path: routePatterns.routeCheck, element: <RouteCheckPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
