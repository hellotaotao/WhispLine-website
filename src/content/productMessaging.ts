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
  name: 'Local Qwen3' | 'Groq' | 'OpenAI'
  models: string[]
  note: string
}

export type ProductMessaging = {
  productName: 'SayType'
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
  productName: 'SayType',
  currentReality:
    'SayType is a Tauri desktop voice input app. On Apple Silicon Macs it can run Qwen3 transcription locally after a one-time model download; Groq and OpenAI remain optional cloud engines using your own key.',
  hero: {
    eyebrow: 'Your voice, instantly typed.',
    headline: 'One shortcut. Every app.',
    subheadline: 'Hold Ctrl+Shift, speak, release.',
    primaryCta: 'Download for Mac',
    secondaryCta: 'See how it works',
    proofPoints: [
      'Hold Ctrl+Shift to record',
      'Release to transcribe',
      'Escape cancels recording or transcription',
      'Local Qwen3 mode keeps audio on your Mac',
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
      featureId: 'engine-choice',
      value: 'Choose private local transcription or your own Groq/OpenAI account without changing how you dictate.',
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
      featureId: 'history',
      value: 'Every completed transcript is kept in History, where it can be copied manually if insertion needs attention.',
    },
  ],
  workflow: [
    {
      label: '01',
      title: 'Keep SayType in the tray',
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
      description: 'SayType stops recording on release and transcribes with your selected local or cloud engine. Local mode shows progress as text arrives.',
    },
    {
      label: '05',
      title: 'Text appears in place',
      description:
        'On macOS, SayType inserts the transcript into the active app. If an app blocks insertion, the completed text remains available in History to copy.',
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
      id: 'engine-choice',
      title: 'Local-first engine choice',
      description: 'Apple Silicon Macs can run Qwen3-ASR locally after a ~1 GB one-time download. Or connect your own Groq or OpenAI key.',
    },
    {
      id: 'microphone-choice',
      title: 'Choose the microphone that works for you',
      description: 'Select a microphone from Settings or the tray. If a saved device is unavailable, SayType safely uses the system default until it returns.',
    },
    {
      id: 'quiet-background',
      title: 'Quiet background operation',
      description: 'SayType runs from the tray, supports auto launch, and downloads verified updates in the background for you to install when ready.',
    },
    {
      id: 'history',
      title: 'History and manual copy',
      description: 'Completed transcriptions are saved locally in History, so you can review and copy a result whenever you need it.',
    },
  ],
  permissions: [
    {
      title: 'Local mode or your own cloud key',
      description: 'Local Qwen3 mode needs no account or API key. Cloud mode sends audio directly to the Groq or OpenAI account you configure.',
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
      title: 'Your audio stays local in local mode',
      description:
        'Qwen3-ASR runs on your machine after its one-time download. SayType has no server in the middle; cloud mode is an explicit choice.',
    },
  ],
  platforms: [
    {
      name: 'macOS',
      status: 'Primary desktop path',
      detail: 'The primary, tested path: menu bar operation, local Qwen3 on Apple Silicon, microphone selection, Accessibility permission, and CGEvent-based automatic text insertion.',
    },
    {
      name: 'Windows',
      status: 'Experimental',
      detail: 'A build target and native insertion path exist, but it has not received the same real-world validation as macOS.',
    },
    {
      name: 'Linux',
      status: 'Experimental',
      detail: 'A build target exists, but desktop integration and insertion behaviour are still experimental.',
    },
  ],
  providers: [
    {
      name: 'Local Qwen3',
      models: ['Qwen3-ASR-0.6B Q8_0', '~1 GB one-time download'],
      note: 'Recommended on Apple Silicon Macs. No account or API key; audio stays on your machine. Translation still uses a configured cloud engine.',
    },
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
    headline: 'A faster way to write, without sending every thought to the cloud.',
    description:
      'Use SayType when typing becomes the bottleneck: comments, tickets, docs, replies, notes, and multilingual work across the apps you already use.',
    note: 'macOS is the primary path. Local mode needs an Apple Silicon Mac and a ~1 GB model download; microphone access and macOS Accessibility permission are required for the full voice-typing workflow.',
  },
}
