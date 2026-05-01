import { describe, expect, it } from 'vitest'
import { productMessaging } from './productMessaging'

const serializedMessaging = JSON.stringify(productMessaging).toLowerCase()

describe('productMessaging', () => {
  it('names SayType consistently and describes the current desktop reality', () => {
    expect(productMessaging.productName).toBe('SayType')
    expect(productMessaging.currentReality).toContain('Tauri')
    expect(productMessaging.currentReality).toContain('Electron legacy support')
    expect(productMessaging.currentReality).toContain('API key')
  })

  it('covers the intended target users', () => {
    expect(productMessaging.targetUsers.map((user) => user.id)).toEqual(
      expect.arrayContaining([
        'developers',
        'writers',
        'bilingual-workers',
        'support-ops',
        'desktop-power-users',
      ]),
    )
  })

  it('captures real pain points and maps each one to a concrete feature value', () => {
    expect(productMessaging.painPoints.map((point) => point.id)).toEqual(
      expect.arrayContaining([
        'native-dictation',
        'fragmented-voice',
        'slow-typing',
        'browser-tools',
      ]),
    )

    for (const painPoint of productMessaging.painPoints) {
      const mapping = productMessaging.valueMappings.find(
        (entry) => entry.painPointId === painPoint.id,
      )
      expect(mapping, `Missing value mapping for ${painPoint.id}`).toBeDefined()
      expect(
        productMessaging.features.some((feature) => feature.id === mapping?.featureId),
      ).toBe(true)
    }
  })

  it('documents the end-to-end hotkey dictation workflow', () => {
    expect(productMessaging.hero.proofPoints).toEqual(
      expect.arrayContaining([
        'Hold Ctrl+Shift to record',
        'Release to transcribe',
        'Escape cancels recording or transcription',
      ]),
    )

    expect(serializedMessaging).toContain('active app')
    expect(serializedMessaging).toContain('cursor')
    expect(serializedMessaging).toContain('waveform')
    expect(serializedMessaging).toContain('clipboard fallback')
  })

  it('keeps provider and model details aligned with the app settings', () => {
    const groq = productMessaging.providers.find((provider) => provider.name === 'Groq')
    const openai = productMessaging.providers.find((provider) => provider.name === 'OpenAI')

    expect(groq?.models).toEqual(['whisper-large-v3', 'whisper-large-v3-turbo'])
    expect(openai?.models).toEqual([
      'whisper-1',
      'gpt-4o-transcribe',
      'gpt-4o-mini-transcribe',
    ])
  })

  it('is explicit about platforms, permissions, and fallback behavior', () => {
    expect(productMessaging.platforms.map((platform) => platform.name)).toEqual([
      'macOS',
      'Windows',
      'Linux',
    ])
    expect(serializedMessaging).toContain('microphone')
    expect(serializedMessaging).toContain('accessibility')
    expect(serializedMessaging).toContain('cgevent')
    expect(serializedMessaging).toContain('clipboard')
    expect(serializedMessaging).toContain('api key')
  })
})
