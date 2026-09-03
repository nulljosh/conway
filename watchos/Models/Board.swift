import SwiftUI

/// Drives one `Life` grid on a timer. Ported from ios/Conway/ContentView.swift's `Board`,
/// minus the screenshot-args plumbing (no fastlane snapshot lane on watch yet) and pinned to
/// a fixed grid size instead of resizing off view geometry.
@MainActor
final class Board: ObservableObject {
    /// 12x12 stays legible at the ~6-9pt cell size a 41-49mm watch face allows.
    static let gridSize = 12

    @Published var life = Life(cols: gridSize, rows: gridSize)
    @Published private(set) var running = false

    /// Generations per second. Clamped — a zero or NaN interval makes Timer spin or trap.
    private let speed: Double = 6

    private var timer: Timer?

    init() {
        life.randomize()
    }

    deinit { timer?.invalidate() }

    func toggleRun() { running ? stop() : start() }

    func start() {
        timer?.invalidate()
        running = true
        timer = Timer.scheduledTimer(withTimeInterval: 1 / speed, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.life.step() }
        }
    }

    func stop() {
        timer?.invalidate()
        timer = nil
        running = false
    }

    func step() { stop(); life.step() }
    func randomize() { stop(); life.randomize() }
    func clear() { stop(); life.clear() }

    func stamp(_ pattern: Pattern) {
        stop()
        life.clear()
        let p = pattern.rows
        life.stamp(p, x: (life.cols - (p.first?.count ?? 0)) / 2, y: (life.rows - p.count) / 2)
    }

    func toggle(x: Int, y: Int) {
        guard x >= 0, x < life.cols, y >= 0, y < life.rows else { return }
        life[x, y].toggle()
    }
}
