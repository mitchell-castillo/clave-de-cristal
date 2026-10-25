import { STAGES } from './puzzles.js';
import { evaluate, submitGuess } from './core.js';
import { STORAGE_KEY, emptyProgress, firstUnfinished, readProgress, writeProgress } from './storage.js';

const SYMBOLS = [ ['sun','Sol'], ['moon','Luna'], ['leaf','Hoja'], ['drop','Gota'], ['star','Estrella'], ['flame','Llama'], ['diamond','Rombo'] ];
const main = document.querySelector('#main'), message = document.querySelector('#message');
const notice = document.querySelector('#storage-notice'), dialog = document.querySelector('#confirm-dialog');
let loaded;
// Accessing localStorage itself can throw in privacy-restricted contexts.
try { loaded = readProgress(window.localStorage); } catch { loaded = { progress: emptyProgress(), available: false }; }
let progress = loaded.progress, view = 'home', active = 0, pending = null, returnFocus = null, revealed = false;
if (!loaded.available) storageWarning();
else if (loaded.recovered) showNotice('El guardado anterior estaba incompleto o dañado. Recuperamos el avance válido; puedes continuar con seguridad.');

function showNotice(text) { notice.hidden = false; notice.textContent = text; }
function storageWarning() { showNotice('Este navegador no permite guardar ahora. Puedes jugar; el avance de esta sesión podría perderse al cerrar o recargar.'); }
function persist() { try { if (!writeProgress(progress, window.localStorage)) storageWarning(); } catch { storageWarning(); } }
function say(text) { message.textContent = text; }
function symbol(id) { return `<span class="symbol s${id}" role="img" aria-label="${SYMBOLS[id][1]}"><svg aria-hidden="true"><use href="assets/symbols.svg#${SYMBOLS[id][0]}"></use></svg></span>`; }
function codeHTML(code) { return `<span class="code" role="img" aria-label="${code.map(s => SYMBOLS[s][1]).join(', ')}">${code.map(symbol).join('')}</span>`; }
function clueHTML(clue, label) { return `<div class="clue-row"><div class="clue-label">${label}</div><div class="clue-inner">${codeHTML(clue.code)}<span class="clue-counts"><span class="exact">● ${clue.exact} ${clue.exact===1?'exacto':'exactos'}</span><span class="misplaced">↔ ${clue.misplaced} ${clue.misplaced===1?'desplazado':'desplazados'}</span></span></div></div>`; }
function status() {
  const run = progress.run, stage = STAGES[progress.currentLevel];
  const won = run?.guesses.length && evaluate(stage.secret, run.guesses.at(-1)).exact === stage.length;
  return { won: Boolean(won), failed: !won && run?.guesses.length >= stage.limit };
}
function focusHeading() { main.querySelector('h1')?.focus(); }
function render() {
  say('');
  if (view === 'home') renderHome();
  else if (view === 'complete') renderComplete();
  else renderPlay();
}
function renderHome() {
  const count = Object.keys(progress.completed).length, hasProgress = progress.run || count;
  main.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">Deducción · seis cerraduras · sin reloj</p><h1 tabindex="-1">La luz guarda<br>una <em>clave.</em></h1><p class="lead">Cada cristal ocupa un lugar. Cruza las pistas, descubre su orden y abre las seis puertas del taller.</p><div class="pills"><span>Formas + colores</span><span>Sin símbolos repetidos</span><span>A tu ritmo</span></div><div class="actions"><button class="primary" data-action="continue">${count === 6 && !progress.run ? 'Ver mi colección' : hasProgress ? 'Continuar' : 'Entrar al taller'} <span aria-hidden="true">→</span></button>${hasProgress ? '<button class="quiet" data-action="reset">Borrar mi avance</button>' : ''}</div></div><img class="hero-art" src="assets/cover.svg" alt="Un prisma luminoso protege seis sellos de cristal" width="1200" height="760"></section><div class="section-label"><h2>Las cerraduras del taller</h2><span>${count} de 6 abiertas</span></div><nav class="locks" aria-label="Elegir cerradura">${STAGES.map((stage,i) => `<button class="lock-card ${progress.completed[i]?'open':''}" data-level="${i}" ${i>firstUnfinished(progress.completed)?'disabled':''} aria-label="${i+1}. ${stage.name}. ${progress.completed[i]?'Abierta, repetir':i>firstUnfinished(progress.completed)?'Bloqueada':'Disponible'}"><span class="lock-number" aria-hidden="true">${progress.completed[i]?'◇':String(i+1).padStart(2,'0')}</span><strong>${stage.name}</strong><small>${progress.completed[i]?`Abierta · ${progress.completed[i].bestMoves} ${progress.completed[i].bestMoves===1?'prueba':'pruebas'}`:i>firstUnfinished(progress.completed)?'Abre la anterior':`${stage.length} casillas · ${stage.palette} símbolos`}</small></button>`).join('')}</nav>`;
}
function renderPlay() {
  const stage = STAGES[progress.currentLevel], run = progress.run, state = status();
  const history = run.guesses.map((code,i) => clueHTML({ code, ...evaluate(stage.secret, code) }, `Prueba ${i+1}`)).join('');
  main.innerHTML = `<div class="play-top"><button class="secondary" data-action="home">← Taller</button><div class="steps" aria-label="Cerradura ${stage.id+1} de 6">${STAGES.map((_,i)=>`<span class="step ${progress.completed[i]?'done':i===stage.id?'active':''}"></span>`).join('')}</div><button class="quiet" data-action="retry">Reiniciar</button></div><section class="stage-heading"><div><p class="stage-index">CERRADURA ${String(stage.id+1).padStart(2,'0')} / 06</p><h1 tabindex="-1">${stage.name}</h1><p>${stage.subtitle}</p></div><div class="stage-spec"><strong>${stage.length}</strong> casillas · <strong>${stage.palette}</strong> símbolos<br>Sin repeticiones</div></section><div class="workspace"><section class="panel archive" aria-labelledby="archive-title"><div class="panel-title"><h2 id="archive-title">Pistas de archivo</h2><span class="label-tag">Siempre visibles</span></div><p class="hint">Estas ${stage.clues.length} pistas juntas señalan una sola clave. Los números son totales; no señalan casillas concretas.</p><div class="legend"><span class="badge exact">● Lugar correcto</span><span class="badge misplaced">↔ Símbolo en otro lugar</span></div>${stage.clues.map((clue,i)=>clueHTML(clue,`Archivo ${String.fromCharCode(65+i)}`)).join('')}</section><section class="panel editor" aria-labelledby="editor-title">${state.won ? winHTML(stage) : state.failed ? failHTML(stage) : editorHTML(stage,run)}<div class="history"><h3>Tus pruebas · ${run.guesses.length} de ${stage.limit}</h3>${history || '<div class="empty-history">Las nuevas pistas aparecerán aquí.<br>Observa el archivo antes de probar.</div>'}</div></section></div>`;
}
function editorHTML(stage, run) {
  return `<div class="panel-title"><h2 id="editor-title">Tu propuesta</h2><span class="label-tag">${stage.length} casillas</span></div><p class="hint">Elige una casilla y luego un símbolo. Se avanza automáticamente a la siguiente.</p><div class="draft" role="group" aria-label="Editar la clave">${run.draft.map((s,i)=>`<button class="slot ${active===i?'active':''}" data-slot="${i}" aria-pressed="${active===i}" aria-label="Casilla ${i+1}, ${s===null?'vacía':SYMBOLS[s][1]}">${s===null?'<span class="empty-slot" aria-hidden="true">·</span>':symbol(s)}<small>CASILLA ${i+1}</small></button>`).join('')}</div><p class="slot-caption">Casilla ${active+1} seleccionada · Sin repetir símbolos</p><div class="palette" role="group" aria-label="Símbolos disponibles">${SYMBOLS.slice(0,stage.palette).map((s,i)=>`<button data-symbol="${i}" class="${run.draft.includes(i)?'used':''}" aria-label="${i+1}: ${s[1]}${run.draft.includes(i)?', ya colocado':''}"><kbd aria-hidden="true">${i+1}</kbd>${symbol(i)}<span>${s[1]}</span></button>`).join('')}</div><div class="editor-actions"><button class="primary" data-action="check">Comprobar clave →</button><button class="secondary" data-action="erase">Borrar casilla</button></div><p class="attempt-count">${stage.limit-run.guesses.length} pruebas disponibles · No hay límite de tiempo</p>`;
}
function winHTML(stage) { const next = stage.id===5?'Ver las seis luces':'Siguiente cerradura'; return `<div class="result"><p class="eyebrow">La luz encaja</p><h2 id="editor-title" tabindex="-1">Cerradura abierta.</h2><p>Todos los símbolos están en su lugar. La clave se ha unido al taller.</p>${codeHTML(stage.secret)}<p class="attempt-count">${progress.run.guesses.length} ${progress.run.guesses.length===1?'prueba':'pruebas'} · Mejor marca: ${progress.completed[stage.id].bestMoves}</p><div class="actions"><button class="primary" data-action="next">${next} →</button><button class="quiet" data-action="retry">Volver a resolver</button></div></div>`; }
function failHTML(stage) { return `<div class="result failed"><p class="eyebrow">La luz sigue esperando</p><h2 id="editor-title" tabindex="-1">Quedan pistas por unir.</h2><p>Has usado las ${stage.limit} pruebas. Puedes volver a intentarlo con las mismas pistas de archivo. Las otras cerraduras conservan su avance.</p><div class="actions"><button class="primary" data-action="retry">Reintentar cerradura</button><button class="secondary" data-action="reveal">Ver solución</button></div>${revealed?`<div class="revealed">${codeHTML(stage.secret)}<p class="hint">La solución no abre la cerradura. Reintenta para resolverla.</p></div>`:''}</div>`; }
function renderComplete() {
  main.innerHTML = `<section class="complete"><p class="eyebrow">El taller vuelve a brillar</p><img src="assets/cover.svg" alt="El prisma de las seis luces completo" width="1200" height="760"><h1 tabindex="-1">Seis claves.<br>Una luz completa.</h1><p>Has abierto todas las cerraduras de Clave de Cristal.<br>Cada pista encontró su sitio. Gracias por jugar con calma.</p><ul class="complete-list">${STAGES.map((s,i)=>`<li>${s.name}<span>${progress.completed[i]?.bestMoves || '—'} ${progress.completed[i]?.bestMoves===1?'prueba':'pruebas'}</span></li>`).join('')}</ul><div class="actions"><button class="primary" data-action="home">Volver al taller</button><button class="secondary" data-action="reset">Borrar avance y empezar</button></div><p class="hint">Tus mejores marcas permanecen en este navegador.</p></section>`;
}
function freshRun(level) { progress.currentLevel=level; progress.run={level,guesses:[],draft:Array(STAGES[level].length).fill(null)}; active=0;revealed=false;view='play';persist();render();focusHeading(); }
function startLevel(level) {
  if (level>firstUnfinished(progress.completed)) return;
  if (progress.run && progress.run.level===level && !status().won) { view='play';active=0;render();focusHeading();return; }
  if (progress.run && !status().won && !status().failed && (progress.run.guesses.length || progress.run.draft.some(s=>s!==null)))
    confirmAction('Cambiar de cerradura','Se borrará la propuesta y las pruebas de la cerradura actual. Las cerraduras abiertas se conservan.',()=>freshRun(level));
  else freshRun(level);
}
function confirmAction(title, body, callback) { returnFocus=document.activeElement;pending=callback;document.querySelector('#confirm-title').textContent=title;document.querySelector('#confirm-body').textContent=body;dialog.showModal();document.querySelector('#cancel-dialog').focus(); }
function closeDialog(accept) { const callback=pending;pending=null;dialog.close();if(accept&&callback)callback();else returnFocus?.focus(); }
document.querySelector('#cancel-dialog').addEventListener('click',()=>closeDialog(false));
document.querySelector('#accept-dialog').addEventListener('click',()=>closeDialog(true));
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(false);});
function editSymbol(id) {
  const run=progress.run;
  if (run.draft.some((s,i)=>s===id&&i!==active)) { say(`${SYMBOLS[id][1]} ya está en otra casilla. Bórralo allí antes de moverlo.`);return; }
  run.draft[active]=id;
  if(active<run.draft.length-1)active++;
  persist();render();focusSlot();
}
function focusSlot() { main.querySelector(`[data-slot="${active}"]`)?.focus(); }
function erase() { progress.run.draft[active]=null;persist();render();focusSlot();say(`Casilla ${active+1} vacía.`); }
function check() {
  const stage=STAGES[progress.currentLevel], run=progress.run;
  const result=submitGuess(stage,run.guesses,run.draft);
  if(result.error){say(result.error);return;}
  run.guesses.push([...run.draft]);run.draft=Array(stage.length).fill(null);active=0;
  if(result.won){const best=progress.completed[stage.id]?.bestMoves??Infinity;progress.completed[stage.id]={bestMoves:Math.min(best,run.guesses.length)};}
  persist();render();
  if(result.won||result.failed)main.querySelector('#editor-title').focus();else focusSlot();
  say(result.won?'Cerradura abierta. Todos los símbolos están en su lugar.':result.failed?'Pruebas agotadas. Puedes reintentar.':`Prueba ${run.guesses.length}: ${result.exact} exactos y ${result.misplaced} desplazados.`);
}
const actions={
  home(){view='home';render();focusHeading();},
  continue(){if(progress.run){view='play';active=0;render();focusHeading();}else if(Object.keys(progress.completed).length===6){view='complete';render();focusHeading();}else freshRun(firstUnfinished(progress.completed));},
  reset(){confirmAction('¿Borrar todo el avance?','Se borrarán las cerraduras abiertas, las mejores marcas y la partida actual de Clave de Cristal.',()=>{progress=emptyProgress();view='home';persist();render();focusHeading();say('Avance borrado. El taller está listo para empezar.');});},
  retry(){confirmAction('¿Reiniciar esta cerradura?','Se borrarán su propuesta y sus pruebas. Las cerraduras abiertas y las mejores marcas se conservan.',()=>freshRun(progress.currentLevel));},
  check,erase,
  reveal(){revealed=true;render();main.querySelector('#editor-title').focus();say('Solución visible. Puedes reintentar esta cerradura.');},
  next(){if(progress.currentLevel===5){progress.run=null;persist();view='complete';render();focusHeading();}else freshRun(progress.currentLevel+1);}
};
main.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled)return;
  if(button.dataset.action)actions[button.dataset.action]?.();
  else if(button.dataset.level!==undefined)startLevel(Number(button.dataset.level));
  else if(button.dataset.slot!==undefined){active=Number(button.dataset.slot);render();focusSlot();}
  else if(button.dataset.symbol!==undefined)editSymbol(Number(button.dataset.symbol));
});
main.addEventListener('focusin',event=>{
  const slot=event.target.closest('[data-slot]');
  if(!slot)return;
  active=Number(slot.dataset.slot);
  main.querySelectorAll('[data-slot]').forEach(button=>{const selected=Number(button.dataset.slot)===active;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
  const caption=main.querySelector('.slot-caption');
  if(caption)caption.textContent=`Casilla ${active+1} seleccionada · Sin repetir símbolos`;
});
main.addEventListener('keydown',event=>{
  if(dialog.open||view!=='play'||status().won||status().failed||event.ctrlKey||event.metaKey||event.altKey)return;
  if(!event.target.closest('.draft,.palette'))return;
  const stage=STAGES[progress.currentLevel];
  if(/^[1-7]$/.test(event.key)&&Number(event.key)<=stage.palette){event.preventDefault();editSymbol(Number(event.key)-1);}
  else if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();active=(active+(event.key==='ArrowLeft'?-1:1)+stage.length)%stage.length;render();focusSlot();}
  else if(['Backspace','Delete'].includes(event.key)){event.preventDefault();erase();}
  else if(event.key==='Enter'&&event.target.closest('.draft')){event.preventDefault();check();}
});
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE_KEY)return;
  if(dialog.open)closeDialog(false);
  try { loaded=readProgress(window.localStorage);progress=loaded.progress; }catch{return;}
  view='home';render();showNotice('El avance cambió en otra pestaña. Se ha cargado la copia más reciente; pulsa Continuar.');
});
render();
