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
