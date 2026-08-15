import { describe, expect, it } from 'vitest'
import {
  detectDownloadPlatform,
  getFallbackDownloadUrl,
  latestReleaseApiUrl,
  resolveLatestDownloadUrl,
  selectReleaseAsset,
} from './downloads'

const releaseAssets = [
  {
    name: 'SayType_1.8.5_universal.dmg.sig',
    browser_download_url: 'https://example.com/macos-signature',
  },
  {
    name: 'SayType_1.8.5_universal.dmg',
    browser_download_url: 'https://example.com/macos',
  },
  {
    name: 'SayType_1.8.5_x64_en-US.msi',
    browser_download_url: 'https://example.com/windows-msi',
  },
  {
    name: 'SayType_1.8.5_x64-setup.exe',
    browser_download_url: 'https://example.com/windows',
  },
  {
    name: 'SayType_1.8.5_amd64.AppImage.sig',
    browser_download_url: 'https://example.com/linux-signature',
  },
  {
    name: 'SayType_1.8.5_amd64.AppImage',
    browser_download_url: 'https://example.com/linux',
  },
]

describe('download platform detection', () => {
  it('detects supported desktop operating systems', () => {
    expect(detectDownloadPlatform('MacIntel', 'Mozilla/5.0 (Macintosh)')).toBe('macos')
    expect(detectDownloadPlatform('Win32', 'Mozilla/5.0 (Windows NT 10.0)')).toBe(
      'windows',
    )
    expect(detectDownloadPlatform('Linux x86_64', 'Mozilla/5.0 (X11; Linux x86_64)')).toBe(
      'linux',
    )
  })

  it('does not send mobile devices a desktop installer', () => {
    expect(detectDownloadPlatform('iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS)')).toBeNull()
    expect(
      detectDownloadPlatform(
        'MacIntel',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Mobile/15E148',
      ),
    ).toBeNull()
    expect(detectDownloadPlatform('Linux armv8l', 'Mozilla/5.0 (Linux; Android 15)')).toBeNull()
  })

  it('does not select an x64 installer for unsupported ARM desktops', () => {
    expect(
      detectDownloadPlatform('Linux aarch64', 'Mozilla/5.0 (X11; Linux aarch64)'),
    ).toBeNull()
    expect(detectDownloadPlatform('Win32', 'Mozilla/5.0 (Windows NT 10.0; ARM64)')).toBeNull()
  })
})

describe('release asset selection', () => {
  it.each([
    ['macos', 'https://example.com/macos'],
    ['windows', 'https://example.com/windows'],
    ['linux', 'https://example.com/linux'],
  ] as const)('selects the preferred %s installer', (platform, expectedUrl) => {
    expect(selectReleaseAsset(platform, releaseAssets)?.browser_download_url).toBe(expectedUrl)
  })

  it('keeps a permanent direct-download fallback for each platform', () => {
    expect(getFallbackDownloadUrl('macos')).toMatch(/\/SayType_1\.8\.5_universal\.dmg$/)
    expect(getFallbackDownloadUrl('windows')).toMatch(/\/SayType_1\.8\.5_x64-setup\.exe$/)
    expect(getFallbackDownloadUrl('linux')).toMatch(/\/SayType_1\.8\.5_amd64\.AppImage$/)
  })

  it('resolves the latest installer from GitHub release metadata', async () => {
    const fetchRelease = async (url: string) => {
      expect(url).toBe(latestReleaseApiUrl)

      return {
        ok: true,
        json: async () => ({ assets: releaseAssets }),
      }
    }

    await expect(resolveLatestDownloadUrl('windows', fetchRelease)).resolves.toBe(
      'https://example.com/windows',
    )
  })

  it('falls back to a direct installer when release metadata is unavailable', async () => {
    const fetchRelease = async () => {
      throw new Error('offline')
    }

    await expect(resolveLatestDownloadUrl('macos', fetchRelease)).resolves.toBe(
      getFallbackDownloadUrl('macos'),
    )
  })
})
