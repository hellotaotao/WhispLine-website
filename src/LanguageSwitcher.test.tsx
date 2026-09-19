import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import LanguageSwitcher from './LanguageSwitcher'

describe('global language switch', () => {
  it('renders ordinary alternate-language links before JavaScript runs', () => {
    const html = renderToStaticMarkup(<LanguageSwitcher locale="en" page="changelog" />)
    expect(html).toContain('href="/zh/changelog"')
    expect(html).toContain('hrefLang="zh-CN"')
    expect(html).toContain('href="/changelog"')
    expect(html).toContain('中文')
    expect(html).toContain('EN')
  })
  it('localizes accessible text and marks the selected language', () => {
    const html = renderToStaticMarkup(<LanguageSwitcher locale="zh" page="home" />)
    expect(html).toContain('aria-label="网站语言"')
    expect(html).toMatch(/href="\/zh"[^>]*aria-current="true"/)
    expect(html).toContain('href="/"')
  })
})
