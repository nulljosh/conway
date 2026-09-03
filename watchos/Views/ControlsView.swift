import SwiftUI

/// Icon-only control row: play/pause, step, randomize, clear. Labels would wrap or truncate
/// at watch widths, so every action here is an SF Symbol with an accessibility label instead.
struct ControlsView: View {
    let running: Bool
    let onToggleRun: () -> Void
    let onStep: () -> Void
    let onRandomize: () -> Void
    let onClear: () -> Void

    var body: some View {
        HStack(spacing: 6) {
            Button(action: onToggleRun) {
                Image(systemName: running ? "pause.fill" : "play.fill")
            }
            .tint(.green)
            .accessibilityLabel(running ? "Pause" : "Play")

            Button(action: onStep) {
                Image(systemName: "forward.frame.fill")
            }
            .accessibilityLabel("Step")

            Button(action: onRandomize) {
                Image(systemName: "shuffle")
            }
            .accessibilityLabel("Randomize")

            Button(action: onClear) {
                Image(systemName: "trash")
            }
            .accessibilityLabel("Clear")
        }
        .buttonStyle(.bordered)
        .buttonBorderShape(.circle)
        .labelStyle(.iconOnly)
        .font(.system(size: 13))
    }
}
