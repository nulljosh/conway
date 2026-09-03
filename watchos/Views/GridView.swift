import SwiftUI

/// The toroidal grid, drawn full-width and square. Tap a cell to toggle it — same gesture as
/// the iOS/macOS drag-to-paint, just single-tap since a watch face has no room for a drag lane
/// separate from scroll/swipe.
struct GridView: View {
    let life: Life
    let onTap: (Int, Int) -> Void

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            let cell = side / CGFloat(life.cols)

            Canvas { ctx, size in
                var lines = Path()
                for x in 0...life.cols {
                    lines.move(to: CGPoint(x: CGFloat(x) * cell, y: 0))
                    lines.addLine(to: CGPoint(x: CGFloat(x) * cell, y: CGFloat(life.rows) * cell))
                }
                for y in 0...life.rows {
                    lines.move(to: CGPoint(x: 0, y: CGFloat(y) * cell))
                    lines.addLine(to: CGPoint(x: CGFloat(life.cols) * cell, y: CGFloat(y) * cell))
                }
                ctx.stroke(lines, with: .color(.primary.opacity(0.12)), lineWidth: 0.5)

                for y in 0..<life.rows {
                    for x in 0..<life.cols where life[x, y] {
                        ctx.fill(
                            Path(CGRect(x: CGFloat(x) * cell + 1, y: CGFloat(y) * cell + 1,
                                        width: cell - 2, height: cell - 2)),
                            with: .color(.green)
                        )
                    }
                }
            }
            .frame(width: side, height: side)
            .contentShape(Rectangle())
            .gesture(
                SpatialTapGesture().onEnded { value in
                    let p = value.location
                    guard p.x.isFinite, p.y.isFinite, p.x >= 0, p.y >= 0, cell > 0 else { return }
                    let x = Int(p.x / cell), y = Int(p.y / cell)
                    onTap(x, y)
                }
            )
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
        }
    }
}
