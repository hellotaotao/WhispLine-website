export type Locale = 'en' | 'zh'
export type Page = 'home' | 'updates' | 'changelog'
export interface SiteRoute { locale: Locale; page: Page }

export function localizedPath(page: Page, locale: Locale): string {
  const prefix = locale === 'zh' ? '/zh' : ''
  return page === 'home' ? prefix || '/' : `${prefix}/${page}`
}

export function parseRoute(pathname: string): SiteRoute | null {
  const path = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/'
  for (const locale of ['en', 'zh'] as const) {
    for (const page of ['home', 'updates', 'changelog'] as const) {
      if (path === localizedPath(page, locale)) return { locale, page }
    }
  }
  return null
}

export function switchLocaleHref(pathname: string, locale: Locale, search = '', hash = ''): string {
  const page = parseRoute(pathname)?.page ?? 'home'
  return `${localizedPath(page, locale)}${search}${hash}`
}
