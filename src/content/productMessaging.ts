export type TargetUser = {
  id: string
  title: string
  need: string
  value: string
}

export type PainPoint = {
  id: string
  problem: string
  consequence: string
}

export type ValueMapping = {
  painPointId: string
  featureId: string
  value: string
}

export type WorkflowStep = {
  label: string
  title: string
  description: string
}

export type ProductFeature = {
  id: string
  title: string
  description: string
}

export type PermissionDetail = {
  title: string
  description: string
}

export type PlatformDetail = {
  name: 'macOS' | 'Windows' | 'Linux'
  status: string
  detail: string
}

export type ProviderDetail = {
  name: 'Groq' | 'OpenAI'
  models: string[]
  note: string
}

export type ProductMessaging = {
  productName: 'WhispLine'
  currentReality: string
  hero: {
    eyebrow: string
    headline: string
    subheadline: string
    primaryCta: string
    secondaryCta: string
    proofPoints: string[]
  }
  targetUsers: TargetUser[]
  painPoints: PainPoint[]
  valueMappings: ValueMapping[]
  workflow: WorkflowStep[]
  features: ProductFeature[]
  permissions: PermissionDetail[]
  platforms: PlatformDetail[]
  providers: ProviderDetail[]
  workflowExample: {
    sourceApp: string
    dictated: string
    inserted: string
  }
  cta: {
    headline: string
    description: string
    note: string
  }
}

