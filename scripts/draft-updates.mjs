import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedReleases } from './release-data.mjs';
import { buildDraftPrompt, validateDraft } from './draft-updates-lib.mjs';

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--baseline') throw new Error('Usage: npm run updates:draft -- --baseline /path/to/previous-releases.json');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = async file => JSON.parse(await readFile(file, 'utf8'));
const releases = await read(resolve(root, 'src/content/releases.json'));
const milestones = await read(resolve(root, 'src/content/milestones.json'));
const baseline = await read(resolve(args[1]));
const changed = changedReleases(baseline,releases).filter(record => record.notesStatus === 'available');
if (!changed.length) {
  console.log('No changed release notes; no AI call or draft rewrite.');
} else {
  if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) throw new Error('Set ANTHROPIC_API_KEY and ANTHROPIC_MODEL to generate review-only drafts.');
  const prompt = buildDraftPrompt(changed,milestones);
  if (prompt.user.length > 160_000) throw new Error('Evidence exceeds the draft budget; use smaller reviewed batches');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST', signal:AbortSignal.timeout(120_000),
    headers:{'content-type':'application/json', 'x-api-key':process.env.ANTHROPIC_API_KEY, 'anthropic-version':'2023-06-01'},
    body:JSON.stringify({model:process.env.ANTHROPIC_MODEL,max_tokens:8000,system:prompt.system,messages:[{role:'user',content:prompt.user}]}),
  });
  if (!response.ok) throw new Error(`Draft generation HTTP ${response.status}; published milestones unchanged`);
  const result = await response.json();
  if (result.stop_reason !== 'end_turn') throw new Error('Draft response incomplete; published milestones unchanged');
  const output = result.content.filter(block => block.type === 'text').map(block => block.text).join('');
  const draft = validateDraft(JSON.parse(output),releases,milestones,changed);
  const folder = resolve(root,'content-drafts');
  await mkdir(folder,{recursive:true});
  await writeFile(resolve(folder,'updates.json'),`${JSON.stringify({status:'needs-human-review',sourceVersions:changed.map(record=>record.version),...draft},null,2)}\n`);
  console.log('Wrote content-drafts/updates.json for review. Curated milestones were not modified.');
}
