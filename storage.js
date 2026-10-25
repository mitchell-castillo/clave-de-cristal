import { STAGES } from './puzzles.js';
import { submitGuess, validCode } from './core.js';
export const STORAGE_KEY = 'daily-games:clave-de-cristal:v1';
export function emptyProgress() {
  return { version: 1, currentLevel: 0, completed: {}, run: null, updatedAt: null };
}
export function firstUnfinished(completed) {
  for (let i = 0; i < STAGES.length; i++) if (!completed[i]) return i;
  return STAGES.length - 1;
}
export function normalizeProgress(value) {
  const clean = emptyProgress();
  if (!value || typeof value !== 'object' || value.version !== 1) return clean;
  for (let i = 0; i < STAGES.length; i++) {
    const best = value.completed?.[i]?.bestMoves;
    if (!Number.isInteger(best) || best < 1 || best > STAGES[i].limit) break;
    clean.completed[i] = { bestMoves: best };
  }
  const unlocked = firstUnfinished(clean.completed);
  clean.currentLevel = Number.isInteger(value.currentLevel) ? Math.min(Math.max(value.currentLevel, 0), unlocked) : 0;
  clean.updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt.slice(0, 40) : null;
  const run = value.run, stage = STAGES[clean.currentLevel];
  if (run && run.level === clean.currentLevel && Array.isArray(run.guesses) && run.guesses.length <= stage.limit && validCode(run.draft, stage, true)) {
    const history = [];
    let okay = true;
    for (const guess of run.guesses) {
      const result = submitGuess(stage, history, guess);
      if (result.error || (history.length && submitGuess(stage, history.slice(0, -1), history.at(-1)).won)) { okay = false; break; }
      history.push([...guess]);
    }
    if (okay) {
      const won = history.length && submitGuess(stage, history.slice(0, -1), history.at(-1)).won;
      if (!won || clean.completed[clean.currentLevel]) clean.run = { level: run.level, guesses: history, draft: [...run.draft] };
    }
  }
  return clean;
}
export function readProgress(storage) {
  let raw;
  try { raw = (storage ?? globalThis.localStorage).getItem(STORAGE_KEY); } catch { return { progress: emptyProgress(), available: false, recovered: false }; }
  if (raw === null) return { progress: emptyProgress(), available: true, recovered: false };
  try {
    if (raw.length > 50000) throw Error('Oversized save');
    const value = JSON.parse(raw), progress = normalizeProgress(value);
    const recovered = !value || value.version !== 1 || JSON.stringify(value.run) !== JSON.stringify(progress.run) || JSON.stringify(value.completed) !== JSON.stringify(progress.completed);
    return { progress, available: true, recovered };
  } catch { return { progress: emptyProgress(), available: true, recovered: true }; }
}
export function writeProgress(progress, storage) {
  try { (storage ?? globalThis.localStorage).setItem(STORAGE_KEY, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() })); return true; }
  catch { return false; }
}
