import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sitePages } from './site-pages.mjs';

const base = process.argv[2];
if (!base || !/^https?:\/\//.test(base)) throw new Error('Usage: npm run test:http -- http://127.0.0.1:4186');
const releases = JSON.parse(await readFile('src/content/releases.json','utf8'));
for (const {path,page,url,lang,title} of sitePages) {
  for(const route of path === '/' ? ['/'] : [path,`${path}/`]) {
    const response = await fetch(new URL(route,base),{signal:AbortSignal.timeout(15_000)});
    assert.equal(response.status,200,route);
    const html = await response.text();
    assert.ok(html.includes('data-prerendered="true"'),`${route} must return content before JavaScript`);
    assert.ok(html.includes(`rel="canonical" href="${url}"`),`${route} canonical`);
    assert.ok(html.includes(`<html lang="${lang}">`),`${route} language`);
    assert.ok(html.includes(`<title>${title}</title>`),`${route} title`);
    if (page === 'changelog') for (const release of releases) assert.ok(html.includes(`id="release-${release.version.replaceAll('.','-')}"`),`${route} ${release.version}`);
    console.log(`PASS ${route}: localized HTML, canonical, content`);
  }
}
for (const route of ['sitemap.xml','robots.txt']) {
  const response = await fetch(new URL(`/${route}`,base),{signal:AbortSignal.timeout(15_000)});
  assert.equal(response.status,200,route);
  const text = await response.text();
  assert.ok(text.includes(route === 'robots.txt' ? 'Sitemap:' : '<urlset'),route);
  console.log(`PASS /${route}`);
}
