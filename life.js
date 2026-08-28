// Conway's Game of Life. Toroidal grid, flat Uint8Array, double-buffered.
class Life {
  constructor(cols, rows) {
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
    const { cols, rows } = this;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x, n = this.neighbors(x, y);
        this.next[i] = this.cells[i] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    }
    [this.cells, this.next] = [this.next, this.cells];
    this.generation++;
  }
  population() { let n = 0; for (const c of this.cells) n += c; return n; }
  // stamp a pattern given as an array of "..O" rows, top-left at (x, y)
  stamp(rows, x, y) {
    rows.forEach((row, dy) => [...row].forEach((ch, dx) => {
      if (ch !== '.' && ch !== ' ') this.set(x + dx, y + dy, 1);
    }));
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
