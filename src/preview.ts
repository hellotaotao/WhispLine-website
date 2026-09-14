export type PreviewLayout = 'editorial' | 'stage'

export function getPreviewLayout(search: string): PreviewLayout | null {
  const preview = new URLSearchParams(search).get('preview')
  return preview === 'editorial' || preview === 'stage' ? preview : null
}
