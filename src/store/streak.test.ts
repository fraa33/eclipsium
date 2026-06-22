import assert from 'node:assert';
import { nextStreak } from './streak.ts';

const TODAY = '2026-06-21';
const YESTERDAY = '2026-06-20';

assert.strictEqual(nextStreak(5, YESTERDAY, TODAY, YESTERDAY), 6);
assert.strictEqual(nextStreak(5, TODAY, TODAY, YESTERDAY), 5);
assert.strictEqual(nextStreak(5, '2026-06-10', TODAY, YESTERDAY), 1);
assert.strictEqual(nextStreak(0, null, TODAY, YESTERDAY), 1);

console.log('streak self-check: OK');
