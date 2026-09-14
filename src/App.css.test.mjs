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
  it('separates screenshot parallax from entrance transforms and staggers title lines', () => {
    expect(css).toMatch(/\.hero-product\s*\{[^}]*translate: 0 var\(--product-scroll/)
    expect(css).toContain('animation-delay: 70ms')
    expect(css).toContain('animation-delay: 140ms')
    expect(css).toContain('--hero-enter-distance: 0px')
  })

})
