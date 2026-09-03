# Conway, roadmap

App Store listing name is **Toroid** (Conway was taken). ASC app id `6806324937`,
bundle `com.heyitsmejosh.conway`, profiles "Toroid AppStore" / "Toroid Mac AppStore".

## Done
- Web live: toroid.heyitsmejosh.com (Cloudflare Pages project `conway`), `scripts/deploy.sh`
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
  (nulljosh/toroid) renamed 2026-09-02. Bundle id, dir and Pages project (internal name) keep `conway`.
- New builds 202609020728 uploaded for iOS and macOS 2026-09-02; attach once VALID.
- README + landing page screenshots, and subdomain rename 2026-09-02: `toroid.heyitsmejosh.com` is
  live, fronted by a tiny Worker (`toroid-proxy`, passthrough fetch to `conway-dmd.pages.dev`) attached
  as a Workers Custom Domain — not a Pages custom domain. The wrangler OAuth token here has no `zone`
  DNS-edit scope, so the normal Pages-domain route left the CNAME stuck on "pending"; Workers Custom
  Domains auto-provision DNS under the `workers_routes`/`workers_scripts` scopes instead, so this got
  the same result without needing a broader token. Repointed all web links plus
  `marketingUrl`/`supportUrl`/`privacyPolicyUrl` in `metadata/` to the new domain.
  `conway.heyitsmejosh.com` still points straight at the Pages project (old links keep working) — ASC
  metadata not pushed live yet since iOS/macOS are mid-review.

## Open
- [ ] Apple Watch companion app -- standalone watchOS target (XcodeGen), same pattern as talli/watchos, sparkjar/watchos, epiphany/watchos, and the new companions in bookrank/charwork/curvely/fengshui/inkpress/lexly/quotestreak. Deferred 2026-09-02 to keep the sweep scoped; pick network+token-pairing, App-Group share, or a fully local port depending on what the app actually is.
- [ ] Wait for review. SUBMITTED 2026-09-02 14:34 UTC: iOS submission b6ad4067-0b93-4a29-a00e-921822296445,
      macOS submission d9c65adb-b487-48a3-a247-f586f5c55e8d. App Privacy published (DATA_NOT_COLLECTED;
      `apply` had to run before `publish`, else 409 APP_DATA_USAGES_REQUIRED).
