# Conway Technical Whitepaper

**v1.0.0** | September 2026

Conway is Conway's Game of Life on a toroidal grid, for web, iOS and macOS.
No accounts, no network, no storage. Live at
[toroid.heyitsmejosh.com](https://toroid.heyitsmejosh.com).

## Engine

The rules are implemented twice, once in JavaScript (`life.js`) and once in
Swift (`ios/Conway/Life.swift`), because there is no shared runtime between a
browser and SwiftUI. Both are pure functions: `step(grid) -> grid`.

The grid wraps at the edges (a torus), so gliders never die at a wall.
`step()` resolves the wrap once per row and once per column instead of doing
two modulo operations on each of the eight neighbour reads. That is the only
optimisation; the board is small enough that anything more is noise.

Both ports are held to the same four test cases (`life.test.js` and
`ios/Checks/main.swift`): block still life, blinker period 2, glider
translation, and edge wrap. If a port drifts, one of them fails.

## Surfaces

| Surface | Where |
|---|---|
| Web landing + live board | `index.html` |
| Web player | `play.html` |
| iOS | `ios/`, xcodegen, SwiftUI |
| macOS | `macos/`, same Swift sources |

The landing page runs the real engine behind the hero as an attract mode.
The player is fully manual: step, run, clear, random, and draw with the
pointer.

## Build

```sh
node life.test.js
swiftc ios/Conway/Life.swift ios/Checks/main.swift -o /tmp/c && /tmp/c
(cd ios && xcodegen generate && xcodebuild -scheme Conway -destination 'generic/platform=iOS Simulator' build)
(cd macos && xcodegen generate && xcodebuild -scheme Conway build)
```

## License

MIT 2026, Joshua Trommel
