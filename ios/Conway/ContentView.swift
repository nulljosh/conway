import SwiftUI

@MainActor
final class Board: ObservableObject {
    @Published var life = Life(cols: 40, rows: 40)
    @Published private(set) var running = false
    /// Generations per second. Clamped — a zero or NaN interval makes Timer spin or trap.
    @Published var speed: Double = 12 {
        didSet {
            let clamped = speed.isFinite ? min(60, max(1, speed)) : 12
            if clamped != speed { speed = clamped; return }
            if running { start() }
        }
    }

    private var timer: Timer?

    init() { life.randomize() }

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
    func randomize() { life.randomize() }
    func clear() { life.clear() }

    func stamp(_ pattern: Pattern) {
        life.clear()
        let p = pattern.rows
        life.stamp(p, x: (life.cols - (p.first?.count ?? 0)) / 2, y: (life.rows - p.count) / 2)
    }
}

struct ContentView: View {
    @StateObject private var board = Board()
    /// Set on the first drag cell: the whole stroke paints that one value, so a drag never flickers.
    @State private var painting: Bool?

    private let cell: CGFloat = 16

    var body: some View {
        VStack(spacing: 0) {
            controls
            Divider()
            grid
        }
        #if os(macOS)
        .frame(minWidth: 560, minHeight: 480)
        #endif
    }

    private var controls: some View {
        HStack(spacing: 12) {
            Button(board.running ? "Pause" : "Play") { board.toggleRun() }
                .keyboardShortcut(.space, modifiers: [])
                .buttonStyle(.borderedProminent)
            Button("Step") { board.step() }
            Button("Random") { board.randomize() }
            Button("Clear") { board.clear() }
            Menu("Patterns") {
                ForEach(Pattern.allCases) { p in
                    Button(p.rawValue) { board.stamp(p) }
                }
            }
            .fixedSize()
            Slider(value: $board.speed, in: 1...60).frame(width: 110)
            Spacer()
            Text("gen \(board.life.generation) · pop \(board.life.population)")
                .font(.caption.monospacedDigit())
                .foregroundStyle(.secondary)
        }
        .buttonStyle(.bordered)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private var grid: some View {
        GeometryReader { geo in
            Canvas { ctx, size in
                let life = board.life
                var lines = Path()
                for x in 0...life.cols {
                    lines.move(to: CGPoint(x: CGFloat(x) * cell, y: 0))
                    lines.addLine(to: CGPoint(x: CGFloat(x) * cell, y: CGFloat(life.rows) * cell))
                }
                for y in 0...life.rows {
                    lines.move(to: CGPoint(x: 0, y: CGFloat(y) * cell))
                    lines.addLine(to: CGPoint(x: CGFloat(life.cols) * cell, y: CGFloat(y) * cell))
                }
                ctx.stroke(lines, with: .color(.primary.opacity(0.08)), lineWidth: 1)

                for y in 0..<life.rows {
                    for x in 0..<life.cols where life[x, y] {
                        ctx.fill(Path(CGRect(x: CGFloat(x) * cell + 1, y: CGFloat(y) * cell + 1,
                                             width: cell - 2, height: cell - 2)),
                                 with: .color(.accentColor))
                    }
                }
                _ = size
            }
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        let p = value.location
                        guard p.x.isFinite, p.y.isFinite, p.x >= 0, p.y >= 0 else { return }
                        let x = Int(p.x / cell), y = Int(p.y / cell)
                        guard x < board.life.cols, y < board.life.rows else { return }
                        let paint = painting ?? !board.life[x, y]
                        painting = paint
                        board.life[x, y] = paint
                    }
                    .onEnded { _ in painting = nil }
            )
            .onAppear { resize(geo.size) }
            .onChange(of: geo.size) { _, new in resize(new) }
        }
    }

    private func resize(_ size: CGSize) {
        // A collapsed or not-yet-laid-out view reports zero or NaN; Int(nan) traps.
        guard size.width.isFinite, size.height.isFinite,
              size.width > 0, size.height > 0 else { return }
        board.life.resized(cols: max(8, Int(size.width / cell)),
                           rows: max(8, Int(size.height / cell)))
    }
}
