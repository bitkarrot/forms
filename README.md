# Forms (WASM)

**Working name: `forms`** — *"Payment-gated forms, registrations and paid workflows."*

A WASM-only LNbits extension: organizers build forms (event tickets, paid
memberships, applications, donation+signup), share a public link, and attendees
submit + pay a Lightning invoice. Server-side payment confirmation gates
fulfillment — tickets, capacity, receipts.

See `PLAN.md` for the full design and phase plan.

## Status

P0 scaffold complete: component-model WASM component (Rust + cargo-component,
`wasm32-wasip1`), schema'd storage, public payment loop, admin + public UIs.
Not yet verified end-to-end against a live LNbits instance.

Layout and conventions follow `../zapgoalswasm/` (a registry-included WASM
extension). `../paidtasks/` uses the legacy WASM ABI and does not run on the
current runtime.

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
