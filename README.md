# SayType Website

Product marketing homepage for SayType, a local-first desktop voice input method. macOS is the primary, tested path; Windows and Linux remain experimental.

The page is based on the real app in `../SayType`: a Tauri desktop app with a global hold-to-record hotkey, local Qwen3-ASR transcription or optional Groq/OpenAI cloud transcription, tray/menu bar operation, microphone selection, an input prompt waveform, local history, automatic updates, and macOS-specific insertion behaviour.

## Product Message

SayType lets users hold `Ctrl+Shift`, speak into any active desktop app, release to transcribe, and insert the resulting text where the cursor already is. `Escape` cancels active recording or transcription.

The site is intentionally honest about the prototype:

- On Apple Silicon Macs, Qwen3-ASR runs locally after a ~1 GB one-time download; no account or API key is needed and audio stays on the machine.
- Cloud mode uses the user's own Groq or OpenAI API key.
- Microphone permission is required for voice capture.
- macOS Accessibility permission is required for global hotkeys and full automatic insertion.
- macOS direct insertion uses CGEvent when available.
- When macOS automatic insertion cannot complete, the transcription remains in local History for manual copy.
- Windows and Linux build targets exist but are explicitly marked experimental.

## Implementation

- Vite, React, and TypeScript.
- Product copy lives in `src/content/productMessaging.ts`.
- Messaging tests live in `src/content/productMessaging.test.ts` and cover target users, pain points, feature/value mappings, providers, platforms, permissions, and the end-to-end workflow.
- CSS avoids high GPU-cost effects: no infinite animations, `backdrop-filter`, `mix-blend-mode`, large blur filters, or fixed animated backgrounds.

## Development

```bash
npm install
npm run dev
npm test
npm run build
npm run lint
```

## Build Output

Production assets are generated into `dist/` with:

```bash
npm run build
```
