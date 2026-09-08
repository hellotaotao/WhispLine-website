import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('SayType launch page', () => {
  it('renders the selected voice-to-cursor hero and primary path', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('Your voice.')
    expect(html).toContain('Your Mac.')
    expect(html).toContain('100% local transcription. No account. No subscription.')
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

  it('keeps navigation and download actions accessible', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('aria-label="Primary navigation"')
    expect(html).toContain('aria-label="Download SayType for Mac"')
    expect(html).toContain(
      'href="https://github.com/hellotaotao/saytype/releases/download/v1.8.5/SayType_1.8.5_universal.dmg"',
    )
    expect(html).toContain('aria-labelledby="workflow-title"')
    expect(html).toContain('aria-labelledby="privacy-title"')
  })

  it('explains recovery and practical desktop controls', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain(
      'If an app blocks insertion, your transcript stays in History for easy copying.',
    )
    expect(html).toContain('Choose your microphone')
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
    expect(html).toContain('Works offline')
    expect(html).toContain('No subscription or word limits')
    expect(html).toContain('Transcribe first. Edit on your terms.')
    expect(html).not.toContain('Available transcription engines')
  })

  it('states local transcription requirements before download', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('macOS primary')
    expect(html).toContain('Apple Silicon for local transcription')
    expect(html).toContain('~1 GB model download')
    expect(html).toContain('Microphone and Accessibility permissions required')
  })
})
