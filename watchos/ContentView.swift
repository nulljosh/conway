import SwiftUI

/// Root view: the toroidal grid plus transport controls and a live gen/pop readout. Fully
/// local — no network, no token pairing, no App Group — same "no accounts, no storage" stance
/// as the web/iOS/macOS engines this ports.
struct ContentView: View {
    @StateObject private var board = Board()

    var body: some View {
        VStack(spacing: 6) {
            GridView(life: board.life) { x, y in
                board.toggle(x: x, y: y)
            }

            ControlsView(
                running: board.running,
                onToggleRun: board.toggleRun,
                onStep: board.step,
                onRandomize: board.randomize,
                onClear: board.clear
            )

            Text("gen \(board.life.generation) · pop \(board.life.population)")
                .font(.system(size: 11, design: .monospaced))
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .padding(.horizontal, 4)
        .padding(.vertical, 2)
    }
}
