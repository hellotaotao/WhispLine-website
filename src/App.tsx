import './App.css'
import { productMessaging } from './content/productMessaging'

const {
  productName,
  hero,
  currentReality,
  targetUsers,
  painPoints,
  valueMappings,
  workflow,
  features,
  permissions,
  platforms,
  providers,
  workflowExample,
  cta,
} = productMessaging

function App() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <HeroSection />
      <ProductPreviewSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PrivacySection />
      <PlatformSection />
      <ProvidersSection />
      <WorkflowSection />
      <CtaSection />
    </main>
  )
}

function SiteHeader() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand-lockup" href="#top" aria-label="SayType home">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>{productName}</span>
      </a>
      <nav className="nav-links" aria-label="Page sections">
        <a href="#workflow">Workflow</a>
        <a href="#features">Features</a>
        <a href="#providers">Providers</a>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="hero-section section-band" id="top">
      <HeroBackdrop />
      <div className="section-inner hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{productName}</h1>
          <p className="hero-headline">{hero.headline}</p>
          <p className="hero-subheadline">{hero.subheadline}</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="#cta">
              {hero.primaryCta}
            </a>
            <a className="button button-secondary" href="#workflow">
              {hero.secondaryCta}
            </a>
          </div>
          <ul className="proof-list" aria-label="Key workflow facts">
            {hero.proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="desktop-frame desktop-frame-large">
        <div className="desktop-topbar">
          <span />
          <span />
          <span />
          <strong>SayType active</strong>
        </div>
        <div className="desktop-grid">
          <div className="editor-pane">
            <div className="pane-label">Active app</div>
            <div className="code-line wide" />
            <div className="code-line" />
            <div className="code-line short" />
            <div className="cursor-row">
              <span className="text-cursor" />
              <span>Text lands here</span>
            </div>
          </div>
          <div className="settings-pane">
            <div className="pane-label">Settings</div>
            <div className="setting-row">
              <span>Provider</span>
              <strong>OpenAI</strong>
            </div>
            <div className="setting-row">
              <span>Model</span>
              <strong>gpt-4o-mini-transcribe</strong>
            </div>
            <div className="setting-row">
              <span>Shortcut</span>
              <strong>Ctrl+Shift</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="voice-prompt voice-prompt-hero">
        <div className="mic-dot" />
        <div>
          <strong>Recording</strong>
          <span>Hold Ctrl+Shift</span>
        </div>
        <Waveform />
      </div>
    </div>
  )
}

