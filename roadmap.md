# Conway — roadmap

App Store listing name is **Toroid** (Conway was taken). ASC app id `6806324937`,
bundle `com.heyitsmejosh.conway`, profiles "Toroid AppStore" / "Toroid Mac AppStore".

## Done
- Web live: conway.heyitsmejosh.com (Cloudflare Pages project `conway`), `scripts/deploy.sh`
- iOS + macOS apps, shared engine and view; 33 JS + 31 Swift checks
- Bundle ID registered, ASC record created, both builds uploaded and VALID (202608280855)
- iOS build attached to version 1.0; metadata, category (Games/Puzzle+Simulation),
  content rights, copyright, age rating all set
- Screenshots captured: `screenshots/` — 4 iPhone 6.5", 4 iPad 13"

## Open
- [ ] Upload screenshots — `asc screenshots upload` needs locale subdirectories:
      stage as `<dir>/en-US/*.png`, then `--device-type IPHONE_65` / `IPAD_PRO_3GEN_129`
      with `--app 6806324937 --version-id 4aba64d8-d4c3-46b0-8339-e10fb65f5322`
- [ ] App Store review details (contact name/email/phone) — `asc review details-create`
- [ ] App availability / territories — `asc web`, first-time bootstrap
- [ ] App Privacy: publish DATA_NOT_COLLECTED *before* the version publish or it 409s
- [ ] macOS platform on the same record — the Mac pkg is uploaded but the record is
      iOS-only (`--platform UNIVERSAL` 409s at creation). Add the platform, then attach
      build `db4fb66d-b26f-49ae-98fe-1b66ddab7b88`. Do NOT run `asc web apps create
      --platform MAC_OS` — that makes a second record.
- [ ] `asc validate --app 6806324937 --version 1.0 --platform IOS` until clean
- [ ] Submit — deliberately held: the 4.3(a) wave is active with three appeals filed
      2026-08-28, and a seventh thin record entering review now risks those appeals.
