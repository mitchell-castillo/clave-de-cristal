// Pure rules shared by the browser and the exhaustive puzzle tests.
export function evaluate(secret, guess) {
  let exact = 0;
  const left = new Map(), right = new Map();
  secret.forEach((s, i) => {
    if (s === guess[i]) exact++;
    else { left.set(s, (left.get(s) || 0) + 1); right.set(guess[i], (right.get(guess[i]) || 0) + 1); }
  });
  let misplaced = 0;
  for (const [symbol, count] of left) misplaced += Math.min(count, right.get(symbol) || 0);
  return { exact, misplaced };
}
export function validCode(code, stage, partial = false) {
  return Array.isArray(code) && code.length === stage.length &&
    code.every(s => (partial && s === null) || (Number.isInteger(s) && s >= 0 && s < stage.palette)) &&
    new Set(code.filter(s => s !== null)).size === code.filter(s => s !== null).length;
}
export function permutations(size, length, prefix = []) {
  if (prefix.length === length) return [prefix];
  return Array.from({ length: size }, (_, i) => i).filter(i => !prefix.includes(i))
    .flatMap(i => permutations(size, length, [...prefix, i]));
}
export function candidates(stage, clues = stage.clues) {
  return permutations(stage.palette, stage.length).filter(code => clues.every(clue => {
    const actual = evaluate(code, clue.code);
    return actual.exact === clue.exact && actual.misplaced === clue.misplaced;
  }));
}
export function submitGuess(stage, history, guess) {
  if (!validCode(guess, stage)) return { error: 'Completa todas las casillas con símbolos distintos.' };
  if ([...stage.clues.map(c => c.code), ...history].some(c => c.every((s, i) => s === guess[i])))
    return { error: 'Esa combinación ya está en las pistas. Prueba otra.' };
  if (history.length >= stage.limit) return { error: 'Este intento ha terminado. Puedes reintentar la cerradura.' };
  const clue = evaluate(stage.secret, guess);
  return { ...clue, won: clue.exact === stage.length, failed: clue.exact !== stage.length && history.length + 1 === stage.limit };
}
