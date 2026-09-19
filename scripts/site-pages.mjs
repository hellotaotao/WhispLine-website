export const siteUrl = 'https://saytype.taotao.au';
const metadata = {
  en: {
    home: {
      title: 'SayType — Your voice. Right where you work.',
      description: 'Voice typing in the apps you already use. Transcribe locally on your Mac with no account or subscription, or connect your own cloud provider.',
    },
    updates: {
      title: 'SayType product updates — Milestones in local voice typing',
      description: 'Explore the important changes in SayType: local transcription, live dictation, recording recovery and model choice, with the versions that introduced them.',
    },
    changelog: {
      title: 'SayType changelog — Complete version history and release notes',
      description: 'Browse every published SayType release by version and date, with original release notes, fixes, improvements and links to the source.',
    },
  },
  zh: {
    home: {
      title: 'SayType — 在常用应用中，用语音输入文字',
      description: '按住快捷键说话，松开后文字出现在光标处。SayType 支持 Mac 本地语音转写，无需账号或订阅，也可选择使用自己的云端服务。',
    },
    updates: {
      title: 'SayType 产品更新 — 本地语音输入的重要进展',
      description: '了解 SayType 的重要更新：本地转写、实时听写、录音恢复与模型选择，以及这些功能首次引入和后续完善的版本。',
    },
    changelog: {
      title: 'SayType 更新日志 — 完整版本历史与发布说明',
      description: '按版本与日期查看 SayType 的完整发布记录，了解新增功能、改进与修复，并追溯原始发布说明。',
    },
  },
};

export function pageMetadata(page, locale = 'en') {
  if (!Object.hasOwn(metadata, locale) || !Object.hasOwn(metadata[locale], page)) throw new Error(`Unknown page or locale: ${page}/${locale}`);
  const path = `${locale === 'zh' ? '/zh' : ''}${page === 'home' ? '' : `/${page}`}` || '/';
  return {...metadata[locale][page], path, url:`${siteUrl}${path}`, lang:locale === 'zh' ? 'zh-CN' : 'en', ogLocale:locale === 'zh' ? 'zh_CN' : 'en_US'};
}
export const sitePages = ['en','zh'].flatMap(locale => ['home','updates','changelog'].map(page => ({page,locale,...pageMetadata(page,locale)})));

const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function renderDocument(template, markup, page, locale = 'en') {
  if (!template.includes('<div id="root"></div>')) throw new Error('Missing empty root in Vite template');
  const meta = pageMetadata(page,locale);
  const alternate = ['en','zh'].map(language => {
    const target = pageMetadata(page,language);
    return `    <link rel="alternate" hreflang="${target.lang}" href="${target.url}" />`;
  }).join('\n');
  return template
    .replace(/<html\b[^>]*>/, `<html lang="${meta.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace(/<meta\s+name="keywords"[\s\S]*?\/?>/, '')
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${meta.url}" />`)
    .replace('</head>', `    <meta property="og:url" content="${meta.url}" />\n    <meta property="og:locale" content="${meta.ogLocale}" />\n    <meta property="og:locale:alternate" content="${locale === 'zh' ? 'en_US' : 'zh_CN'}" />\n${alternate}\n    <link rel="alternate" hreflang="x-default" href="${pageMetadata(page,'en').url}" />\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="true">${markup}</div>`);
}
export function renderSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitePages.map(({url}) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
}
