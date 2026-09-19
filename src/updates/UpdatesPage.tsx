import { useEffect } from 'react'
import { milestones, releases, releaseAnchor, releaseHref, type Release } from './data'
import ReleaseNotes from './ReleaseNotes'
import './UpdatesPage.css'

function dateLabel(value: string) {
  const date = new Date(value)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

function VersionLink({ version }: { version: string }) {
  return <a href={releaseHref(version)}>v{version.replace(/^v/, '')}</a>
}

function ReleaseEntry({ release, latest }: { release: Release; latest: boolean }) {
  return (
    <details className="release-entry" id={releaseAnchor(release.version)} open={latest || undefined}>
      <summary>
        <span className="release-version">v{release.version.replace(/^v/, '')}{latest && <span className="latest-label">Latest</span>}</span>
        <time dateTime={release.publishedAt}>{dateLabel(release.publishedAt)}</time>
        <span className="release-expand" aria-hidden="true">+</span>
      </summary>
      <div className="release-body">
        {release.notesStatus === 'missing' ? <p className="missing-notes">Release notes are unavailable for this version. The original release and its downloads are still available on GitHub.</p> : <ReleaseNotes body={release.body} />}
        <a className="release-source" href={release.url}>Original release on GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </details>
  )
}

function Changelog() {
  const years = [...new Set(releases.map((release) => release.publishedAt.slice(0, 4)))]
  return (
    <div className="updates-layout">
      <aside className="updates-aside">
        <p className="updates-eyebrow">Browse the archive</p>
        <nav aria-label="Release years">{years.map((year) => <a key={year} href={`#year-${year}`}>{year}<span>{releases.filter((release) => release.publishedAt.startsWith(year)).length} releases</span></a>)}</nav>
        <p>Every published version, with its original release notes. Looking for the bigger picture? <a href="/updates">Read the highlights.</a></p>
      </aside>
      <div className="release-archive">
        {years.map((year) => {
          const yearReleases = releases.filter((release) => release.publishedAt.startsWith(year))
          const minors = [...new Set(yearReleases.map((release) => release.version.replace(/^v/, '').split('.').slice(0, 2).join('.')))]
          return (
            <section className="release-year" key={year} id={`year-${year}`} aria-labelledby={`year-title-${year}`}>
              <h2 id={`year-title-${year}`}>{year}</h2>
              {Number(year) < 2026 && <p className="legacy-notice"><strong>Historical releases.</strong> These notes describe earlier versions of SayType and may not reflect the current app.</p>}
              {minors.map((minor) => (
                <section className="release-series" key={minor} aria-labelledby={`series-${year}-${minor}`}>
                  <h3 id={`series-${year}-${minor}`}>{minor} series</h3>
                  {yearReleases.filter((release) => release.version.replace(/^v/, '').split('.').slice(0, 2).join('.') === minor).map((release) => <ReleaseEntry key={release.version} release={release} latest={release === releases[0]} />)}
                </section>
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function Milestones() {
  return (
    <div className="updates-layout">
      <aside className="updates-aside">
        <p className="updates-eyebrow">The bigger picture</p>
        <p>New capabilities and the releases that brought them to SayType. Small fixes and every patch live in the <a href="/changelog">complete changelog.</a></p>
        <nav className="milestone-index" aria-label="Product milestones">{milestones.map((milestone) => <a key={milestone.id} href={`#${milestone.id}`}>{milestone.category}</a>)}</nav>
      </aside>
      <div className="milestone-list">
        {milestones.map((milestone) => {
          const introduced = releases.find((release) => release.version === milestone.introducedVersion)
          return (
            <article className="milestone" id={milestone.id} key={milestone.id} aria-labelledby={`${milestone.id}-title`}>
              <div className="milestone-meta"><span>{milestone.category}</span>{introduced && <time dateTime={introduced.publishedAt}>{dateLabel(introduced.publishedAt)}</time>}</div>
              <h2 id={`${milestone.id}-title`}>{milestone.title}</h2>
              <p className="milestone-summary">{milestone.summary}</p>
              <ul className="milestone-details">{milestone.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              <p className="milestone-scope">{milestone.scope}</p>
              <div className="milestone-history">
                <p><span className="history-label">First introduced</span><VersionLink version={milestone.introducedVersion} /></p>
                {milestone.evolution.length > 0 && <div className="milestone-evolution"><h3>Since then</h3><ul>{milestone.evolution.map((change) => <li key={`${change.version}-${change.description}`}><VersionLink version={change.version} /><span>{change.description}</span></li>)}</ul></div>}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default function UpdatesPage({ page }: { page: 'updates' | 'changelog' }) {
  useEffect(() => {
    const revealRelease = () => {
      let id: string
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      if (target instanceof HTMLDetailsElement) target.open = true
    }
    revealRelease()
    window.addEventListener('hashchange', revealRelease)
    return () => window.removeEventListener('hashchange', revealRelease)
  }, [])

  return (
    <div className="updates-shell">
      <a className="updates-skip" href="#main">Skip to content</a>
      <header className="updates-header">
        <a className="updates-brand" href="/" aria-label="SayType home"><img src="/saytype-icon.png" alt="" width="42" height="42" /><span>SayType</span></a>
        <nav aria-label="Main navigation"><a href="/">The app</a><a href="/updates" aria-current={page === 'updates' ? 'page' : undefined}>Updates</a><a className="updates-download" href="/#download">Get SayType <span aria-hidden="true">↗</span></a></nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="updates-hero" aria-labelledby="updates-title">
          <p className="updates-eyebrow">SayType, over time</p>
          <h1 id="updates-title">{page === 'updates' ? <>A little closer to<br /><span>effortless.</span></> : <>Every release.<br /><span>Every detail.</span></>}</h1>
          <p>{page === 'updates' ? 'The meaningful changes to how you speak, write, and keep your words close.' : 'A complete record of what changed in SayType, one version at a time.'}</p>
          <nav className="updates-tabs" aria-label="Updates navigation"><a href="/updates" aria-current={page === 'updates' ? 'page' : undefined}>Product highlights</a><a href="/changelog" aria-current={page === 'changelog' ? 'page' : undefined}>Full changelog <span>{releases.length}</span></a></nav>
        </section>
        {page === 'updates' ? <Milestones /> : <Changelog />}
      </main>
      <footer className="updates-footer"><a href="/" className="updates-brand">SayType</a><p>Your voice. On your device.</p><a href="/#download">Get SayType <span aria-hidden="true">↗</span></a></footer>
    </div>
  )
}
