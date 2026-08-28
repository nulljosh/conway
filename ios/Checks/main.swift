// swiftc ios/Conway/Life.swift ios/Checks/main.swift -o /tmp/conway-checks && /tmp/conway-checks
import Foundation

func check(_ ok: Bool, _ what: String) {
    if !ok { print("FAIL: \(what)"); exit(1) }
}

// Block is a still life.
var g = Life(cols: 8, rows: 8)
g.stamp(["OO", "OO"], x: 2, y: 2)
g.step()
check(g.population == 4 && g[2, 2] && g[3, 3], "block survives unchanged")

// Blinker oscillates with period 2.
g = Life(cols: 8, rows: 8)
g.stamp(Pattern.blinker.rows, x: 2, y: 3)
let before = g.cells
g.step()
check(g[3, 2] && g[3, 4] && !g[2, 3], "blinker rotates")
g.step()
check(g.cells == before, "blinker period is 2")

// Glider translates by (1,1) every 4 generations.
g = Life(cols: 16, rows: 16)
g.stamp(Pattern.glider.rows, x: 1, y: 1)
for _ in 0..<4 { g.step() }
check(g.population == 5 && g[3, 2] && g[4, 3] && g[2, 4] && g[3, 4] && g[4, 4], "glider walks diagonally")

// Loneliness, and wrapping at the edges.
g = Life(cols: 8, rows: 8)
g[4, 4] = true
g.step()
check(g.population == 0, "a lone cell dies")

g = Life(cols: 8, rows: 8)
g[0, 0] = true; g[7, 0] = true; g[0, 7] = true
g.step()
check(g[7, 7], "neighbours wrap around the torus")

print("ok — Life.swift rules verified")
