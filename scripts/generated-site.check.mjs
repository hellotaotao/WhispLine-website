import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const releases = JSON.parse(await readFile('src/content/releases.json', 'utf8'));
const milestones = JSON.parse(await readFile('src/content/milestones.json', 'utf8'));
test('built pages contain complete indexable content, correct metadata and working local assets', async () => {
  for(const page of ['updates','changelog']) {
    const html = await readFile(`dist/${page}.html`, 'utf8');
    assert.equal(html, await readFile(`dist/${page}/index.html`, 'utf8'));
    assert.ok(html.includes(`rel="canonical" href="https://saytype.taotao.au/${page}"`));
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
    assert.ok(html.includes('data-prerendered="true"'));
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) assert.ok((await stat(`dist${match[1]}`)).isFile());
    if(page === 'changelog') {
      for(const release of releases) {
        assert.ok(html.includes(`id="release-${release.version.replaceAll('.', '-')}"`), release.version);
        assert.ok(html.includes(release.url));
      }
    } else {
      for(const milestone of milestones) assert.ok(html.includes(`id="${milestone.id}"`),milestone.id);
    }
  }
  assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('/changelog'));
  assert.ok((await readFile('dist/robots.txt','utf8')).includes('Sitemap: https://saytype.taotao.au/sitemap.xml'));
});
