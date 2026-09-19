import { describe, expect, it } from 'vitest'
import { releases, milestones, releaseAnchor, releaseHref } from './data'

describe('release evidence and milestone history', () => {
  it('has ordered, unique published versions with explicit gaps', () => {
    expect(releases.length).toBeGreaterThanOrEqual(47)
    expect(new Set(releases.map(record => record.version)).size).toBe(releases.length)
    for (const record of releases) {
      expect(['available', 'missing']).toContain(record.notesStatus)
      if (record.notesStatus === 'available') expect(record.body.trim()).not.toBe('')
    }
    for (let index = 1; index < releases.length; index++) {
      expect(Date.parse(releases[index - 1].publishedAt)).toBeGreaterThanOrEqual(Date.parse(releases[index].publishedAt))
    }
  })
  it('links every milestone claim to a published version and orders refinements after introduction', () => {
    expect(milestones.length).toBeGreaterThanOrEqual(5)
    expect(new Set(milestones.map(item => item.id)).size).toBe(milestones.length)
    for (const milestone of milestones) {
      const first = releases.find(record => record.version === milestone.introducedVersion)
      expect(first?.notesStatus).toBe('available')
      for (const step of milestone.evolution) {
        const record = releases.find(record => record.version === step.version)
        expect(record?.notesStatus).toBe('available')
        expect(Date.parse(record!.publishedAt)).toBeGreaterThan(Date.parse(first!.publishedAt))
      }
    }
  })
  it('does not misdate local transcription or failed-recording recovery to a later refinement', () => {
    expect(milestones.find(item => item.id === 'local-transcription')?.introducedVersion).toBe('v1.4.0')
    expect(milestones.find(item => item.id === 'recording-recovery')?.introducedVersion).toBe('v1.8.0')
  })
  it('uses deterministic anchors including legacy versions', () => {
    expect(releaseAnchor('v1.15.8')).toBe('release-v1-15-8')
    expect(releaseHref('1.0.67')).toBe('/changelog#release-1-0-67')
  })
})
