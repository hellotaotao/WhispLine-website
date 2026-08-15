export type DownloadPlatform = 'macos' | 'windows' | 'linux'

export interface ReleaseAsset {
  name: string
  browser_download_url: string
}

interface ReleaseResponse {
  ok: boolean
  json: () => Promise<unknown>
}

type FetchRelease = (url: string) => Promise<ReleaseResponse>

export const latestReleaseApiUrl =
  'https://api.github.com/repos/hellotaotao/saytype/releases/latest'
export const releasePageUrl = 'https://github.com/hellotaotao/saytype/releases/latest'

const releaseBaseUrl = 'https://github.com/hellotaotao/saytype/releases/download/v1.8.5'

const fallbackDownloadUrls: Record<DownloadPlatform, string> = {
  macos: `${releaseBaseUrl}/SayType_1.8.5_universal.dmg`,
  windows: `${releaseBaseUrl}/SayType_1.8.5_x64-setup.exe`,
  linux: `${releaseBaseUrl}/SayType_1.8.5_amd64.AppImage`,
}

const assetMatchers: Record<DownloadPlatform, RegExp[]> = {
  macos: [/universal\.dmg$/i, /\.dmg$/i],
  windows: [/x64-setup\.exe$/i, /\.exe$/i, /\.msi$/i],
  linux: [/amd64\.AppImage$/i, /\.AppImage$/i, /amd64\.deb$/i, /\.deb$/i],
}

export function detectDownloadPlatform(
  platform: string,
  userAgent: string,
): DownloadPlatform | null {
  const normalizedPlatform = platform.toLowerCase()
  const normalizedUserAgent = userAgent.toLowerCase()

  if (/iphone|ipad|ipod|android|mobile/.test(`${normalizedPlatform} ${normalizedUserAgent}`)) {
    return null
  }

  if (normalizedPlatform.includes('mac') || normalizedUserAgent.includes('macintosh')) {
    return 'macos'
  }

  if (/arm64|aarch64|armv\d/.test(`${normalizedPlatform} ${normalizedUserAgent}`)) {
    return null
  }

  if (normalizedPlatform.includes('win') || normalizedUserAgent.includes('windows')) {
    return 'windows'
  }

  if (normalizedPlatform.includes('linux') || normalizedUserAgent.includes('linux')) {
    return 'linux'
  }

  return null
}

export function selectReleaseAsset(
  platform: DownloadPlatform,
  assets: ReleaseAsset[],
): ReleaseAsset | undefined {
  for (const matcher of assetMatchers[platform]) {
    const asset = assets.find(
      (candidate) => !candidate.name.endsWith('.sig') && matcher.test(candidate.name),
    )

    if (asset) {
      return asset
    }
  }

  return undefined
}

export function getFallbackDownloadUrl(platform: DownloadPlatform): string {
  return fallbackDownloadUrls[platform]
}

function isReleaseAsset(value: unknown): value is ReleaseAsset {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const asset = value as Record<string, unknown>
  return typeof asset.name === 'string' && typeof asset.browser_download_url === 'string'
}

export async function resolveLatestDownloadUrl(
  platform: DownloadPlatform,
  fetchRelease: FetchRelease = (url) => fetch(url),
): Promise<string> {
  const fallbackUrl = getFallbackDownloadUrl(platform)

  try {
    const response = await fetchRelease(latestReleaseApiUrl)

    if (!response.ok) {
      return fallbackUrl
    }

    const release = await response.json()
    if (typeof release !== 'object' || release === null) {
      return fallbackUrl
    }

    const assets = (release as Record<string, unknown>).assets
    if (!Array.isArray(assets)) {
      return fallbackUrl
    }

    return (
      selectReleaseAsset(platform, assets.filter(isReleaseAsset))?.browser_download_url ?? fallbackUrl
    )
  } catch {
    return fallbackUrl
  }
}
