# WhispLine Website

Product marketing homepage for WhispLine, a desktop voice input method for macOS, Windows, and Linux.

The page is based on the real app in `../WhispLine`: a Tauri-based desktop prototype with Electron legacy support, a global hold-to-record hotkey, AI transcription via Groq or OpenAI, tray/menu bar operation, an input prompt waveform, and OS-specific permission and insertion behavior.

## Product Message

WhispLine lets users hold `Ctrl+Shift`, speak into any active desktop app, release to transcribe, and insert the resulting text where the cursor already is. `Escape` cancels active recording or transcription.

The site is intentionally honest about the prototype:

- Users configure their own Groq or OpenAI API key.
- Microphone permission is required for voice capture.
- macOS Accessibility permission is required for global hotkeys and full automatic insertion.
- macOS direct insertion uses CGEvent when available.
- Clipboard fallback is available when direct insertion or permission-based insertion is unavailable.
- Cross-platform packaging is positioned for macOS, Windows, and Linux.

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
