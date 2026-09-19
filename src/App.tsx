import './App.css'
import './updates/UpdatesPage.css'
import { useEffect, useRef } from 'react'
import { getPreviewLayout, type PreviewLayout } from './preview'
import { setupPageMotion } from './motion'
import { homeCopy } from './content/homeCopy'
import { localizedPath, type Locale } from './i18n'
import SiteHeader from './SiteHeader'
import DownloadButton from './DownloadButton'
import { releasePageUrl } from './downloads'
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
] as const

const featuredCapabilities = [
  { id: 'global-hotkey', title: 'Global hold-to-record hotkey', description: 'Hold Ctrl+Shift to record, release to stop, and keep your hands near the keyboard.' },
  { id: 'active-app-insertion', title: 'Active-app text insertion', description: 'Transcribed text is sent back to the app and text field that already has your cursor.' },
] as const

const practicalDetails = [
  { label: 'Input', detail: 'Uses your system’s default microphone' },
  { label: 'Control', detail: 'Press Escape to cancel' },
  { label: 'Presence', detail: 'Runs quietly from the menu bar' },
] as const

const downloadRequirements = [
  'macOS primary',
  'Apple Silicon recommended for local dictation',
  '~1 GB download for Qwen3-ASR 0.6B',
  'Microphone and Accessibility permissions required',
] as const

function App({ locale = 'en', preview = getPreviewLayout(typeof window === 'undefined' ? '' : window.location.search) }: { locale?: Locale; preview?: PreviewLayout | null }) {
  const t = homeCopy(locale)
  const root = useRef<HTMLDivElement>(null)
  const layout = preview ?? 'editorial'

  useEffect(() => {
    if (root.current) return setupPageMotion(root.current)
  }, [layout])

  return (
    <div className="site-shell" data-layout={layout} lang={locale === 'zh' ? 'zh-CN' : 'en'} ref={root}>
      <a className="skip-link" href="#main">{t('Skip to content')}</a>
      <SiteHeader locale={locale} page="home" />
      <main id="main" tabIndex={-1}>
        <HeroSection locale={locale} layout={layout} />
        <PrivacySection locale={locale} />
        <WorkflowSection locale={locale} />
        <ProductSection locale={locale} />
        <DownloadSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      {preview && (
        <aside className="preview-toolbar" aria-label={t('Layout preview')}>
          <span>{t('Layout preview')}</span>
          <a href="?preview=editorial#top" aria-current={layout === 'editorial' ? 'page' : undefined}>{t('1 · Editorial')}</a>
          <a href="?preview=stage#top" aria-current={layout === 'stage' ? 'page' : undefined}>{t('2 · Product stage')}</a>
          <a href="?" aria-label={t('Exit layout preview')}>{t('Exit preview')}</a>
        </aside>
      )}
    </div>
  )
}

function HeroSection({ locale, layout }: { locale: Locale; layout: PreviewLayout }) {
  const t = homeCopy(locale)

  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        <img className="hero-waveform" src={layout === 'stage' ? '/saytype-stage-wave.webp' : '/saytype-waveform.png'} alt="" />
      </div>
      <div className="hero-content">
        <div className="hero-copy">
          <h1 id="hero-title">
            <span>{t('Local transcription.')}</span>
            <span>{t('No account.')}</span>
            <span>{t('No subscription.')}</span>
          </h1>
          <p className="hero-description">{t('Download a model. Transcribe offline.')}</p>
          <div className="hero-actions">
            <DownloadButton locale={locale} />
            <a className="text-link" href="#workflow">{t('See how it works')}</a>
          </div>
          <p className="hero-tagline">{t('Optional cloud transcription · Bring your own API key.')}</p>
        </div>
        <figure className="hero-product">
          <a href="/saytype-settings.png" target="_blank" rel="noreferrer" aria-label={t('View full-size SayType Dictation Settings screenshot')}>
            <img src="/saytype-settings.png" alt={t('SayType main window showing Dictation Settings and available transcription engines')} width="1152" height="768" />
          </a>
        </figure>
      </div>
    </section>
  )
}

function WorkflowSection({ locale }: { locale: Locale }) {
  const t = homeCopy(locale)
  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
      <div className="section-kicker">
        <span>02</span>
        <span>{t('How it works')}</span>
      </div>
      <div className="workflow-heading reveal-target">
        <h2 id="workflow-title">{t('Hold. Speak. Release.')}</h2>
        <p>{t('One physical gesture carries a thought all the way back to your cursor.')}</p>
      </div>
      <ol className="workflow-list reveal-target">
        {workflowSteps.map((step) => (
          <li key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3>{t(step.title)}</h3>
            <p>{t(step.detail)}</p>
          </li>
        ))}
      </ol>
      <p className="workflow-footnote">{t('On-device transcription')} <span>{t('Optional cloud translation')}</span> {t('Local History & retry')}</p>
    </section>
  )
}

