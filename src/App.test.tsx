import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('SayType launch page', () => {
  it('links to product updates from the header and mobile-visible footer', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html.match(/href="\/updates"/g)).toHaveLength(2)
    expect(html.match(/<footer[\s\S]*?<\/footer>/)?.[0]).toContain('href="/updates"')
  })

  it('renders the selected voice-to-cursor hero and primary path', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('Your voice.')
    expect(html).toContain('Right where')
    expect(html).toContain('you work.')
    expect(html).toContain('Local transcription. No account. No subscription.')
    expect(html).toContain('Hold Ctrl+Shift, speak, release.')
    expect(html).toContain('Download for Mac')
    expect(html).toContain('href="#workflow"')
  })

  it('uses the real brand, product, and waveform assets', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('src="/saytype-icon.png"')
    expect(html).toContain('src="/saytype-waveform.png"')
    expect(html).toContain('src="/saytype-settings.png"')
  })

  it('uses the whole normally proportioned Settings window in the hero', () => {
    const html = renderToStaticMarkup(<App />)
    const hero = html.match(/<section class="hero-section"[\s\S]*?<\/section>/)?.[0] ?? ''
    expect(hero).toContain('src="/saytype-settings.png"')
    expect(hero).toContain('width="1152" height="768"')
    expect(hero).not.toContain('saytype-home.png')
    expect(hero).not.toContain('loading="lazy"')
  })

  it('shows real App Settings before capabilities with a full-size link', () => {
    const html = renderToStaticMarkup(<App />)
    const product = html.match(/<section class="product-section"[\s\S]*?<\/section>/)?.[0] ?? ''
    const screenshotPosition = product.indexOf('src="/saytype-app-settings.png"')
    expect(screenshotPosition).toBeGreaterThan(-1)
    expect(product.indexOf('class="capability-list"')).toBeGreaterThan(screenshotPosition)
    expect(product).toContain('width="1152" height="768"')
    expect(product).toContain('App Settings')
    expect(product).toContain('View full size')
  })

  it('defaults to editorial without preview controls or experiment state', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('data-layout="editorial"')
    expect(html).not.toContain('Layout preview')
  })

  it('renders the centered alternative only when explicitly requested', () => {
    const html = renderToStaticMarkup(<App preview="stage" />)
    expect(html).toContain('data-layout="stage"')
    expect(html).toContain('Speak freely.')
    expect(html).toContain('src="/saytype-stage-wave.webp"')
    expect(html).toContain('Keep your words close.')
    expect(html).toContain('Layout preview')
    expect(html).toContain('href="?preview=editorial#top"')
    expect(html).toContain('href="?preview=stage#top"')
    expect(html).toContain('aria-current="page"')
  })

  it('keeps navigation and download actions accessible', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('aria-label="Primary navigation"')
    expect(html).toContain('aria-label="Download SayType for Mac"')
    expect(html).toContain(
      'href="https://github.com/hellotaotao/saytype/releases/latest"',
    )
    expect(html).toContain('aria-labelledby="workflow-title"')
    expect(html).toContain('aria-labelledby="privacy-title"')
  })

  it('explains recovery and practical desktop controls', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain(
      'Copy saved transcripts from History. If transcription fails and audio was saved, retry it with your current engine.',
    )
    expect(html).toContain('Uses your system’s default microphone')
    expect(html).toContain('Press Escape to cancel')
    expect(html).toContain('Runs quietly from the menu bar')
  })

  it('makes the cloud privacy boundary explicit', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain(
      'Optional cloud transcription and translation send audio to Groq or OpenAI using your own API key. Provider charges may apply.',
    )
  })

  it('leads with local ownership rather than cloud engine selection', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('Your words stay on your Mac.')
    expect(html).toContain('In local mode')
    expect(html).toContain('Works offline')
    expect(html).toContain('No subscription or word limits')
    expect(html).toContain('Transcribe first. Edit on your terms.')
    expect(html).not.toContain('Available transcription engines')
  })

  it('explains translation, experimental models and updates', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('Shift+Alt')
    expect(html).toContain('English')
    expect(html).toContain('Nemotron')
    expect(html).toContain('experimental')
    expect(html).toContain('Restart when you’re ready.')
    expect(html).not.toContain('Local by default')
  })

  it('states local transcription requirements before download', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('macOS primary')
    expect(html).toContain('Apple Silicon recommended for local dictation')
    expect(html).toContain('~1 GB download for Qwen3-ASR 0.6B')
    expect(html).toContain('Microphone and Accessibility permissions required')
  })
})


describe('localized launch page', () => {
  afterEach(() => { vi.unstubAllGlobals() })

  it('translates every section and navigation into Chinese', () => {
    const html = renderToStaticMarkup(<App locale="zh" preview={null} />)
    for (const text of ['跳到正文', '按住，说话，松开。', '随时待命，不打扰工作。', '你的话，留在你的 Mac。', '用声音输入，无需云端。', '产品更新', '本地转写无需账号或 API key', 'Windows 和 Linux 版本仍处于实验阶段', '查看原图']) {
      expect(html).toContain(text)
    }
    expect(html).toContain('href="/zh/updates"')
    expect(html).toContain('href="#workflow"')
    expect(html).toContain('aria-label="主要导航"')
    expect(html).toContain('aria-label="下载 Mac 版 SayType"')
    expect(html).toContain('音频发送给 Groq 或 OpenAI')
    expect(html).toContain('Qwen3-ASR 1.7B 和 Nemotron 实时转写属于实验性选项')
    expect(html).not.toContain('Your voice.')
    expect(html).not.toMatch(/(?:src|href)="\.\//)
  })

  it('localizes preview controls without changing the real screenshots', () => {
    const html = renderToStaticMarkup(<App locale="zh" preview="stage" />)
    expect(html).toContain('布局预览')
    expect(html).toContain('退出预览')
    expect(html).toContain('src="/saytype-settings.png"')
  })

  it('keeps the initial download markup deterministic across visitor platforms', () => {
    const baseline = renderToStaticMarkup(<App preview={null} />)
    for (const platform of ['Win32', 'Linux x86_64']) {
      vi.stubGlobal('navigator', { platform, userAgent: platform })
      expect(renderToStaticMarkup(<App preview={null} />)).toBe(baseline)
    }
  })
})
