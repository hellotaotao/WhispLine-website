import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
vi.mock('./data', () => ({
  releases: [
    { version: '1.2.1', publishedAt: '2026-09-19T23:30:00Z', updatedAt: '2026-09-19T23:30:00Z', url: 'https://example.com/v1.2.1', body: '## Fixed\n- Better capture.', notesStatus: 'available' },
    { version: '1.2.0', publishedAt: '2026-09-18T00:00:00Z', updatedAt: '2026-09-18T00:00:00Z', url: 'https://example.com/v1.2.0', body: '', notesStatus: 'missing' },
    { version: '0.1.0', publishedAt: '2025-09-18T00:00:00Z', updatedAt: '2025-09-18T00:00:00Z', url: 'https://example.com/v0.1.0', body: 'Legacy capture.', notesStatus: 'available' },
  ],
  milestones: [{ id: 'capture', title: 'Capture that keeps up', category: 'Dictation', summary: 'A better recording path.', introducedVersion: '1.2.0', details: ['Capture on your device.'], scope: 'macOS', evolution: [{ version: '1.2.1', description: 'Improved recovery.' }] }],
  releaseAnchor: (version: string) => `v${version}`,
  releaseHref: (version: string) => `/changelog#v${version}`,
}))
import UpdatesPage from './UpdatesPage'

describe('UpdatesPage', () => {
  it('renders milestone introductions and later evolution with crawlable source links', () => {
    const html = renderToStaticMarkup(<UpdatesPage page="updates" />)
    expect(html).toContain('<h1 id="updates-title">')
    expect(html).toContain('Capture that keeps up')
    expect(html).toContain('First introduced')
    expect(html).toContain('18 Sep 2026')
    expect(html).toContain('href="/changelog#v1.2.0"')
    expect(html).toContain('Improved recovery.')
    expect(html).toContain('macOS')
    expect(html).toContain('href="/changelog"')
    expect(html).toContain('aria-current="page"')
  })

  it('renders every release body in HTML, grouped by year and minor, with explicit missing and legacy notices', () => {
    const html = renderToStaticMarkup(<UpdatesPage page="changelog" />)
    expect(html).toContain('id="year-2026"')
    expect(html).toContain('1.2 series')
    expect(html).toContain('id="v1.2.1"')
    expect(html).toContain('Better capture.')
    expect(html).toContain('Release notes are unavailable')
    expect(html).toContain('Historical releases')
    expect(html).toContain('href="https://example.com/v1.2.0"')
    expect(html).toContain('19 Sep 2026')
    expect(html).toContain('<details')
    expect(html).toContain('href="#year-2025"')
  })
})
