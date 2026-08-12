import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const appCss = readFileSync(new URL('./App.css', import.meta.url), 'utf8')

describe('hero waveform layout', () => {
  it('spans ultra-wide viewports without growing vertically', () => {
    const heroWaveformRule = appCss.match(/\.hero-waveform\s*\{([^}]*)\}/)?.[1]

    expect(heroWaveformRule).toBeDefined()
    expect(heroWaveformRule).toContain('width: 129vw')
    expect(heroWaveformRule).toContain('height: min(86vw, 1307px)')
    expect(heroWaveformRule).not.toContain('1960px')
  })
})
