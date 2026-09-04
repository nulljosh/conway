package com.nulljosh.conway

import kotlin.random.Random

// Ported from life.js. Conway's Game of Life on a toroidal grid, flat
// ByteArray, double-buffered.
class Life(cols: Int, rows: Int) {
    val cols: Int = maxOf(1, cols)
    val rows: Int = maxOf(1, rows)
    var cells: ByteArray = ByteArray(this.cols * this.rows)
        private set
    private var next: ByteArray = ByteArray(this.cols * this.rows)
    var generation: Int = 0
        private set

    fun idx(x: Int, y: Int): Int = ((y + rows) % rows) * cols + ((x + cols) % cols)
    fun get(x: Int, y: Int): Int = cells[idx(x, y)].toInt()
    fun set(x: Int, y: Int, v: Boolean) { cells[idx(x, y)] = if (v) 1 else 0 }
    fun toggle(x: Int, y: Int) { val i = idx(x, y); cells[i] = if (cells[i].toInt() != 0) 0 else 1 }
    fun clear() { cells.fill(0); generation = 0 }

    fun randomize(density: Double = 0.28) {
        val d = density.coerceIn(0.0, 1.0)
        for (i in cells.indices) cells[i] = if (Random.nextDouble() < d) 1 else 0
        generation = 0
    }

    fun neighbors(x: Int, y: Int): Int {
        var n = 0
        for (dy in -1..1) for (dx in -1..1) if (dx != 0 || dy != 0) n += cells[idx(x + dx, y + dy)]
        return n
    }

    fun step() {
        for (y in 0 until rows) {
            val up = (if (y == 0) rows - 1 else y - 1) * cols
            val mid = y * cols
            val dn = (if (y == rows - 1) 0 else y + 1) * cols
            for (x in 0 until cols) {
                val l = if (x == 0) cols - 1 else x - 1
                val r = if (x == cols - 1) 0 else x + 1
                val n = cells[up + l] + cells[up + x] + cells[up + r] +
                    cells[mid + l] + cells[mid + r] +
                    cells[dn + l] + cells[dn + x] + cells[dn + r]
                val i = mid + x
                next[i] = if (cells[i].toInt() != 0) (if (n == 2 || n == 3) 1 else 0) else (if (n == 3) 1 else 0)
            }
        }
        val tmp = cells; cells = next; next = tmp
        generation++
    }

    fun population(): Int = cells.sumOf { it.toInt() }

    /** stamp a pattern given as an array of "..O" rows, top-left at (x, y) */
    fun stamp(pattern: List<String>, x: Int = 0, y: Int = 0) {
        pattern.forEachIndexed { dy, row ->
            row.forEachIndexed { dx, ch -> if (ch != '.' && ch != ' ') set(x + dx, y + dy, true) }
        }
    }

    /** Copies whatever still fits onto a new board. Used when the viewport resizes. */
    fun resized(newCols: Int, newRows: Int): Life {
        if (newCols == cols && newRows == rows) return this
        val fresh = Life(newCols, newRows)
        for (y in 0 until minOf(rows, fresh.rows)) for (x in 0 until minOf(cols, fresh.cols)) fresh.set(x, y, get(x, y) != 0)
        fresh.generation = generation
        return fresh
    }
}

val PATTERNS: Map<String, List<String>> = mapOf(
    "Glider" to listOf(".O.", "..O", "OOO"),
    "Blinker" to listOf("OOO"),
    "Toad" to listOf(".OOO", "OOO."),
    "Pulsar" to listOf(
        "..OOO...OOO..", ".............", "O....O.O....O", "O....O.O....O",
        "O....O.O....O", "..OOO...OOO..", ".............", "..OOO...OOO..",
        "O....O.O....O", "O....O.O....O", "O....O.O....O", ".............",
        "..OOO...OOO..",
    ),
    "Gosper gun" to listOf(
        "........................O...........",
        "......................O.O...........",
        "............OO......OO............OO",
        "...........O...O....OO............OO",
        "OO........O.....O...OO..............",
        "OO........O...O.OO....O.O...........",
        "..........O.....O.......O...........",
        "...........O...O....................",
        "............OO......................",
    ),
    "R-pentomino" to listOf(".OO", "OO.", ".O."),
)
