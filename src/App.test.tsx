import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('SayType launch page', () => {
  it('renders the selected voice-to-cursor hero and primary path', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('One shortcut.')
    expect(html).toContain('Every app.')
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
    expect(html).toContain('aria-labelledby="workflow-title"')
    expect(html).toContain('aria-labelledby="privacy-title"')
  })
})
