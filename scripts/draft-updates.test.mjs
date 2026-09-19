import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDraftPrompt, validateDraft } from './draft-updates-lib.mjs';
const releases = [{version:'v1.0.0',notesStatus:'available',body:'First release'},{version:'v1.1.0',notesStatus:'available',body:'New feature'}];
const milestones = [{id:'local-transcription',introducedVersion:'v1.0.0',evolution:[]}];
const changed = [releases[1]];
const proposal = {kind:'extend',milestoneId:'local-transcription',title:'Local changes',summary:'A new option.',sourceVersions:['v1.1.0'],reason:'Extends an existing feature.'};
test('prompt includes changed evidence and curated milestones, with a review-only boundary', () => {
  const prompt = buildDraftPrompt(changed, milestones);
  assert.match(prompt.system,/untrusted/i);
  assert.match(prompt.system,/human review/i);
  assert.ok(prompt.user.includes('New feature'));
  assert.ok(prompt.user.includes('local-transcription'));
});
test('accepts evidence-backed draft without changing the curated milestone object', () => {
  const before = JSON.stringify(milestones);
  assert.deepEqual(validateDraft({proposals:[proposal]},releases,milestones,changed),{proposals:[proposal]});
  assert.equal(JSON.stringify(milestones),before);
});
test('rejects nonexistent versions, unknown milestones, invented availability and missing evidence', () => {
  for (const invalid of [
    {...proposal,sourceVersions:['v9.9.9']}, {...proposal,milestoneId:'invented'},
    {...proposal,kind:'publish'}, {...proposal,sourceVersions:[]}, {...proposal,sourceVersions:['v1.0.0']},
    {...proposal,summary:''}, {...proposal,sourceVersions:['v1.1.0'],confidence:'verified'},
  ]) assert.throws(()=>validateDraft({proposals:[invalid]},releases,milestones,changed));
  assert.throws(()=>validateDraft({proposals:[proposal]},[...releases.slice(0,1),{...releases[1],notesStatus:'missing'}],milestones,changed));
});
test('requires every changed available release to be considered, even if skipped', () => {
  assert.throws(()=>validateDraft({proposals:[]},releases,milestones,changed));
  assert.doesNotThrow(()=>validateDraft({proposals:[{...proposal,kind:'skip',milestoneId:null}]},releases,milestones,changed));
});
