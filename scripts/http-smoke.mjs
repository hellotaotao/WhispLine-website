import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.argv[2];
if (!base || !/^https?:\/\//.test(base)) throw new Error('Usage: npm run test:http -- http://127.0.0.1:4186');
const releases = JSON.parse(await readFile('src/content/releases.json','utf8'));
for (const route of ['updates','updates/','changelog','changelog/']) {
  const response = await fetch(new URL(`/${route}`,base),{signal:AbortSignal.timeout(15_000)});
  assert.equal(response.status,200,route);
  const html = await response.text();
  const page = route.replace(/\/$/,'');
  assert.ok(html.includes('data-prerendered="true"'),`${route} must return content before JavaScript`);
  assert.ok(html.includes(`rel="canonical" href="https://saytype.taotao.au/${page}"`),`${route} canonical`);
  assert.ok(html.includes(page === 'updates' ? 'Milestones in local voice typing' : 'Complete version history and release notes'),`${route} title`);
  if (page === 'changelog') for (const release of releases) assert.ok(html.includes(`id="release-${release.version.replaceAll('.','-')}"`),`${route} ${release.version}`);
  console.log(`PASS /${route}: HTML, canonical, content`);
}
for (const route of ['sitemap.xml','robots.txt']) {
  const response = await fetch(new URL(`/${route}`,base),{signal:AbortSignal.timeout(15_000)});
  assert.equal(response.status,200,route);
  const text = await response.text();
  assert.ok(text.includes(route === 'robots.txt' ? 'Sitemap:' : '<urlset'),route);
  console.log(`PASS /${route}`);
}
