// node life.test.js — fails loudly if the rules break.
const assert = require('assert');
const { Life, PATTERNS } = require('./life.js');

// Block is a still life.
let g = new Life(8, 8);
g.stamp(['OO', 'OO'], 2, 2);
g.step();
assert.strictEqual(g.population(), 4);
assert.ok(g.get(2, 2) && g.get(3, 3), 'block should survive unchanged');

// Blinker oscillates with period 2.
g = new Life(8, 8);
g.stamp(PATTERNS.Blinker, 2, 3);
const before = Array.from(g.cells);
g.step();
assert.ok(g.get(3, 2) && g.get(3, 4) && !g.get(2, 3), 'blinker should rotate');
g.step();
assert.deepStrictEqual(Array.from(g.cells), before, 'blinker period is 2');

// Glider translates by (1,1) every 4 generations, wrapping included.
g = new Life(16, 16);
g.stamp(PATTERNS.Glider, 1, 1);
for (let i = 0; i < 4; i++) g.step();
assert.strictEqual(g.population(), 5);
assert.ok(g.get(3, 2) && g.get(4, 3) && g.get(2, 4) && g.get(3, 4) && g.get(4, 4), 'glider moved one cell diagonally');

// Loneliness and overcrowding.
g = new Life(8, 8);
g.set(4, 4, 1); g.step();
assert.strictEqual(g.population(), 0, 'a lone cell dies');

console.log('ok — life.js rules verified');
