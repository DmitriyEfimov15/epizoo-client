export const routes = {
  map: () => '/',
  region: (code: string) => `/region/${code}`,
  farm: () => '/farm',
  feed: () => '/feed',
  diseases: () => '/diseases',
  disease: (slug: string) => `/diseases/${slug}`,
  routeCheck: () => '/route-check',
} as const

export const routePatterns = {
  map: '/',
  region: '/region/:code',
  farm: '/farm',
  feed: '/feed',
  diseases: '/diseases',
  disease: '/diseases/:slug',
  routeCheck: '/route-check',
} as const
