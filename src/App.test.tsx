import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('SayType launch page', () => {
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

    expect(html).toContain('src="./saytype-icon.png"')
    expect(html).toContain('src="./saytype-waveform.png"')
    expect(html).toContain('src="./saytype-settings.png"')
  })

  it('uses the whole normally proportioned Settings window in the hero', () => {
    const html = renderToStaticMarkup(<App />)
    const hero = html.match(/<section class="hero-section"[\s\S]*?<\/section>/)?.[0] ?? ''
    expect(hero).toContain('src="./saytype-settings.png"')
    expect(hero).toContain('width="1152" height="768"')
    expect(hero).not.toContain('saytype-home.png')
    expect(hero).not.toContain('loading="lazy"')
  })

  it('shows real App Settings before capabilities with a full-size link', () => {
    const html = renderToStaticMarkup(<App />)
    const product = html.match(/<section class="product-section"[\s\S]*?<\/section>/)?.[0] ?? ''
    const screenshotPosition = product.indexOf('src="./saytype-app-settings.png"')
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
    expect(html).toContain('src="./saytype-stage-wave.webp"')
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
