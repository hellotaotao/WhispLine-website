import './App.css'
import { productMessaging } from './content/productMessaging'

const releaseUrl = 'https://github.com/hellotaotao/saytype/releases/latest'

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
  'live-overlay',
  'engine-choice',
]

const featuredCapabilities = featureIds.flatMap((id) => {
  const feature = productMessaging.features.find((item) => item.id === id)
  return feature ? [feature] : []
})

function App() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <HeroSection />
        <WorkflowSection />
        <ProductSection />
        <PrivacySection />
        <DownloadSection />
      </main>
      <SiteFooter />
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
      </nav>
    </header>
  )
}

function HeroSection() {
  const { hero } = productMessaging

  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>One shortcut.</span>
          <span>Every app.</span>
        </h1>
        <p className="hero-shortcut">{hero.subheadline}</p>
        <a
          className="download-button"
          href={releaseUrl}
          aria-label="Download SayType for Mac"
        >
          <img src="./apple-logo.png" alt="" width="26" height="27" />
          <span>{hero.primaryCta}</span>
        </a>
        <p className="hero-tagline">{hero.eyebrow}</p>
      </div>

      <div className="hero-visual" aria-label="Voice becomes text in SayType">
        <img
          className="hero-waveform"
          src="./saytype-waveform.png"
          alt=""
          aria-hidden="true"
        />
        <img className="hero-cursor" src="./saytype-cursor.png" alt="" aria-hidden="true" />
        <figure className="hero-product">
          <img
            src="./saytype-settings.png"
            alt="SayType settings showing the recording shortcut, permissions, language, and light theme"
          />
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
        <span>The gesture</span>
      </div>
      <div className="workflow-heading">
        <h2 id="workflow-title">Hold. Speak. Release.</h2>
        <p>One physical gesture carries a thought all the way back to your cursor.</p>
      </div>
      <ol className="workflow-list">
        {workflowSteps.map((step) => (
          <li key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
          </li>
        ))}
      </ol>
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
        <div className="product-copy">
          <h2 id="product-title">Ready when you are. Invisible when you’re not.</h2>
          <p>
            SayType stays in the background until the shortcut is held. Choose a local
            model or your own cloud provider without changing the way you dictate.
          </p>
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
        <figure className="settings-figure">
          <div className="settings-accent settings-accent-coral" />
          <img
            src="./saytype-home.png"
            alt="SayType ready to dictate with local model, microphone, and Accessibility ready"
          />
          <div className="settings-accent settings-accent-cyan" />
        </figure>
      </div>
    </section>
  )
}

function PrivacySection() {
  const localProvider = productMessaging.providers.find(
    (provider) => provider.name === 'Local Qwen3',
  )

  return (
    <section className="privacy-section" id="privacy" aria-labelledby="privacy-title">
      <div className="section-kicker">
        <span>03</span>
        <span>Your choice</span>
      </div>
      <div className="privacy-layout">
        <div className="privacy-copy">
          <p className="privacy-label">Local first</p>
          <h2 id="privacy-title">Your audio can stay on your Mac.</h2>
          <p>
            Run Qwen3-ASR locally on Apple Silicon after a one-time model download. No
            account and no API key are required for local transcription.
          </p>
        </div>
        <div className="engine-list" aria-label="Available transcription engines">
          {productMessaging.providers.map((provider) => (
            <article key={provider.name}>
              <div>
                <h3>{provider.name}</h3>
                <span>{provider.name === localProvider?.name ? 'On-device' : 'Your key'}</span>
              </div>
              <p>{provider.note}</p>
            </article>
          ))}
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
      <div className="download-copy">
        <p>Say less to your keyboard.</p>
        <h2 id="download-title">Speak. It’s already typed.</h2>
        <a
          className="download-button"
          href={releaseUrl}
          aria-label="Download SayType for Mac"
        >
          <img src="./apple-logo.png" alt="" width="26" height="27" />
          <span>Download for Mac</span>
        </a>
        <small>Apple Silicon recommended · Latest GitHub release</small>
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
      <p>Voice to text, in any app.</p>
      <a href={releaseUrl}>GitHub releases ↗</a>
    </footer>
  )
}

export default App
