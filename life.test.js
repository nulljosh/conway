// node life.test.js — the whole rule set, the edge cases, and the guards.
const assert = require('assert');
const { Life, PATTERNS } = require('./life.js');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (e) { console.error(`FAIL: ${name}\n  ${e.message}`); process.exit(1); }
}
const board = (w, h, pattern, x = 0, y = 0) => {
  const g = new Life(w, h);
  if (pattern) g.stamp(pattern, x, y);
  return g;
};

// ---- the four rules, one at a time ----

test('a lone cell dies of underpopulation', () => {
  const g = board(8, 8); g.set(4, 4, 1); g.step();
  assert.strictEqual(g.population(), 0);
});

test('a cell with one neighbour dies of underpopulation', () => {
  const g = board(8, 8); g.set(3, 4, 1); g.set(4, 4, 1); g.step();
  assert.strictEqual(g.population(), 0);
});

test('a cell with two neighbours survives', () => {
  const g = board(8, 8, ['OOO'], 2, 3); g.step();
  assert.ok(g.get(3, 3), 'the centre cell had two neighbours');
});

test('a cell with three neighbours survives', () => {
  const g = board(8, 8, ['OO', 'OO'], 2, 2); g.step();
  assert.strictEqual(g.population(), 4);
});

test('a cell with four neighbours dies of overcrowding', () => {
  const g = board(8, 8, ['.O.', 'OOO', '.O.'], 2, 2); g.step();
  assert.ok(!g.get(3, 3), 'the centre cell had four neighbours');
});

test('a dead cell with exactly three neighbours is born', () => {
  const g = board(8, 8); g.set(2, 2, 1); g.set(3, 2, 1); g.set(2, 3, 1); g.step();
  assert.ok(g.get(3, 3), 'the empty corner had three neighbours');
});

test('a dead cell with two neighbours stays dead', () => {
  const g = board(8, 8); g.set(2, 2, 1); g.set(3, 2, 1); g.step();
  assert.strictEqual(g.population(), 0);
});

// ---- known figures ----

test('block is a still life', () => {
  const g = board(8, 8, ['OO', 'OO'], 2, 2);
  const before = Array.from(g.cells);
  for (let i = 0; i < 5; i++) g.step();
  assert.deepStrictEqual(Array.from(g.cells), before);
});

test('beehive is a still life', () => {
  const g = board(10, 10, ['.OO.', 'O..O', '.OO.'], 3, 3);
  const before = Array.from(g.cells);
  g.step();
  assert.deepStrictEqual(Array.from(g.cells), before);
});

test('blinker has period 2', () => {
  const g = board(8, 8, PATTERNS.Blinker, 2, 3);
  const before = Array.from(g.cells);
  g.step();
  assert.notDeepStrictEqual(Array.from(g.cells), before, 'it should change on the first step');
  g.step();
  assert.deepStrictEqual(Array.from(g.cells), before);
});

test('toad has period 2', () => {
  const g = board(10, 10, PATTERNS.Toad, 3, 4);
  const before = Array.from(g.cells);
  g.step(); g.step();
  assert.deepStrictEqual(Array.from(g.cells), before);
});

test('pulsar has period 3', () => {
  const g = board(20, 20, PATTERNS.Pulsar, 3, 3);
  const before = Array.from(g.cells);
  g.step(); g.step();
  assert.notDeepStrictEqual(Array.from(g.cells), before);
  g.step();
  assert.deepStrictEqual(Array.from(g.cells), before);
});

test('glider travels one cell diagonally every four generations', () => {
  const g = board(20, 20, PATTERNS.Glider, 1, 1);
  for (let i = 0; i < 4; i++) g.step();
  assert.strictEqual(g.population(), 5);
  for (const [x, y] of [[3, 2], [4, 3], [2, 4], [3, 4], [4, 4]]) {
    assert.ok(g.get(x, y), `expected a cell at ${x},${y}`);
  }
});

test('glider returns to its start after crossing a 20x20 torus', () => {
  const g = board(20, 20, PATTERNS.Glider, 1, 1);
  const before = Array.from(g.cells);
  for (let i = 0; i < 80; i++) g.step();   // 20 cells of travel at 1 per 4 gens
  assert.deepStrictEqual(Array.from(g.cells), before);
});

test('gosper gun keeps producing cells instead of settling', () => {
  const g = board(60, 30, PATTERNS['Gosper gun'], 1, 1);
  const early = (g.step(), g.population());
  for (let i = 0; i < 120; i++) g.step();
  assert.ok(g.population() > early, `gun population ${g.population()} should exceed ${early}`);
});

