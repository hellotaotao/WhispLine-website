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
