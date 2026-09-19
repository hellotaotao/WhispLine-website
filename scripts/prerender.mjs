import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { renderDocument, renderSitemap, siteUrl } from './site-pages.mjs';

const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({server:{middlewareMode:true, hmr:false, ws:false}, appType:'custom'});
try {
  const {default: UpdatesPage} = await server.ssrLoadModule('/src/updates/UpdatesPage.tsx');
  for (const page of ['updates', 'changelog']) {
    const markup = renderToString(createElement(UpdatesPage, {page}));
    await mkdir(`dist/${page}`, {recursive:true});
    const html = renderDocument(template,markup,page);
    await writeFile(`dist/${page}/index.html`, html);
    await writeFile(`dist/${page}.html`, html);
    console.log(`Pre-rendered /${page} (${Buffer.byteLength(markup)} bytes of HTML)`);
  }
  await writeFile('dist/sitemap.xml',renderSitemap());
  await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
} finally {
  await server.close();
}
