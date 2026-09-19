# SayType Website

Product marketing homepage for SayType, a Tauri desktop voice input app. macOS is the primary tested path; Windows and Linux builds remain experimental.

## Product message

Hold `Ctrl+Shift`, speak, release: SayType transcribes with the configured engine and inserts text at the cursor. `Escape` cancels. Local Qwen3 transcription needs no account or API key after the model download. Optional Groq/OpenAI transcription and English translation upload audio to the configured provider using the user's own key; provider charges may apply.

Copy is checked against `../SayType` at tag `v1.15.2`, especially `README.md`, `docs/local-asr.md`, `docs/cloud-transcription.md`, `docs/dictation-recovery.md`, the Settings UI, and the updater implementation. Hardware-aware onboarding/default changes in the desktop working tree are not advertised as released behavior.

- Uses the system-default microphone; select the device in operating-system sound settings.
- Qwen3-ASR 0.6B is the recommended local model (~1 GB download). Qwen3-ASR 1.7B (~2.52 GB) and Nemotron live transcription are experimental.
- Apple Silicon is recommended for local dictation, not a universal installation requirement.
- History stores completed transcripts for copying. Failed transcription can be retried with the current engine when its audio was saved.
- Hold `Shift+Alt` for English cloud translation. Local-mode translation setup asks for consent.
- Updates download in the background; the user chooses when to restart.
- Microphone and macOS Accessibility permissions are required for the complete macOS workflow.

## Layouts and preview

The default `/` uses the selected editorial layout. Explicit preview links expose a small layout switcher:

- `/?preview=editorial` — first design, also the production default.
- `/?preview=stage` — second design, centered product stage.

Unknown or missing preview parameters always use the default without preview controls. Exit preview returns to `/`. Both layouts share the current product copy, real screenshots, lower sections and download behavior. There is **no A/B experiment, analytics SDK, event collection, random assignment, cookie or localStorage persistence**. The canonical URL is the production homepage.

## Product screenshots

Native captures of installed SayType **v1.15.2**, captured **2026-09-15**, in English/light appearance:

- `public/saytype-settings.png` — Dictation Settings, **1152 x 768**; used by both hero layouts. Configuration drawers collapsed, no API keys or private transcript text visible.
- `public/saytype-app-settings.png` — App Settings, **1152 x 768**; used in the product section.

These are actual app pixels, not AI-generated UI reconstructions. Both are displayed at their original **3:2** aspect ratio with no crop, and link to the full-size image. The previously shortened Home capture is not used. Native captures may require PNG format conversion; do not redraw, retouch, or squash the interface.

The existing SayType logo, Apple logo and diagonal coral/cyan waveform are reused. `public/saytype-stage-wave.webp` is a generated decorative ribbon matching the second concept, compressed to WebP and loaded only by that preview. No product screenshot is generated. The concept-image text "Local by default" was corrected to "Local transcription" because the published configuration does not always default to local mode.

## Implementation

- React, Vite and TypeScript; no additional runtime dependency for preview or motion.
- `src/content/productMessaging.ts` holds the structured product copy.
- `src/preview.ts` only parses explicit preview parameters.
- `src/motion.ts` scopes animation lifecycle to the page. CSS hero entrance and one-time section reveals use transform/opacity; only decorative wave art responds to mouse movement, by at most 10px horizontally and 7px vertically. No continuously moving app window or animation loop.
- Reduced motion disables entrance, parallax, reveals, transitions and smooth scrolling. No hidden-by-default reveal content. Observers, animations, frame requests and listeners are cleaned up.
- Downloads resolve current GitHub assets on a normal click. Modified clicks, metadata errors or missing assets open the latest release page instead of a pinned obsolete installer.

## Development and validation

```bash
npm install
npm run lint
npx tsc -b --pretty false
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4175
```

Preview both layouts at 320, 390, 768, 1100, 1280 and 1440px. Check anchor navigation, the preview switcher, model disclosure, full-size screenshot links, download fallback, reduced motion, console/network errors and overflow. Production output is `dist/`. Deployments are separate from local validation.

