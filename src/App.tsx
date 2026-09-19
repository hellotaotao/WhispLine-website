import './App.css'
import './updates/UpdatesPage.css'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { getPreviewLayout, type PreviewLayout } from './preview'
import { setupPageMotion } from './motion'
import { productMessaging } from './content/productMessaging'
import {
  detectDownloadPlatform,
  getFallbackDownloadUrl,
  releasePageUrl,
  resolveLatestDownloadUrl,
  type DownloadPlatform,
} from './downloads'

const workflowSteps = [
  {
    number: '01',
    title: 'Hold',
    detail: 'Press Ctrl+Shift in the app where you want to write.',
  },
  {
    number: '02',
    title: 'Speak',
    detail: 'SayType listens while a compact prompt keeps you oriented.',
  },
  {
    number: '03',
    title: 'Release',
    detail: 'Your transcript returns to the text field that already has focus.',
  },
]

const featureIds = [
  'global-hotkey',
  'active-app-insertion',
  'engine-choice',
  'translation',
]

const featuredCapabilities = featureIds.flatMap((id) => {
  const feature = productMessaging.features.find((item) => item.id === id)
  return feature ? [feature] : []
})

const practicalDetails = [
  { label: 'Input', detail: 'Uses your system’s default microphone' },
  { label: 'Control', detail: 'Press Escape to cancel' },
  { label: 'Presence', detail: 'Runs quietly from the menu bar' },
]

const downloadRequirements = [
  'macOS primary',
  'Apple Silicon recommended for local dictation',
  '~1 GB download for Qwen3-ASR 0.6B',
  'Microphone and Accessibility permissions required',
]

const downloadPlatforms: Record<DownloadPlatform, { label: string; name: string }> = {
  macos: { label: 'Download for Mac', name: 'Mac' },
  windows: { label: 'Download for Windows', name: 'Windows' },
  linux: { label: 'Download for Linux', name: 'Linux' },
}

function getCurrentDownloadPlatform(): DownloadPlatform | null {
  if (typeof navigator === 'undefined') {
    return 'macos'
  }

  const navigatorWithUserAgentData = navigator as Navigator & {
    userAgentData?: { platform?: string }
  }
  const platform = navigatorWithUserAgentData.userAgentData?.platform ?? navigator.platform

  return detectDownloadPlatform(platform, navigator.userAgent)
}

function App({ preview = getPreviewLayout(typeof window === 'undefined' ? '' : window.location.search) }: { preview?: PreviewLayout | null }) {
  const root = useRef<HTMLDivElement>(null)
  const layout = preview ?? 'editorial'

  useEffect(() => {
    if (root.current) return setupPageMotion(root.current)
  }, [layout])

  return (
    <div className="site-shell" data-layout={layout} ref={root}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <HeroSection layout={layout} />
        <WorkflowSection />
        <ProductSection />
        <PrivacySection />
        <DownloadSection />
      </main>
      <SiteFooter />
      {preview && (
        <aside className="preview-toolbar" aria-label="Layout preview">
          <span>Layout preview</span>
          <a href="?preview=editorial#top" aria-current={layout === 'editorial' ? 'page' : undefined}>1 · Editorial</a>
          <a href="?preview=stage#top" aria-current={layout === 'stage' ? 'page' : undefined}>2 · Product stage</a>
          <a href="?" aria-label="Exit layout preview">Exit preview</a>
        </aside>
      )}
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand-lockup" href="#top" aria-label="SayType home">
        <img src="./saytype-icon.png" alt="" width="48" height="48" />
        <span>SayType</span>
      </a>
      <nav className="nav-links" aria-label="Page sections">
        <a href="#workflow">How it works</a>
        <a href="#product">Product</a>
        <a href="#privacy">Privacy</a>
        <a className="updates-nav-link" href="/updates">Updates</a>
      </nav>
      <DownloadButton />
    </header>
  )
}

