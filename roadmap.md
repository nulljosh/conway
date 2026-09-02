# Conway, roadmap

App Store listing name is **Toroid** (Conway was taken). ASC app id `6806324937`,
bundle `com.heyitsmejosh.conway`, profiles "Toroid AppStore" / "Toroid Mac AppStore".

## Done
- Web live: conway.heyitsmejosh.com (Cloudflare Pages project `conway`), `scripts/deploy.sh`
- iOS + macOS apps, shared engine and view; 33 JS + 31 Swift checks
- Bundle ID registered, ASC record created, both builds uploaded and VALID (202608280855)
- iOS 1.0 fully staged: build attached, metadata, category (Games/Puzzle+Simulation),
  content rights, copyright, age rating, screenshots (4 iPhone 6.5", 4 iPad 13"),
  review details. One `asc` submit away.
  (screenshot upload needs an `en-US/` subdirectory under --path, not a flat folder)
- macOS platform added to the SAME record 2026-08-30: version `10ce9764-bc36-46bf-943f-20f321f9522a`,
  Mac build `db4fb66d-b26f-49ae-98fe-1b66ddab7b88` attached, en-US metadata applied
  (`asc versions create --platform MAC_OS` on the existing app id, does NOT make a second record)
- `availableInNewTerritories`: settable only at `create` time, was set true. Not an issue.

- Pricing set Free (USA base) 2026-09-02; it was the second submit blocker alongside App Privacy.
- macOS screenshots uploaded 2026-09-02 (4 x 1440x900, DESKTOP set). Headless recipe: Debug build,
  `open -n App.app --args -pattern "Gosper gun" -generations 300`, find the window id with a
  10-line Swift CGWindowListCopyWindowInfo script, `screencapture -x -o -l <id>`. Window size is
  pinned by `.defaultSize(1440x900)` on the scene (autosave keys embed a per-launch address).
- Display name is Toroid on both platforms (Info.plist), landing page + manifest + GitHub repo
  (nulljosh/toroid) renamed 2026-09-02. Bundle id, dir, Pages project and subdomain keep `conway`.
- New builds 202609020728 uploaded for iOS and macOS 2026-09-02; attach once VALID.

## Open
- [x] Build 202609020728 attached to both 1.0 versions (iOS 2fb43827…, macOS f11e043f…), validate clean
- [ ] App Privacy publish, the LAST blocker. Needs a live web session (2FA code from Joshua):
      `asc web auth login --apple-id trommatic@icloud.com` with `ASC_WEB_2FA_CODE_COMMAND='echo <code>'`,
      then `asc web privacy publish --app 6806324937 --confirm`, then
      `asc review submit --app 6806324937 --version-id <id> --platform IOS|MAC_OS --build-id <id> --confirm`.
      Stray draft submission b6ad4067-0b93-4a29-a00e-921822296445 exists from the 2026-09-02 attempt; it is reused when safe.
- [ ] 4.3(a) wave hold was lifted by Joshua 2026-09-02 ("ship it"); submit both platforms as soon as privacy is published.
