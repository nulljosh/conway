# Conway — roadmap

App Store listing name is **Toroid** (Conway was taken). ASC app id `6806324937`,
bundle `com.heyitsmejosh.conway`, profiles "Toroid AppStore" / "Toroid Mac AppStore".

## Done
- Web live: conway.heyitsmejosh.com (Cloudflare Pages project `conway`), `scripts/deploy.sh`
- iOS + macOS apps, shared engine and view; 33 JS + 31 Swift checks
- Bundle ID registered, ASC record created, both builds uploaded and VALID (202608280855)
- iOS build attached to version 1.0; metadata, category (Games/Puzzle+Simulation),
  content rights, copyright, age rating all set
- Screenshots captured AND uploaded: 4 iPhone 6.5", 4 iPad 13" (upload needs an
  `en-US/` subdirectory under --path, not a flat folder)
- App Store review details set (contact + reviewer notes, no demo account needed)

## Open
- [x] App availability / territories — **DONE 2026-08-29 from the CLI, no dashboard, no 2FA.**
      The blocker was a wrong flag name, not a missing capability: `asc pricing territories
      list` *does* paginate, it just takes `--limit` (it caps at 50 by default, which is why
      the list came back short and `create` then rejected it as partial). With
      `--limit 200` the full 175 come back, and
      `asc pricing availability create --app 6806324937 --territory "<all 175>"
      --available true --available-in-new-territories true` succeeded first try.
      Verified: 175/175 available, and `asc validate` is now **0 errors, 0 blocking**.
- [ ] `availableInNewTerritories` cannot be *changed* afterwards from the public API
      (`edit` refuses: "the public API cannot change this setting"). It is only settable at
      `create` time, so get it right on the first bootstrap — flipping it later is genuinely
      dashboard-only. Not a problem here; it was set true at creation.
- [ ] App Privacy: declaration is already DATA_NOT_COLLECTED but `published: false`.
      `asc web privacy publish --app 6806324937` needs a flag it did not name — check its
      FLAGS. Publish BEFORE the version publish or it 409s.
- [ ] macOS platform on the same record — the Mac pkg is uploaded but the record is
      iOS-only (`--platform UNIVERSAL` 409s at creation). Add the platform, then attach
      build `db4fb66d-b26f-49ae-98fe-1b66ddab7b88`. Do NOT run `asc web apps create
      --platform MAC_OS` — that makes a second record.
- [x] `asc validate --app 6806324937 --version 1.0 --platform IOS` — clean 2026-08-29
      (0 errors, 0 warnings, 0 blocking). Only an info row remains: App Privacy publish
      state is not verifiable through the public API, which is the item above.
- [ ] Submit — deliberately held: the 4.3(a) wave is active with three appeals filed
      2026-08-28, and a seventh thin record entering review now risks those appeals.
