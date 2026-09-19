import test from 'node:test';
import assert from 'node:assert/strict';
import { pageMetadata, renderDocument, renderSitemap } from './site-pages.mjs';
const template = '<!doctype html><html lang="en"><head><title>Home</title><meta name="description" content="Home copy"/><meta property="og:title" content="Home"/><meta property="og:description" content="Home"/><link rel="canonical" href="https://saytype.taotao.au/"/><script type="module" src="/assets/index.js"></script><link rel="stylesheet" href="/assets/index.css"></head><body><div id="root"></div></body></html>';
test('renders unique self-canonical documents with complete server HTML and reusable assets', () => {
  for(const page of ['updates','changelog']) {
    const html = renderDocument(template, '<main><h1>Real content</h1></main>', page);
    assert.ok(html.includes(`<link rel="canonical" href="https://saytype.taotao.au/${page}"`));
    assert.ok(html.includes('data-prerendered="true"'));
    assert.ok(html.includes('<main><h1>Real content</h1></main>'));
    assert.ok(html.includes('/assets/index.css'));
    assert.ok(html.includes('/assets/index.js'));
    assert.ok(html.includes(`<meta property="og:url" content="https://saytype.taotao.au/${page}"`));
    assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
    assert.ok(!html.includes('Home copy'));
  }
  assert.notEqual(pageMetadata('updates').title,pageMetadata('changelog').title);
});
test('rejects unknown routes and missing root rather than silently producing empty pages', () => {
  assert.throws(()=>pageMetadata('unknown'));
  assert.throws(()=>renderDocument('<html></html>', '<main/>', 'updates'));
});
test('sitemap exposes homepage and both independent views without artificial dates', () => {
  const xml = renderSitemap();
  for(const url of ['https://saytype.taotao.au/','https://saytype.taotao.au/updates','https://saytype.taotao.au/changelog']) assert.ok(xml.includes(`<loc>${url}</loc>`));
  assert.ok(!xml.includes('<lastmod>'));
});