## Product updates and release history

- `/updates` is a curated timeline of product capabilities, including introduction versions and later refinements. Content lives in `src/content/milestones.json`.
- `/changelog` includes every published stable GitHub Release in `src/content/releases.json`, grouped by year and minor version. Patch notes use native disclosures; all text is present in the initial HTML. The English site shows English first and retains available Chinese notes in a separate disclosure.
- `npm run build` pre-renders both routes, adds unique metadata and canonicals, and generates `sitemap.xml` and `robots.txt`. It checks the generated HTML and source links. Clean-URL HTML files and directory-index mirrors keep both slash variants readable in local preview; Vercel canonicalizes to the non-trailing-slash URL. No visitor-time GitHub or AI request is needed. The homepage remains the existing Vite app.
- Release bodies are preserved verbatim in the snapshot. The display removes repeated installer instructions and renders a safe Markdown subset without executable HTML. Historical notes describe that release, not current support or recommendations. Versions `v1.3.3` and `v1.3.4` have installer-only placeholder notes and are explicitly marked missing. The 2025 archive predates the current Tauri implementation.
- Eight initial milestones were checked against the published release bodies. In particular, local transcription first appeared in **v1.4.0**, not the onboarding expansion in v1.5.0; saved-audio recovery began in **v1.8.0**, before its broader coverage in v1.13.3. No release-note claim is a substitute for real-device validation.

### Synchronization

Requires Node 22 or later. `GH_TOKEN` / `GITHUB_TOKEN` is optional for public reads but avoids low unauthenticated API limits.

```bash
cp src/content/releases.json /tmp/saytype-releases-before.json
npm run releases:sync
# Offline import of an unmodified GitHub Releases API JSON array:
npm run releases:sync -- --from-file /path/to/releases.json
```

The importer paginates, excludes drafts/prereleases, detects revised notes, and writes atomically only after successful validation. A partial fetch, missing previously published release, or replacement of real notes by a placeholder fails without overwriting the snapshot. Resolve actual upstream removals manually. A missing note on a new release remains a visible gap; a later sync imports its completed body.

`.github/workflows/sync-releases.yml` checks daily, can be dispatched manually, and accepts `repository_dispatch` with event type `saytype-release-notes-ready`. For immediate updates, send that event from the desktop release pipeline **after** its `gh release edit --notes-file` succeeds, using a token with access to this website repository. The daily check is the fallback for late/edited notes. No desktop-pipeline credentials or remote configuration are created by this change.

The workflow opens a single content PR rather than publishing automatically. Enable GitHub Actions' **Allow GitHub Actions to create and approve pull requests** repository setting for PR creation. It preserves an open review PR without overwriting reviewer edits; after merging or closing it, the next run catches up. The branch is reserved for this workflow. There is no automatic merge. Website deployment follows the repository's existing deployment process after an approved merge.

### Optional AI-assisted editorial drafts

Configure `ANTHROPIC_API_KEY` as an Actions secret and `ANTHROPIC_MODEL` as an Actions variable (or environment variables locally). No model is hardcoded. The pipeline still syncs release notes when AI is not configured.

```bash
npm run updates:draft -- --baseline /tmp/saytype-releases-before.json
```

Only added/revised release notes plus the existing curated milestones are sent to the API. The command writes review-only proposals into `content-drafts/updates.json`; it never edits published milestones. It validates source versions, existing milestone IDs, schema and coverage. Review each proposed introduction against older releases before adding a new milestone. To publish a reviewed proposal, edit `src/content/milestones.json`, remove the consumed draft, and run the validation commands above. AI failures do not block release-note synchronization; no API call occurs when nothing changed.

After starting the production preview, run `npm run test:http -- http://127.0.0.1:4186` (use your preview port) to verify actual route responses. This catches SPA fallback responses that look correct after JavaScript but initially serve homepage metadata instead of release content.
