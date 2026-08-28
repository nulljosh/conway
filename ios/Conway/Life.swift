import Foundation

/// Conway's Game of Life on a toroidal grid. Pure value type — the views own one and redraw it.
struct Life: Equatable {
    private(set) var cols: Int
    private(set) var rows: Int
    private(set) var cells: [UInt8]
    private(set) var generation = 0

    init(cols: Int, rows: Int) {
        self.cols = max(1, cols)
        self.rows = max(1, rows)
        self.cells = [UInt8](repeating: 0, count: self.cols * self.rows)
    }

    private func index(_ x: Int, _ y: Int) -> Int {
        let wx = ((x % cols) + cols) % cols
        let wy = ((y % rows) + rows) % rows
        return wy * cols + wx
    }

    subscript(x: Int, y: Int) -> Bool {
        get { cells[index(x, y)] == 1 }
        set { cells[index(x, y)] = newValue ? 1 : 0 }
    }

    var population: Int { cells.reduce(0) { $0 + Int($1) } }

    mutating func clear() {
        cells = [UInt8](repeating: 0, count: cols * rows)
        generation = 0
    }

    mutating func randomize(density: Double = 0.28) {
        for i in cells.indices { cells[i] = Double.random(in: 0..<1) < density ? 1 : 0 }
        generation = 0
    }

    mutating func step() {
        var next = [UInt8](repeating: 0, count: cells.count)
        for y in 0..<rows {
            for x in 0..<cols {
                var n = 0
                for dy in -1...1 {
                    for dx in -1...1 where dx != 0 || dy != 0 {
                        n += Int(cells[index(x + dx, y + dy)])
                    }
                }
                let i = y * cols + x
                next[i] = cells[i] == 1 ? (n == 2 || n == 3 ? 1 : 0) : (n == 3 ? 1 : 0)
            }
        }
        cells = next
        generation += 1
    }

    /// Stamps a pattern written as rows of "O" (alive) and "." (dead), top-left at (x, y).
    mutating func stamp(_ pattern: [String], x: Int, y: Int) {
        for (dy, row) in pattern.enumerated() {
            for (dx, ch) in row.enumerated() where ch != "." && ch != " " {
                self[x + dx, y + dy] = true
            }
        }
    }

    /// Resizes in place, keeping whatever still fits.
    mutating func resized(cols newCols: Int, rows newRows: Int) {
        guard newCols != cols || newRows != rows else { return }
        var fresh = Life(cols: newCols, rows: newRows)
        for y in 0..<min(rows, fresh.rows) {
            for x in 0..<min(cols, fresh.cols) where self[x, y] {
                fresh[x, y] = true
            }
        }
        fresh.generation = generation
        self = fresh
    }
}

enum Pattern: String, CaseIterable, Identifiable {
    case glider = "Glider"
    case blinker = "Blinker"
    case toad = "Toad"
    case pulsar = "Pulsar"
    case gosperGun = "Gosper gun"
    case rPentomino = "R-pentomino"

    var id: String { rawValue }

    var rows: [String] {
        switch self {
        case .glider:  return [".O.", "..O", "OOO"]
        case .blinker: return ["OOO"]
        case .toad:    return [".OOO", "OOO."]
        case .pulsar: return [
            "..OOO...OOO..", ".............", "O....O.O....O", "O....O.O....O",
            "O....O.O....O", "..OOO...OOO..", ".............", "..OOO...OOO..",
            "O....O.O....O", "O....O.O....O", "O....O.O....O", ".............",
            "..OOO...OOO.."]
        case .gosperGun: return [
            "........................O...........",
            "......................O.O...........",
            "............OO......OO............OO",
            "...........O...O....OO............OO",
            "OO........O.....O...OO..............",
            "OO........O...O.OO....O.O...........",
            "..........O.....O.......O...........",
            "...........O...O....................",
            "............OO......................"]
        case .rPentomino: return [".OO", "OO.", ".O."]
        }
    }
}