function ProductPreviewSection() {
  return (
    <section className="section-band preview-section" aria-labelledby="preview-title">
      <div className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Product preview</p>
          <h2 id="preview-title">A desktop input method, not another writing box.</h2>
          <p>
            SayType is designed around the active app: it records from a global shortcut,
            visualizes your voice in a compact prompt, and returns text to the field that
            already has focus.
          </p>
        </div>
        <div className="product-stage" aria-label="SayType product interface mockup">
          <div className="app-stack">
            <div className="mock-window mock-window-editor">
              <div className="mock-titlebar">
                <div className="traffic-lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <strong>Release notes draft</strong>
              </div>
              <div className="mock-content">
                <div className="document-line large" />
                <div className="document-line" />
                <div className="document-line medium" />
                <div className="insertion-target">
                  <span className="text-cursor" />
                  <span>{workflowExample.inserted}</span>
                </div>
              </div>
            </div>

            <div className="voice-prompt voice-prompt-preview">
              <div className="mic-dot" />
              <div>
                <strong>Speak now</strong>
                <span>Release to transcribe</span>
              </div>
              <Waveform />
            </div>

            <div className="mock-window mock-window-settings">
              <div className="mini-heading">SayType settings</div>
              <div className="settings-list">
                <div>
                  <span>Provider</span>
                  <strong>OpenAI or Groq</strong>
                </div>
                <div>
                  <span>Microphone</span>
                  <strong>System default</strong>
                </div>
                <div>
                  <span>Language</span>
                  <strong>Auto-detect</strong>
                </div>
                <div>
                  <span>Theme</span>
                  <strong>Elegant</strong>
                </div>
              </div>
            </div>
          </div>
          <aside className="preview-notes" aria-label="Prototype notes">
            <p className="mini-heading">Current prototype reality</p>
            <p>{currentReality}</p>
            <p>
              macOS needs microphone and Accessibility permission for the full automatic
              workflow. When direct insertion is unavailable, SayType falls back to the
              clipboard so the transcript is still ready to paste.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="section-band problem-section" aria-labelledby="problem-title">
      <div className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">The problem</p>
          <h2 id="problem-title">Desktop writing is still tied to the keyboard.</h2>
          <p>
            Dictation exists, but the moment work moves across IDEs, ticket queues,
            browsers, terminals, and chat, the experience becomes fragmented.
          </p>
        </div>
        <div className="problem-grid">
          {painPoints.map((point) => (
            <article className="problem-card" key={point.id}>
              <h3>{point.problem}</h3>
              <p>{point.consequence}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="section-band how-section" id="workflow" aria-labelledby="how-title">
      <div className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">One gesture from thought to inserted text.</h2>
          <p>
            The core workflow is intentionally short: hold, speak, release, and keep
            going in the app where you started.
          </p>
        </div>
        <ol className="workflow-grid">
          {workflow.map((step) => (
            <li className="workflow-card" key={step.label}>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="section-band features-section" id="features" aria-labelledby="features-title">
      <div className="section-inner">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Feature set</p>
          <h2 id="features-title">Built for repeated desktop use.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.id}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrivacySection() {
  return (
    <section className="section-band privacy-section" aria-labelledby="privacy-title">
      <div className="section-inner privacy-layout">
        <div>
          <p className="eyebrow">Privacy and permissions</p>
          <h2 id="privacy-title">Honest controls for a desktop prototype.</h2>
          <p>
            SayType is explicit about what it needs. Audio transcription runs through
            the provider configured by the user, and OS permissions are requested only
            for the desktop workflow.
          </p>
        </div>
        <div className="permission-list">
          {permissions.map((detail) => (
            <article className="permission-card" key={detail.title}>
              <h3>{detail.title}</h3>
              <p>{detail.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlatformSection() {
  return (
    <section className="section-band platform-section" aria-labelledby="platform-title">
      <div className="section-inner">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Cross-platform direction</p>
          <h2 id="platform-title">A desktop app with platform-specific packaging.</h2>
        </div>
        <div className="platform-grid">
          {platforms.map((platform) => (
            <article className="platform-card" key={platform.name}>
              <div>
                <h3>{platform.name}</h3>
                <span>{platform.status}</span>
              </div>
              <p>{platform.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProvidersSection() {
  return (
    <section className="section-band providers-section" id="providers" aria-labelledby="providers-title">
      <div className="section-inner provider-layout">
        <div>
          <p className="eyebrow">Transcription providers</p>
          <h2 id="providers-title">Bring your own AI transcription key.</h2>
          <p>
            SayType keeps model choice in settings, so users can tune speed, cost,
            and quality for their own workflow.
          </p>
        </div>
        <div className="provider-grid">
          {providers.map((provider) => (
            <article className="provider-card" key={provider.name}>
              <h3>{provider.name}</h3>
              <ul>
                {provider.models.map((model) => (
                  <li key={model}>{model}</li>
                ))}
              </ul>
              <p>{provider.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section className="section-band fit-section" aria-labelledby="fit-title">
      <div className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Workflow fit</p>
          <h2 id="fit-title">Made for people who write across many apps.</h2>
          <p>
            The value is not just faster text. It is keeping context where it already
            lives: the editor, the ticket, the chat reply, the document, or the terminal
            note.
          </p>
        </div>
        <div className="fit-layout">
          <div className="audience-list">
            {targetUsers.map((user) => (
              <article className="audience-card" key={user.id}>
                <h3>{user.title}</h3>
                <p>{user.need}</p>
                <strong>{user.value}</strong>
              </article>
            ))}
          </div>
          <div className="dictation-example">
            <p className="mini-heading">Example dictation</p>
            <blockquote>{workflowExample.dictated}</blockquote>
            <div>
              <span>Used inside</span>
              <strong>{workflowExample.sourceApp}</strong>
            </div>
          </div>
        </div>
        <div className="mapping-strip" aria-label="Feature value mappings">
          {valueMappings.map((mapping) => {
            const feature = features.find((item) => item.id === mapping.featureId)
            return (
              <article key={mapping.painPointId}>
                <span>{feature?.title}</span>
                <p>{mapping.value}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="section-band cta-section" id="cta" aria-labelledby="cta-title">
      <div className="section-inner cta-inner">
        <div>
          <p className="eyebrow">Try the prototype</p>
          <h2 id="cta-title">{cta.headline}</h2>
          <p>{cta.description}</p>
        </div>
        <div className="cta-panel">
          <p>{cta.note}</p>
          <a className="button button-primary" href="#top">
            Back to top
          </a>
        </div>
      </div>
    </section>
  )
}

function Waveform() {
  return (
    <div className="waveform" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

export default App