function DownloadButton({ macLabel }: { macLabel?: string }) {
  const [platform] = useState(getCurrentDownloadPlatform)
  const [isResolving, setIsResolving] = useState(false)
  const platformDetails = platform ? downloadPlatforms[platform] : null
  const label =
    platform === 'macos' && macLabel
      ? macLabel
      : platformDetails?.label ?? 'View downloads'
  const href = platform ? getFallbackDownloadUrl(platform) : releasePageUrl

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !platform ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    if (isResolving) {
      return
    }

    setIsResolving(true)
    const downloadUrl = await resolveLatestDownloadUrl(platform)
    window.location.assign(downloadUrl)
  }

  return (
    <a
      className="download-button"
      href={href}
      aria-label={
        platformDetails ? `Download SayType for ${platformDetails.name}` : 'View SayType downloads'
      }
      aria-busy={isResolving || undefined}
      onClick={handleClick}
    >
      {platform === 'macos' ? (
        <img src="./apple-logo.png" alt="" width="26" height="27" />
      ) : (
        <svg className="download-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
        </svg>
      )}
      <span>{isResolving ? 'Preparing download…' : label}</span>
    </a>
  )
}

function HeroSection({ layout }: { layout: PreviewLayout }) {
  const { hero } = productMessaging

  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        <img className="hero-waveform" src={layout === 'stage' ? './saytype-stage-wave.webp' : './saytype-waveform.png'} alt="" />
      </div>
      <div className="hero-content">
        <div className="hero-copy">
          <h1 id="hero-title">
            {layout === 'stage' ? <><span>Speak freely.</span><span>Keep your words close.</span></> :
              <><span>Your voice.</span><span>Right where</span><span>you work.</span></>}
          </h1>
          {layout === 'editorial' && <p className="hero-shortcut">{hero.subheadline}</p>}
          <p className="hero-description">Voice typing in the apps you already use.</p>
          <div className="hero-actions">
            <DownloadButton macLabel={hero.primaryCta} />
            <a className="text-link" href="#workflow">{hero.secondaryCta}</a>
          </div>
          <p className="hero-tagline">{hero.eyebrow}</p>
        </div>
        <figure className="hero-product">
          <a href="./saytype-settings.png" target="_blank" rel="noreferrer" aria-label="View full-size SayType Dictation Settings screenshot">
            <img src="./saytype-settings.png" alt="SayType main window showing Dictation Settings and available transcription engines" width="1152" height="768" />
          </a>
        </figure>
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
      <div className="section-kicker">
        <span>01</span>
        <span>One shortcut, every app</span>
      </div>
      <div className="workflow-heading reveal-target">
        <h2 id="workflow-title">Hold. Speak. Release.</h2>
        <p>One physical gesture carries a thought all the way back to your cursor.</p>
      </div>
      <ol className="workflow-list reveal-target">
        {workflowSteps.map((step) => (
          <li key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
          </li>
        ))}
      </ol>
      <p className="workflow-footnote">On-device transcription <span>Optional cloud translation</span> Local History &amp; retry</p>
    </section>
  )
}