export const productMessaging: ProductMessaging = {
  productName: 'WhispLine',
  currentReality:
    'WhispLine is a desktop voice input prototype with a Tauri-based main build and Electron legacy support. Users configure their own transcription API key.',
  hero: {
    eyebrow: 'Desktop voice input for every text field',
    headline: 'Hold a hotkey, speak, and keep writing where your cursor already is.',
    subheadline:
      'WhispLine runs quietly in the menu bar or system tray, records while you hold Ctrl+Shift, sends audio to your chosen AI transcription provider, then inserts the result into the active app.',
    primaryCta: 'Get the desktop build',
    secondaryCta: 'See the workflow',
    proofPoints: [
      'Hold Ctrl+Shift to record',
      'Release to transcribe',
      'Escape cancels recording or transcription',
      'Clipboard fallback when direct insertion is unavailable',
    ],
  },
  targetUsers: [
    {
      id: 'developers',
      title: 'Developers',
      need: 'Long comments, PR notes, standup updates, issue triage, and architecture notes without leaving the editor.',
      value: 'Dictate structured text directly into IDEs, terminals, docs, and chat tools.',
    },
    {
      id: 'writers',
      title: 'Writers',
      need: 'Draft faster across notes, manuscripts, outlines, and research tools.',
      value: 'Capture paragraphs in place instead of moving ideas through a separate dictation app.',
    },
    {
      id: 'bilingual-workers',
      title: 'Bilingual workers',
      need: 'Switch between languages for messages, docs, and support replies.',
      value: 'Choose transcription language behavior and UI language from settings.',
    },
    {
      id: 'support-ops',
      title: 'Support and ops teams',
      need: 'Turn live context into clear tickets, handoff notes, and customer replies.',
      value: 'Speak operational updates into the exact system already open.',
    },
    {
      id: 'desktop-power-users',
      title: 'Desktop power users',
      need: 'Reduce repetitive typing across many native and web apps.',
      value: 'Use one global voice input method instead of app-by-app voice tools.',
    },
  ],
  painPoints: [
    {
      id: 'native-dictation',
      problem: 'Native dictation can be inconsistent across apps and operating systems.',
      consequence: 'Users hesitate to rely on it for long, precise desktop writing.',
    },
    {
      id: 'fragmented-voice',
      problem: 'Voice input is often locked inside one browser tab, app, or editor.',
      consequence: 'People copy text around instead of staying in their current workflow.',
    },
    {
      id: 'slow-typing',
      problem: 'Typing long notes, explanations, code comments, and replies is slow.',
      consequence: 'High-context work gets postponed or shortened.',
    },
    {
      id: 'browser-tools',
      problem: 'Browser voice tools do not reliably insert text into arbitrary desktop apps.',
      consequence: 'They help with drafts, but not with the place where work actually happens.',
    },
  ],
  valueMappings: [
    {
      painPointId: 'native-dictation',
      featureId: 'provider-choice',
      value: 'Use Groq Whisper or OpenAI transcription models instead of relying on built-in dictation quality.',
    },
    {
      painPointId: 'fragmented-voice',
      featureId: 'global-hotkey',
      value: 'A global hold-to-record shortcut works from the app you are already using.',
    },
    {
      painPointId: 'slow-typing',
      featureId: 'active-app-insertion',
      value: 'Speak naturally, release the keys, and get text back at the cursor.',
    },
    {
      painPointId: 'browser-tools',
      featureId: 'desktop-fallback',
      value: 'Direct insertion is used where available, with clipboard insertion as a fallback.',
    },
  ],
  workflow: [
    {
      label: '01',
      title: 'Keep WhispLine in the tray',
      description: 'The desktop app stays out of the way in the menu bar or system tray until you need it.',
    },
    {
      label: '02',
      title: 'Hold Ctrl+Shift',
      description: 'Press and hold the global recording shortcut from any app, with shortcut options available in settings.',
    },
    {
      label: '03',
      title: 'Speak with visual feedback',
      description: 'A compact input prompt appears with real-time recording and waveform feedback.',
    },
    {
      label: '04',
      title: 'Release to transcribe',
      description: 'WhispLine stops recording on release and sends the audio to the configured Groq or OpenAI model.',
    },
    {
      label: '05',
      title: 'Text appears in place',
      description:
        'The transcript is inserted into the active app when possible, or copied to the clipboard when a fallback is needed.',
    },
    {
      label: '06',
      title: 'Cancel instantly',
      description: 'Press Escape to cancel an active recording or an in-progress transcription request.',
    },
  ],
  features: [
    {
      id: 'global-hotkey',
      title: 'Global hold-to-record hotkey',
      description: 'Hold Ctrl+Shift to record, release to stop, and keep your hands near the keyboard.',
    },
    {
      id: 'active-app-insertion',
      title: 'Active-app text insertion',
      description: 'Transcribed text is sent back to the app and text field that already has your cursor.',
    },
    {
      id: 'live-overlay',
      title: 'Prompt overlay with waveform',
      description: 'A small always-on-top prompt confirms recording state with real-time audio visualization.',
    },
    {
      id: 'provider-choice',
      title: 'Configurable AI transcription',
      description: 'Choose Groq or OpenAI, select a model, and keep API keys under your own account.',
    },
    {
      id: 'desktop-fallback',
      title: 'Direct insertion plus clipboard fallback',
      description: 'macOS uses CGEvent direct insertion where permissions allow; clipboard fallback keeps the text available.',
    },
    {
      id: 'quiet-background',
      title: 'Quiet background operation',
      description: 'WhispLine runs from the tray, supports auto launch, and exposes settings only when needed.',
    },
  ],
  permissions: [
    {
      title: 'User-owned API keys',
      description: 'WhispLine expects the user to configure a Groq or OpenAI API key in desktop settings.',
    },
    {
      title: 'Microphone access',
      description: 'Microphone permission is required to capture voice input for transcription.',
    },
    {
      title: 'macOS Accessibility permission',
      description:
        'macOS requires Accessibility permission for global hotkeys and full automatic insertion into other apps.',
    },
    {
      title: 'Clipboard fallback',
      description:
        'When direct insertion or Accessibility permission is unavailable, WhispLine can copy the transcript to the clipboard for paste.',
    },
  ],
  platforms: [
    {
      name: 'macOS',
      status: 'Primary desktop path',
      detail: 'Tauri build, menu bar operation, microphone permission, Accessibility permission, CGEvent insertion, and clipboard fallback.',
    },
    {
      name: 'Windows',
      status: 'Platform packaging path',
      detail: 'Windows build targets exist, with desktop hotkey and insertion behavior handled through platform-specific code paths and fallback behavior.',
    },
    {
      name: 'Linux',
      status: 'Platform packaging path',
      detail: 'Linux build targets exist, with desktop tray operation and fallback-oriented insertion behavior.',
    },
  ],
  providers: [
    {
      name: 'Groq',
      models: ['whisper-large-v3', 'whisper-large-v3-turbo'],
      note: 'Whisper models for fast speech-to-text and translation-mode support.',
    },
    {
      name: 'OpenAI',
      models: ['whisper-1', 'gpt-4o-transcribe', 'gpt-4o-mini-transcribe'],
      note: 'OpenAI transcription models, with whisper-1 used for translation mode.',
    },
  ],
  workflowExample: {
    sourceApp: 'Cursor, Slack, Linear, Notion, Gmail, terminal notes',
    dictated:
      'The regression is probably in the new permission flow. I am going to add a retry around the accessibility recheck and update the release notes.',
    inserted:
      'The regression is probably in the new permission flow. I am going to add a retry around the accessibility recheck and update the release notes.',
  },
  cta: {
    headline: 'Voice input that follows your desktop workflow.',
    description:
      'Use WhispLine when typing becomes the bottleneck: comments, tickets, docs, replies, notes, and multilingual work across the apps you already use.',
    note: 'Current prototype: desktop app, user-configured API key, microphone access required, macOS Accessibility permission required for full automatic insertion.',
  },
}
