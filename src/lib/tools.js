// The tool definitions behind both /api and /mcp. Neither surface has logic of its own, so
// they cannot drift apart. The rules themselves stay in life.js, which the browser also
// loads as a classic script — this module only wraps it.
import pkg from '../../life.js';
const { Life, PATTERNS } = pkg;

export class ToolError extends Error {}

const MAX_CELLS = 10000;   // 100x100. This endpoint is public and steps a grid per request.
const MAX_STEPS = 500;

export const TOOLS = [
  {
    name: 'step_board',
    description: "Advance a Conway's Game of Life board by n generations on a toroidal grid.",
    inputSchema: {
      type: 'object',
      properties: {
        rows: { type: 'array', items: { type: 'string' }, description: "Board rows, 'O' alive and '.' dead." },
        steps: { type: 'integer', description: 'Generations to advance (default 1).' },
      },
      required: ['rows'],
    },
  },
  {
    name: 'list_patterns',
    description: 'The named starting patterns, as row strings ready to pass to step_board.',
    inputSchema: { type: 'object', properties: {} },
  },
];

export const TOOL_NAMES = TOOLS.map(t => t.name);

const toRows = (life) => {
  const out = [];
  for (let y = 0; y < life.rows; y++) {
    let row = '';
    for (let x = 0; x < life.cols; x++) row += life.get(x, y) ? 'O' : '.';
    out.push(row);
  }
  return out;
};

function stepBoard({ rows, steps = 1 }) {
  if (!Array.isArray(rows) || rows.length === 0) throw new ToolError('rows must be a non-empty array of strings.');
  if (!rows.every(r => typeof r === 'string')) throw new ToolError('every row must be a string.');
  const width = rows[0].length;
  if (width === 0) throw new ToolError('rows must not be empty strings.');
  // A ragged board has no well-defined width, and Life would index past the short rows.
  if (!rows.every(r => r.length === width)) throw new ToolError('every row must be the same length.');
  if (width * rows.length > MAX_CELLS) throw new ToolError(`board is larger than ${MAX_CELLS} cells.`);
  if (!Number.isInteger(steps) || steps < 0) throw new ToolError('steps must be a non-negative integer.');
  if (steps > MAX_STEPS) throw new ToolError(`steps must be ${MAX_STEPS} or fewer.`);

  const life = new Life(width, rows.length);
  life.stamp(rows, 0, 0);
  for (let i = 0; i < steps; i++) life.step();
  return { rows: toRows(life), population: life.population(), steps };
}

function listPatterns() {
  return { patterns: Object.entries(PATTERNS).map(([name, rows]) => ({ name, rows })) };
}

const IMPL = { step_board: stepBoard, list_patterns: listPatterns };

export function callTool(name, args) {
  const fn = IMPL[name];
  if (!fn) return null;
  return fn(args || {});
}
