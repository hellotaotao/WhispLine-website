export const siteUrl = 'https://saytype.taotao.au';
const metadata = {
  updates: {
    title: 'SayType product updates — Milestones in local voice typing',
    description: 'Explore the important changes in SayType: local transcription, live dictation, recording recovery and model choice, with the versions that introduced them.',
  },
  changelog: {
    title: 'SayType changelog — Complete version history and release notes',
    description: 'Browse every published SayType release by version and date, with original release notes, fixes, improvements and links to the source.',
  },
};
export function pageMetadata(page) {
  if (!Object.hasOwn(metadata, page)) throw new Error(`Unknown page: ${page}`);
  return {...metadata[page], url:`${siteUrl}/${page}`};
}
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function renderDocument(template, markup, page) {
  if (!template.includes('<div id="root"></div>')) throw new Error('Missing empty root in Vite template');
  const meta = pageMetadata(page);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace(/<meta\s+name="keywords"[\s\S]*?\/?>/, '')
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${meta.url}" />`)
    .replace('</head>', `    <meta property="og:url" content="${meta.url}" />\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="true">${markup}</div>`);
}
export function renderSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', '/updates', '/changelog'].map(path => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
}
