import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeReleases, fetchAllReleases, changedReleases, validateSnapshotUpdate } from './release-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(root, 'src/content/releases.json');
const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--from-file');
if (args.length && (args.length !== 2 || sourceIndex !== 0 || !args[1])) {
  throw new Error('Usage: node scripts/sync-releases.mjs [--from-file path-to-github-response.json]');
}
let previous = [];
try { previous = JSON.parse(await readFile(file, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const raw = sourceIndex >= 0 ? JSON.parse(await readFile(resolve(args[sourceIndex + 1]), 'utf8')) : await fetchAllReleases();
const next = normalizeReleases(raw);
if (!next.length) throw new Error('No published releases returned; existing snapshot left unchanged');
validateSnapshotUpdate(previous, next);
const changed = changedReleases(previous, next);
if (changed.length) {
  await mkdir(dirname(file), {recursive:true});
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`);
  await rename(temporary, file);
}
console.log(`${next.length} published releases; ${changed.length} added or revised.`);
for (const release of next.filter(record => record.notesStatus === 'missing')) {
  console.warn(`Missing release notes: ${release.version} (kept as a visible gap, not invented).`);
}
