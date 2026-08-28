# Conway

Conway's Game of Life for web, iOS and macOS. No accounts, no network, no storage.

| Surface | Where |
|---------|-------|
| Web | `index.html` (landing, live board behind the hero) + `play.html` |
| Engine (web) | `life.js` — `node life.test.js` verifies the rules |
| iOS | `ios/` — xcodegen, SwiftUI |
| macOS | `macos/` — same sources, `../ios/Conway/Life.swift` + `ContentView.swift` |
| Engine (Swift) | `ios/Conway/Life.swift` |

## Build

```sh
node life.test.js                                    # web engine check
swiftc ios/Conway/Life.swift ios/Checks/main.swift -o /tmp/c && /tmp/c   # swift engine check
(cd ios && xcodegen generate && xcodebuild -scheme Conway -destination 'generic/platform=iOS Simulator' build)
(cd macos && xcodegen generate && xcodebuild -scheme Conway build)
```

The grid is toroidal — patterns wrap at the edges. The engine is duplicated in JS and Swift
because there is no shared runtime between the two; both are covered by the checks above, and
`life.test.js` / `Checks/main.swift` assert the same four cases.