function ProductSection({ locale }: { locale: Locale }) {
  const t = homeCopy(locale)
  return (
    <section className="product-section" id="product" aria-labelledby="product-title">
      <div className="section-kicker">
        <span>03</span>
        <span>{t('The product')}</span>
      </div>
      <div className="product-layout">
        <div className="product-copy reveal-target">
          <h2 id="product-title">{t('Ready when you are. Invisible when you’re not.')}</h2>
          <p>{t('In local mode, SayType turns speech into text on your Mac and inserts it at your cursor. Choose your engine once, then keep working where you are.')}</p>
        </div>
        <figure className="settings-figure reveal-target" data-reveal-delay="120">
          <a href="/saytype-app-settings.png" target="_blank" rel="noreferrer" aria-label={t('View full-size SayType App Settings screenshot')}>
          <img
            src="/saytype-app-settings.png"
            alt={t('SayType main window showing App Settings, appearance and software updates')}
            width="1152"
            height="768"
            loading="lazy"
            decoding="async"
          />
          </a>
          <figcaption>{t('App Settings. Make yourself at home.')} <a href="/saytype-app-settings.png" target="_blank" rel="noreferrer">{t('View full size')}</a></figcaption>
        </figure>
        <div className="capability-list">
          {featuredCapabilities.map((feature, index) => (
            <article key={feature.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{t(feature.title)}</h3>
                <p>{t(feature.description)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <details className="model-details cloud-options">
        <summary>{t('Optional cloud features')}</summary>
        <p className="cloud-disclosure">{t('Optional cloud transcription and translation send audio to Groq or OpenAI using your own API key. Provider charges may apply.')}</p>
        <p className="translation-note">{t('Hold Shift+Alt to turn speech into English through a cloud provider. In local mode, translation setup asks for your consent before sending audio.')}</p>
      </details>
      <div className="product-reassurance reveal-target">
        <div className="history-reassurance">
          <span>{t('Your transcript, saved locally')}</span>
          <p>{t('Copy saved transcripts from History. If transcription fails and audio was saved, retry it with your current engine.')}</p>
        </div>
        <ul className="practical-details" aria-label={t('Practical desktop controls')}>
          {practicalDetails.map((detail) => (
            <li key={t(detail.label)}>
              <span>{t(detail.label)}</span>
              <strong>{t(detail.detail)}</strong>
            </li>
          ))}
        </ul>
      </div>
      <p className="product-note">{t('Change your input device in your operating system’s sound settings. Updates download in the background. Restart when you’re ready.')}</p>
    </section>
  )
}

function PrivacySection({ locale }: { locale: Locale }) {
  const t = homeCopy(locale)
  const localBenefits = [
    { title: 'Works offline', detail: 'Download a local model once, then transcribe without an internet connection.' },
    { title: 'Local transcription. No signup.', detail: 'Download a model and transcribe locally without registering or configuring an API key. You can also use cloud transcription through Groq or OpenAI with your own API key.' },
    { title: 'No subscription or word limits', detail: 'Local transcription needs no account or API key. No weekly allowance and no per-minute service fees.' },
  ] as const

  return (
    <section className="privacy-section" id="privacy" aria-labelledby="privacy-title">
      <div className="section-kicker">
        <span>01</span>
        <span>{t('Why local matters')}</span>
      </div>
      <div className="privacy-layout reveal-target">
        <div className="privacy-copy">
          <p className="privacy-label">{t('In local mode · on-device transcription')}</p>
          <h2 id="privacy-title">{t('Your words stay on your Mac.')}</h2>
          <p>{t('In local mode, audio is processed on your Mac and transcripts are saved there. Neither is uploaded for transcription. Your everyday thoughts do not need a trip to someone else’s server.')}</p>
        </div>
        <div className="engine-panel">
          <div className="engine-list" aria-label={t('Benefits of local transcription')}>
            {localBenefits.map((benefit) => (
              <article key={t(benefit.title)}>
                <div>
                  <h3>{t(benefit.title)}</h3>
                </div>
                <p>{t(benefit.detail)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <p className="platform-note">{t('macOS is the primary tested path. Windows and Linux builds remain experimental.')}</p>
    </section>
  )
}

function DownloadSection({ locale }: { locale: Locale }) {
  const t = homeCopy(locale)
  return (
    <section className="download-section" id="download" aria-labelledby="download-title">
      <img className="download-waveform" src="/saytype-waveform.png" alt="" aria-hidden="true" />
      <div className="download-copy reveal-target">
        <p>{t('Offline dictation. No account. No subscription.')}</p>
        <h2 id="download-title">{t('Your voice. No cloud required.')}</h2>
        <ul className="download-requirements" aria-label={t('Download requirements')}>
          {downloadRequirements.map((requirement) => (
            <li key={t(requirement)}>{t(requirement)}</li>
          ))}
        </ul>
        <details className="model-details">
          <summary>{t('Which local engine should I choose?')}</summary>
          <p>{t('Qwen3-ASR 0.6B is the recommended local model, with a ~1 GB one-time download. Qwen3-ASR 1.7B and Nemotron live transcription are experimental options. The larger Qwen model needs a ~2.52 GB download; performance varies with your hardware.')}</p>
        </details>
        <DownloadButton locale={locale} />
      </div>
    </section>
  )
}

function SiteFooter({ locale }: { locale: Locale }) {
  const t = homeCopy(locale)
  return (
    <footer className="site-footer">
      <a className="brand-lockup" href="#top" aria-label={t('Back to top')}>
        <img src="/saytype-icon.png" alt="" width="42" height="42" />
        <span>SayType</span>
      </a>
      <p>{t('Voice to text. On your device.')}</p>
      <a href={localizedPath('updates', locale)}>{t('Updates')}</a>
      <a href={releasePageUrl}>{t('GitHub releases ↗')}</a>
    </footer>
  )
}

export default App
