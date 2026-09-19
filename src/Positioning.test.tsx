import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('local-first marketing hierarchy', () => {
  for (const locale of ['en', 'zh'] as const) {
    for (const preview of [null, 'stage'] as const) {
      it(`leads with local value before instructions: ${locale}/${preview}`, () => {
        const html = renderToStaticMarkup(<App locale={locale} preview={preview} />)
        const hero = html.match(/<section class="hero-section"[\s\S]*?<\/section>/)![0]
        const heading = hero.match(/<h1[\s\S]*?<\/h1>/)![0]
        for (const text of locale === 'zh' ? ['本地转写。', '无需账号。', '无需订阅。'] : ['Local transcription.', 'No account.', 'No subscription.']) expect(heading).toContain(text)
        expect(hero).not.toContain('Ctrl+Shift')
        expect(html.indexOf('id="privacy"')).toBeLessThan(html.indexOf('id="workflow"'))
        expect(html.indexOf('id="workflow"')).toBeLessThan(html.indexOf('id="product"'))
        const benefits = html.match(/<section class="privacy-section"[\s\S]*?<\/section>/)![0]
        expect(benefits).not.toContain('Shift+Alt')
        const download = html.match(/<section class="download-section"[\s\S]*?<\/section>/)![0]
        expect(download.indexOf('download-requirements')).toBeLessThan(download.indexOf('class="download-button"'))
      })
    }
  }
})

describe('local and cloud copy boundaries', () => {
  for (const locale of ['en', 'zh'] as const) {
    it(`explains optional cloud transcription without expanding details: ${locale}`, () => {
      const html = renderToStaticMarkup(<App locale={locale} preview={null} />)
      const hero = html.match(/<section class="hero-section"[\s\S]*?<\/section>/)![0]
      const benefits = html.match(/<section class="privacy-section"[\s\S]*?<\/section>/)![0]
      for (const section of [hero, benefits]) {
        expect(section).toContain(locale === 'zh' ? '自己的 API key' : 'your own API key')
        expect(section.toLowerCase()).toContain(locale === 'zh' ? '云端' : 'cloud')
        expect(section).not.toContain('<details')
      }
      expect(benefits).toContain(locale === 'zh' ? '本地转写，无需注册。' : 'Local transcription. No signup.')
    })
  }
})


describe('concise hero copy', () => {
  for (const locale of ['en', 'zh'] as const) {
    it(`uses one short supporting sentence in ${locale}`, () => {
      const html = renderToStaticMarkup(<App locale={locale} preview={null} />)
      const description = html.match(/<p class="hero-description">([^<]+)<\/p>/)![1]
      expect(description).toBe(locale === 'zh' ? '下载模型，即可离线转写。' : 'Download a model. Transcribe offline.')
    })
  }
})
