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