function ProductSection() {
  return (
    <section className="product-section" id="product" aria-labelledby="product-title">
      <div className="section-kicker">
        <span>02</span>
        <span>The product</span>
      </div>
      <div className="product-layout">
        <div className="product-copy reveal-target">
          <h2 id="product-title">Ready when you are. Invisible when you’re not.</h2>
          <p>
            In local mode, SayType turns speech into text on your Mac and inserts it at
            your cursor. Choose your engine once, then keep working where you are.
          </p>
        </div>
        <figure className="settings-figure reveal-target" data-reveal-delay="120">
          <a href="./saytype-app-settings.png" target="_blank" rel="noreferrer" aria-label="View full-size SayType App Settings screenshot">
          <img
            src="./saytype-app-settings.png"
            alt="SayType main window showing App Settings, appearance and software updates"
            width="1152"
            height="768"
            loading="lazy"
            decoding="async"
          />
          </a>
          <figcaption>App Settings. Make yourself at home. <a href="./saytype-app-settings.png" target="_blank" rel="noreferrer">View full size</a></figcaption>
        </figure>
        <div className="capability-list">
          {featuredCapabilities.map((feature, index) => (
            <article key={feature.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <details className="model-details">
        <summary>Which local engine should I choose?</summary>
        <p>Qwen3-ASR 0.6B is the recommended local model, with a ~1 GB one-time download.
          Qwen3-ASR 1.7B and Nemotron live transcription are experimental options.
          The larger Qwen model needs a ~2.52 GB download; performance varies with your hardware.</p>
      </details>
      <div className="product-reassurance reveal-target">
        <div className="history-reassurance">
          <span>Your transcript, saved locally</span>
          <p>Copy saved transcripts from History. If transcription fails and audio was saved, retry it with your current engine.</p>
        </div>
        <ul className="practical-details" aria-label="Practical desktop controls">
          {practicalDetails.map((detail) => (
            <li key={detail.label}>
              <span>{detail.label}</span>
              <strong>{detail.detail}</strong>
            </li>
          ))}
        </ul>
      </div>
      <p className="product-note">Change your input device in your operating system’s sound settings. Updates download in the background. Restart when you’re ready.</p>
    </section>
  )
}

function PrivacySection() {
  const localBenefits = [
    { title: 'Works offline', detail: 'Download a local model once, then transcribe without an internet connection.' },
    { title: 'No subscription or word limits', detail: 'Local transcription needs no account or API key. No weekly allowance and no per-minute service fees.' },
    { title: 'Transcribe first. Edit on your terms.', detail: 'Get your words as text. You decide whether to rewrite them, which tool to use, and what to share.' },
  ]

  return (
    <section className="privacy-section" id="privacy" aria-labelledby="privacy-title">
      <div className="section-kicker">
        <span>03</span>
        <span>Local by design</span>
      </div>
      <div className="privacy-layout reveal-target">
        <div className="privacy-copy">
          <p className="privacy-label">In local mode · on-device transcription</p>
          <h2 id="privacy-title">Your words stay on your Mac.</h2>
          <p>
            In local mode, audio is processed on your Mac and transcripts are saved
            there. Neither is uploaded for transcription. Your everyday thoughts
            do not need a trip to someone else’s server.
          </p>
        </div>
        <div className="engine-panel">
          <div className="engine-list" aria-label="Benefits of local transcription">
            {localBenefits.map((benefit) => (
              <article key={benefit.title}>
                <div>
                  <h3>{benefit.title}</h3>
                </div>
                <p>{benefit.detail}</p>
              </article>
            ))}
          </div>
          <p className="cloud-disclosure">
            Optional cloud transcription and translation send audio to Groq or OpenAI using your own API key. Provider charges may apply.
          </p>
          <p className="translation-note">Hold Shift+Alt to turn speech into English through a cloud provider. In local mode, translation setup asks for your consent before sending audio.</p>
        </div>
      </div>
      <p className="platform-note">
        macOS is the primary tested path. Windows and Linux builds remain experimental.
      </p>
    </section>
  )
}

function DownloadSection() {
  return (
    <section className="download-section" id="download" aria-labelledby="download-title">
      <img className="download-waveform" src="./saytype-waveform.png" alt="" aria-hidden="true" />
      <div className="download-copy reveal-target">
        <p>Offline dictation. No account. No subscription.</p>
        <h2 id="download-title">Your voice. No cloud required.</h2>
        <DownloadButton />
        <ul className="download-requirements" aria-label="Download requirements">
          {downloadRequirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand-lockup" href="#top" aria-label="Back to top">
        <img src="./saytype-icon.png" alt="" width="42" height="42" />
        <span>SayType</span>
      </a>
      <p>Voice to text. On your device.</p>
      <a href="/updates">Updates</a>
      <a href={releasePageUrl}>GitHub releases ↗</a>
    </footer>
  )
}

export default App
