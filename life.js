// Conway's Game of Life. Toroidal grid, flat Uint8Array, double-buffered.
class Life {
  constructor(cols, rows) {
    // A board with no cells has no rules to run, and a fractional or NaN size
    // silently produces a zero-length array that every later index misses.
    if (!Number.isFinite(cols) || !Number.isFinite(rows)) {
      throw new RangeError(`Life: cols and rows must be finite, got ${cols}x${rows}`);
    }
    cols = Math.max(1, Math.floor(cols));
    rows = Math.max(1, Math.floor(rows));
    this.cols = cols; this.rows = rows;
    this.cells = new Uint8Array(cols * rows);
    this.next = new Uint8Array(cols * rows);
    this.generation = 0;
  }
  idx(x, y) {
    const { cols, rows } = this;
    return ((y + rows) % rows) * cols + ((x + cols) % cols);
  }
  get(x, y) { return this.cells[this.idx(x, y)]; }
  set(x, y, v) { this.cells[this.idx(x, y)] = v ? 1 : 0; }
  toggle(x, y) { const i = this.idx(x, y); this.cells[i] = this.cells[i] ? 0 : 1; }
  clear() { this.cells.fill(0); this.generation = 0; }
  randomize(density = 0.28) {
    if (!Number.isFinite(density)) density = 0.28;
    density = Math.min(1, Math.max(0, density));
    for (let i = 0; i < this.cells.length; i++) this.cells[i] = Math.random() < density ? 1 : 0;
    this.generation = 0;
  }
  neighbors(x, y) {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++)
        if (dx || dy) n += this.cells[this.idx(x + dx, y + dy)];
    return n;
  }
  step() {
    const { cols, rows, cells, next } = this;
    // Row/column wrap is resolved once per row and once per column instead of
    // through idx()'s two modulos on each of the 8 neighbour reads.
    for (let y = 0; y < rows; y++) {
      const up = (y === 0 ? rows - 1 : y - 1) * cols;
      const mid = y * cols;
      const dn = (y === rows - 1 ? 0 : y + 1) * cols;
      for (let x = 0; x < cols; x++) {
        const l = x === 0 ? cols - 1 : x - 1;
        const r = x === cols - 1 ? 0 : x + 1;
        const n = cells[up + l] + cells[up + x] + cells[up + r]
                + cells[mid + l] + cells[mid + r]
                + cells[dn + l] + cells[dn + x] + cells[dn + r];
        const i = mid + x;
        next[i] = cells[i] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    }
    [this.cells, this.next] = [this.next, this.cells];
    this.generation++;
  }
  population() { let n = 0; for (const c of this.cells) n += c; return n; }
  // stamp a pattern given as an array of "..O" rows, top-left at (x, y)
  stamp(rows, x = 0, y = 0) {
    if (!Array.isArray(rows)) throw new TypeError('Life.stamp: pattern must be an array of strings');
    rows.forEach((row, dy) => [...String(row)].forEach((ch, dx) => {
      if (ch !== '.' && ch !== ' ') this.set(x + dx, y + dy, 1);
    }));
  }

  // Copies whatever still fits onto a new board. Used when the viewport resizes.
  resized(cols, rows) {
    if (cols === this.cols && rows === this.rows) return this;
    const fresh = new Life(cols, rows);
    for (let y = 0; y < Math.min(this.rows, fresh.rows); y++)
      for (let x = 0; x < Math.min(this.cols, fresh.cols); x++)
        fresh.set(x, y, this.get(x, y));
    fresh.generation = this.generation;
    return fresh;
  }
}

const PATTERNS = {
  Glider:   ['.O.', '..O', 'OOO'],
  Blinker:  ['OOO'],
  Toad:     ['.OOO', 'OOO.'],
  Pulsar: [
    '..OOO...OOO..', '.............', 'O....O.O....O', 'O....O.O....O',
    'O....O.O....O', '..OOO...OOO..', '.............', '..OOO...OOO..',
    'O....O.O....O', 'O....O.O....O', 'O....O.O....O', '.............',
    '..OOO...OOO..'],
  'Gosper gun': [
    '........................O...........',
    '......................O.O...........',
    '............OO......OO............OO',
    '...........O...O....OO............OO',
    'OO........O.....O...OO..............',
    'OO........O...O.OO....O.O...........',
    '..........O.....O.......O...........',
    '...........O...O....................',
    '............OO......................'],
  'R-pentomino': ['.OO', 'OO.', '.O.'],
};

if (typeof module !== 'undefined') module.exports = { Life, PATTERNS };