test('r-pentomino is still active after 100 generations', () => {
  const g = board(40, 40, PATTERNS['R-pentomino'], 18, 18);
  for (let i = 0; i < 100; i++) g.step();
  assert.ok(g.population() > 0);
});

test('every named pattern fits its board and survives a step', () => {
  for (const [name, rows] of Object.entries(PATTERNS)) {
    const g = board(80, 40, rows, 2, 2);
    assert.ok(g.population() > 0, `${name} stamped nothing`);
    g.step();
  }
});

// ---- the torus ----

test('neighbours wrap around the edges', () => {
  const g = board(8, 8);
  g.set(0, 0, 1); g.set(7, 0, 1); g.set(0, 7, 1);
  g.step();
  assert.ok(g.get(7, 7), 'the opposite corner had three neighbours across the wrap');
});

test('reading and writing out of bounds wraps rather than throwing', () => {
  const g = board(8, 8);
  g.set(-1, -1, 1);
  assert.ok(g.get(7, 7), 'negative coordinates wrap to the far corner');
  g.set(8, 8, 1);
  assert.ok(g.get(0, 0), 'coordinates past the edge wrap to the origin');
});

test('a stamp that runs off the edge wraps instead of being clipped', () => {
  const g = board(8, 8, ['OOO'], 7, 0);
  assert.ok(g.get(7, 0) && g.get(0, 0) && g.get(1, 0));
  assert.strictEqual(g.population(), 3);
});

// ---- board bookkeeping ----

test('generation counts up and clear resets it', () => {
  const g = board(8, 8); g.randomize();
  g.step(); g.step();
  assert.strictEqual(g.generation, 2);
  g.clear();
  assert.strictEqual(g.generation, 0);
  assert.strictEqual(g.population(), 0);
});

test('toggle flips a cell both ways', () => {
  const g = board(8, 8);
  g.toggle(1, 1); assert.ok(g.get(1, 1));
  g.toggle(1, 1); assert.ok(!g.get(1, 1));
});

test('randomize respects density 0 and density 1', () => {
  const g = board(8, 8);
  g.randomize(0); assert.strictEqual(g.population(), 0);
  g.randomize(1); assert.strictEqual(g.population(), 64);
});

test('an out-of-range or missing density does not corrupt the board', () => {
  const g = board(8, 8);
  g.randomize(5); assert.strictEqual(g.population(), 64);
  g.randomize(-5); assert.strictEqual(g.population(), 0);
  g.randomize(NaN); assert.ok(g.population() >= 0 && g.population() <= 64);
});

test('an empty board stays empty forever', () => {
  const g = board(8, 8);
  for (let i = 0; i < 10; i++) g.step();
  assert.strictEqual(g.population(), 0);
});

test('resize keeps what still fits and drops the rest', () => {
  const g = board(10, 10);
  g.set(1, 1, 1); g.set(9, 9, 1); g.step = g.step;
  const small = g.resized(5, 5);
  assert.ok(small.get(1, 1), 'a cell inside the new bounds survives');
  assert.strictEqual(small.population(), 1, 'the cell outside them is gone');
  assert.strictEqual(small.cols, 5);
});

test('resize to the same size is a no-op', () => {
  const g = board(6, 6); g.set(2, 2, 1);
  assert.strictEqual(g.resized(6, 6), g);
});

// ---- guards ----

test('a 1x1 board is legal and its lone cell dies', () => {
  const g = new Life(1, 1);
  g.set(0, 0, 1);
  g.step();
  assert.strictEqual(g.population(), 0, 'on a 1x1 torus a cell is its own eight neighbours');
});

test('zero and negative dimensions are clamped, not crashed', () => {
  assert.strictEqual(new Life(0, 0).cols, 1);
  assert.strictEqual(new Life(-4, -4).rows, 1);
});

test('fractional dimensions are floored', () => {
  const g = new Life(7.9, 3.2);
  assert.strictEqual(g.cols, 7);
  assert.strictEqual(g.rows, 3);
  assert.strictEqual(g.cells.length, 21);
});

test('NaN dimensions throw rather than making an unusable board', () => {
  assert.throws(() => new Life(NaN, 10), RangeError);
  assert.throws(() => new Life(10, undefined), RangeError);
});

test('stamping a non-array throws a clear error', () => {
  assert.throws(() => board(8, 8).stamp('OOO'), TypeError);
});

test('stamp ignores dots and spaces and accepts any other character', () => {
  const g = board(8, 8, ['. .', 'X#O'], 1, 1);
  assert.strictEqual(g.population(), 3);
});

console.log(`ok — ${passed} checks passed`);
