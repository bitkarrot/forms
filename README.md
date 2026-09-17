# Forms (WASM)

**Working name: `forms`** — *"Payment-gated forms, registrations and paid workflows."*

A WASM-only LNbits extension: organizers build forms (event tickets, paid
memberships, applications, donation+signup), share a public link, and attendees
submit + pay a Lightning invoice. Server-side payment confirmation gates
fulfillment — tickets, capacity, receipts.

See `PLAN.md` for the full design and phase plan.

## Status

Feature-complete MVP (P0–P4): component-model WASM component (Rust +
cargo-component, `wasm32-wasip1`), schema'd storage, verified public payment
loop, admin builder UI, hosted public pages with themes/stepper/custom CSS,
cross-origin JavaScript embed widget, deterministic packaging, and store
metadata.

Verified against LNbits 1.6.2rc1: `tests/e2e_local.py` drives the full
install → create → publish → submit → invoice → pay → ticket loop, and
`tests/backend` runs 18 native mock-host tests covering capacity, expiry,
quarantine, idempotency, and approval flows. `tests/e2e_ui.mjs` is a
Playwright browser test that drives the real admin builder and hosted page
inside their sandboxed iframes (requires `npm i playwright` in a scratch
dir — it is not a package dependency).

## Header images and the frame CSP

LNbits serves every WASM extension inside a sandboxed iframe whose CSP only
allows images from `/ext-assets/<ext-id>/` and `data:` URIs. A form's
`headerImage` therefore only renders on hosted/admin pages when it points at
an extension asset — a sample ships at
`/ext-assets/forms/assets/banner.png` — or a `data:image/` URI. External
`https://` URLs are accepted and work in the cross-origin embed widget, which
runs on the host page with no such CSP. Note the host's static-asset allowlist
does **not** serve `.svg` — use `.png`/`.jpg`/`.webp` for bundled images.

Layout and conventions follow
[zapgoalswasm](https://github.com/bitkarrot/zapgoalswasm), a registry-included
WASM extension.

## Build & test

```bash
make build         # check toolchain, precompile Vue templates, build component
make check         # toolchain + JSON + cargo component check
make test          # config tests + native mock-host backend tests
make package       # deterministic dist/forms-<version>.zip
```

Toolchain pins live in `build-tools.json` (rustc 1.98.0, cargo-component
0.21.1, node 22.22.3). `wasm32-wasip1` target required:

```bash
rustup target add wasm32-wasip1
cargo install cargo-component --locked
```
