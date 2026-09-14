import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./App.css', import.meta.url), 'utf8')

describe('product presentation and motion', () => {
  it('preserves the whole app window rather than cropping or flattening it', () => {
    const rule = css.match(/\.hero-product img\s*\{([^}]+)\}/)?.[1]
    expect(rule).toContain('height: auto')
    expect(rule).toContain('aspect-ratio: 3 / 2')
    expect(rule).not.toContain('object-fit: cover')
    expect(css).not.toContain('1200 / 480')
  })
  it('uses a proportional decorative asset and no perpetual animation', () => {
    const rule = css.match(/\.hero-waveform\s*\{([^}]+)\}/)?.[1]
    expect(rule).toContain('height: auto')
    expect(css).not.toContain('infinite')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
