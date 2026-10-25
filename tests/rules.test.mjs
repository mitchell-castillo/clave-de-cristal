import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../puzzles.js';
import { evaluate, permutations, candidates, validCode, submitGuess } from '../core.js';

// Independent multiset-intersection oracle, including hypothetical duplicates.
function oracle(secret, guess) {
  const exact = secret.filter((s,i)=>s===guess[i]).length;
  let total=0;
  for(const s of new Set(secret)) total+=Math.min(secret.filter(v=>v===s).length,guess.filter(v=>v===s).length);
  return {exact,misplaced:total-exact};
}
test('documented clue example: exact symbols are never counted twice',()=>{
  assert.deepEqual(evaluate([0,1,2],[1,0,3]),{exact:0,misplaced:2});
  assert.deepEqual(evaluate([0,1,2],[0,2,1]),{exact:1,misplaced:2});
  assert.deepEqual(evaluate([0,1,2],[3,4,5]),{exact:0,misplaced:0});
});
test('clue evaluator exhaustively matches independent oracle even with duplicate inputs',()=>{
  const codes=[];for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)codes.push([a,b,c]);
  for(const secret of codes)for(const guess of codes)assert.deepEqual(evaluate(secret,guess),oracle(secret,guess));
});
const counts=[24,60,120,360,720,2520];
for(const [i,stage] of STAGES.entries()) {
  test(`stage ${i+1}: original clues are valid and uniquely determine the intended solution`,()=>{
    assert.equal(stage.id,i);assert.ok(validCode(stage.secret,stage));
    assert.equal(permutations(stage.palette,stage.length).length,counts[i]);
    assert.ok(stage.clues.length>1);
    assert.equal(new Set(stage.clues.map(c=>c.code.join())).size,stage.clues.length);
    for(const clue of stage.clues){assert.ok(validCode(clue.code,stage));assert.deepEqual(evaluate(stage.secret,clue.code),{exact:clue.exact,misplaced:clue.misplaced});assert.notEqual(clue.exact,stage.length);}
    assert.deepEqual(candidates(stage),[stage.secret]);
  });
  test(`stage ${i+1}: all ${counts[i]} legal guesses evaluate correctly and solution wins`,()=>{
    for(const guess of permutations(stage.palette,stage.length)){
      assert.deepEqual(evaluate(stage.secret,guess),oracle(stage.secret,guess));
      if(stage.clues.some(c=>c.code.join()===guess.join()))continue;
      const result=submitGuess(stage,[],guess);
      assert.equal(result.won,guess.join()===stage.secret.join());
    }
    assert.equal(submitGuess(stage,[],stage.secret).won,true);
  });
}
test('progressive search spaces, six different solutions, untimed puzzles',()=>{
  assert.equal(STAGES.length,6);assert.equal(new Set(STAGES.map(s=>s.secret.join())).size,6);
  assert.ok(counts.every((n,i)=>i===0||n>counts[i-1]));
});
test('partial codes are allowed only in drafts; repeated and out-of-range symbols are rejected',()=>{
  const stage=STAGES[0];assert.ok(validCode([0,null,2],stage,true));
  for(const code of [[0,0,2],[0,1,99],[0,1,-1],[0,1,1.5],[0,1],[0,1,'2'],[null,1,2],null])assert.equal(validCode(code,stage),false);
  assert.equal(validCode([null,null,null],stage,true),true);
  assert.ok(submitGuess(stage,[],[0,null,2]).error);
});
test('already known clues and repeated attempts do not consume a trial',()=>{
  const stage=STAGES[0], guess=[0,1,2];
  assert.ok(submitGuess(stage,[],stage.clues[0].code).error);
  assert.ok(submitGuess(stage,[guess],guess).error);
});
test('last attempt can win; failure and retry are deterministic',()=>{
  const stage=STAGES[0];const wrong=permutations(stage.palette,stage.length).filter(g=>g.join()!==stage.secret.join()&&!stage.clues.some(c=>c.code.join()===g.join()));
  const history=wrong.slice(0,stage.limit-1);
  assert.equal(submitGuess(stage,history,stage.secret).won,true);
  assert.equal(submitGuess(stage,history,wrong[stage.limit-1]).failed,true);
  assert.ok(submitGuess(stage,wrong.slice(0,stage.limit),stage.secret).error);
  assert.equal(submitGuess(stage,[],stage.secret).won,true);
});
