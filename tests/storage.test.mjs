import test from 'node:test';import assert from 'node:assert/strict';
import {STAGES} from '../puzzles.js';
import {STORAGE_KEY,emptyProgress,normalizeProgress,readProgress,writeProgress,firstUnfinished} from '../storage.js';
const storage=(raw=null)=>({getItem:()=>raw,setItem(key,value){assert.equal(key,STORAGE_KEY);raw=value;}});
test('catalogue-compatible version, level and bestMoves namespace',()=>{
  assert.equal(STORAGE_KEY,'daily-games:clave-de-cristal:v1');
  const value={...emptyProgress(),completed:{0:{bestMoves:2}},currentLevel:1};
  assert.deepEqual(normalizeProgress(value),value);assert.equal(firstUnfinished(value.completed),1);
});
test('valid draft and attempts survive round-trip without mutation',()=>{
  const p=emptyProgress();p.run={level:0,guesses:[[0,1,2]],draft:[1,null,0]};
  const s=storage();assert.equal(writeProgress(p,s),true);const result=readProgress(s);
  assert.deepEqual(result.progress.run,p.run);assert.equal(result.recovered,false);assert.equal(p.updatedAt,null);
});
test('winning runs and all six completion marks survive reload',()=>{
  const p=emptyProgress();p.currentLevel=5;STAGES.forEach((s,i)=>p.completed[i]={bestMoves:1});p.run={level:5,guesses:[STAGES[5].secret],draft:Array(5).fill(null)};
  assert.deepEqual(normalizeProgress(p),p);
});
test('invalid JSON, oversized data and unsupported versions recover safely',()=>{
  for(const raw of ['{','x'.repeat(50001),'null','{"version":99}', '[]']){const r=readProgress(storage(raw));assert.equal(r.recovered,true);assert.equal(r.available,true);assert.deepEqual(r.progress,emptyProgress());}
  assert.equal(readProgress(storage()).recovered,false);
});
test('blocked reads and writes degrade to in-memory play',()=>{
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
  assert.equal(readProgress(blocked).available,false);assert.equal(writeProgress(emptyProgress(),blocked),false);
});
test('malicious completion records cannot unlock stages or inject HTML',()=>{
  const p={version:1,currentLevel:999,completed:{0:{bestMoves:'<img>'},1:{bestMoves:1},99:{bestMoves:2}},run:null};
  assert.deepEqual(normalizeProgress(p),emptyProgress());
  for(const best of [-1,0,1.2,999,NaN])assert.deepEqual(normalizeProgress({...p,completed:{0:{bestMoves:best}}}),emptyProgress());
});
test('corrupt drafts, cross-stage saves, duplicate attempts and attempts after a win are discarded',()=>{
  const base=emptyProgress(), stage=STAGES[0];
  const badRuns=[{level:1,guesses:[],draft:[null,null,null]},{level:0,guesses:[[0,0,1]],draft:[null,null,null]},{level:0,guesses:[[0,1,2],[0,1,2]],draft:[null,null,null]},{level:0,guesses:[],draft:[1,1,null]},{level:0,guesses:[stage.secret,[0,1,2]],draft:[null,null,null]}];
  for(const run of badRuns)assert.equal(normalizeProgress({...base,run}).run,null);
});
test('an unearned winning run is discarded, confirmed completion is preserved',()=>{
  const p=emptyProgress();p.run={level:0,guesses:[STAGES[0].secret],draft:[null,null,null]};
  assert.equal(normalizeProgress(p).run,null);p.completed[0]={bestMoves:1};assert.ok(normalizeProgress(p).run);
});
test('reset writes only its own key and restores a new game',()=>{
  const data=new Map([['other-game','keep']]);const s={getItem:key=>data.get(key)??null,setItem:(key,v)=>data.set(key,v)};
  const p=emptyProgress();p.completed[0]={bestMoves:2};writeProgress(p,s);writeProgress(emptyProgress(),s);
  assert.equal(data.get('other-game'),'keep');assert.deepEqual(readProgress(s).progress.completed,{});
});
