import SwiftUI

@main
struct ConwayApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .commands { CommandGroup(replacing: .newItem) {} }
    }
}
