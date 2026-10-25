import test from 'node:test';import assert from 'node:assert/strict';import {readFile,access} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('independent static delivery includes original art, documentation and checks',async()=>{
  for(const file of ['.nojekyll','README.md','.github/workflows/check.yml','assets/cover.svg','assets/symbols.svg','assets/favicon.svg'])await access(new URL('../'+file,import.meta.url));
  const pkg=JSON.parse(await read('package.json'));assert.equal(pkg.dependencies,undefined);assert.equal(pkg.devDependencies,undefined);
});
test('Spanish accessible shell keeps requests local and telemetry off',async()=>{
  const html=await read('index.html'), js=await read('app.js');
  assert.match(html,/<html lang="es">/);assert.match(html,/connect-src 'none'/);assert.match(html,/<dialog/);assert.match(html,/role="status"/);
  assert.doesNotMatch(js,/fetch\(|sendBeacon|XMLHttpRequest|https?:\/\//);assert.doesNotMatch(html,/<(?:script|link|img)[^>]+(?:src|href)="https?:/);
});
