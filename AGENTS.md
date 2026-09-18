# Forms — Agent Notes

WASM-only LNbits extension. Read `PLAN.md` first — it is verified against the
component-model runtime in `../lnbits` (dev, `lnbits/core/wasm_ext/`).

Key rules:

- Only edit files inside this directory. Never touch lnbits core files.
- Target the **component-model ABI** (`wasmtime` component + WASIp2,
  `lnbits:extension/*` imports, exports are `func(string) -> string` JSON).
  `../paidtasks/` is the *legacy* ABI — layout reference only, not runnable code.
- Every host capability must be declared in `config.json` `permissions` and granted
  by the user at install time.
- Secrets and wallet ids must never appear in `public_fields` policies.
- Public routes are unauthenticated — validate everything in-module, bound capacity
  server-side, never trust client-computed prices.

## Registry listing metadata

- The extension directory "More" dialog reads `config.json` via `details_link`
  (tagged raw.githubusercontent URL). Screenshots, `contributors`, `license`,
  and `description_md` must exist at the tagged ref — cut a git tag matching
  `manifest.json`'s version before the URLs will resolve.
- For a local/dev install the card only shows MORE when the manifest is added
  as a source: admin settings → `lnbits_wasm_extensions_manifests` (or the
  `system_settings` row) + restart. The details endpoint also requires the
  installed release's `details_link` meta to match a release from a manifest
  source.

## Cutting a release

1. `make package` (or `python3 tools/package.py` if no Rust toolchain — needs
   a current `wasm/module.wasm`) → `dist/forms-{version}.zip`, deterministic.
2. Put the zip's sha256 in `manifest.json` `extensions[0].hash`, commit, push,
   move the version tag to that commit (`manifest.json` is not inside the zip,
   so the tag move is safe).
3. `gh release create vX.Y.Z dist/forms-X.Y.Z.zip --notes-file notes.md`.
4. Verify: download the asset, `shasum -a 256` must equal the manifest `hash`;
   every `vX.Y.Z`-tagged raw URL (config.json, icon.png, description.md,
   screenshots) must return 200.
5. For the `lnbits/lnbits-extensions-wasm` PR, the registry `extensions.json`
   entry is exactly our `manifest.json` `extensions[0]` object, plus the
   `categories` map (we list under `merchant`).
