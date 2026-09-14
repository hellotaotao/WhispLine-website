import { describe, expect, it } from 'vitest'
import { getPreviewLayout } from './preview'

describe('explicit layout preview', () => {
  it.each(['', '?utm_source=test', '?preview=unknown', '?preview=STAGE', '?variant=b'])('ignores non-preview queries %s', (query) => {
    expect(getPreviewLayout(query)).toBeNull()
  })
  it.each(['editorial', 'stage'] as const)('selects %s only through the preview parameter', (layout) => {
    expect(getPreviewLayout(`?preview=${layout}`)).toBe(layout)
    expect(getPreviewLayout(`?utm_source=qa&preview=${layout}`)).toBe(layout)
  })
})
