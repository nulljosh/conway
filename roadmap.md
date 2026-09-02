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

## Open
- [ ] macOS screenshots, the only blocking `asc validate` error on the Mac version
      (`screenshots.required.any`). Needs 1280x800/1440x900 captures of the real Mac app;
      no headless way found (no pyobjc for window ids, System Events is off-limits).
- [ ] App Privacy publish. The missing flag was `--confirm`:
      `asc web privacy publish --app 6806324937 --confirm`
      Blocked only on an Apple 2FA code (pass `ASC_WEB_2FA_CODE_COMMAND='echo <code>'`).
      Run it BEFORE the version publish or it 409s.
- [ ] Submit, still deliberately held: the 4.3(a) wave is active with three appeals filed
      2026-08-28, and a seventh thin record entering review now risks those appeals.
      Revisit once the appeals land.
