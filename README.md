<img src="icon.svg" width="80" style="border-radius:18px">

# Toroid

![version](https://img.shields.io/badge/version-v1.0.0-blue) ![license](https://img.shields.io/badge/license-MIT-green) [![GitHub](https://img.shields.io/badge/GitHub-nulljosh%2Fconway-black?logo=github)](https://github.com/nulljosh/conway)


**Live:** https://conway.heyitsmejosh.com

Toroid is Conway's Game of Life on a wrapping board. Web, iOS and macOS. App Store name is Toroid; the repo, bundle and domain keep the conway name.

No accounts. No network. No storage. Just the rules, and a grid that wraps.

| Surface | Where |
|---------|-------|
| Web | `index.html` (landing, live board behind the hero) + `play.html` |
| Engine (web) | `life.js`. `node life.test.js` checks the rules |
| iOS | `ios/`, xcodegen, SwiftUI |
| macOS | `macos/`, same sources: `../ios/Conway/Life.swift` and `ContentView.swift` |
| Engine (Swift) | `ios/Conway/Life.swift` |

## Build

```sh
node life.test.js                                    # web engine check
swiftc ios/Conway/Life.swift ios/Checks/main.swift -o /tmp/c && /tmp/c   # swift engine check
(cd ios && xcodegen generate && xcodebuild -scheme Conway -destination 'generic/platform=iOS Simulator' build)
(cd macos && xcodegen generate && xcodebuild -scheme Conway build)
```

The grid is a torus. Patterns wrap at the edges. The engine exists twice, once in JS and once
in Swift, because a browser and SwiftUI share no runtime. Both are held to the same four
cases in `life.test.js` and `Checks/main.swift`. If one drifts, one fails.

## Architecture

<img src="architecture.svg" width="600">

## Step performance

`step()` works out the wrap once per row and once per column instead of calling
`idx()`, two modulos, on each of the eight neighbour reads. The rule is unchanged,
including the odd 1×n and n×1 boards where a cell is its own neighbour. On a 400×400
board, 200 generations dropped from 600 ms to 136 ms. That is what keeps a
full-screen grid at 60 fps.
