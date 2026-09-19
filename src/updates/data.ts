import releaseRecords from '../content/releases.json'
import milestoneRecords from '../content/milestones.json'

export interface Release {
  version: string
  publishedAt: string
  updatedAt: string
  url: string
  body: string
  notesStatus: 'available' | 'missing'
}

export interface Milestone {
  id: string
  title: string
  summary: string
  category: string
  introducedVersion: string
  details: string[]
  scope: string
  evolution: { version: string; description: string }[]
}

export const releases: Release[] = releaseRecords.map(record => ({
  ...record,
  notesStatus: record.notesStatus === 'available' ? 'available' : 'missing',
}))

export const milestones: Milestone[] = [...milestoneRecords].sort((a, b) => {
  const published = (version: string) => Date.parse(releases.find(record => record.version === version)!.publishedAt)
  return published(b.introducedVersion) - published(a.introducedVersion)
})

export function releaseAnchor(version: string): string {
  return `release-${version.replace(/\./g, '-')}`
}

export function releaseHref(version: string): string {
  return `/changelog#${releaseAnchor(version)}`
}
