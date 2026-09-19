import { useEffect, useState } from 'react'
import { localizedPath, type Locale, type Page } from './i18n'
import './LanguageSwitcher.css'

export default function LanguageSwitcher({ locale, page }: { locale: Locale; page: Page }) {
  const [suffix, setSuffix] = useState('')
  useEffect(() => {
    const updateSuffix = () => setSuffix(`${window.location.search}${window.location.hash}`)
    updateSuffix()
    window.addEventListener('hashchange', updateSuffix)
    window.addEventListener('popstate', updateSuffix)
    return () => {
      window.removeEventListener('hashchange', updateSuffix)
      window.removeEventListener('popstate', updateSuffix)
    }
  }, [])

  return (
    <nav className="language-switcher" aria-label={locale === 'zh' ? '网站语言' : 'Site language'}>
      <a href={`${localizedPath(page, 'en')}${suffix}`} hrefLang="en" lang="en" aria-current={locale === 'en' ? 'true' : undefined} aria-label={locale === 'zh' ? '切换为英文' : 'English'}>EN</a>
      <a href={`${localizedPath(page, 'zh')}${suffix}`} hrefLang="zh-CN" lang="zh-CN" aria-current={locale === 'zh' ? 'true' : undefined} aria-label={locale === 'zh' ? '简体中文' : 'Switch to Chinese'}>中文</a>
    </nav>
  )
}
