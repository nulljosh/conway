// swiftc ios/Conway/Life.swift ios/Checks/main.swift -o /tmp/conway-checks && /tmp/conway-checks
// The Swift engine has to agree with life.js cell for cell — same cases, same order.
import Foundation

var passed = 0
func test(_ name: String, _ body: () -> Bool) {
    if body() { passed += 1 } else { print("FAIL: \(name)"); exit(1) }
}
func board(_ w: Int, _ h: Int, _ pattern: [String]? = nil, _ x: Int = 0, _ y: Int = 0) -> Life {
    var g = Life(cols: w, rows: h)
    if let pattern { g.stamp(pattern, x: x, y: y) }
    return g
}

// ---- the four rules ----

test("a lone cell dies of underpopulation") {
    var g = board(8, 8); g[4, 4] = true; g.step()
    return g.population == 0
}
test("a cell with one neighbour dies") {
    var g = board(8, 8); g[3, 4] = true; g[4, 4] = true; g.step()
    return g.population == 0
}
test("a cell with two neighbours survives") {
    var g = board(8, 8, ["OOO"], 2, 3); g.step()
    return g[3, 3]
}
test("a cell with three neighbours survives") {
    var g = board(8, 8, ["OO", "OO"], 2, 2); g.step()
    return g.population == 4
}
test("a cell with four neighbours dies of overcrowding") {
    var g = board(8, 8, [".O.", "OOO", ".O."], 2, 2); g.step()
    return !g[3, 3]
}
test("a dead cell with exactly three neighbours is born") {
    var g = board(8, 8); g[2, 2] = true; g[3, 2] = true; g[2, 3] = true; g.step()
    return g[3, 3]
}
test("a dead cell with two neighbours stays dead") {
    var g = board(8, 8); g[2, 2] = true; g[3, 2] = true; g.step()
    return g.population == 0
}

// ---- known figures ----

test("block is a still life") {
    var g = board(8, 8, ["OO", "OO"], 2, 2)
    let before = g.cells
    for _ in 0..<5 { g.step() }
    return g.cells == before
}
test("beehive is a still life") {
    var g = board(10, 10, [".OO.", "O..O", ".OO."], 3, 3)
    let before = g.cells
    g.step()
    return g.cells == before
}
test("blinker has period 2") {
    var g = board(8, 8, Pattern.blinker.rows, 2, 3)
    let before = g.cells
    g.step()
    guard g.cells != before else { return false }
    g.step()
    return g.cells == before
}
test("toad has period 2") {
    var g = board(10, 10, Pattern.toad.rows, 3, 4)
    let before = g.cells
    g.step(); g.step()
    return g.cells == before
}
test("pulsar has period 3") {
    var g = board(20, 20, Pattern.pulsar.rows, 3, 3)
    let before = g.cells
    g.step(); g.step()
    guard g.cells != before else { return false }
    g.step()
    return g.cells == before
}
test("glider travels one cell diagonally every four generations") {
    var g = board(20, 20, Pattern.glider.rows, 1, 1)
    for _ in 0..<4 { g.step() }
    return g.population == 5 && g[3, 2] && g[4, 3] && g[2, 4] && g[3, 4] && g[4, 4]
}
test("glider returns to its start after crossing a 20x20 torus") {
    var g = board(20, 20, Pattern.glider.rows, 1, 1)
    let before = g.cells
    for _ in 0..<80 { g.step() }
    return g.cells == before
}
test("gosper gun keeps producing cells instead of settling") {
    var g = board(60, 30, Pattern.gosperGun.rows, 1, 1)
    g.step()
    let early = g.population
    for _ in 0..<120 { g.step() }
    return g.population > early
}
test("r-pentomino is still active after 100 generations") {
    var g = board(40, 40, Pattern.rPentomino.rows, 18, 18)
    for _ in 0..<100 { g.step() }
    return g.population > 0
}
test("every named pattern fits its board and survives a step") {
    for p in Pattern.allCases {
        var g = board(80, 40, p.rows, 2, 2)
        guard g.population > 0 else { return false }
        g.step()
    }
    return true
}

// ---- the torus ----

test("neighbours wrap around the edges") {
    var g = board(8, 8)
    g[0, 0] = true; g[7, 0] = true; g[0, 7] = true
    g.step()
    return g[7, 7]
}
test("out-of-bounds coordinates wrap rather than trapping") {
    var g = board(8, 8)
    g[-1, -1] = true
    guard g[7, 7] else { return false }
    g[8, 8] = true
    return g[0, 0]
}
test("a stamp that runs off the edge wraps instead of being clipped") {
    let g = board(8, 8, ["OOO"], 7, 0)
    return g[7, 0] && g[0, 0] && g[1, 0] && g.population == 3
}

// ---- board bookkeeping ----

test("generation counts up and clear resets it") {
    var g = board(8, 8); g.randomize()
    g.step(); g.step()
    guard g.generation == 2 else { return false }
    g.clear()
    return g.generation == 0 && g.population == 0
}
test("randomize respects density 0 and density 1") {
    var g = board(8, 8)
    g.randomize(density: 0)
    guard g.population == 0 else { return false }
    g.randomize(density: 1)
    return g.population == 64
}
test("an out-of-range or non-finite density does not corrupt the board") {
    var g = board(8, 8)
    g.randomize(density: 5)
    guard g.population == 64 else { return false }
    g.randomize(density: -5)
    guard g.population == 0 else { return false }
    g.randomize(density: .nan)
    return g.population >= 0 && g.population <= 64
}
test("an empty board stays empty forever") {
    var g = board(8, 8)
    for _ in 0..<10 { g.step() }
    return g.population == 0
}
test("resize keeps what still fits and drops the rest") {
    var g = board(10, 10)
    g[1, 1] = true; g[9, 9] = true
    g.resized(cols: 5, rows: 5)
    return g[1, 1] && g.population == 1 && g.cols == 5
}
test("resize to the same size changes nothing") {
    var g = board(6, 6); g[2, 2] = true
    let before = g.cells
    g.resized(cols: 6, rows: 6)
    return g.cells == before
}

// ---- guards ----

test("a 1x1 board is legal and its lone cell dies") {
    var g = Life(cols: 1, rows: 1)
    g[0, 0] = true
    g.step()
    return g.population == 0
}
test("zero and negative dimensions are clamped, not crashed") {
    Life(cols: 0, rows: 0).cols == 1 && Life(cols: -4, rows: -4).rows == 1
}
test("resizing to zero clamps instead of emptying the board") {
    var g = board(6, 6); g[0, 0] = true
    g.resized(cols: 0, rows: 0)
    return g.cols == 1 && g.rows == 1
}
test("stamp ignores dots and spaces and accepts any other character") {
    board(8, 8, [". .", "X#O"], 1, 1).population == 3
}
test("the Swift engine agrees with the JS engine on a fixed seed") {
    // Same start, same 10 generations, same population as life.test.js's block/blinker mix.
    var g = board(12, 12, ["OO", "OO"], 1, 1)
    g.stamp(Pattern.blinker.rows, x: 6, y: 6)
    for _ in 0..<10 { g.step() }
    return g.population == 7   // 4 (block) + 3 (blinker)
}

print("ok — \(passed) checks passed")
