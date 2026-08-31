// node --test — the /api and /mcp tool layer. Both endpoints are thin shells over
// callTool(), so testing here covers both; the transport itself is curvely's, unchanged.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callTool, ToolError, TOOL_NAMES } from './src/lib/tools.js';

const step = (rows, steps) => callTool('step_board', { rows, steps });
const BLINKER = ['.....', '.....', '.OOO.', '.....', '.....'];

test('both tools are exposed', () => {
  assert.deepEqual(TOOL_NAMES, ['step_board', 'list_patterns']);
});

test('an unknown tool is null, not a throw', () => {
  // mcp.js turns null into a JSON-RPC "Unknown tool"; a throw would 500 instead.
  assert.equal(callTool('nope', {}), null);
});

test('a blinker oscillates with period two', () => {
  assert.deepEqual(step(BLINKER, 1).rows, ['.....', '..O..', '..O..', '..O..', '.....']);
  assert.deepEqual(step(BLINKER, 2).rows, BLINKER);
  assert.equal(step(BLINKER, 2).population, 3);
});

test('zero steps returns the board untouched', () => {
  assert.deepEqual(step(BLINKER, 0).rows, BLINKER);
});

test('every named pattern is steppable', () => {
  // A pattern with ragged rows would be unusable from the API while still rendering in
  // the browser, where the stamp is drawn cell by cell.
  for (const { name, rows } of callTool('list_patterns').patterns) {
    const width = rows[0].length;
    assert.ok(rows.every(r => r.length === width), `pattern "${name}" has ragged rows`);
    assert.doesNotThrow(() => step(rows, 1), `pattern "${name}" cannot be stepped`);
  }
});

test('bad input is a ToolError, so the endpoint answers 400 rather than 500', () => {
  const bad = [
    [[], undefined],                    // no rows
    [['OO', 'O'], undefined],           // ragged
    [[''], undefined],                  // empty row
    [['O'], -1],                        // negative steps
    [['O'], 1.5],                       // fractional steps
    [['O'], 501],                       // over the step ceiling
    [Array(101).fill('O'.repeat(101)), 1], // over the cell ceiling
  ];
  for (const [rows, steps] of bad) {
    assert.throws(() => step(rows, steps), ToolError, `expected a ToolError for ${JSON.stringify(rows).slice(0, 30)}`);
  }
});
